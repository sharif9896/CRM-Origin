import { useEffect, useState } from "react";
import type { Nullable } from "primereact/ts-helpers";
import type { Appointment, Property } from "../../data/types";
import FormModal from "../../components/ui/formModal";
import { INPUT_CLASS, LABEL_CLASS } from "../../components/ui/formField";
import DatePicker from "../../components/ui/datePicker";
import Select from "../../components/ui/select";
import { listResource } from "../../lib/api/resource";
import { useAuth } from "../../store/hooks";

const STATUSES: Appointment["status"][] = ["Confirmed", "Pending", "Completed", "Cancelled"];

type FormValues = {
  title: string;
  location: string;
  date: Nullable<Date>;
  time: string;
  duration: string;
  client: string;
  propertyRef: string;
  requesterEmail: string;
  requesterWhatsapp: string;
  notes: string;
  status: Appointment["status"];
};

const toFormValues = (appt: Appointment | null, user?: { name: string; email: string; phone?: string } | null): FormValues => {
  if (!appt) {
    return { title: "", location: "", date: null, time: "10:00", duration: "30 mins", client: user?.name || "", propertyRef: "", requesterEmail: user?.email || "", requesterWhatsapp: user?.phone || "", notes: "", status: "Pending" };
  }
  const when = appt.when ? new Date(appt.when) : null;
  const time = when
    ? `${String(when.getHours()).padStart(2, "0")}:${String(when.getMinutes()).padStart(2, "0")}`
    : "10:00";
  return {
    title: appt.title,
    location: appt.location,
    date: when,
    time,
    duration: appt.duration,
    client: appt.client,
    propertyRef: appt.propertyRef || "",
    requesterEmail: appt.requesterEmail || "",
    requesterWhatsapp: appt.requesterWhatsapp || "",
    notes: appt.notes || "",
    status: appt.status,
  };
};

type Props = {
  open: boolean;
  editing: Appointment | null;
  errorMessage?: string | null;
  onClose: () => void;
  onSave: (values: Partial<Appointment>) => void;
};

const AppointmentFormModal = ({ open, editing, errorMessage, onClose, onSave }: Props) => {
  const { user } = useAuth();
  const [values, setValues] = useState<FormValues>(toFormValues(editing, user));
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    let cancelled = false;
    listResource<Property>("properties").then((rows) => { if (!cancelled) setProperties(rows); }).catch(() => { if (!cancelled) setProperties([]); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Rehydrate this modal when a different appointment is selected.
    setValues(toFormValues(editing, user));
  }, [editing, user]);

  const handleSubmit = () => {
    let when: string | undefined;
    if (values.date) {
      const combined = new Date(values.date);
      const [hh, mm] = values.time.split(":").map(Number);
      combined.setHours(hh || 0, mm || 0, 0, 0);
      when = combined.toISOString();
    }

    onSave({
      title: values.title,
      location: values.location,
      when,
      duration: values.duration,
      client: values.client,
      propertyRef: values.propertyRef || undefined,
      requesterEmail: values.requesterEmail,
      requesterWhatsapp: values.requesterWhatsapp,
      notes: values.notes,
      status: values.status,
    });
  };

  return (
    <FormModal
      open={open}
      title={editing ? "Edit Appointment" : "Schedule Appointment"}
      submitLabel={editing ? "Save Appointment" : "Schedule Appointment"}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      {errorMessage && (
        <div className="col-span-12 rounded-lg border border-danger/30 bg-danger/10 text-danger text-sm px-4 py-3">
          {errorMessage}
        </div>
      )}
      <div className="col-span-12">
        <label htmlFor="appointmentProperty" className={LABEL_CLASS}>
          Property {(user?.role === "customer" || user?.role === "viewer") && <span className="text-danger">*</span>}
        </label>
        <select
          id="appointmentProperty"
          required={user?.role === "customer" || user?.role === "viewer"}
          value={values.propertyRef}
          onChange={(event) => {
            const selected = properties.find((property) => property.id === event.target.value);
            setValues((current) => ({
              ...current,
              propertyRef: event.target.value,
              location: selected?.location || current.location,
              title: selected && !editing ? `Visit: ${selected.name}` : current.title,
            }));
          }}
          className={INPUT_CLASS}
        >
          <option value="">General appointment</option>
          {properties.map((property) => <option key={property.id} value={property.id}>{property.name} — {property.location}</option>)}
        </select>
        <p className="text-xs text-gray-500 mt-1 mb-0">Selecting a property sends the visit request to its owner and listing agent.</p>
      </div>
      <div className="col-span-12">
        <label htmlFor="appointmentTitle" className={LABEL_CLASS}>
          Appointment Title
        </label>
        <input
          type="text"
          id="appointmentTitle"
          required
          value={values.title}
          onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
          placeholder="e.g., Property Viewing, Client Meeting"
          className={INPUT_CLASS}
        />
      </div>

      <div className="col-span-6">
        <label htmlFor="appointmentDate" className={LABEL_CLASS}>
          Date
        </label>
        <DatePicker
          inputId="appointmentDate"
          value={values.date}
          onChange={(date) => setValues((v) => ({ ...v, date }))}
        />
      </div>
      <div className="col-span-6">
        <label htmlFor="appointmentTime" className={LABEL_CLASS}>
          Time
        </label>
        <input
          type="time"
          id="appointmentTime"
          value={values.time}
          onChange={(e) => setValues((v) => ({ ...v, time: e.target.value }))}
          className={INPUT_CLASS}
        />
      </div>

      <div className="col-span-6">
        <label htmlFor="appointmentDuration" className={LABEL_CLASS}>
          Duration
        </label>
        <input
          type="text"
          id="appointmentDuration"
          value={values.duration}
          onChange={(e) => setValues((v) => ({ ...v, duration: e.target.value }))}
          placeholder="e.g., 30 mins"
          className={INPUT_CLASS}
        />
      </div>
      <div className="col-span-6">
        <label htmlFor="appointmentStatus" className={LABEL_CLASS}>
          Status
        </label>
        <Select
          inputId="appointmentStatus"
          value={values.status}
          options={STATUSES}
          onChange={(v) => setValues((cur) => ({ ...cur, status: v as Appointment["status"] }))}
        />
      </div>

      <div className="col-span-12">
        <label htmlFor="appointmentGuest" className={LABEL_CLASS}>
          Guest / Client Name
        </label>
        <input
          type="text"
          id="appointmentGuest"
          required
          value={values.client}
          onChange={(e) => setValues((v) => ({ ...v, client: e.target.value }))}
          placeholder="Enter guest or client name"
          className={INPUT_CLASS}
        />
      </div>
      <div className="col-span-6">
        <label htmlFor="appointmentEmail" className={LABEL_CLASS}>Requester Email</label>
        <input type="email" id="appointmentEmail" required value={values.requesterEmail} onChange={(e) => setValues((v) => ({ ...v, requesterEmail: e.target.value }))} readOnly={user?.role === "customer" || user?.role === "viewer"} placeholder="customer@example.com" className={INPUT_CLASS} />
      </div>
      <div className="col-span-6">
        <label htmlFor="appointmentWhatsapp" className={LABEL_CLASS}>Requester WhatsApp</label>
        <input type="tel" id="appointmentWhatsapp" required={user?.role === "customer" || user?.role === "viewer"} value={values.requesterWhatsapp} onChange={(e) => setValues((v) => ({ ...v, requesterWhatsapp: e.target.value }))} placeholder="+1 555 000 1234" className={INPUT_CLASS} />
      </div>
      <div className="col-span-12">
        <label htmlFor="appointmentLocation" className={LABEL_CLASS}>
          Location
        </label>
        <input
          type="text"
          id="appointmentLocation"
          value={values.location}
          onChange={(e) => setValues((v) => ({ ...v, location: e.target.value }))}
          placeholder="e.g., Conference Room, Downtown Office"
          className={INPUT_CLASS}
        />
      </div>
      <div className="col-span-12">
        <label htmlFor="appointmentNotes" className={LABEL_CLASS}>Message for Owner / Agent</label>
        <textarea id="appointmentNotes" rows={3} value={values.notes} onChange={(e) => setValues((v) => ({ ...v, notes: e.target.value }))} placeholder="Share any details about the visit..." className={INPUT_CLASS} />
      </div>
    </FormModal>
  );
};

export default AppointmentFormModal;
