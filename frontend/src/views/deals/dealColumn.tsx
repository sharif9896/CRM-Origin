import { useDroppable } from "@dnd-kit/core";
import type { DealStage } from "../../data/types";

type Props = {
  stage: DealStage;
  accent: string;
  count: number;
  total: string;
  children: React.ReactNode;
};

const DealColumn = ({ stage, accent, count, total, children }: Props) => {
  const { setNodeRef, isOver } = useDroppable({ id: stage });

  return (
    <div
      className={`bg-white-50 rounded-lg shadow-xs p-4 flex flex-col h-full transition-colors ${
        isOver ? "border-2 border-primary" : "border border-border-color"
      }`}
    >
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border-color">
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-0.5">{stage}</h3>
          <p className="text-xs text-gray-500 mb-0">
            <span className="deal-value">{total}</span> (<span className="deal-count">{count}</span>{" "}
            deals)
          </p>
        </div>
        <span
          className={`size-6 flex items-center justify-center rounded-full text-sm font-bold deal-counter ${accent}`}
        >
          {count}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`kanban-column space-y-3 flex-1 min-h-24 rounded-lg transition-colors ${
          isOver ? "bg-primary/5" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default DealColumn;
