import { useState } from "react";
import { taxonomyStatusClass } from "../../data/taxonomies";
import type { Taxonomy } from "../../data/types";
import { useCrud } from "../../hooks/useCrud";
import PageHeader from "../../components/ui/pageHeader";
import TableToolbar from "../../components/ui/tableToolbar";
import ConfirmDeleteModal from "../../components/ui/confirmDeleteModal";
import TableHeadRow, { TH_CLASS, TH_END_CLASS } from "../../components/ui/tableHead";
import TaxonomyFormModal from "./taxonomyFormModal";

type Props = {
  title: string;
  entity: string;
  /** Which bucket of the shared Taxonomy collection this table shows. */
  kind: "category" | "amenity";
  searchNoun: string;
  beforeTable?: React.ReactNode;
};

const TaxonomyTable = ({ title, entity, kind, searchNoun, beforeTable }: Props) => {
  const crud = useCrud<Taxonomy>("taxonomies", {
    pageSize: 100,
    searchKeys: ["name", "status"],
    params: { kind },
  });
  const [pendingDelete, setPendingDelete] = useState<Taxonomy | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Taxonomy | null>(null);

  const [saveError, setSaveError] = useState<string | null>(null);

  const openAdd = () => {
    setEditing(null);
    setSaveError(null);
    setFormOpen(true);
  };

  const openEdit = (item: Taxonomy) => {
    setEditing(item);
    setSaveError(null);
    setFormOpen(true);
  };

  const handleSave = async (values: Pick<Taxonomy, "name" | "icon" | "status">) => {
    setSaveError(null);
    try {
      if (editing) await crud.update(editing.id, values);
      else await crud.add({ ...values, usedIn: 0, badge: "" } as Omit<Taxonomy, "id">);
      setFormOpen(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : `Failed to save ${entity.toLowerCase()}`);
    }
  };

  return (
    <div className="p-3 lg:py-6 lg:px-0">
      {crud.error && <div className="ws-error" role="alert">{crud.error}<button onClick={() => void crud.reset()}>Retry</button></div>}
      {crud.loading && <div className="ws-notice" role="status">Loading records?</div>}
      <PageHeader
        title={title}
        action={
          <button
            type="button"
            onClick={openAdd}
            className="btn px-4 py-2 rounded-full bg-primary text-white text-sm font-medium inline-flex items-center gap-2 hover:bg-primary-hover transition cursor-pointer"
          >
            <span className="flex">
              <i className="icon-plus" />
            </span>
            Add {entity}
          </button>
        }
      />

      {beforeTable}

      <div className="grid grid-cols-1">
        <div className="bg-white-50 rounded-lg border border-border-color shadow-xs overflow-hidden">
          <TableToolbar
            heading={`All ${title}`}
            searchWidth="md:w-64"
            searchPlaceholder={`Search ${searchNoun}...`}
            search={crud.search}
            onSearch={crud.setSearch}
          />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <TableHeadRow>
                  {([
                    ["name", entity],
                    ["usedIn", title === "Categories" ? "Properties" : "Used In"],
                    ["status", "Status"],
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
                {crud.rows.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 border-b border-border-color bg-white">
                      <div className="flex items-center gap-3">
                        <span
                          className={`size-10 shrink-0 flex items-center justify-center rounded-full text-lg ${
                            item.badge ? `${item.badge} text-white` : "bg-primary/10 text-primary"
                          }`}
                        >
                          <i className={item.icon} />
                        </span>
                        <span className="text-sm font-semibold text-gray-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-border-color bg-white">
                      <span className="text-sm text-gray-600">
                        {item.usedIn.toLocaleString()} properties
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b border-border-color bg-white">
                      <span
                        className={`inline-flex items-center text-xs font-bold border rounded-lg px-3 py-1 ${taxonomyStatusClass[item.status]}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b border-border-color bg-white text-end">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          className="size-9 rounded-full hover:bg-gray-100 text-gray-900 flex items-center justify-center transition-colors cursor-pointer"
                          aria-label={`Edit ${item.name}`}
                        >
                          <i className="icon-pencil-line" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(item)}
                          className="size-9 rounded-full hover:bg-gray-100 text-gray-900 hover:text-danger flex items-center justify-center transition-colors cursor-pointer"
                          aria-label={`Delete ${item.name}`}
                        >
                          <i className="icon-trash-2" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {crud.rows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center border-b border-border-color bg-white">
                      <i className="icon-search-x text-3xl text-gray-400 mb-2 block" />
                      <p className="mb-0">No {title.toLowerCase()} match your search.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {formOpen && (
        <TaxonomyFormModal
          open
          entity={entity}
          editing={editing}
          errorMessage={saveError}
          onClose={() => setFormOpen(false)}
          onSave={handleSave}
        />
      )}

      <ConfirmDeleteModal
        open={pendingDelete !== null}
        entity={entity.toLowerCase()}
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

export default TaxonomyTable;
