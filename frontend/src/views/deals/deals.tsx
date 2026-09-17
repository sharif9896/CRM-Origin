import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DEAL_STAGES, dealStageClass } from "../../data/deals";
import type { Deal, DealStage } from "../../data/types";
import { useCrud } from "../../hooks/useCrud";
import PageHeader from "../../components/ui/pageHeader";
import DealCard, { DealCardBody } from "./dealCard";
import DealColumn from "./dealColumn";
import { compactMoney } from "./constants";

const STAT_CARD =
  "bg-white rounded-lg border border-border-color shadow-sm hover:shadow-md transition-shadow p-6 relative group h-full flex flex-col";
const STAT_LABEL = "text-xs font-semibold text-gray-600 tracking-wider mb-2";
const STAT_VALUE = "text-3xl max-lg:text-2xl max-md:text-[22px] font-bold text-gray-900 leading-tight";

const startOfMonth = () => {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
};

const Deals = () => {
  const crud = useCrud<Deal>("deals", { pageSize: 500 });
  const deals = crud.rows;
  const [dragging, setDragging] = useState<Deal | null>(null);
  const [dragError, setDragError] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const byStage = useMemo(
    () =>
      Object.fromEntries(
        DEAL_STAGES.map((stage) => [stage, deals.filter((d) => d.stage === stage)]),
      ) as Record<DealStage, Deal[]>,
    [deals],
  );

  const pipelineValue = useMemo(() => deals.reduce((sum, d) => sum + d.value, 0), [deals]);
  const avgValue = deals.length ? pipelineValue / deals.length : 0;
  const wonThisMonth = useMemo(() => {
    const cutoff = startOfMonth();
    return deals
      .filter((d) => d.stage === "Won" && d.closeDate && new Date(d.closeDate) >= cutoff)
      .reduce((sum, d) => sum + d.value, 0);
  }, [deals]);

  const onDragStart = ({ active }: DragStartEvent) =>
    setDragging(deals.find((d) => d.id === active.id) ?? null);

  const onDragEnd = async ({ active, over }: DragEndEvent) => {
    setDragging(null);
    if (!over) return;

    const overStage = DEAL_STAGES.includes(over.id as DealStage)
      ? (over.id as DealStage)
      : deals.find((d) => d.id === over.id)?.stage;
    if (!overStage) return;

    const dealId = String(active.id);
    const current = deals.find((d) => d.id === dealId);
    if (!current || current.stage === overStage) return;

    setDragError(null);
    try {
      await crud.update(dealId, { stage: overStage });
    } catch {
      setDragError("Failed to update deal stage. Please try again.");
    }
  };

  return (
    <div className="p-3 lg:py-6 lg:px-0">
      {crud.error && <div className="ws-error" role="alert">{crud.error}<button onClick={() => void crud.reset()}>Retry</button></div>}
      {crud.loading && <div className="ws-notice" role="status">Loading records?</div>}
      <PageHeader title="Deals" />

      {dragError && (
        <div className="mb-4 rounded-lg border border-danger/30 bg-danger/10 text-danger text-sm px-4 py-3">
          {dragError}
        </div>
      )}

      <div className="grid grid-cols-12 gap-4 lg:gap-6 mb-4 lg:mb-6">
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <div className={STAT_CARD}>
            <div className="flex items-start justify-between mb-4 flex-1">
              <div className="flex-1">
                <p className={STAT_LABEL}>Pipeline Value</p>
                <h2 className={STAT_VALUE}>{compactMoney(pipelineValue)}</h2>
              </div>
              <div className="text-3xl text-secondary/20 group-hover:scale-110 transition-transform">
                <i className="icon-trending-up" />
              </div>
            </div>
            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-secondary to-secondary/60 rounded-full"
                style={{ width: "75%" }}
              />
            </div>
          </div>
        </div>

        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <div className={STAT_CARD}>
            <div className="flex items-start justify-between mb-4 flex-1">
              <div className="flex-1">
                <p className={STAT_LABEL}>Active Deals</p>
                <h2 className={`${STAT_VALUE} mb-3`}>{deals.filter((d) => d.stage !== "Won").length}</h2>
              </div>
              <div className="text-3xl text-primary/20 group-hover:scale-110 transition-transform">
                <i className="icon-handshake" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Across all stages</span>
            </div>
          </div>
        </div>

        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <div className={STAT_CARD}>
            <div className="flex items-start justify-between mb-4 flex-1">
              <div className="flex-1">
                <p className={STAT_LABEL}>Avg Value</p>
                <h2 className={STAT_VALUE}>{compactMoney(avgValue)}</h2>
              </div>
              <div className="text-3xl text-info/20 group-hover:scale-110 transition-transform">
                <i className="icon-calculator" />
              </div>
            </div>
            <p className="text-xs text-gray-500">Per transaction</p>
          </div>
        </div>

        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-lg border-2 border-success/30 shadow-sm hover:shadow-md hover:border-success/50 transition-all p-6 relative group h-full flex flex-col">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-semibold text-success tracking-wider mb-2">
                    Won This Month
                  </p>
                  <h2 className="text-3xl max-lg:text-2xl max-md:text-[22px] font-bold text-success leading-tight">
                    {compactMoney(wonThisMonth)}
                  </h2>
                </div>
                <div className="text-3xl text-success/30 group-hover:scale-110 transition-transform">
                  <i className="icon-circle-check" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {crud.loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragCancel={() => setDragging(null)}
        >
          <div className="grid grid-cols-12 gap-4 lg:gap-6 items-start">
            {DEAL_STAGES.map((stage) => (
              <div key={stage} className="col-span-12 md:col-span-6 xl:col-span-3">
                <DealColumn
                  stage={stage}
                  accent={dealStageClass[stage]}
                  count={byStage[stage].length}
                  total={compactMoney(byStage[stage].reduce((sum, d) => sum + d.value, 0))}
                >
                  <SortableContext
                    items={byStage[stage].map((d) => d.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {byStage[stage].map((deal) => (
                      <DealCard key={deal.id} deal={deal} />
                    ))}
                  </SortableContext>
                </DealColumn>
              </div>
            ))}
          </div>

          <DragOverlay>{dragging && <DealCardBody deal={dragging} dragging />}</DragOverlay>
        </DndContext>
      )}
    </div>
  );
};

export default Deals;
