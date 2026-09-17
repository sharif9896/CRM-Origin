export type FilterConfig = {
  label: string;
  icon?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

type Props = {
  /** Omit the search trio to render a toolbar with filters only. */
  searchPlaceholder?: string;
  search?: string;
  onSearch?: (value: string) => void;
  filter?: FilterConfig;
  filters?: FilterConfig[];
  trailing?: React.ReactNode;
  heading?: string;
  searchWidth?: string;
  className?: string;
};

const FilterDropdown = ({ filter }: { filter: FilterConfig }) => (
  <div className="hs-dropdown relative inline-flex">
    <button
      type="button"
      className="hs-dropdown-toggle inline-flex items-center gap-2 bg-white border border-border-color text-sm font-medium text-gray-900 rounded-full py-2 px-3 hover:bg-light cursor-pointer"
    >
      {filter.icon && <i className={`${filter.icon} font-normal`} />}
      {filter.value || filter.label}
      <i className="icon-chevron-down" />
    </button>
    <div
      className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-40 bg-white border border-border-color shadow rounded-lg p-1.5 mt-1 z-100"
      role="menu"
    >
      <button
        type="button"
        className="w-full text-left block px-3 py-1.5 text-sm rounded-md font-medium text-gray-700 hover:bg-light cursor-pointer"
        onClick={() => filter.onChange("")}
      >
        All
      </button>
      {filter.options.map((option) => (
        <button
          key={option}
          type="button"
          className="w-full text-left block px-3 py-1.5 text-sm rounded-md font-medium text-gray-700 hover:bg-light cursor-pointer"
          onClick={() => filter.onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);

const TableToolbar = ({
  searchPlaceholder,
  search,
  onSearch,
  filter,
  filters,
  trailing,
  heading,
  searchWidth = "sm:w-72",
  className = "p-4 border-b border-border-color",
}: Props) => {
  const list = filters ?? (filter ? [filter] : []);

  const searchBox = onSearch ? (
    <div className={`relative w-full ${searchWidth}`}>
      <input
        type="text"
        placeholder={searchPlaceholder}
        value={search ?? ""}
        onChange={(e) => onSearch(e.target.value)}
        className="form-input w-full bg-white border border-border-color text-sm text-gray-900 rounded-full py-2 pl-4 pr-10! focus:ring-0 focus:border-border-color"
      />
      <i className="icon-search absolute top-1/2 -translate-y-1/2 right-3.5 text-base text-gray-500 leading-none pointer-events-none" />
    </div>
  ) : null;

  if (heading) {
    return (
      <div className={`flex items-center justify-between gap-2 flex-wrap ${className}`}>
        <h2 className="text-gray-900 text-lg font-bold mb-0">{heading}</h2>
        {searchBox}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center ${searchBox ? "justify-between" : "justify-end"} flex-wrap gap-3 ${className}`}
    >
      {searchBox}
      <div className="flex items-center flex-wrap gap-2 md:gap-3">
        {list.map((f) => (
          <FilterDropdown key={f.label} filter={f} />
        ))}
        {trailing}
      </div>
    </div>
  );
};

export default TableToolbar;
