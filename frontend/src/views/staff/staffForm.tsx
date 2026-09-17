import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Nullable } from "primereact/ts-helpers";
import { all_routes } from "../../routes/all_routes";
import type { Staff } from "../../data/types";
import { getResource, createResource, updateResource } from "../../lib/api/resource";
import { ApiError } from "../../lib/apiClient";
import { STAFF_ROLES, STAFF_DEPARTMENTS, STAFF_FORM_STATUSES } from "../../data/staff";
import PageHeader from "../../components/ui/pageHeader";
import { INPUT_CLASS, LABEL_CLASS } from "../../components/ui/formField";
import Select from "../../components/ui/select";
import DatePicker from "../../components/ui/datePicker";
import ImagePicker from "../../components/ui/imagePicker";
import {
  FormCardHeader,
  FormGroup,
  FormActions,
  CANCEL_CLASS,
  QuickTips,
} from "../../components/ui/formLayout";

const TIPS = [
  "Assign role based on responsibility level",
  "Grant minimum permissions needed to work",
  "Email confirmation will be sent automatically",
  "Review permissions after 30 days",
];

const StaffForm = ({ mode }: { mode: "add" | "edit" }) => {
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
  const [role, setRole] = useState("Junior Agent");
  const [department, setDepartment] = useState("Sales");
  const [status, setStatus] = useState("Active");
  const [joinDate, setJoinDate] = useState<Nullable<Date>>(new Date());
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (!isEdit || !id) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Reset state when loading a different record.
    setLoading(true);
    setLoadError(null);
    getResource<Staff>("staff", id)
      .then((member) => {
        if (cancelled) return;
        const [first = "", ...rest] = member.name.split(" ");
        setFirstName(first);
        setLastName(rest.join(" "));
        setEmail(member.email ?? "");
        setRole(member.role ?? "Junior Agent");
        setDepartment(member.department ?? "Sales");
        setStatus(member.status ?? "Active");
        setJoinDate(member.joinDate ? new Date(member.joinDate) : new Date());
        setAvatar(member.avatar || "");
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof ApiError ? err.message : "Failed to load staff member");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isEdit, id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    const payload: Partial<Staff> = {
      name: `${firstName} ${lastName}`.trim(),
      email,
      role,
      department,
      status: status as Staff["status"],
      joinDate: joinDate ? joinDate.toISOString() : undefined,
      avatar,
    };

    setSubmitting(true);
    try {
      if (isEdit && id) {
        await updateResource<Staff>("staff", id, payload);
      } else {
        await createResource<Staff>("staff", payload);
      }
      navigate(all_routes.staff);
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Failed to save staff member");
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
        <Link to={all_routes.staff} className="text-primary text-sm font-medium">
          Back to Staff
        </Link>
      </div>
    );
  }

  return (
    <div className="p-3 lg:py-6 lg:px-0">
      <PageHeader
        title={isEdit ? "Edit Staff" : "Add Staff"}
        crumbs={[
          { label: "Staff", to: all_routes.staff },
          { label: isEdit ? "Edit Staff" : "Add Staff" },
        ]}
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
              title="Staff Information"
              subtitle={
                isEdit
                  ? "Edit team member and assign permissions"
                  : "Create a new team member and assign permissions"
              }
            />

            <form onSubmit={handleSubmit}>
              <FormGroup title="Personal Information">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="staffFirstName" className={LABEL_CLASS}>
                      First Name
                    </label>
                    <input
                      type="text"
                      id="staffFirstName"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter First Name"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label htmlFor="staffLastName" className={LABEL_CLASS}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="staffLastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter Last Name"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="staffEmail" className={LABEL_CLASS}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="staffEmail"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className={INPUT_CLASS}
                  />
                </div>
              </FormGroup>

              <FormGroup title="Professional Information">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="staffRole" className={LABEL_CLASS}>
                      Role
                    </label>
                    <Select
                      inputId="staffRole"
                      value={role}
                      options={STAFF_ROLES}
                      onChange={setRole}
                      placeholder="Select Role"
                    />
                  </div>
                  <div>
                    <label htmlFor="staffDepartment" className={LABEL_CLASS}>
                      Department
                    </label>
                    <Select
                      inputId="staffDepartment"
                      value={department}
                      options={STAFF_DEPARTMENTS}
                      onChange={setDepartment}
                      placeholder="Select Department"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="staffStatus" className={LABEL_CLASS}>
                      Status
                    </label>
                    <Select
                      inputId="staffStatus"
                      value={status}
                      options={STAFF_FORM_STATUSES}
                      onChange={setStatus}
                    />
                  </div>
                  <div>
                    <label htmlFor="staffJoinDate" className={LABEL_CLASS}>
                      Join Date
                    </label>
                    <DatePicker inputId="staffJoinDate" value={joinDate} onChange={setJoinDate} />
                  </div>
                </div>
              </FormGroup>

              <FormGroup title="Profile photo">
                <ImagePicker label="Staff photo" resource="staff" values={avatar ? [avatar] : []} onChange={values => setAvatar(values[0] || '')}/>
              </FormGroup>

              <FormActions
                cancelTo={
                  <Link to={all_routes.staff} className={CANCEL_CLASS}>
                    Cancel
                  </Link>
                }
                submitLabel={submitting ? "Saving..." : isEdit ? "Save Staff" : "Add Staff"}
              />
            </form>
          </div>
        </div>

        <QuickTips tips={TIPS} />
      </div>
    </div>
  );
};

export default StaffForm;
