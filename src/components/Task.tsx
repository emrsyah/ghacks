import { ChevronDown } from "lucide-react";
import React from "react";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { api, RouterInputs, type RouterOutputs } from "~/trpc/react";

type Task = {
  id: number;
  task: string;
  points: number;
  isDone: boolean;
  dateCompleted: Date | null;
};

// const TASK_TODOS: Task[] = [
//   {
//     id: 1,
//     task: "Baca Buku sebelum tidur",
//     points: 1,
//     isDone: false,
//     // taskDone:
//     dateCompleted: undefined,
//   },
//   {
//     id: 3,
//     task: "Makan buah dan sayur setiap hari",
//     points: 1,
//     isDone: false,
//     dateCompleted: undefined,
//   },
//   {
//     id: 4,
//     task: "Meditasi selama 10 menit",
//     points: 1,
//     isDone: false,
//     dateCompleted: undefined,
//   },
// ];

// const TASK_COMPLETED = [
//   {
//     id: 2,
//     task: "Lari pagi selama 30 menit",
//     points: 2,
//     isDone: true,
//     dateCompleted: new Date(),
//   },
//   {
//     id: 5,
//     task: "Belajar hal baru selama 1 jam",
//     points: 2,
//     isDone: true,
//     dateCompleted: new Date(),
//   },
// ];

// type TaskType = RouterOutputs["task"]["getAll"];

const Task = () => {
  // const getTask = task?.map((t) => ({...t, isDone: t.isDone || false }));
  const { data: completed, isLoading: isLoadingCompleted } =
    api.task.getCompletedTask.useQuery();
  const { data: uncompleted, isLoading: isLoadingUncompleted } =
    api.task.getUncompletedTask.useQuery();
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-xl font-bold">Your Task:</h1>
      {isLoadingUncompleted ? (
        <div className="flex items-center justify-center">
          <p className="font-medium text-gray-600">Getting data...</p>
          {/* <div className="flex h-10 w-10 animate-pulse items-center justify-center rounded-full border-2 border-gray-200"></div> */}
        </div>
      ) : uncompleted != undefined && uncompleted.length > 0 ? null : (
        // completed.map((t) => <TaskCard key={t.id} id={t.id} isDone={t.dateCompleted} />)
        <div className="text-sm font-medium text-gray-500">No Task Yet</div>
      )}
      <Collapsible className="">
        <CollapsibleTrigger className="mt-3 flex w-full items-center justify-between rounded-sm hover:bg-gray-200">
          {/* <button className=""> */}
          <h2 className="text-sm font-medium text-gray-700">
            {isLoadingCompleted ? "Getting task..." : "See Completed Task"}
          </h2>
          <ChevronDown size={16} className="text-gray-700" />
          {/* </button> */}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-1">
            {isLoadingCompleted ? (
              <div className="flex items-center justify-center">
                <div className="flex h-10 w-10 animate-pulse items-center justify-center rounded-full border-2 border-gray-200">
                  Loading...
                </div>
              </div>
            ) : completed != undefined && completed.length > 0 ? (
              // completed.map((t) => <TaskCard key={t.id} id={t.id} isDone={t.dateCompleted} />)
              completed.map((t) => (
                <TaskCard
                  key={t.id}
                  isDone={t.dateCompleted == null ? false : true}
                  id={t.id}
                  points={1}
                  task={t.description}
                  dateCompleted={t.dateCompleted}
                />
              ))
            ) : (
              <div className="text-sm font-medium text-gray-500">
                No Completed Task Yet
              </div>
            )}
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
