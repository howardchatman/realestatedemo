"use client";

import { useState, useEffect } from "react";
import { Phone, PhoneOff, Mic, MicOff, Volume2 } from "lucide-react";

declare global {
  interface Window {
    Retell: {
      RetellWebClient: new () => RetellWebClient;
    };
  }
}

interface RetellWebClient {
  startCall(config: { accessToken: string }): Promise<void>;
  stopCall(): void;
  on(event: string, callback: (data?: unknown) => void): void;
}

interface CallButtonProps {
  className?: string;
  variant?: "default" | "hero" | "minimal";
}

export default function CallButton({ className = "", variant = "default" }: CallButtonProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [retellClient, setRetellClient] = useState<RetellWebClient | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load Retell SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.retellai.com/retell-web-sdk/retell-web-sdk.min.js";
    script.async = true;
    script.onload = () => {
      if (window.Retell) {
        const client = new window.Retell.RetellWebClient();

        client.on("call_started", () => {
          console.log("Call started");
          setIsCallActive(true);
          setIsConnecting(false);
        });

        client.on("call_ended", () => {
          console.log("Call ended");
          setIsCallActive(false);
          setIsConnecting(false);
        });

        client.on("error", (err) => {
          console.error("Retell error:", err);
          setError("Call failed. Please try again.");
          setIsCallActive(false);
          setIsConnecting(false);
        });

        setRetellClient(client);
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const startCall = async () => {
    if (!retellClient) {
      setError("Call system not ready. Please refresh and try again.");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Get access token from our API
      const response = await fetch("/api/retell/web-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to start call");
      }

      // Start the call with Retell
      await retellClient.startCall({
        accessToken: data.data.access_token,
      });
    } catch (err) {
      console.error("Error starting call:", err);
      setError("Unable to start call. Please try again.");
      setIsConnecting(false);
    }
  };

  const endCall = () => {
    if (retellClient) {
      retellClient.stopCall();
    }
    setIsCallActive(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Note: Actual mute implementation would require Retell SDK methods
  };

  if (variant === "minimal") {
    return (
      <button
        onClick={isCallActive ? endCall : startCall}
        disabled={isConnecting}
        className={`flex items-center space-x-2 ${className}`}
      >
        {isConnecting ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <Phone className="w-5 h-5" />
        )}
        <span>{isCallActive ? "End Call" : "Call Now"}</span>
      </button>
    );
  }

  if (variant === "hero") {
    return (
      <div className="relative">
        {isCallActive ? (
          <div className="bg-white rounded-2xl shadow-2xl p-6 min-w-[300px]">
            <div className="text-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3 animate-pulse">
                <Volume2 className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Connected with AIVA</h4>
              <p className="text-sm text-gray-500">AI Assistant is listening...</p>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={toggleMute}
                className={`p-3 rounded-full transition-colors ${
                  isMuted ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
                }`}
              >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
              <button
                onClick={endCall}
                className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={startCall}
            disabled={isConnecting}
            className={`flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all ${className}`}
          >
            {isConnecting ? (
              <>
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Phone className="w-6 h-6" />
                <span>Talk to AIVA Now</span>
              </>
            )}
          </button>
        )}

        {error && (
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className="relative inline-block">
      {isCallActive ? (
        <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg">
          <Volume2 className="w-5 h-5 animate-pulse" />
          <span className="font-medium">On Call</span>
          <button
            onClick={endCall}
            className="ml-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <PhoneOff className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={startCall}
          disabled={isConnecting}
          className={`flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors ${className}`}
        >
          {isConnecting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Phone className="w-5 h-5" />
          )}
          <span>{isConnecting ? "Connecting..." : "Call AI Assistant"}</span>
        </button>
      )}

      {error && (
        <p className="absolute top-full left-0 right-0 text-red-500 text-sm mt-1 text-center whitespace-nowrap">
          {error}
        </p>
      )}
    </div>
  );
}
