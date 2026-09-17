import type { Tone } from "./tones";

export type SolidStatCard = {
  label: string;
  value: string | number;
  caption: string;
  icon: string;
  tone: Tone;
  blob?: "top-right" | "bottom-right" | "bottom-left" | "top-left";
};

const TONES: Record<Tone, string> = {
  primary: "from-primary to-primary/80",
  secondary: "from-secondary to-secondary/80",
  success: "from-success to-success/80",
  warning: "from-warning to-warning/80",
  danger: "from-danger to-danger/80",
  info: "from-info to-info/80",
  orange: "from-orange to-orange/80",
};

const BLOBS: Record<NonNullable<SolidStatCard["blob"]>, string> = {
  "top-right": "-top-6 -right-6",
  "bottom-right": "-bottom-6 -right-6",
  "bottom-left": "-bottom-6 -left-6",
  "top-left": "-top-6 -left-6",
};

const SolidStatCards = ({ cards }: { cards: SolidStatCard[] }) => (
  <div className="grid grid-cols-12 gap-4 lg:gap-6 mb-4 lg:mb-6">
    {cards.map((card) => (
      <div key={card.label} className="col-span-12 sm:col-span-6 xl:col-span-3">
        <div
          className={`bg-gradient-to-br rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-white relative group overflow-hidden h-full flex flex-col ${TONES[card.tone]}`}
        >
          <div
            className={`absolute w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500 ${BLOBS[card.blob ?? "bottom-right"]}`}
          />
          <div className="relative z-10 flex-1">
            <i className={`${card.icon} text-4xl! opacity-50 mb-3 block`} />
            <p className="text-sm font-medium text-white mb-1">{card.label}</p>
            <h2 className="text-3xl max-lg:text-2xl max-md:text-[22px] font-bold leading-none text-white mb-2">
              {card.value}
            </h2>
            <p className="text-xs text-white mb-0">{card.caption}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default SolidStatCards;
