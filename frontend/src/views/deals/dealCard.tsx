import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Deal } from "../../data/types";
import { dealStageHover } from "../../data/deals";
import ImageWithBasePath from "../../components/ui/imageWithBasePath";

export const DealCardBody = ({ deal, dragging = false }: { deal: Deal; dragging?: boolean }) => {
  const isWon = deal.stage === "Won";

  return (
    <div
      className={`kanban-card bg-white rounded-lg p-3 border transition-all ${
        isWon
          ? "border-success/30 bg-success/5 cursor-default"
          : `border-border-color hover:shadow-md cursor-move ${dealStageHover[deal.stage]} ${
              dragging ? "shadow-lg" : ""
            }`
      }`}
    >
      <p className="text-sm font-medium text-gray-900 mb-2">{deal.title}</p>
      <p className="text-xs text-gray-500 mb-3">{deal.price}</p>
      <div className="flex items-center gap-2">
        <ImageWithBasePath
          src={deal.avatar}
          alt={deal.agent}
          className="w-6 h-6 rounded-full object-cover"
        />
        <span className="text-xs text-gray-600">{deal.agent}</span>
      </div>
    </div>
  );
};

const DealCard = ({ deal }: { deal: Deal }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: deal.id,
    disabled: deal.stage === "Won",
  });

  if (deal.stage === "Won") return <DealCardBody deal={deal} />;

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? "opacity-50 scale-95" : ""}
      {...attributes}
      {...listeners}
    >
      <DealCardBody deal={deal} />
    </div>
  );
};

export default DealCard;
