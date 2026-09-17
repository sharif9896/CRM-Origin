import type { Tone } from "./tones";

export type PlainStatCard = {
  label: string;
  value: string | number;
  icon: string;
  tone: Tone;
};

const TONES: Record<Tone, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  orange: "bg-orange",
};

const PlainStatCards = ({ cards }: { cards: PlainStatCard[] }) => (
  <div className="grid grid-cols-12 gap-4 lg:gap-6 mb-4 lg:mb-6">
    {cards.map((card) => (
      <div key={card.label} className="col-span-12 sm:col-span-6 xl:col-span-3">
        <div className="bg-white-50 rounded-lg border border-border-color shadow-xs p-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{card.label}</p>
            <h2 className="text-2xl max-lg:text-xl font-bold text-gray-900 leading-none mb-0">
              {card.value}
            </h2>
          </div>
          <span
            className={`size-12 shrink-0 flex items-center justify-center rounded-full text-white text-xl ${TONES[card.tone]}`}
          >
            <i className={card.icon} />
          </span>
        </div>
      </div>
    ))}
  </div>
);

export default PlainStatCards;
