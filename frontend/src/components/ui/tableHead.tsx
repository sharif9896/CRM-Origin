export const TH_CLASS =
  "px-6 py-3 bg-white text-gray-900 text-start text-[13px] font-semibold uppercase tracking-wider";

export const TH_END_CLASS =
  "px-6 py-3 bg-white text-gray-900 text-end text-[13px] font-semibold uppercase tracking-wider";

const TableHeadRow = ({ children }: { children: React.ReactNode }) => (
  <tr className="border-b border-border-color bg-gray-50/50">{children}</tr>
);

export default TableHeadRow;
