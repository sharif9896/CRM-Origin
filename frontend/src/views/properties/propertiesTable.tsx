import { useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import type { Property } from "../../data/types";
import { useCrud } from "../../hooks/useCrud";
import { usePrelineRefresh } from "../../hooks/usePrelineRefresh";
import ImageWithBasePath from "../../components/ui/imageWithBasePath";
import PageHeader from "../../components/ui/pageHeader";
import TableToolbar from "../../components/ui/tableToolbar";
import Pagination from "../../components/ui/pagination";
import ConfirmDeleteModal from "../../components/ui/confirmDeleteModal";
import RowActions from "../../components/ui/rowActions";
import PlainStatCards from "../../components/ui/plainStatCards";
import { PROPERTY_STATUSES, PROPERTY_TYPES, formatPrice } from "./constants";
import { StatusBadge, Specs } from "./shared";
import TableHeadRow, { TH_CLASS, TH_END_CLASS } from "../../components/ui/tableHead";
import ViewSwitch from "./viewSwitch";

type Props = {
  title: string;
  statCards?: boolean;
  typeFilter?: boolean;
  activeView?: "grid" | "list";
};

const PropertiesTable = ({
  title,
  statCards = false,
  typeFilter = false,
  activeView = "list",
}: Props) => {
  const crud = useCrud<Property>("properties", {
    pageSize: 8,
    searchKeys: ["name", "location", "agent", "type"],
  });
  const [pendingDelete, setPendingDelete] = useState<Property | null>(null);

  usePrelineRefresh(crud.rows.map((p) => p.id).join(","));

  const propertyCount = (status: Property["status"]) =>
    crud.allRows.filter((p) => p.status === status).length;

  return (
    <div className="p-3 lg:py-6 lg:px-0">
      {crud.error && <div className="ws-error" role="alert">{crud.error}<button onClick={() => void crud.reset()}>Retry</button></div>}
      {crud.loading && <div className="ws-notice" role="status">Loading records?</div>}
      <PageHeader
        title={title}
        action={
          <Link
            to={all_routes.addProperty}
            className="btn px-4 py-2 rounded-full bg-primary text-white text-sm font-medium inline-flex items-center gap-2 hover:bg-primary-hover transition hover:text-white"
          >
            <span className="flex">
              <i className="icon-plus" />
            </span>
            Add Properties
          </Link>
        }
      />

      {statCards && (
        <PlainStatCards
          cards={[
            { label: "Total Properties", value: String(crud.allRows.length), icon: "icon-hotel", tone: "secondary" },
            { label: "For Sale", value: String(propertyCount("For Sale")), icon: "icon-house", tone: "info" },
            { label: "For Rent", value: String(propertyCount("For Rent")), icon: "icon-key-round", tone: "orange" },
            { label: "Sold", value: String(propertyCount("Sold")), icon: "icon-badge-check", tone: "primary" },
          ]}
        />
      )}

      <div className="grid grid-cols-1">
        <div className="bg-white-50 rounded-lg border border-border-color shadow-xs overflow-hidden">
          <TableToolbar
            searchPlaceholder="Search properties..."
            search={crud.search}
            onSearch={crud.setSearch}
            filters={[
              ...(typeFilter
                ? [
                    {
                      label: "Type",
                      icon: "icon-house",
                      options: [...PROPERTY_TYPES],
                      value: crud.filters.type ?? "",
                      onChange: (v: string) => crud.setFilter("type", v),
                    },
                  ]
                : []),
              {
                label: "Status",
                icon: "icon-tag",
                options: [...PROPERTY_STATUSES],
                value: crud.filters.status ?? "",
                onChange: (v: string) => crud.setFilter("status", v),
              },
            ]}
            trailing={<ViewSwitch active={activeView} />}
          />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <TableHeadRow>
                  {([
                    ["name", "Property"],
                    ["type", "Type"],
                    ["price", "Price"],
                  ] as const).map(([key, label]) => (
                    <th
                      key={key}
                      className={`${TH_CLASS} cursor-pointer select-none`}
                      onClick={() => crud.toggleSort(key)}
                    >
                      <span className="inline-flex items-center gap-1">
                        {label}
                        {crud.sort?.key === key && (
                          <i className={crud.sort.dir === "asc" ? "icon-arrow-up" : "icon-arrow-down"} />
                        )}
                      </span>
                    </th>
                  ))}
                  <th className={TH_CLASS}>Specs</th>
                  <th className={TH_CLASS}>Status</th>
                  <th className={TH_CLASS}>Agent</th>
                  <th className={TH_END_CLASS}>Action</th>
                </TableHeadRow>
              </thead>
              <tbody className="divide-y">
                {crud.rows.map((property) => (
                  <tr key={property.id}>
                    <td className="px-6 py-4 border-b border-border-color bg-white">
                      <div className="flex items-center gap-3">
                        <ImageWithBasePath
                          src={property.image}
                          alt={property.name}
                          className="size-10 rounded-lg object-cover shadow-xs shrink-0"
                        />
                        <div>
                          <Link
                            to={`${all_routes.propertyDetails}/${property.id}`}
                            className="text-sm font-semibold text-gray-900 mb-0.5 hover:text-primary transition-colors block"
                          >
                            {property.name}
                          </Link>
                          <p className="text-[13px] text-gray-600 mb-0 flex items-center gap-1">
                            <i className="icon-map-pin" /> {property.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-border-color bg-white">
                      <span className="text-sm text-gray-600">{property.type}</span>
                    </td>
                    <td className="px-6 py-4 border-b border-border-color bg-white">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatPrice(property.price)}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b border-border-color bg-white">
                      <Specs beds={property.beds} baths={property.baths} sqft={property.sqft} />
                    </td>
                    <td className="px-6 py-4 border-b border-border-color bg-white">
                      <StatusBadge status={property.status} />
                    </td>
                    <td className="px-6 py-4 border-b border-border-color bg-white">
                      <div className="flex items-center gap-2">
                        <ImageWithBasePath
                          src={property.agentAvatar}
                          alt={property.agent}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium text-gray-900">{property.agent}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-border-color bg-white text-end">
                      <RowActions
                        label={property.name}
                        viewTo={`${all_routes.propertyDetails}/${property.id}`}
                        editTo={`${all_routes.editProperty}/${property.id}`}
                        onDelete={() => setPendingDelete(property)}
                      />
                    </td>
                  </tr>
                ))}

                {crud.rows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center border-b border-border-color bg-white">
                      <i className="icon-search-x text-3xl text-gray-400 mb-2 block" />
                      <p className="mb-0">No properties match your search.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            page={crud.page}
            pageCount={crud.pageCount}
            pageSize={crud.pageSize}
            total={crud.total}
            label="properties"
            onChange={crud.setPage}
          />
        </div>
      </div>

      <ConfirmDeleteModal
        open={pendingDelete !== null}
        entity="property"
        name={pendingDelete?.name}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) void crud.remove(pendingDelete.id).catch(() => undefined);
          setPendingDelete(null);
        }}
      />
    </div>
  );
};

export default PropertiesTable;
