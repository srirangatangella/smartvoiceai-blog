---
title: How to Build an AI Appointment Booking System
description: Tutorial on linking Vapi AI tool calls with Google Calendar API to schedule client slots on the phone.
date: 2026-07-07
author: Smart Voice AI
category: Tutorials
tags:
  - Vapi
  - Google Calendar
  - API Tool Calls
  - Nodejs
image: https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop
featured: false
draft: false
---

A primary business task for voice agents is scheduling. Allowing an AI agent to query calendar availability and write new meetings during a live phone call requires setting up a custom webhook API.

In this tutorial, we will write a Node.js route that translates **Vapi tool-calls** into **Google Calendar** events.

## Understanding Vapi Tool Calls

When a Vapi voice agent hears the customer say *"I'd like to book a tour tomorrow at 3 PM"*, the LLM identifies a slot scheduling intent and triggers a custom tool payload:

```json
{
  "message": {
    "type": "tool-calls",
    "toolCalls": [
      {
        "id": "call_123xyz",
        "function": {
          "name": "bookAppointment",
          "arguments": "{\"dateTime\":\"2026-07-11T15:00:00Z\",\"customerName\":\"John Doe\"}"
        }
      }
    ]
  }
}
```

Your API must listen to this payload, schedule the slot, and send back a success reply so the agent can tell the caller: *"Awesome! You are booked for tomorrow at 3 PM."*

## Setting Up Google Calendar API

First, initialize a Google Calendar service client in Node.js using service account credentials:

```javascript
const { google } = require('googleapis');
const credentials = require('./google-service-account.json');

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  SCOPES
);

const calendar = google.calendar({ version: 'v3', auth });
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;
```

## Creating the Tool Call API Endpoint

Now, write an Express route to receive the webhook from Vapi, verify the tool name, run the scheduling, and return a result stream:

```javascript
const express = require('express');
const app = express();
app.use(express.json());

app.post('/vapi/tool-call', async (req, res) => {
  const { type, toolCalls } = req.body.message;

  if (type === 'tool-calls') {
    const toolCall = toolCalls[0];
    const { name, arguments: argsString } = toolCall.function;

    if (name === 'bookAppointment') {
      const args = JSON.parse(argsString);
      
      try {
        const result = await insertCalendarEvent(args.dateTime, args.customerName);
        
        // Return confirmation to Vapi SDK
        return res.status(200).json({
          results: [{
            toolCallId: toolCall.id,
            result: `Successfully scheduled: ${result.htmlLink}`
          }]
        });
      } catch (err) {
        return res.status(500).json({
          results: [{
            toolCallId: toolCall.id,
            error: "Slot unavailable."
          }]
        });
      }
    }
  }

  res.sendStatus(400);
});
```

## Adding Calendar Events

Implement the Google Calendar write API:

```javascript
async function insertCalendarEvent(dateTime, customerName) {
  const start = new Date(dateTime);
  const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour duration

  const event = {
    summary: `AI Booking: ${customerName}`,
    description: 'Scheduled dynamically by Smart Voice AI Voice Agent.',
    start: { dateTime: start.toISOString(), timeZone: 'Asia/Kolkata' },
    end: { dateTime: end.toISOString(), timeZone: 'Asia/Kolkata' },
    reminders: { useDefault: true },
  };

  const response = await calendar.events.insert({
    calendarId: CALENDAR_ID,
    resource: event,
  });

  return response.data;
}
```

## Wrap up

Integrating this route as a custom function in your Vapi dashboard allows your real estate or service agent to book live visits without human intervention. Ensure to configure verification tokens on your webhook to prevent unauthorized access.
