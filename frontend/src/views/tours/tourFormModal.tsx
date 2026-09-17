import { useState } from "react";
import type { Tour } from "../../data/types";
import FormModal from "../../components/ui/formModal";
import FormField, { INPUT_CLASS } from "../../components/ui/formField";
import Select from "../../components/ui/select";

export type TourFormValues = Pick<Tour, "property" | "location" | "duration" | "status">;

type Props = {
  open: boolean;
  editing: Tour | null;
  errorMessage?: string | null;
  onClose: () => void;
  onSave: (values: TourFormValues) => void;
};

const EMPTY: TourFormValues = {
  property: "",
  location: "",
  duration: "",
  status: "Published",
};

const TourFormModal = ({ open, editing, errorMessage, onClose, onSave }: Props) => {
  const [values, setValues] = useState<TourFormValues>(
    editing
      ? {
          property: editing.property,
          location: editing.location,
          duration: editing.duration,
          status: editing.status,
        }
      : EMPTY,
  );

  return (
    <FormModal
      open={open}
      title={editing ? "Edit Tour" : "Add Tour"}
      submitLabel={editing ? "Update Tour" : "Add Tour"}
      onClose={onClose}
      onSubmit={() => onSave(values)}
    >
      {errorMessage && (
        <div className="col-span-12 rounded-lg border border-danger/30 bg-danger/10 text-danger text-sm px-4 py-3">
          {errorMessage}
        </div>
      )}
      <FormField label="Property" htmlFor="tour-property" span="md:col-span-12">
        <input
          id="tour-property"
          type="text"
          required
          value={values.property}
          onChange={(e) => setValues((v) => ({ ...v, property: e.target.value }))}
          placeholder="Mariana High Apartments"
          className={INPUT_CLASS}
        />
      </FormField>

      <FormField label="Location" htmlFor="tour-location" span="md:col-span-12">
        <input
          id="tour-location"
          type="text"
          value={values.location}
          onChange={(e) => setValues((v) => ({ ...v, location: e.target.value }))}
          placeholder="Downtown, Dubai"
          className={INPUT_CLASS}
        />
      </FormField>

      <FormField label="Duration (mm:ss)" htmlFor="tour-duration" span="md:col-span-6">
        <input
          id="tour-duration"
          type="text"
          value={values.duration}
          onChange={(e) => setValues((v) => ({ ...v, duration: e.target.value }))}
          placeholder="e.g., 3:24"
          className={INPUT_CLASS}
        />
      </FormField>

      <FormField label="Status" htmlFor="tour-status" span="md:col-span-6">
        <Select
          inputId="tour-status"
          value={values.status}
          options={["Published", "Draft"]}
          onChange={(v) => setValues((s) => ({ ...s, status: v as Tour["status"] }))}
        />
      </FormField>
    </FormModal>
  );
};

export default TourFormModal;
