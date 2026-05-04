import { Story } from "@/types/story";

type Status = Story["status"];

interface Props {
  activeStatus: Status;
  onStatusChange: (status: Status) => void;
}

export const StatusTabs = ({ activeStatus, onStatusChange }: Props) => {
  const tabs: { label: string; value: Status; color: string }[] = [
    { label: "Active", value: "todo", color: "bg-[#a3ff33]" },
    { label: "In progress", value: "in progress", color: "bg-[#ff9933]" },
    { label: "Done", value: "done", color: "bg-white" },
  ];

  return (
    <div className="flex justify-end gap-1 mb-[-2px] mr-4 relative z-10">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onStatusChange(tab.value)}
          className={`px-6 py-2 rounded-t-xl font-medium transition-all duration-300 ${
            activeStatus === tab.value 
            ? `${tab.color} text-black scale-105` 
            : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};