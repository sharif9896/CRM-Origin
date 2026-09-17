import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import type { Property } from "../../data/types";
import { useCrud } from "../../hooks/useCrud";
import PageHeader from "../../components/ui/pageHeader";
import TableToolbar from "../../components/ui/tableToolbar";
import Pagination from "../../components/ui/pagination";
import PropertyCard from "./propertyCard";
import ViewSwitch from "./viewSwitch";
import { PROPERTY_STATUSES, PROPERTY_TYPES } from "./constants";

const PropertyGrid = () => {
  const crud = useCrud<Property>("properties", {
    pageSize: 6,
    searchKeys: ["name", "location", "agent", "type"],
  });

  return (
    <div className="p-3 lg:py-6 lg:px-0">
      {crud.error && <div className="ws-error" role="alert">{crud.error}<button onClick={() => void crud.reset()}>Retry</button></div>}
      {crud.loading && <div className="ws-notice" role="status">Loading records?</div>}
      <PageHeader
        title="Property Grid"
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

      <div className="bg-white-50 rounded-lg border border-border-color shadow-xs p-4 mb-4 lg:mb-6">
        <TableToolbar
          className=""
          searchPlaceholder="Search properties..."
          search={crud.search}
          onSearch={crud.setSearch}
          filters={[
            {
              label: "Type",
              icon: "icon-house",
              options: [...PROPERTY_TYPES],
              value: crud.filters.type ?? "",
              onChange: (v) => crud.setFilter("type", v),
            },
            {
              label: "Status",
              icon: "icon-tag",
              options: [...PROPERTY_STATUSES],
              value: crud.filters.status ?? "",
              onChange: (v) => crud.setFilter("status", v),
            },
          ]}
          trailing={<ViewSwitch active="grid" />}
        />
      </div>

      {crud.rows.length === 0 ? (
        <div className="bg-white-50 rounded-lg border border-border-color p-12 text-center">
          <i className="icon-search-x text-3xl text-gray-400 mb-2 block" />
          <p className="mb-0">No properties match your search.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-12 gap-4 lg:gap-6">
            {crud.rows.map((property) => (
              <div key={property.id} className="col-span-12 sm:col-span-6 xl:col-span-4">
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
          <Pagination
            className="flex items-center justify-between flex-wrap gap-3 mt-6"
            page={crud.page}
            pageCount={crud.pageCount}
            pageSize={crud.pageSize}
            total={crud.total}
            label="properties"
            onChange={crud.setPage}
          />
        </>
      )}
    </div>
  );
};

export default PropertyGrid;
