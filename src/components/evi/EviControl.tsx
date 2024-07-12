"use client";
import { useVoice, VoiceReadyState } from "@humeai/voice-react";
export default function EviControl() {
  const { connect, disconnect, readyState, lastVoiceMessage, status } =
    useVoice();
  if (readyState === VoiceReadyState.OPEN) {
    return (
      <button
        onClick={() => {
          disconnect();
        }}
      >
        End Session
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        connect()
          .then(() => {
            /* handle success */
          })
          .catch(() => {
            /* handle error */
          });
      }}
    >
      Start Session
    </button>
  );
}
