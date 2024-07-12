"use client";
import * as React from "react";
import { useVoice } from "@humeai/voice-react";

export default function EviMessages() {
  const { messages } = useVoice();

  // React.useEffect(() => {
  //   console.log(lastVoiceMessage);
  // }, [messages]);

  return (
    <div>
      {/* {lastVoiceMessage?.models} */}
      {messages.map((msg, index) => {
        if (msg.type === "user_message" || msg.type === "assistant_message") {
          return (
            <div key={msg.type + index}>
              <div>{msg.message.role}</div>
              <div>{msg.message.content}</div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
