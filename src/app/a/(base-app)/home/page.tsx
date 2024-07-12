"use client";
import Link from "next/link";
import React from "react";
import HistoryCard from "~/components/HistoryCard";
import Streak from "~/components/Streak";
import Task from "~/components/Task";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/react";

const HomePage = () => {
  const { data, isLoading } = api.journal.getAll.useQuery();

  return (
    <div className="flex gap-4 pb-3">
      <div className="flex w-full max-w-[360px] flex-col gap-3">
        <Streak />
        <Separator />
        <Task />
      </div>
      <div className="flex h-9 w-full flex-col gap-4 bg-blue-300">
        <Link href={"home/j/new"} className="w-full">
          <Button size={"lg"} className="text-md w-full bg-indigo-600 py-8">
            Start Daily Journal
          </Button>
        </Link>
        <Separator />
        <div className="flex flex-col gap-2">
          {isLoading ? (
            <div>Loading...</div>
          ) : data && data.length > 0 ? (
            data.map((j) => (
              <HistoryCard
                dates={j.date}
                title={j.keyTakeaway}
                desc={j.wordAffirmation}
                id={j.id}
                key={j.id}
                type="journal"
              />
            ))
          ) : (
            <div className="flex w-full items-center font-medium text-gray-500">
              No journal entries yet.
            </div>
          )}
          {/* {JOURNAL.map((j) => (
            <HistoryCard {...j} key={j.id} type="journal" />
          ))} */}
        </div>
        {/* <button>Start CBT Journaling</button> */}
      </div>
    </div>
  );
};

export default HomePage;
