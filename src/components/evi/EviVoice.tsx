"use client";
import { VoiceProvider } from "@humeai/voice-react";
import React from "react";
import EviControl from "~/components/evi/EviControl";
import EviMessages from "~/components/evi/EviMessages";

export default function EviVoice({ accessToken }: { accessToken: string }) {
  return (
    <VoiceProvider auth={{ type: "accessToken", value: accessToken }}>
      <div className="mx-auto max-w-4xl">
        <EviControl />
      </div>
    </VoiceProvider>
  );
}
