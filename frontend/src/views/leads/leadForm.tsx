import { useResourceOptions } from "../../hooks/useResourceOptions";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import type { Lead } from "../../data/types";
import { getResource, createResource, updateResource } from "../../lib/api/resource";
import { ApiError } from "../../lib/apiClient";
import { LEAD_STATUSES } from "../../data/statusStyles";
import PageHeader from "../../components/ui/pageHeader";
import { INPUT_CLASS, LABEL_CLASS } from "../../components/ui/formField";
import Select from "../../components/ui/select";
import {
  FormCardHeader,
  FormGroup,
  FormActions,
  CANCEL_CLASS,
  QuickTips,
} from "../../components/ui/formLayout";

const SOURCES = ["Website", "Phone Inquiry", "Referral", "Social Media", "Other"];
const PROPERTY_INTERESTS = ["Villa", "Apartment", "Penthouse", "Office"];


const TIPS = [
  "Assign lead to available agent",
  "Set realistic Budget range",
  "Track lead source for analytics",
  "Add relevant notes for agent",
];

const formatBudget = (min: string, max: string) => {
  const fmt = (v: string) => {
    const n = Number(v);
    if (!n) return "";
    return `$${(n / 1_000_000).toLocaleString("en-US", { maximumFractionDigits: 2 })}M`;
  };
  const a = fmt(min);
  const b = fmt(max);
  if (a && b) return `${a} - ${b}`;
  return a || b || "";
};

const LeadForm = ({ mode }: { mode: "add" | "edit" }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = mode === "edit";
  const lookup = useResourceOptions("agents");

  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [source, setSource] = useState("Website");
  const [status, setStatus] = useState<string>("New");
  const [propertyType, setPropertyType] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");

  useEffect(() => {
    if (!isEdit || !id) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Reset state when loading a different record.
    setLoading(true);
    setLoadError(null);
    getResource<Lead>("leads", id)
      .then((lead) => {
        if (cancelled) return;
        const [first = "", ...rest] = lead.name.split(" ");
        setFirstName(first);
        setLastName(rest.join(" "));
        setEmail(lead.email ?? "");
        setPhone(lead.phone ?? "");
        setStatus(lead.status ?? "New");
        setAssignedTo(lead.assignedTo ?? "");
        setSource(lead.source || "Website");
        setPropertyType(lead.propertyType || "");
        const parseBudget = (value: string) => {
          const n = Number(value.replace(/[^0-9.]/g, ""));
          return String(n * (/M/i.test(value) ? 1000000 : /K/i.test(value) ? 1000 : 1));
        };
        const parts = (lead.budget || "").split("-").map(v => v.trim());
        setBudgetMin(lead.budgetMin != null ? String(lead.budgetMin) : parts[0] ? parseBudget(parts[0]) : "");
        setBudgetMax(lead.budgetMax != null ? String(lead.budgetMax) : parts[1] ? parseBudget(parts[1]) : "");

      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof ApiError ? err.message : "Failed to load lead");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isEdit, id]);

  const title = isEdit ? "Edit Lead" : "Add Lead";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    if (budgetMin && budgetMax && Number(budgetMin) > Number(budgetMax)) { setSubmitError("Minimum budget cannot exceed maximum budget."); return; }
    const computedBudget =
      budgetMin || budgetMax ? formatBudget(budgetMin, budgetMax) : undefined;

    const payload: Partial<Lead> = {
      name: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      status: status as Lead["status"],
      assignedTo,
      source,
      propertyType,
      budgetMin: budgetMin ? Number(budgetMin) : undefined,
      budgetMax: budgetMax ? Number(budgetMax) : undefined,
      ...(computedBudget ? { budget: computedBudget } : {}),
    };

    setSubmitting(true);
    try {
      if (isEdit && id) {
        await updateResource<Lead>("leads", id, payload);
      } else {
        await createResource<Lead>("leads", payload);
      }
      navigate(all_routes.leads);
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Failed to save lead");
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
        <Link to={all_routes.leads} className="text-primary text-sm font-medium">
          Back to Leads
        </Link>
      </div>
    );
  }

  return (
    <div className="p-3 lg:py-6 lg:px-0">
      {lookup.error && <div className="ws-error" role="alert">{lookup.error}</div>}
      <PageHeader
        title={title}
        crumbs={[{ label: "Leads", to: all_routes.leads }, { label: title }]}
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
              icon="icon-user-plus"
              tone="info"
              title="Lead Information"
              subtitle={
                isEdit
                  ? "Edit lead and track sales opportunities"
                  : "Create a new lead and track sales opportunities"
              }
            />

            <form onSubmit={handleSubmit}>
              <FormGroup title="Personal Information">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="leadFirstName" className={LABEL_CLASS}>
                      First Name
                    </label>
                    <input
                      type="text"
                      id="leadFirstName"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter First Name"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label htmlFor="leadLastName" className={LABEL_CLASS}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="leadLastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter Last Name"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="leadEmail" className={LABEL_CLASS}>
                      Email
                    </label>
                    <input
                      type="email"
                      id="leadEmail"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label htmlFor="leadPhone" className={LABEL_CLASS}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="leadPhone"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter Phone Number"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>
              </FormGroup>

              <FormGroup title="Lead Details" bordered>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="leadSource" className={LABEL_CLASS}>
                      Lead Source
                    </label>
                    <Select
                      inputId="leadSource"
                      value={source}
                      options={SOURCES}
                      onChange={setSource}
                      placeholder="Select Source"
                    />
                  </div>
                  <div>
                    <label htmlFor="leadStatus" className={LABEL_CLASS}>
                      Lead Status
                    </label>
                    <Select
                      inputId="leadStatus"
                      value={status}
                      options={LEAD_STATUSES}
                      onChange={setStatus}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="leadPropertyType" className={LABEL_CLASS}>
                      Property Type Interest
                    </label>
                    <Select
                      inputId="leadPropertyType"
                      value={propertyType}
                      options={PROPERTY_INTERESTS}
                      onChange={setPropertyType}
                      placeholder="Select Property Type"
                    />
                  </div>
                  <div>
                    <label htmlFor="leadAgent" className={LABEL_CLASS}>
                      Assigned Agent
                    </label>
                    <Select
                      inputId="leadAgent"
                      value={assignedTo}
                      options={[...new Set([...lookup.options, assignedTo].filter(Boolean))]}
                      onChange={setAssignedTo}
                      placeholder="Select Agent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="leadBudgetMin" className={LABEL_CLASS}>
                      Budget Min
                    </label>
                    <input
                      type="number"
                      id="leadBudgetMin"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(e.target.value)}
                      placeholder="Enter Minimum Budget"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label htmlFor="leadBudgetMax" className={LABEL_CLASS}>
                      Budget Max
                    </label>
                    <input
                      type="number"
                      id="leadBudgetMax"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(e.target.value)}
                      placeholder="Enter Maximum Budget"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>
              </FormGroup>

              <FormActions
                cancelTo={
                  <Link to={all_routes.leads} className={CANCEL_CLASS}>
                    Cancel
                  </Link>
                }
                submitLabel={submitting ? "Saving..." : isEdit ? "Save Changes" : "Add Lead"}
              />
            </form>
          </div>
        </div>

        <QuickTips tips={TIPS} />
      </div>
    </div>
  );
};

export default LeadForm;
