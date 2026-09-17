import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import type { Agent } from "../../data/types";
import { getResource, createResource, updateResource } from "../../lib/api/resource";
import { ApiError } from "../../lib/apiClient";
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

const ROLES = ["Senior Agent", "Sales Agent", "Junior Agent", "Manager", "Broker", "Leasing Agent"];
const STATUSES = ["Active", "Inactive", "Away"];

const TIPS = [
  "Fill all required fields for better agent profile",
  "Upload a professional photo for better visibility",
  "Set realistic performance goals",
];

const AgentForm = ({ mode }: { mode: "add" | "edit" }) => {
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
  const [role, setRole] = useState("Sales Agent");
  const [status, setStatus] = useState("Active");
  const [listingsGoal, setListingsGoal] = useState("");
  const [salesGoal, setSalesGoal] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (!isEdit || !id) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Reset state when loading a different record.
    setLoading(true);
    setLoadError(null);
    getResource<Agent>("agents", id)
      .then((agent) => {
        if (cancelled) return;
        const [first = "", ...rest] = agent.name.split(" ");
        setFirstName(first);
        setLastName(rest.join(" "));
        setEmail(agent.email ?? "");
        setPhone(agent.phone ?? "");
        setRole(agent.role ?? "Sales Agent");
        setStatus(agent.status ?? "Active");
        setListingsGoal(agent.listings != null ? String(agent.listings) : "");
        setSalesGoal(agent.deals != null ? String(agent.deals) : "");
        setAvatar(agent.avatar || "");
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof ApiError ? err.message : "Failed to load agent");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isEdit, id]);

  const title = isEdit ? "Edit Agent" : "Add Agent";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    const payload: Partial<Agent> = {
      name: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      role,
      status: status as Agent["status"],
      listings: listingsGoal ? Number(listingsGoal) : undefined,
      deals: salesGoal ? Number(salesGoal) : undefined,
      avatar,
    };

    setSubmitting(true);
    try {
      if (isEdit && id) {
        await updateResource<Agent>("agents", id, payload);
      } else {
        await createResource<Agent>("agents", payload);
      }
      navigate(all_routes.agents);
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Failed to save agent");
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
        <Link to={all_routes.agents} className="text-primary text-sm font-medium">
          Back to Agents
        </Link>
      </div>
    );
  }

  return (
    <div className="p-3 lg:py-6 lg:px-0">
      <PageHeader
        title={title}
        crumbs={[{ label: "Agents", to: all_routes.agents }, { label: title }]}
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
              tone="primary"
              title="Agent Information"
              subtitle="Complete the form below to add a new agent"
            />

            <form onSubmit={handleSubmit}>
              <FormGroup title="Personal Information" bordered>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="agentFirstName" className={LABEL_CLASS}>
                      First Name
                    </label>
                    <input
                      type="text"
                      id="agentFirstName"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter First Name"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label htmlFor="agentLastName" className={LABEL_CLASS}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="agentLastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter Last Name"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="agentEmail" className={LABEL_CLASS}>
                      Email
                    </label>
                    <input
                      type="email"
                      id="agentEmail"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter Email Address"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label htmlFor="agentPhone" className={LABEL_CLASS}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="agentPhone"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter phone number"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>
              </FormGroup>

              <FormGroup title="Professional Information">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="agentRole" className={LABEL_CLASS}>
                      Role
                    </label>
                    <Select
                      inputId="agentRole"
                      value={role}
                      options={ROLES}
                      onChange={setRole}
                      placeholder="Select Role"
                    />
                  </div>
                  <div>
                    <label htmlFor="agentStatus" className={LABEL_CLASS}>
                      Status
                    </label>
                    <Select
                      inputId="agentStatus"
                      value={status}
                      options={STATUSES}
                      onChange={setStatus}
                    />
                  </div>
                </div>
              </FormGroup>

              <FormGroup title="Performance Goals" bordered>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="agentListingsGoal" className={LABEL_CLASS}>
                      Listings
                    </label>
                    <input
                      type="number"
                      id="agentListingsGoal"
                      min={0}
                      value={listingsGoal}
                      onChange={(e) => setListingsGoal(e.target.value)}
                      placeholder="Enter Target"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label htmlFor="agentSalesGoal" className={LABEL_CLASS}>
                      Deals Closed
                    </label>
                    <input
                      type="number"
                      id="agentSalesGoal"
                      min={0}
                      value={salesGoal}
                      onChange={(e) => setSalesGoal(e.target.value)}
                      placeholder="Enter Target"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>
              </FormGroup>

              <FormActions
                cancelTo={
                  <Link to={all_routes.agents} className={CANCEL_CLASS}>
                    Cancel
                  </Link>
                }
                submitLabel={submitting ? "Saving..." : isEdit ? "Save Changes" : "Add Agent"}
              />
            </form>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-4">
          <div className="bg-white-50 rounded-lg border border-border-color shadow-xs p-6 mb-4 lg:mb-6">
            <ImagePicker label="Agent photo" resource="agents" values={avatar ? [avatar] : []} onChange={values => setAvatar(values[0] || '')}/>
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

export default AgentForm;
