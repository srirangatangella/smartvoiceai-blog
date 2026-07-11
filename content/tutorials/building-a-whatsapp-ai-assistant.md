---
title: "Building a WhatsApp AI Assistant Using Node.js"
date: "2026-07-08"
description: "Step-by-step tutorial on integrating the WhatsApp Cloud API with OpenAI's GPT-4o for automated customer conversations."
draft: false
---

Text automation is a vital counterpart to voice AI. In this tutorial, we will write a Node.js microservice that connects the **WhatsApp Cloud API** with **OpenAI's GPT-4o** to create an automated, responsive chat assistant.

## Prerequisites

Before starting, ensure you have:
- A Facebook Developer account with the WhatsApp product configured.
- Node.js installed locally.
- An OpenAI API key.

## Project Setup

Create a new directory and install the necessary dependencies:

```bash
mkdir whatsapp-ai-assistant
cd whatsapp-ai-assistant
npm init -y
npm install express dotenv openai body-parser
```

## Creating the Webhook

WhatsApp relies on webhooks to deliver incoming messages to your backend. Let's create an Express application to handle WhatsApp's verification request and receive message payloads.

```javascript
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Verification endpoint for Meta
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === process.env.VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Receiver endpoint for messages
app.post('/webhook', async (req, res) => {
  const body = req.body;
  if (body.object === 'whatsapp_business_account') {
    if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
      const msg = body.entry[0].changes[0].value.messages[0];
      const from = msg.from; // User's phone number
      const text = msg.text.body; // User's message

      console.log(`Received message from ${from}: ${text}`);
      
      // Process with OpenAI and respond
      await handleIncomingMessage(from, text);
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Webhook is listening...'));
```

## Connecting OpenAI

Now, let's process the user's message using OpenAI and trigger a reply back using the WhatsApp Cloud API:

```javascript
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function handleIncomingMessage(phoneNumber, userText) {
  // 1. Generate reply from GPT-4o
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are a helpful customer assistant for Smart Voice AI." },
      { role: "user", content: userText }
    ],
  });

  const replyText = completion.choices[0].message.content;

  // 2. Call WhatsApp Send API
  const url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;
  
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: phoneNumber,
      type: "text",
      text: { body: replyText }
    })
  });
}
```

## Testing Your Webhook

To test locally, run `node index.js` and expose your port using a tunnel utility like **ngrok**:

```bash
ngrok http 3000
```

Copy the generated HTTPS forwarding URL, set it in your Meta developer dashboard, and send a WhatsApp message to your test number. Your AI assistant will reply instantly!