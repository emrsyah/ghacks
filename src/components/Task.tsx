import { ChevronDown } from "lucide-react";
import React from "react";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";

type Task = {
  id: number;
  task: string;
  points: number;
  isDone: boolean;
  dateCompleted?: Date;
};

const TASK_TODOS: Task[] = [
  {
    id: 1,
    task: "Baca Buku sebelum tidur",
    points: 1,
    isDone: false,
    // taskDone:
    dateCompleted: undefined,
  },
  {
    id: 3,
    task: "Makan buah dan sayur setiap hari",
    points: 1,
    isDone: false,
    dateCompleted: undefined,
  },
  {
    id: 4,
    task: "Meditasi selama 10 menit",
    points: 1,
    isDone: false,
    dateCompleted: undefined,
  },
];

const TASK_COMPLETED = [
  {
    id: 2,
    task: "Lari pagi selama 30 menit",
    points: 2,
    isDone: true,
    dateCompleted: new Date(),
  },
  {
    id: 5,
    task: "Belajar hal baru selama 1 jam",
    points: 2,
    isDone: true,
    dateCompleted: new Date(),
  },
];

const Task = () => {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-xl font-bold">Your Task:</h1>
      {TASK_TODOS.map((t) => (
        <TaskCard key={t.id} {...t} />
      ))}
      <Collapsible className="">
        <CollapsibleTrigger className="w-full">
          <button className="mt-3 flex w-full items-center justify-between rounded-sm hover:bg-gray-200">
            <h2 className="text-sm font-medium text-gray-700">
              See Completed Task
            </h2>
            <ChevronDown size={16} className="text-gray-700" />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-1">
            {TASK_COMPLETED.map((t) => (
              <TaskCard key={t.id} {...t} />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

const TaskCard = (t: Task) => {
  return (
    <div
      key={t.id}
      className={`flex justify-between border-b-[1.3px] border-gray-300 pb-2 pr-3 pt-1 ${t.isDone ? "text-gray-500 line-through" : ""}`}
    >
      <div>
        <h2
          className={`font-semibold ${t.isDone ? "text-gray-500" : "text-indigo-700"}`}
        >
          {t.task}
        </h2>
        <p className="text-sm font-medium text-gray-700">Point: {t.points}</p>
      </div>
      <div className="pt-1">
        <Checkbox checked={t.isDone} />
      </div>
    </div>
  );
};

export default Task;
