import { useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import type { Appointment, AppointmentStatus } from "../../data/types";
import { useCrud } from "../../hooks/useCrud";
import ImageWithBasePath from "../../components/ui/imageWithBasePath";
import ConfirmDeleteModal from "../../components/ui/confirmDeleteModal";
import AppointmentFormModal from "./appointmentFormModal";
import { useAccess } from "../../hooks/useAccess";

const STATUSES: AppointmentStatus[] = ["Confirmed", "Pending", "Completed", "Cancelled"];

const STATUS_STYLE: Record<AppointmentStatus, string> = {
  Confirmed: "text-success bg-success/10 border-success/30",
  Pending: "text-warning bg-warning/10 border-warning/30",
  Completed: "text-info bg-info/10 border-info/30",
  Cancelled: "text-danger bg-danger/10 border-danger/30",
};

const STATUS_ICON: Record<AppointmentStatus, string> = {
  Confirmed: "icon-check-circle",
  Pending: "icon-clock",
  Completed: "icon-check",
  Cancelled: "icon-x-circle",
};

const formatWhen = (when: string) => {
  if (!when) return "—";
  const d = new Date(when);
  return d.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const Appointments = () => {
  const { can } = useAccess();
  const crud = useCrud<Appointment>("appointments", {
    pageSize: 20,
    searchKeys: ["title", "client", "location"],
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Appointment | null>(null);

  const openAdd = () => {
    setEditing(null);
    setSaveError(null);
    setFormOpen(true);
  };

  const openEdit = (appt: Appointment) => {
    setEditing(appt);
    setSaveError(null);
    setFormOpen(true);
  };

  const handleSave = async (values: Partial<Appointment>) => {
    setSaveError(null);
    try {
      if (editing) await crud.update(editing.id, values);
      else await crud.add({ ...values, avatar: "assets/img/avatar/avatar-02.jpg", icon: "icon-home" } as Omit<Appointment, "id">);
      setFormOpen(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save appointment");
    }
  };

  return (
    <div className="p-3 lg:py-6 lg:px-0">
      {crud.error && <div className="ws-error" role="alert">{crud.error}<button onClick={() => void crud.reset()}>Retry</button></div>}
      {crud.loading && <div className="ws-notice" role="status">Loading records?</div>}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-gray-900 text-xl lg:text-[28px] font-bold mb-1">Appointments</h1>
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to={all_routes.dashboard} className="hover:text-primary">
              Dashboard
            </Link>
            <i className="icon-chevron-right text-xs" />
            <span className="text-gray-900 font-medium">Appointments</span>
          </nav>
        </div>
        {can("appointments:create") && <button
          type="button"
          onClick={openAdd}
          className="btn px-4 py-2 rounded-full bg-primary text-white text-sm font-medium inline-flex items-center gap-2 hover:bg-primary-hover transition hover:text-white cursor-pointer"
        >
          <i className="icon-plus" /> Add Appointment
        </button>}
      </div>

      <div className="grid grid-cols-1">
        <div className="bg-white rounded-xl border border-border-color overflow-hidden">
          <div className="flex items-center justify-between flex-wrap gap-3 p-5 border-b border-border-color bg-white">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={crud.search}
                onChange={(e) => crud.setSearch(e.target.value)}
                placeholder="Search appointments..."
                className="form-input w-full bg-gray-50 border border-border-color text-sm text-gray-900 rounded-full py-2 pl-4 pr-10! focus:ring-0 focus:border-primary focus:bg-white transition"
              />
              <i className="icon-search absolute top-1/2 -translate-y-1/2 right-3 text-base text-gray-400 leading-none pointer-events-none" />
            </div>
            <div className="flex items-center gap-2">
              <div className="hs-dropdown relative inline-flex">
                <button
                  type="button"
                  className="hs-dropdown-toggle inline-flex items-center gap-2 bg-white border border-border-color text-sm font-medium text-gray-900 rounded-full py-2 px-3 hover:bg-gray-50 cursor-pointer transition"
                >
                  <i className="icon-tag font-normal" /> {crud.filters.status || "Status"}{" "}
                  <i className="icon-chevron-down text-xs" />
                </button>
                <div
                  className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-48 bg-white border border-border-color shadow-lg rounded-lg p-2 mt-1 z-100"
                  role="menu"
                >
                  <button
                    type="button"
                    onClick={() => crud.setFilter("status", "")}
                    className="block w-full text-left px-3 py-2 text-sm rounded-md font-medium text-gray-700 hover:bg-primary hover:text-white transition cursor-pointer"
                  >
                    All
                  </button>
                  {STATUSES.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => crud.setFilter("status", status)}
                      className="block w-full text-left px-3 py-2 text-sm rounded-md font-medium text-gray-700 hover:bg-primary hover:text-white transition cursor-pointer"
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {crud.loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
            </div>
          ) : crud.rows.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-16 mb-0">No appointments found.</p>
          ) : (
            <div className="divide-y divide-gray-200">
              {crud.rows.map((appt) => (
                <div key={appt.id} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-lg">
                          <i className={appt.icon || "icon-calendar"} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-base font-semibold text-gray-900 mb-0.5">{appt.title}</h2>
                          <p className="text-sm text-gray-600 mb-0">{appt.location}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-3 ml-13">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <i className="icon-calendar text-sm text-gray-400" />
                          <span>{formatWhen(appt.when)}</span>
                        </div>
                        {appt.duration && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <i className="icon-clock text-sm text-gray-400" />
                            <span>{appt.duration}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <i className="icon-user text-sm text-gray-400" />
                          <span>{appt.client}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <ImageWithBasePath
                        src={appt.avatar}
                        alt={appt.client}
                        className="w-9 h-9 rounded-full border-2 border-white object-cover"
                      />
                      <span
                        className={`inline-flex items-center text-xs font-bold border rounded-lg px-2.5 py-1 ${STATUS_STYLE[appt.status]}`}
                      >
                        <i className={`${STATUS_ICON[appt.status]} text-xs mr-1`} />
                        {appt.status}
                      </span>
                      {(can("appointments:update") || can("appointments:delete")) && <div className="hs-dropdown [--placement:bottom-right] relative inline-flex">
                        <button
                          type="button"
                          className="hs-dropdown-toggle size-8 rounded-lg cursor-pointer hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors text-base"
                        >
                          <i className="icon-ellipsis-vertical" />
                        </button>
                        <div
                          className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-40 bg-white border border-border-color shadow-lg rounded-lg p-2 mt-2 z-10"
                          role="menu"
                        >
                          {can("appointments:update") && <button
                            type="button"
                            onClick={() => openEdit(appt)}
                            className="w-full flex items-center hover:bg-primary-50 px-4 py-1.75 rounded-lg text-sm text-default hover:text-primary focus:outline-hidden focus:bg-white cursor-pointer"
                          >
                            <i className="icon-pencil-line me-2" />
                            Edit
                          </button>}
                          {can("appointments:delete") && <button
                            type="button"
                            onClick={() => setPendingDelete(appt)}
                            className="w-full flex items-center hover:bg-primary-50 px-4 py-1.75 rounded-lg text-sm text-default hover:text-primary focus:outline-hidden focus:bg-white cursor-pointer"
                          >
                            <i className="icon-trash-2 me-2" />
                            Cancel
                          </button>}
                        </div>
                      </div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {crud.pageCount > 1 && (
            <div className="flex items-center justify-between flex-wrap gap-3 p-4 border-t border-border-color">
              <p className="text-sm text-gray-600 mb-0">
                Page <span className="font-semibold text-gray-900">{crud.page}</span> of{" "}
                <span className="font-semibold text-gray-900">{crud.pageCount}</span>
              </p>
              <nav className="inline-flex items-center gap-1">
                <button
                  type="button"
                  disabled={crud.page <= 1}
                  onClick={() => crud.setPage(crud.page - 1)}
                  className="size-9 flex items-center justify-center rounded-full border border-border-color bg-white text-gray-600 hover:bg-light disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Previous"
                >
                  <i className="icon-chevron-left" />
                </button>
                <button
                  type="button"
                  disabled={crud.page >= crud.pageCount}
                  onClick={() => crud.setPage(crud.page + 1)}
                  className="size-9 flex items-center justify-center rounded-full border border-border-color bg-white text-gray-600 hover:bg-light disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Next"
                >
                  <i className="icon-chevron-right" />
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>

      <AppointmentFormModal
        open={formOpen}
        editing={editing}
        errorMessage={saveError}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
      />

      <ConfirmDeleteModal
        open={pendingDelete !== null}
        entity="Appointment"
        name={pendingDelete?.title}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) void crud.remove(pendingDelete.id).catch(() => undefined);
          setPendingDelete(null);
        }}
      />
    </div>
  );
};

export default Appointments;
