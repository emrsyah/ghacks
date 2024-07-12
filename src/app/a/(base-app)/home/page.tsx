import React from "react";
import HistoryCard from "~/components/HistoryCard";
import Streak from "~/components/Streak";
import Task from "~/components/Task";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

const JOURNAL = [
  {
    id: 1,
    title: "Focusing on breathing helps calm the mind.",
    dates: "2024-07-12",
    desc: "I am calm and at peace.",
  },
  {
    id: 2,
    title: "Taking breaks during work improves productivity.",
    dates: "2024-06-12",
    desc: "I balance work and rest effectively.",
  },
  {
    id: 3,
    title: "Gratitude journaling boosts mood and positivity.",
    dates: "2024-07-11",
    desc: "I am grateful for the positive aspects of my life.",
  },
  {
    id: 4,
    title: "Exercise significantly reduces stress levels.",
    dates: "2024-07-10",
    desc: "I am strong and healthy.",
  },
  {
    id: 5,
    title: "Spending time in nature enhances mental clarity.",
    dates: "2024-07-09",
    desc: "I am connected to the beauty of nature.",
  },
  {
    id: 6,
    title: "Talking about feelings with friends provides relief.",
    dates: "2024-07-08",
    desc: "I am open and honest in my relationships.",
  },
  {
    id: 7,
    title: "Mindfulness meditation improves focus and concentration.",
    dates: "2024-07-07",
    desc: "I am focused and present in the moment.",
  },
  {
    id: 8,
    title: "Adequate sleep is crucial for mental well-being.",
    dates: "2024-07-06",
    desc: "I prioritize rest and relaxation.",
  },
  {
    id: 9,
    title: "Setting small goals helps in achieving larger objectives.",
    dates: "2024-07-05",
    desc: "I achieve my goals step by step.",
  },
  {
    id: 10,
    title: "Creative activities like drawing or painting reduce anxiety.",
    dates: "2024-07-04",
    desc: "I am creative and inspired.",
  },
];

const HomePage = () => {
  return (
    <div className="flex gap-4 pb-3">
      <div className="flex w-full max-w-[360px] flex-col gap-3">
        <Streak />
        <Separator />
        <Task />
        {/* <Streak /> */}
      </div>
      <div className="flex h-9 w-full flex-col gap-4 bg-blue-300">
        <Button size={"lg"} className="text-md bg-indigo-600 py-8">
          Start Daily Journal
        </Button>
        <Separator />
        <div className="flex flex-col gap-2">
          {JOURNAL.map((j) => (
            <HistoryCard {...j} key={j.id} type="journal" />
          ))}
        </div>
        {/* <button>Start CBT Journaling</button> */}
      </div>
    </div>
  );
};

export default HomePage;
