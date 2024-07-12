import { AudioWaveform, BookHeart } from "lucide-react";
import React from "react";

type Params = {
  id: number;
  title: string;
  desc: string;
  dates: string;
  type: "journal" | "conversation";
};

const HistoryCard = (j: Params) => {
  return (
    <button
      type="button"
      key={j.id}
      className="flex justify-between rounded border-[1.3px] border-gray-300 bg-white px-3 py-2 text-start hover:border-indigo-600 hover:bg-indigo-50"
    >
      <div className="flex gap-3">
        <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border-[1.4px] border-indigo-300 text-indigo-600">
          {j.type == "journal" ? (
            <BookHeart size={20} />
          ) : (
            <AudioWaveform size={20} />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-indigo-600">{j.title}</h3>
          <p className="font-medium text-gray-500">{j.desc}</p>
        </div>
      </div>
      <p className="text-sm font-medium">{j.dates}</p>
    </button>
  );
};

export default HistoryCard;
