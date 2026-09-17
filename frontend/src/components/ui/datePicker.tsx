import { Calendar } from "primereact/calendar";
import type { Nullable } from "primereact/ts-helpers";

type Props = {
  value: Nullable<Date>;
  onChange: (value: Nullable<Date>) => void;
  placeholder?: string;
  inputId?: string;
};

const DatePicker = ({ value, onChange, placeholder = "Select Date", inputId }: Props) => (
  <Calendar
    inputId={inputId}
    value={value}
    onChange={(e) => onChange(e.value)}
    placeholder={placeholder}
    dateFormat="d M yy"
    showIcon
    icon={<i className="icon-calendar-days" />}
    className="crm-date w-full"
    panelClassName="crm-date-panel"
    // Render at the body so the calendar is never clipped by a modal or a
    // scrolling table wrapper.
    appendTo={typeof document !== "undefined" ? document.body : undefined}
    pt={{
      root: { className: "relative block w-full" },
      input: { className: "w-full" },
      
      
      dropdownButton: {
        root: {
          className:
            "absolute inset-y-0 end-0 z-1 w-10 min-w-0 p-0 bg-transparent border-0 shadow-none text-gray-500 hover:text-primary cursor-pointer",
        },
      },
    }}
  />
);

export default DatePicker;
