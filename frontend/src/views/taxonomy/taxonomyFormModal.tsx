import { useState } from "react";
import { TAXONOMY_STATUSES } from "../../data/taxonomies";
import type { Taxonomy } from "../../data/types";
import FormModal from "../../components/ui/formModal";
import FormField, { INPUT_CLASS } from "../../components/ui/formField";
import Select from "../../components/ui/select";

type Props = {
  open: boolean;
  entity: string;
  editing: Taxonomy | null;
  errorMessage?: string | null;
  onClose: () => void;
  onSave: (values: Pick<Taxonomy, "name" | "icon" | "status">) => void;
};

const EMPTY = { name: "", icon: "", status: "Active" as Taxonomy["status"] };

const TaxonomyFormModal = ({ open, entity, editing, errorMessage, onClose, onSave }: Props) => {
  const [values, setValues] = useState(
    editing ? { name: editing.name, icon: editing.icon, status: editing.status } : EMPTY,
  );

  return (
    <FormModal
      open={open}
      title={`${editing ? "Edit" : "Add"} ${entity}`}
      submitLabel={`${editing ? "Update" : "Add"} ${entity}`}
      onClose={onClose}
      onSubmit={() => onSave(values)}
    >
      {errorMessage && (
        <div className="col-span-12 rounded-lg border border-danger/30 bg-danger/10 text-danger text-sm px-4 py-3">
          {errorMessage}
        </div>
      )}
      <FormField label={`${entity} Name`} htmlFor="taxonomy-name" span="md:col-span-12">
        <input
          id="taxonomy-name"
          type="text"
          required
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          placeholder={`Enter ${entity.toLowerCase()} name`}
          className={INPUT_CLASS}
        />
      </FormField>

      <FormField label="Icon Class" htmlFor="taxonomy-icon" span="md:col-span-12">
        <input
          id="taxonomy-icon"
          type="text"
          value={values.icon}
          onChange={(e) => setValues((v) => ({ ...v, icon: e.target.value }))}
          placeholder="e.g., icon-wifi"
          className={INPUT_CLASS}
        />
      </FormField>

      <FormField label="Status" htmlFor="taxonomy-status" span="md:col-span-12">
        <Select
          inputId="taxonomy-status"
          value={values.status}
          options={TAXONOMY_STATUSES}
          onChange={(v) => setValues((s) => ({ ...s, status: v as Taxonomy["status"] }))}
        />
      </FormField>
    </FormModal>
  );
};

export default TaxonomyFormModal;
