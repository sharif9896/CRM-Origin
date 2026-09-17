import { useResourceOptions } from "../../hooks/useResourceOptions";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Nullable } from "primereact/ts-helpers";
import { all_routes } from "../../routes/all_routes";
import type { Agent, Property } from "../../data/types";
import { getResource, createResource, listResource, updateResource } from "../../lib/api/resource";
import { ApiError } from "../../lib/apiClient";
import PageHeader from "../../components/ui/pageHeader";
import FormField, { INPUT_CLASS, LABEL_CLASS_TIGHT } from "../../components/ui/formField";
import Select from "../../components/ui/select";
import DatePicker from "../../components/ui/datePicker";
import TextEditor from "../../components/ui/textEditor";
import FormSection from "../../components/ui/formSection";
import ImagePicker from "../../components/ui/imagePicker";
import { PROPERTY_STATUSES, PROPERTY_TYPES } from "./constants";



const PropertyForm = ({ mode }: { mode: "add" | "edit" }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = mode === "edit";
  const categoryOptions = useResourceOptions("taxonomies", { kind: "category", status: "Active" });
  const amenityOptions = useResourceOptions("taxonomies", { kind: "amenity", status: "Active" });

  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [type, setType] = useState<string>("Villa");
  const [status, setStatus] = useState<string>("For Sale");
  const [price, setPrice] = useState<string>("");
  const [sqft, setSqft] = useState<string>("");
  const [beds, setBeds] = useState<string>("");
  const [baths, setBaths] = useState<string>("");
  const [garage, setGarage] = useState<string>("");
  const [availableFrom, setAvailableFrom] = useState<Nullable<Date>>(null);
  const [description, setDescription] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentRef, setAgentRef] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerWhatsapp, setOwnerWhatsapp] = useState("");

  useEffect(() => {
    let cancelled = false;
    listResource<Agent>("agents")
      .then((rows) => { if (!cancelled) setAgents(rows); })
      .catch(() => { if (!cancelled) setAgents([]); });
    return () => { cancelled = true; };
  }, []);

  // In edit mode, load the real record from the backend and populate the form.
  useEffect(() => {
    if (!isEdit || !id) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Reset state when loading a different record.
    setLoading(true);
    setLoadError(null);
    getResource<Property>("properties", id)
      .then((prop) => {
        if (cancelled) return;
        setName(prop.name ?? "");
        setImage(prop.image || "");
        setImages(prop.images || []);
        setLocation(prop.location ?? "");
        setType(prop.type ?? "Villa");
        setStatus(prop.status ?? "For Sale");
        setPrice(prop.price != null ? String(prop.price) : "");
        setSqft(prop.sqft != null ? String(prop.sqft) : "");
        setBeds(prop.beds != null ? String(prop.beds) : "");
        setBaths(prop.baths != null ? String(prop.baths) : "");
        setGarage(prop.garage != null ? String(prop.garage) : "");
        setAvailableFrom(prop.availableFrom ? new Date(prop.availableFrom) : null);
        setDescription(prop.description ?? "");
        setAmenities(prop.amenities ?? []);
        setAgentRef(prop.agentRef ?? "");
        setOwnerName(prop.ownerName ?? "");
        setOwnerEmail(prop.ownerEmail ?? "");
        setOwnerWhatsapp(prop.ownerWhatsapp ?? "");
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(err instanceof ApiError ? err.message : "Failed to load property");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isEdit, id]);

  const toggleAmenity = (amenity: string) =>
    setAmenities((current) =>
      current.includes(amenity) ? current.filter((a) => a !== amenity) : [...current, amenity],
    );

  const title = isEdit ? "Edit Property" : "Add Property";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    const selectedAgent = agents.find((record) => record.id === agentRef);
    const payload: Partial<Property> = {
      name,
      image,
      images,
      location,
      type: type as Property["type"],
      status: status as Property["status"],
      price: Number(price) || 0,
      sqft: Number(sqft) || 0,
      beds: Number(beds) || 0,
      baths: Number(baths) || 0,
      garage: Number(garage) || 0,
      availableFrom: availableFrom ? availableFrom.toISOString() : undefined,
      description,
      amenities,
      agentRef: agentRef || undefined,
      agent: selectedAgent?.name || "",
      agentAvatar: selectedAgent?.avatar || "",
      ownerName,
      ownerEmail,
      ownerWhatsapp,
    };

    setSubmitting(true);
    try {
      if (isEdit && id) {
        await updateResource<Property>("properties", id, payload);
      } else {
        await createResource<Property>("properties", payload);
      }
      navigate(all_routes.properties);
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Failed to save property");
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
        <Link to={all_routes.properties} className="text-primary text-sm font-medium">
          Back to Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="p-3 lg:py-6 lg:px-0">
      {(categoryOptions.error || amenityOptions.error) && <div className="ws-error" role="alert">{categoryOptions.error || amenityOptions.error}</div>}
      <PageHeader
        title={title}
        crumbs={[{ label: "Properties", to: all_routes.properties }, { label: title }]}
        action={
          <Link
            to={all_routes.properties}
            className="page-back-button inline-flex items-center gap-2 bg-white border border-border-color text-sm font-medium text-gray-900 rounded-full py-2 px-4 hover:bg-light transition"
          >
            <i className="icon-arrow-left" /> Back
          </Link>
        }
      />

      {submitError && (
        <div className="mb-4 rounded-lg border border-danger/30 bg-danger/10 text-danger text-sm px-4 py-3">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          <FormSection icon="icon-info" title="Basic Information">
            <FormField labelClass={LABEL_CLASS_TIGHT} label="Property Name" htmlFor="name" span="md:col-span-6" required>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mariana High Apartments"
                className={INPUT_CLASS}
              />
            </FormField>
            <FormField labelClass={LABEL_CLASS_TIGHT} label="Property Type" htmlFor="type" span="md:col-span-3">
              <Select inputId="type" value={type} options={[...new Set([...PROPERTY_TYPES, ...categoryOptions.options, type])]} onChange={setType} />
            </FormField>
            <FormField labelClass={LABEL_CLASS_TIGHT} label="Status" htmlFor="status" span="md:col-span-3">
              <Select inputId="status" value={status} options={PROPERTY_STATUSES} onChange={setStatus} />
            </FormField>
          </FormSection>

          <FormSection icon="icon-dollar-sign" title="Price & Area">
            <FormField labelClass={LABEL_CLASS_TIGHT} label="Price ($)" htmlFor="price" span="md:col-span-3">
              <input
                id="price"
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="3512500"
                className={INPUT_CLASS}
              />
            </FormField>
            <FormField labelClass={LABEL_CLASS_TIGHT} label="Area (Sq Ft)" htmlFor="area" span="md:col-span-3">
              <input
                id="area"
                type="number"
                min={0}
                value={sqft}
                onChange={(e) => setSqft(e.target.value)}
                placeholder="1526"
                className={INPUT_CLASS}
              />
            </FormField>
            <FormField labelClass={LABEL_CLASS_TIGHT} label="Bedrooms" htmlFor="beds" span="md:col-span-2">
              <input
                id="beds"
                type="number"
                min={0}
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
                placeholder="4"
                className={INPUT_CLASS}
              />
            </FormField>
            <FormField labelClass={LABEL_CLASS_TIGHT} label="Bathrooms" htmlFor="baths" span="md:col-span-2">
              <input
                id="baths"
                type="number"
                min={0}
                value={baths}
                onChange={(e) => setBaths(e.target.value)}
                placeholder="4"
                className={INPUT_CLASS}
              />
            </FormField>
            <FormField labelClass={LABEL_CLASS_TIGHT} label="Garage" htmlFor="garage" span="md:col-span-2">
              <input
                id="garage"
                type="number"
                min={0}
                value={garage}
                onChange={(e) => setGarage(e.target.value)}
                placeholder="2"
                className={INPUT_CLASS}
              />
            </FormField>
          </FormSection>

          <FormSection icon="icon-map-pin" title="Location">
            <FormField labelClass={LABEL_CLASS_TIGHT} label="Location" htmlFor="location" span="md:col-span-6" required>
              <input
                id="location"
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Los Angeles, CA"
                className={INPUT_CLASS}
              />
            </FormField>
            <FormField labelClass={LABEL_CLASS_TIGHT} label="Available From" htmlFor="available" span="md:col-span-3">
              <DatePicker inputId="available" value={availableFrom} onChange={setAvailableFrom} />
            </FormField>
          </FormSection>

          <FormSection icon="icon-contact" title="Listing Contacts">
            <FormField labelClass={LABEL_CLASS_TIGHT} label="Listing Agent" htmlFor="listing-agent" span="md:col-span-6">
              <select id="listing-agent" value={agentRef} onChange={(event) => setAgentRef(event.target.value)} className={INPUT_CLASS}>
                <option value="">No agent assigned</option>
                {agents.map((record) => <option key={record.id} value={record.id}>{record.name} — {record.email}</option>)}
              </select>
            </FormField>
            <FormField labelClass={LABEL_CLASS_TIGHT} label="Owner Name" htmlFor="owner-name" span="md:col-span-6">
              <input id="owner-name" type="text" value={ownerName} onChange={(event) => setOwnerName(event.target.value)} placeholder="Property owner or company" className={INPUT_CLASS} />
            </FormField>
            <FormField labelClass={LABEL_CLASS_TIGHT} label="Owner Email" htmlFor="owner-email" span="md:col-span-6">
              <input id="owner-email" type="email" value={ownerEmail} onChange={(event) => setOwnerEmail(event.target.value)} placeholder="owner@example.com" className={INPUT_CLASS} />
            </FormField>
            <FormField labelClass={LABEL_CLASS_TIGHT} label="Owner WhatsApp" htmlFor="owner-whatsapp" span="md:col-span-6">
              <input id="owner-whatsapp" type="tel" value={ownerWhatsapp} onChange={(event) => setOwnerWhatsapp(event.target.value)} placeholder="+1 555 000 1234" className={INPUT_CLASS} />
            </FormField>
            <div className="col-span-12 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-gray-600">
              New visit requests are sent automatically to the owner and the selected agent. Missing destinations are recorded in Notification Status for the administrator.
            </div>
          </FormSection>

          <FormSection icon="icon-image" title="Property images">
            <div className="col-span-12 field-grid">
              <ImagePicker label="Cover image" resource="properties" values={image ? [image] : []} onChange={values => setImage(values[0] || '')}/>
              <ImagePicker label="Gallery images" resource="properties" values={images} multiple maxFiles={10} onChange={setImages}/>
            </div>
          </FormSection>
          <FormSection icon="icon-align-left" title="Description">
            <div className="col-span-12">
              <TextEditor value={description} onChange={setDescription} />
            </div>
          </FormSection>

          <FormSection icon="icon-sparkles" title="Amenities">
            <div className="col-span-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {[...new Set([...amenityOptions.options, ...amenities])].map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center gap-2 text-sm font-medium text-gray-900 bg-white border border-border-color rounded-lg py-2.5 px-3 cursor-pointer hover:border-primary transition"
                  >
                    <input
                      type="checkbox"
                      checked={amenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="form-checkbox rounded text-primary focus:ring-0 focus:outline-none focus:ring-offset-0"
                    />
                    {amenity}
                  </label>
                ))}
              </div>
            </div>
          </FormSection>

          <div className="col-span-12 flex items-center justify-end gap-3">
            <Link
              to={all_routes.properties}
              className="inline-flex items-center gap-2 bg-white border border-border-color text-gray-900 text-sm font-medium rounded-full px-5 py-2.5 hover:bg-light transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="btn px-5 py-2.5 rounded-full bg-primary text-white text-sm font-medium inline-flex items-center gap-2 hover:bg-primary-hover transition hover:text-white cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <i className="icon-check" /> {submitting ? "Saving..." : "Save Property"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;
