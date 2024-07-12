"use client";
import { Loader2 } from "lucide-react";
import React from "react";
import BackLink from "~/components/BackLink";
import { Separator } from "~/components/ui/separator";
import { dateConverterCreatedAt } from "~/lib/helper";
import { api } from "~/trpc/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

interface ChatMessage {
  role: "ai" | "human";
  content: string;
}

const DetailJournal = ({ params }: { params: { id: string } }) => {
  const { data, isLoading } = api.journal.getById.useQuery({
    id: parseInt(params.id),
  });
  const chatData = data?.chat as ChatMessage[] | undefined;

  // console.log(data);
  return (
    <div>
      <nav className="mx-auto max-w-6xl px-2 py-5">
        <BackLink />
      </nav>
      {isLoading ? (
        <div className="mx-auto my-24 flex max-w-2xl flex-col items-center justify-center rounded-md">
          <Loader2 size="64" className="animate-spin" />
          <p>Getting Your Journal</p>
        </div>
      ) : (
        <main className="mx-auto max-w-2xl rounded-md border-[1.4px] border-gray-200 p-4">
          <div className="w-full bg-white">
            <div className="flex flex-col gap-2">
              <h1 className="text-lg font-semibold">{data?.keyTakeaway}</h1>
              <h6 className="w-fit rounded-lg bg-indigo-600 px-4 py-1 font-medium text-white">
                {dateConverterCreatedAt(data ? data.date : new Date())}
              </h6>
            </div>
            <Tabs defaultValue="analytics" className="mt-3 w-full">
              <TabsList>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
              </TabsList>
              <Separator className="mt-1" />
              <TabsContent value="analytics">
                <div className="flex flex-col gap-3">
                  <div>
                    <h5 className="font-semibold text-indigo-600">
                      Key Takeaway 🔍
                    </h5>
                    <h6 className="text-lg font-medium">{data?.keyTakeaway}</h6>
                  </div>
                  <div>
                    <h5 className="font-semibold text-indigo-600">
                      Word Affirmations ✨
                    </h5>
                    <h6 className="text-lg font-medium">
                      {data?.wordAffirmation}
                    </h6>
                  </div>
                  <div>
                    <h5 className="font-semibold text-indigo-600">
                      Your Mood 🤔
                    </h5>
                    <h6 className="text-lg font-medium">{data?.mood}</h6>
                  </div>
                  <div>
                    <h5 className="font-semibold text-indigo-600">
                      Your ToDos ✨
                    </h5>
                    <h6 className="text-lg font-medium">
                      {data?.tasks.map((task) => (
                        <div key={task.id}>{task.description}</div>
                      ))}
                    </h6>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="chat">
                <div className="mb-4 h-72 overflow-y-auto">
                  {chatData != null ? (
                    chatData.map((msg, index) => (
                      <div
                        key={index}
                        className={`mb-2 ${msg.role === "ai" ? "font-medium text-indigo-600" : ""}`}
                      >
                        {msg.content} {msg.role === "ai" ? "🤗" : ""}
                      </div>
                    ))
                  ) : (
                    <div>NO Data Chat</div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      )}
    </div>
  );
};

export default DetailJournal;
