import { useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import { STAFF_STATUSES, staffStatusClass } from "../../data/staff";
import type { Staff } from "../../data/types";
import { useCrud } from "../../hooks/useCrud";
import ImageWithBasePath from "../../components/ui/imageWithBasePath";
import PageHeader from "../../components/ui/pageHeader";
import TableToolbar from "../../components/ui/tableToolbar";
import Pagination from "../../components/ui/pagination";
import ConfirmDeleteModal from "../../components/ui/confirmDeleteModal";
import StatCards from "../../components/ui/statCards";
import TableHeadRow, { TH_CLASS, TH_END_CLASS } from "../../components/ui/tableHead";
import { usePrelineRefresh } from "../../hooks/usePrelineRefresh";

const DROPDOWN_ITEM =
  "flex items-center hover:bg-primary-50 px-4 py-1.75 rounded-lg text-sm text-default hover:text-primary focus:outline-hidden focus:bg-white";

const StaffPage = () => {
  const crud = useCrud<Staff>("staff", {
    pageSize: 8,
    searchKeys: ["name", "email", "role", "department"],
  });
  const [pendingDelete, setPendingDelete] = useState<Staff | null>(null);

  usePrelineRefresh(crud.rows.map((s) => s.id).join(","));

  const count = (status: Staff["status"]) => crud.allRows.filter((s) => s.status === status).length;

  return (
    <div className="p-3 lg:py-6 lg:px-0">
      {crud.error && <div className="ws-error" role="alert">{crud.error}<button onClick={() => void crud.reset()}>Retry</button></div>}
      {crud.loading && <div className="ws-notice" role="status">Loading records?</div>}
      <PageHeader
        title="Staff Management"
        crumb="Staff"
        action={
          <Link
            to={all_routes.addStaff}
            className="btn px-4 py-2 rounded-full bg-primary text-white text-sm font-medium inline-flex items-center gap-2 hover:bg-primary-hover transition hover:text-white"
          >
            <span className="flex">
              <i className="icon-plus" />
            </span>
            Add Staff
          </Link>
        }
      />

      <StatCards
        cards={[
          { label: "Total Staff", value: crud.allRows.length, icon: "icon-users", tone: "secondary" },
          { label: "Active", value: count("Active"), icon: "icon-circle-check", tone: "primary" },
          { label: "Pending Approval", value: 0, icon: "icon-hourglass", tone: "warning" },
          { label: "On Leave", value: count("On Leave"), icon: "icon-calendar-off", tone: "info" },
        ]}
      />

      <div className="grid grid-cols-1">
        <div className="bg-white-50 rounded-lg border border-border-color shadow-xs overflow-hidden">
          <TableToolbar
            searchPlaceholder="Search staff..."
            search={crud.search}
            onSearch={crud.setSearch}
            filter={{
              label: "Status",
              icon: "icon-tag",
              options: STAFF_STATUSES,
              value: crud.filters.status ?? "",
              onChange: (v) => crud.setFilter("status", v),
            }}
          />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <TableHeadRow>
                  {([
                    ["name", "Name"],
                    ["email", "Email"],
                    ["role", "Role"],
                    ["department", "Department"],
                    ["status", "Status"],
                    ["joinDate", "Join Date"],
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
                  <th className={TH_END_CLASS}>Action</th>
                </TableHeadRow>
              </thead>
              <tbody className="divide-y">
                {crud.rows.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 border-b border-border-color bg-white">
                      <div className="flex items-center gap-3">
                        <ImageWithBasePath
                          src={member.avatar}
                          alt={member.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <Link
                          to={`${all_routes.editStaff}/${member.id}`}
                          className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors"
                        >
                          {member.name}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-border-color bg-white">
                      <span className="text-sm text-gray-600">{member.email}</span>
                    </td>
                    <td className="px-6 py-4 border-b border-border-color bg-white">
                      <span className="text-sm font-medium text-gray-900">{member.role}</span>
                    </td>
                    <td className="px-6 py-4 border-b border-border-color bg-white">
                      <span className="text-sm text-gray-600">{member.department}</span>
                    </td>
                    <td className="px-6 py-4 border-b border-border-color bg-white">
                      <span
                        className={`inline-flex items-center text-xs font-bold border rounded-lg px-3 py-1 ${staffStatusClass[member.status]}`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b border-border-color bg-white">
                      <span className="text-sm text-gray-600">{member.joinDate}</span>
                    </td>
                    <td className="px-6 py-4 border-b border-border-color bg-white text-end">
                      <div className="hs-dropdown [--placement:bottom-right] [--auto-close:inside] relative inline-flex">
                        <button
                          type="button"
                          className="hs-dropdown-toggle size-9 rounded-full cursor-pointer hover:bg-gray-100 text-gray-900 flex items-center justify-center transition-colors text-base"
                          aria-haspopup="menu"
                          aria-expanded="false"
                          aria-label={`Actions for ${member.name}`}
                        >
                          <i className="icon-ellipsis-vertical" />
                        </button>
                        <div
                          className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-40 bg-white border border-border-color shadow rounded-lg mt-2 z-1"
                          role="menu"
                          aria-orientation="vertical"
                        >
                          <div className="p-2 space-y-1">
                            <Link
                              className={DROPDOWN_ITEM}
                              to={`${all_routes.editStaff}/${member.id}`}
                            >
                              <i className="icon-pencil-line me-2" />
                              Edit
                            </Link>
                            <button
                              type="button"
                              onClick={() => crud.update(member.id, { status: "Inactive" })}
                              className={`${DROPDOWN_ITEM} w-full cursor-pointer`}
                            >
                              <i className="icon-lock me-2" />
                              Deactivate
                            </button>
                            <button
                              type="button"
                              onClick={() => setPendingDelete(member)}
                              className={`${DROPDOWN_ITEM} w-full cursor-pointer`}
                            >
                              <i className="icon-trash-2 me-2" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}

                {crud.rows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center border-b border-border-color bg-white">
                      <i className="icon-search-x text-3xl text-gray-400 mb-2 block" />
                      <p className="mb-0">No staff match your search.</p>
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
            label="staff"
            onChange={crud.setPage}
          />
        </div>
      </div>

      <ConfirmDeleteModal
        open={pendingDelete !== null}
        entity="staff member"
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

export default StaffPage;
