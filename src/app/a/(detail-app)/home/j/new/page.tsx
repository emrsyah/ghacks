"use client";
import { SendHorizonal } from "lucide-react";
import * as React from "react";
import BackLink from "~/components/BackLink";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { ChatMistralAI } from "@langchain/mistralai";

const model = new ChatMistralAI({
  model: "mistral-large-latest",
  temperature: 0.7, // Increased for more nuanced responses
  apiKey: "627eLqu1GEWwEhAZc2I17ZqN0jSSX3MP",
});

interface ChatMessage {
  role: "human" | "ai";
  content: string;
}

const reframingSteps = [
  "Share a negative thought you're experiencing.",
  "What triggered this negative thought?",
  "How does this thought make you feel, and what is its impact?",
  "In what situations do you notice this thought impacting you the most?",
  "What evidence supports your negative thought?",
  "What evidence challenges this thought?",
  "How would it feel to let go of this negative thought?",
  "How can we turn this negative thought into something more positive?",
  "Let's suggest a new way of thinking about this situation.",
  "How does this new way of thinking make you feel?",
];

const NewJournal = () => {
  const [input, setInput] = React.useState("");
  const [chatHistory, setChatHistory] = React.useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(0);

  React.useEffect(() => {
    // Start the conversation with the first question
    if (chatHistory.length === 0) {
      setChatHistory([{ role: "ai", content: reframingSteps[0]! }]);
    }
  }, []);

  const sendMessage = async () => {
    if (input.trim() === "") return;
    setIsLoading(true);

    const newHumanMessage: ChatMessage = { role: "human", content: input };
    setChatHistory((prev) => [...prev, newHumanMessage]);

    try {
      const messages = [
        ...chatHistory.map((msg) =>
          msg.role === "human"
            ? new HumanMessage(msg.content)
            : new AIMessage(msg.content),
        ),
        new HumanMessage(input),
      ];

      // Prepare the prompt for the next step
      const nextStep = currentStep + 1;
      let prompt = "";
      if (nextStep < reframingSteps.length) {
        prompt = `Based on the user's response "${input}" to the question "${reframingSteps[currentStep]}", provide a thoughtful and empathetic response. Then, ask the next question: "${reframingSteps[nextStep]}". Adjust the question if needed based on previous responses.`;
      } else {
        prompt = prompt =
          "This concludes our reframing exercise. Provide a brief 2-3 sentence summary of the conversation and offer encouragement to the user.";
      }

      const response = await model.invoke([
        ...messages,
        new HumanMessage(prompt),
      ]);
      const aiContent =
        typeof response.content === "string"
          ? response.content
          : JSON.stringify(response.content);

      const newAIMessage: ChatMessage = { role: "ai", content: aiContent };
      setChatHistory((prev) => [...prev, newAIMessage]);

      if (nextStep < reframingSteps.length) {
        setCurrentStep(nextStep);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle error (e.g., show an error message to the user)
    }

    setIsLoading(false);
    setInput("");
  };

  return (
    <div className="min-h-screen">
      <nav className="mx-auto max-w-6xl px-2 py-5">
        <BackLink />
      </nav>
      <div className="mx-auto max-w-2xl rounded-md border-[1.4px] border-gray-200 p-4">
        <div className="w-full bg-white">
          <h1 className="text-lg font-semibold">
            Reframing Negative Thoughts Journal -{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </h1>
          <Separator className="my-3" />
          <div className="mb-4 h-72 overflow-y-auto">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 ${msg.role === "ai" ? "text-indigo-600" : ""}`}
              >
                {/* <strong>{msg.role === "ai" ? "AI: " : "You: "}</strong> */}
                {msg.content} {msg.role === "ai" ? "🤗" : ""}
              </div>
            ))}
            <Textarea
              value={input}
              onChange={(ev) => setInput(ev.target.value)}
              className="flex-grow border-none outline-none ring-0 focus:border-none focus:outline-none"
              placeholder="Share your thoughts here..."
            />
          </div>
          <Separator className="mb-5 mt-3" />
          <div className="flex items-center gap-3">
            <Button
              onClick={sendMessage}
              disabled={input.trim() === "" || isLoading}
              className={`flex gap-3 text-lg ${
                input.trim() === "" || isLoading
                  ? "bg-gray-400"
                  : "bg-indigo-600"
              }`}
            >
              <p>Send</p>
              <SendHorizonal />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewJournal;
