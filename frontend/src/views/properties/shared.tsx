import type { PropertyStatus } from "../../data/types";
import { propertyStatusClass } from "./constants";

export const StatusBadge = ({ status }: { status: PropertyStatus }) => (
  <span
    className={`inline-flex items-center text-xs font-bold border rounded-lg px-3 py-1 ${propertyStatusClass[status]}`}
  >
    {status}
  </span>
);

export const Specs = ({ beds, baths, sqft }: { beds: number; baths: number; sqft: number }) => (
  <div className="flex items-center gap-3 text-[13px] text-gray-600">
    <span className="flex items-center gap-1">
      <i className="icon-bed" /> {beds}
    </span>
    <span className="flex items-center gap-1">
      <i className="icon-bath" /> {baths}
    </span>
    <span className="flex items-center gap-1">
      <i className="icon-maximize" /> {sqft.toLocaleString("en-US")}
    </span>
  </div>
);
