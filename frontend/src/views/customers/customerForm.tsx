import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import type { Customer } from "../../data/types";
import { getResource, createResource, updateResource } from "../../lib/api/resource";
import { ApiError } from "../../lib/apiClient";
import { LEAD_STATUSES } from "../../data/statusStyles";
import PageHeader from "../../components/ui/pageHeader";
import { INPUT_CLASS, LABEL_CLASS } from "../../components/ui/formField";
import Select from "../../components/ui/select";
import ImagePicker from "../../components/ui/imagePicker";
import {
  FormCardHeader,
  FormGroup,
  FormActions,
  CANCEL_CLASS,
} from "../../components/ui/formLayout";

const PROPERTY_INTERESTS = ["Villa", "Apartment", "Penthouse", "Office", "Land", "Commercial"];

const LEAD_SOURCES = [
  { value: "website", label: "Website" },
  { value: "phone", label: "Phone Inquiry" },
  { value: "referral", label: "Referral" },
  { value: "social", label: "Social Media" },
  { value: "other", label: "Other" },
];

const TIPS = [
  "Mark status appropriately based on engagement level",
  "Set realistic budget expectations",
  "Assign to most suitable agent",
];

const CustomerForm = ({ mode }: { mode: "add" | "edit" }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = mode === "edit";

  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<string>("New");
  const [interest, setInterest] = useState("");
  const [source, setSource] = useState("website");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (!isEdit || !id) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Reset state when loading a different record.
    setLoading(true);
    setLoadError(null);
    getResource<Customer>("customers", id)
      .then((customer) => {
        if (cancelled) return;
        const [first = "", ...rest] = customer.name.split(" ");
        setFirstName(first);
        setLastName(rest.join(" "));
        setEmail(customer.email ?? "");
        setPhone(customer.phone ?? "");
        setStatus(customer.status ?? "New");
        setInterest(customer.interestedIn ?? "");
        setSource(customer.source || "website");
        setAvatar(customer.avatar || "");
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof ApiError ? err.message : "Failed to load customer");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isEdit, id]);

  const title = isEdit ? "Edit Customer" : "Add Customer";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    const payload: Partial<Customer> = {
      name: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      status: status as Customer["status"],
      interestedIn: interest,
      source,
      avatar,
    };

    setSubmitting(true);
    try {
      if (isEdit && id) {
        await updateResource<Customer>("customers", id, payload);
      } else {
        await createResource<Customer>("customers", payload);
      }
      navigate(all_routes.customers);
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Failed to save customer");
      setSubmitting(false);
    }
  };

  if (isEdit && loading) {
    return (
      <div className="p-3 lg:py-6 lg:px-0 flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isEdit && loadError) {
    return (
      <div className="p-3 lg:py-6 lg:px-0">
        <p className="text-danger text-sm">{loadError}</p>
        <Link to={all_routes.customers} className="text-primary text-sm font-medium">
          Back to Customers
        </Link>
      </div>
    );
  }

  return (
    <div className="p-3 lg:py-6 lg:px-0">
      <PageHeader
        title={title}
        crumbs={[{ label: "Customers", to: all_routes.customers }, { label: title }]}
      />

      {submitError && (
        <div className="mb-4 rounded-lg border border-danger/30 bg-danger/10 text-danger text-sm px-4 py-3">
          {submitError}
        </div>
      )}

      <div className="grid grid-cols-12 gap-4 lg:gap-6">
        <div className="col-span-12 xl:col-span-8">
          <div className="bg-white-50 rounded-lg border border-border-color shadow-xs p-6">
            <FormCardHeader
              icon="icon-circle-user-round"
              tone="secondary"
              title="Customer Information"
              subtitle={
                isEdit
                  ? "Edit customer or prospect to your list"
                  : "Add a new customer or prospect to your list"
              }
            />

            <form onSubmit={handleSubmit}>
              <FormGroup title="Personal Information">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="customerFirstName" className={LABEL_CLASS}>
                      First Name
                    </label>
                    <input
                      type="text"
                      id="customerFirstName"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter First Name"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label htmlFor="customerLastName" className={LABEL_CLASS}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="customerLastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter Last Name"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="customerEmail" className={LABEL_CLASS}>
                      Email
                    </label>
                    <input
                      type="email"
                      id="customerEmail"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter Email Address"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label htmlFor="customerPhone" className={LABEL_CLASS}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="customerPhone"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter Phone Number"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>
              </FormGroup>

              <FormGroup title="Customer Preferences" bordered>
                <div className="mb-4">
                  <label htmlFor="customerStatus" className={LABEL_CLASS}>
                    Lead Status
                  </label>
                  <Select
                    inputId="customerStatus"
                    value={status}
                    options={LEAD_STATUSES}
                    onChange={setStatus}
                    placeholder="Select Status"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="customerInterest" className={LABEL_CLASS}>
                    Property Interest
                  </label>
                  <Select
                    inputId="customerInterest"
                    value={interest}
                    options={PROPERTY_INTERESTS}
                    onChange={setInterest}
                    placeholder="Select Property Type"
                  />
                </div>
              </FormGroup>

              <FormGroup title="Customer photo" bordered>
                <ImagePicker label="Profile image" resource="customers" values={avatar ? [avatar] : []} onChange={values => setAvatar(values[0] || '')}/>
              </FormGroup>

              <FormActions
                cancelTo={
                  <Link to={all_routes.customers} className={CANCEL_CLASS}>
                    Cancel
                  </Link>
                }
                submitLabel={submitting ? "Saving..." : isEdit ? "Save Changes" : "Add Customer"}
              />
            </form>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-4">
          <div className="bg-white-50 rounded-lg border border-border-color shadow-xs p-6 mb-4 lg:mb-6">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Lead Source</h3>
            <div className="space-y-2 mb-6">
              {LEAD_SOURCES.map((item) => (
                <label key={item.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="leadSource"
                    value={item.value}
                    checked={source === item.value}
                    onChange={() => setSource(item.value)}
                    className="form-radio bg-white border-border-color rounded-full text-primary focus:ring-0 focus:outline-none focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-600">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white-50 rounded-lg border border-border-color shadow-xs p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Quick Tips</h3>
            <ul className="space-y-3 text-sm text-gray-600 p-0">
              {TIPS.map((tip) => (
                <li key={tip} className="flex items-center gap-2">
                  <i className="icon-circle-check text-primary mt-0.5 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;
