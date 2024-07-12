"use client";
import { Loader, SendHorizonal } from "lucide-react";
import * as React from "react";
import BackLink from "~/components/BackLink";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
} from "@langchain/core/messages";
// import { ChatMistralAI } from "@langchain/mistralai";

// const model = new ChatMistralAI({
//   model: "mistral-large-latest",
//   temperature: 0.7, // Increased for more nuanced responses
//   apiKey: "627eLqu1GEWwEhAZc2I17ZqN0jSSX3MP",
// });

import { ChatOpenAI } from "@langchain/openai";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Progress } from "~/components/ui/progress";
import { toast } from "sonner";
// import { api } from "~/trpc/server";

const model = new ChatOpenAI({
  model: "gpt-4-turbo",
  temperature: 0,
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
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

const psychologistPrompt = `You are a skilled psychologist specializing in cognitive behavioral therapy (CBT). Your role is to guide the user through a process of reframing negative thoughts. Respond with empathy, insight, and professionalism, always maintaining a supportive and non-judgmental tone. Keep your responses concise, aiming for 2 sentences maximum. Your goal is to help the user identify, challenge, and reframe their negative thoughts in a more balanced and constructive way.`;

interface AnalysisResult {
  mood: string;
  keyTakeaway: string;
  affirmation: string;
  summary: string;
  actionableItems: string[];
}

const NewJournal = () => {
  const [input, setInput] = React.useState("");
  const [chatHistory, setChatHistory] = React.useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isFinished, setIsFinished] = React.useState(false);
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  // const [lo]
  const { mutateAsync, isPending } = api.journal.create.useMutation({
    onSuccess: (result) => {
      toast("New Journal Added");
      // router.push("/a/journal");
      router.replace(`/a/home/j/${result.id}`);
    },
    onMutate: () => {
      setIsLoading(true);
    },
  });
  const router = useRouter();

  // console.log(currentStep);
  // console.log(reframingSteps.length);

  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

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
        new SystemMessage(psychologistPrompt),
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
          "This concludes our reframing exercise. Provide a brief 1 sentence summary of the conversation and offer encouragement to the user.";
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

      // console.log(nextStep);
      // console.log(reframingSteps.length);
      if (nextStep < reframingSteps.length) {
        setCurrentStep(nextStep);
      } else if (nextStep == reframingSteps.length) {
        // alert("selesai");
        setIsFinished(true);
        // finishedJournaling();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle error (e.g., show an error message to the user)
    }

    setIsLoading(false);
    setInput("");
  };

  const finishedJournaling = async () => {
    const promptForAnalysis = `
    Based on the following chat history, please provide:
    1. The user's mood (choose from: happy, anxious, sad, angry, confused)
    2. A key takeaway from the conversation which the user can learn from
    3. A word of affirmation for the user
    4. A summary of the user's condition (for their psychologist)
    5. 3 actionable items the user can do

    Chat history:
    ${chatHistory.map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`).join("\n")}

    Please format your response as a JSON object with the following structure:
    {
      "mood": string,
      "keyTakeaway": string,
      "affirmation": string,
      "summary": string,
      "actionableItems": [string, string, string]
    }
  `;

    try {
      const response = await model.invoke([
        new SystemMessage(psychologistPrompt),
        new HumanMessage(promptForAnalysis),
      ]);

      const analysisResult = JSON.parse(
        response.content as string,
      ) as AnalysisResult;
      // console.log("Analysis Result:", analysisResult);
      const result = await mutateAsync({
        actionableItems: analysisResult.actionableItems,
        wordAffirmation: analysisResult.affirmation,
        keyTakeaway: analysisResult.keyTakeaway,
        mood: analysisResult.mood,
        summary: analysisResult.summary,
        chat: chatHistory,
        type: "CBT",
      });
      // router.replace(`/a/home/j/${result.id}`);
      // Here you can do something with the analysisResult,
      // such as saving it to a database or displaying it to the user
    } catch (error) {
      console.error("Error analyzing chat history:", error);
      // Handle the error appropriately
    }
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
          <Separator className="mt-3" />
          <Progress
            value={
              isFinished ? 100 : (currentStep / reframingSteps.length) * 100
            }
            // max={reframingSteps.length}
            className="mb-3 h-2 text-indigo-600"
            // color="indigo"
          />
          <div ref={chatContainerRef} className="mb-4 h-72 overflow-y-auto">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 ${msg.role === "ai" ? "font-medium text-indigo-600" : ""}`}
              >
                {/* <strong>{msg.role === "ai" ? "AI: " : "You: "}</strong> */}
                {msg.content} {msg.role === "ai" ? "🤗" : ""}
              </div>
            ))}
            {isFinished ? null : (
              <Textarea
                value={input}
                disabled={isFinished}
                onChange={(ev) => setInput(ev.target.value)}
                className="flex-grow border-none outline-none ring-0 focus:border-none focus:outline-none"
                placeholder="Share your thoughts here..."
              />
            )}
          </div>
          <Separator className="mb-5 mt-3" />
          <div className="flex items-center gap-3">
            <Button
              onClick={isFinished ? finishedJournaling : sendMessage}
              disabled={
                (input.trim() === "" && !isFinished) || isLoading || isPending
              }
              className={`flex gap-3 text-lg ${
                (input.trim() === "" && !isFinished) || isLoading
                  ? "bg-gray-400"
                  : "bg-indigo-600"
              } ${isFinished ? "w-full" : ""}`}
            >
              {isPending ? (
                <p>Adding Data...</p>
              ) : (
                <p>{isFinished ? "Finish Journal" : "Send"}</p>
              )}
              {isPending ? (
                <Loader className="animate-spin" />
              ) : (
                <SendHorizonal />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewJournal;
