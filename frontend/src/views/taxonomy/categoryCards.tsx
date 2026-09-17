import type { Taxonomy } from "../../data/types";

const CategoryCards = ({ items }: { items: Taxonomy[] }) => (
  <div className="grid grid-cols-12 gap-4 lg:gap-6 mb-4 lg:mb-6">
    {items.map((item) => (
      <div key={item.id} className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-2">
        <div className="bg-white-50 rounded-lg border border-border-color shadow-xs p-5 hover:shadow-md transition-shadow duration-200 text-center h-full">
          <span
            className={`size-14 mx-auto flex items-center justify-center rounded-full text-white text-2xl mb-3 ${item.badge}`}
          >
            <i className={item.icon} />
          </span>
          <h2 className="text-base font-bold text-gray-900 mb-0.5">{item.name}</h2>
          <p className="text-[13px] text-gray-500 mb-0">
            {item.usedIn.toLocaleString()} Properties
          </p>
        </div>
      </div>
    ))}
  </div>
);

export default CategoryCards;
