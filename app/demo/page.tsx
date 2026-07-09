"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import { Mic, ArrowLeft } from "lucide-react";
import { clients, ClientConfig } from "@/lib/clients";

declare global {
  interface Window {
    vapiSDK?: any;
  }
}

const PUBLIC_KEY = "ba407006-669b-4cb3-91c2-1796c297d18e";

function DemoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const vapiRef = useRef<any>(null);

  // Parse current client from search params, default to first client ('apas')
  const clientParam = searchParams.get("client");
  const initialClientKey = clientParam && clients[clientParam] ? clientParam : "apas";

  const [currentClientKey, setCurrentClientKey] = useState<string>(initialClientKey);
  const [statusText, setStatusText] = useState<string>("Ready to call");
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [overlayVisible, setOverlayVisible] = useState<boolean>(false);
  const [overlayImage, setOverlayImage] = useState<string>("");
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);

  const currentClient = clients[currentClientKey];

  // Helper to trigger showing client visuals based on voice commands
  const showVisual = (requestedType: string, clientKey: string) => {
    const client = clients[clientKey];
    if (!client || !client.images) return;

    const cleanType = (requestedType || "masterplan").toString().toLowerCase();
    let finalKey = "default";

    if (cleanType.includes("master")) finalKey = "default";
    else if (cleanType.includes("tower")) finalKey = "tower";
    else if (cleanType.includes("1695") || cleanType.includes("east")) finalKey = "1695";
    else if (cleanType.includes("1870") || cleanType.includes("west")) finalKey = "1870";
    else if (cleanType.includes("living") || cleanType.includes("interior")) finalKey = "living";
    else if (client.images[cleanType]) finalKey = cleanType;

    const imageUrl = client.images[finalKey] || client.images["default"];
    if (imageUrl) {
      setOverlayImage(imageUrl);
      setOverlayVisible(true);
    }
  };

  const closeOverlay = () => {
    setOverlayVisible(false);
  };

  // Initialize/Teardown Vapi for a client configuration
  const setupVapi = (clientKey: string) => {
    if (!window.vapiSDK) return;

    // Stop existing instance
    if (vapiRef.current) {
      vapiRef.current.stop();
      vapiRef.current = null;
    }

    const client = clients[clientKey];
    setStatusText("Ready to call");
    setIsCalling(false);

    try {
      const vapiInstance = window.vapiSDK.run({
        apiKey: PUBLIC_KEY,
        assistant: client.assistantId,
        config: {
          voice: { provider: "11labs", voiceId: client.voiceId },
          position: "bottom",
          button: {
            style: {
              width: "70px",
              height: "70px",
              bottom: "50px",
              backgroundColor: "#4ade80",
              boxShadow: "0 0 20px rgba(74, 222, 128, 0.4)",
              border: "4px solid rgba(255,255,255,0.2)",
              borderRadius: "50%",
            },
          },
        },
      });

      vapiInstance.on("call-start", () => {
        setStatusText("Listening...");
        setIsCalling(true);
      });

      vapiInstance.on("call-end", () => {
        setStatusText("Ready to call");
        setIsCalling(false);
        setOverlayVisible(false);
      });

      vapiInstance.on("message", (message: any) => {
        if (message.type === "tool-calls") {
          const toolCall = message.toolCalls[0];
          if (toolCall.function.name.toLowerCase() === "showfloorplan") {
            let args: any = {};
            try {
              if (typeof toolCall.function.arguments === "object") {
                args = toolCall.function.arguments;
              } else {
                args = JSON.parse(toolCall.function.arguments);
              }
            } catch (e) {
              console.error("Error parsing floorplan args", e);
            }
            showVisual(args.type, clientKey);
            vapiInstance.send({
              type: "tool-calls-result",
              toolCalls: [{ id: toolCall.id, result: "Image displayed." }],
            });
          }
        }
      });

      vapiRef.current = vapiInstance;
    } catch (err) {
      console.error("Error running Vapi SDK", err);
    }
  };

  // Run setup when script is loaded or client changes
  useEffect(() => {
    if (scriptLoaded && window.vapiSDK) {
      setupVapi(currentClientKey);
    }
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
        vapiRef.current = null;
      }
    };
  }, [currentClientKey, scriptLoaded]);

  // Handle client selection change
  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextClientKey = e.target.value;
    setCurrentClientKey(nextClientKey);
    router.replace(`?client=${nextClientKey}`);
  };

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js"
        onLoad={() => setScriptLoaded(true)}
      />

      <style jsx global>{`
        body {
          margin: 0;
          background: #000;
          color: #fff;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
      `}</style>

      {/* Background layer */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 transition-all duration-500 z-0"
        style={{ backgroundImage: `url('${currentClient.bgImage}')` }}
      ></div>

      {/* Floor Plan Overlay */}
      {overlayVisible && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.95)] flex flex-col items-center justify-center z-[9999] transition-opacity duration-300 backdrop-blur-md opacity-100"
          onClick={closeOverlay}
        >
          <img
            src={overlayImage}
            alt="Floor Plan Preview"
            className="max-w-[95vw] max-h-[80vh] object-contain rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] scale-100 transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="mt-5 py-3 px-[30px] bg-[rgba(255,255,255,0.15)] text-white border border-[rgba(255,255,255,0.3)] rounded-[50px] cursor-pointer text-sm uppercase tracking-wider hover:bg-[rgba(255,255,255,0.25)]"
            onClick={closeOverlay}
          >
            Close Preview
          </button>
        </div>
      )}

      {/* Back button */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-300 text-sm font-semibold bg-black/40 border border-white/10 rounded-full px-4 py-2 hover:bg-black/60"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      {/* Main UI Interface Container */}
      <div className="text-center max-w-[600px] p-5 z-10 relative flex flex-col items-center pb-[120px] pointer-events-none select-none">
        <div
          className="text-sm tracking-[3px] uppercase mb-5 font-semibold pointer-events-auto"
          id="client-logo"
          style={{ color: currentClient.primaryColor }}
          dangerouslySetInnerHTML={{ __html: currentClient.logo }}
        />

        <select
          id="demoSelect"
          className="py-2.5 px-4 rounded-lg bg-black/80 text-white border border-white/30 mb-6 cursor-pointer text-sm outline-none pointer-events-auto select-auto"
          value={currentClientKey}
          onChange={handleClientChange}
        >
          {Object.values(clients).map((c) => (
            <option key={c.key} value={c.key}>
              {c.name}
            </option>
          ))}
        </select>

        <h1
          id="client-tagline"
          className="font-serif text-[32px] md:text-[40px] mb-2.5 leading-[1.1] pointer-events-auto"
        >
          {currentClient.tagline}
        </h1>
        <div className="text-base text-[#aaa] mb-6 pointer-events-auto font-medium">
          AI Virtual Sales Director
        </div>

        <div
          className="w-[110px] h-[110px] md:w-[130px] md:h-[130px] mb-5 rounded-full p-1 border-2 border-dashed border-white/25 relative z-10 bg-black/30 pointer-events-auto"
          style={{ borderColor: currentClient.primaryColor }}
        >
          <img
            id="avatar"
            className="w-full h-full rounded-full object-cover border-3 border-solid"
            style={{ borderColor: currentClient.primaryColor }}
            src={
              currentClientKey === "apas"
                ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"
                : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
            }
            alt="AI Assistant Avatar"
          />
        </div>

        <div className="text-sm opacity-90 font-medium min-h-5 mt-2.5 flex items-center gap-2 pointer-events-auto">
          <span
            id="status-dot"
            style={{ color: isCalling ? "#00d4ff" : "#4ade80" }}
            className={`text-lg leading-none ${isCalling ? "animate-pulse" : ""}`}
          >
            ●
          </span>
          <span id="status-text">{statusText}</span>
        </div>

        {/* Sneaky pulsing wave indicator shown when speaking or listening */}
        {isCalling && (
          <div className="absolute top-[280px] flex items-center gap-1.5 h-[100px] z-0">
            <div
              className="w-2 bg-primary rounded-full animate-[wave_1s_infinite_ease-in-out]"
              style={{ animationDelay: "0s", height: "30px", boxShadow: "0 0 15px #00d4ff" }}
            ></div>
            <div
              className="w-2 bg-primary rounded-full animate-[wave_1s_infinite_ease-in-out]"
              style={{ animationDelay: "0.1s", height: "50px", boxShadow: "0 0 15px #00d4ff" }}
            ></div>
            <div
              className="w-2 bg-primary rounded-full animate-[wave_1s_infinite_ease-in-out]"
              style={{ animationDelay: "0.2s", height: "80px", boxShadow: "0 0 15px #00d4ff" }}
            ></div>
            <div
              className="w-2 bg-primary rounded-full animate-[wave_1s_infinite_ease-in-out]"
              style={{ animationDelay: "0.3s", height: "50px", boxShadow: "0 0 15px #00d4ff" }}
            ></div>
            <div
              className="w-2 bg-primary rounded-full animate-[wave_1s_infinite_ease-in-out]"
              style={{ animationDelay: "0.4s", height: "30px", boxShadow: "0 0 15px #00d4ff" }}
            ></div>
          </div>
        )}
      </div>
    </>
  );
}

export default function DemoPage() {
  return (
    <Suspense fallback={<div className="text-white text-center p-10">Loading Demo Experience...</div>}>
      <DemoContent />
    </Suspense>
  );
}
