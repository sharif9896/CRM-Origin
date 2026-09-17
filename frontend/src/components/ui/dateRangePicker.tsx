import { useEffect, useRef } from "react";
import { Calendar } from "primereact/calendar";
import type { Nullable } from "primereact/ts-helpers";

type Props = {
  value: Nullable<(Date | null)[]>;
  onChange: (value: Nullable<(Date | null)[]>) => void;
  inputId?: string;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Flatpickr's "d M y" — 01 Jan 26. */
const formatDate = (date: Date) =>
  `${String(date.getDate()).padStart(2, "0")} ${MONTHS[date.getMonth()]} ${String(
    date.getFullYear(),
  ).slice(-2)}`;

const formatRange = (value: Nullable<(Date | null)[]>) => {
  const [start, end] = value ?? [];
  if (!start) return "";
  return end ? `${formatDate(start)} to ${formatDate(end)}` : formatDate(start);
};

const DateRangePicker = ({ value, onChange, inputId }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  /*
   * PrimeReact joins a range with a hardcoded " - " and writes it straight to
   * the input's DOM node, so `formatDateTime` (called once per date) can't
   * produce the template's "01 Jan 26 to 20 Jan 26". Rewriting the text after
   * it commits is the available seam; the field is readOnly, so nothing else
   * competes for it.
   */
  useEffect(() => {
    if (inputRef.current) inputRef.current.value = formatRange(value);
  }, [value]);

  return (
    <div className="relative rangepicker-input w-[204px] leading-none h-[37.6px]">
      <Calendar
        inputRef={inputRef}
        inputId={inputId}
        value={value}
        onChange={(e) => onChange(e.value)}
        selectionMode="range"
        readOnlyInput
        hideOnRangeSelection
        dateFormat="d M y"
        showIcon
        icon={<i className="icon-calendar-check-2" />}
        className="crm-date crm-range w-full"
        panelClassName="crm-date-panel"
        // Render at the body so the calendar is never clipped by a modal or a
        // scrolling table wrapper.
        appendTo={typeof document !== "undefined" ? document.body : undefined}
        // `inputClassName`, not pt.input — PrimeReact hands its own className to
        // the inner InputText, which wins over the passthrough.
        inputClassName="form-input h-[37.6px] inline-flex items-center gap-2 bg-white border border-border-color text-sm font-medium text-gray-900 rounded-full py-2 px-3 hover:bg-light cursor-pointer pl-8! ps-8! focus:ring-0 focus:border-border-color flatpickr-input"
        pt={{
          root: { className: "relative block w-full" },
        }}
      />
    </div>
  );
};

export default DateRangePicker;
