import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import { all_routes } from "../../routes/all_routes";
import type { Appointment, Property } from "../../data/types";
import { createResource, getResource, listResource } from "../../lib/api/resource";
import { ApiError } from "../../lib/apiClient";
import { useAuth } from "../../store/hooks";
import { useAccess } from "../../hooks/useAccess";
import ImageWithBasePath from "../../components/ui/imageWithBasePath";
import FavouriteButton from "../../components/ui/favouriteButton";
import PropertyCard from "./propertyCard";
import DatePicker from "../../components/ui/datePicker";
import { INPUT_CLASS, LABEL_CLASS_TIGHT } from "../../components/ui/formField";
import type { Nullable } from "primereact/ts-helpers";
import { formatPrice, propertyStatusSolid, propertyTypeClass } from "./constants";

const AMENITY_ICONS: Record<string, string> = {
  "Wi-Fi": "icon-wifi",
  Parking: "icon-car",
  "Swimming Pool": "icon-waves",
  Gym: "icon-dumbbell",
  Security: "icon-shield-check",
  Garden: "icon-trees",
  "Air Conditioning": "icon-snowflake",
  Elevator: "icon-arrow-up-down",
};

const MAP_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2967.8862835683544!2d-73.98256668525309!3d41.93829486962529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89dd0ee3286615b7%3A0x42bfa96cc2ce4381!2s132%20Kingston%20St%2C%20Kingston%2C%20NY%2012401%2C%20USA!5e0!3m2!1sen!2sin!4v1670922579281!5m2!1sen!2sin";

const CARD = "bg-white-50 rounded-lg border border-border-color shadow-xs p-5";
const HEADING = "text-lg font-bold text-gray-900 mb-4";
const SPEC_PILL =
  "flex items-center gap-1.5 text-gray-900 text-sm font-medium border border-border-color py-1.5 px-3 rounded-full";

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { can } = useAccess();

  const [property, setProperty] = useState<Property | null>(null);
  const [similar, setSimilar] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [thumbs, setThumbs] = useState<SwiperClass | null>(null);
  const [visitDate, setVisitDate] = useState<Nullable<Date>>(null);
  const [visitTime, setVisitTime] = useState("10:00");
  const [visitName, setVisitName] = useState(user?.name || "");
  const [visitEmail, setVisitEmail] = useState(user?.email || "");
  const [visitWhatsapp, setVisitWhatsapp] = useState(user?.phone || "");
  const [visitMessage, setVisitMessage] = useState("");
  const [visitBusy, setVisitBusy] = useState(false);
  const [visitResult, setVisitResult] = useState<{ kind: "success" | "error"; message: string } | null>(null);

  const handleVisitRequest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setVisitResult(null);
    if (!visitDate) {
      setVisitResult({ kind: "error", message: "Choose a preferred visit date." });
      return;
    }
    const when = new Date(visitDate);
    const [hours, minutes] = visitTime.split(":").map(Number);
    when.setHours(hours || 0, minutes || 0, 0, 0);
    setVisitBusy(true);
    try {
      const appointment = await createResource<Appointment>("appointments", {
        title: `Visit: ${property?.name || "Property"}`,
        propertyRef: property?.id,
        agentRef: property?.agentRef,
        client: visitName,
        requesterEmail: visitEmail,
        requesterWhatsapp: visitWhatsapp,
        when: when.toISOString(),
        duration: "30 mins",
        location: property?.location,
        notes: visitMessage,
        status: "Pending",
        avatar: user?.avatar || "",
        icon: "icon-home",
      });
      const detail = appointment.notificationStatus === "sent"
        ? "The owner and listing agent were notified."
        : "Your visit is booked. Delivery progress is available to the administrator.";
      setVisitResult({ kind: "success", message: detail });
      setVisitMessage("");
    } catch (err) {
      setVisitResult({ kind: "error", message: err instanceof ApiError ? err.message : "Failed to schedule the visit." });
    } finally {
      setVisitBusy(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Reset state when loading a different record.
    setLoading(true);
    setError(null);

    Promise.all([getResource<Property>("properties", id), listResource<Property>("properties")])
      .then(([prop, all]) => {
        if (cancelled) return;
        setProperty(prop);
        setSimilar(all.filter((p) => p.id !== prop.id).slice(0, 3));
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Failed to load property");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="p-3 lg:py-6 lg:px-0 flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="p-3 lg:py-6 lg:px-0">
        <p className="text-danger text-sm">{error ?? "Property not found"}</p>
        <Link to={all_routes.properties} className="text-primary text-sm font-medium">
          Back to Properties
        </Link>
      </div>
    );
  }

  const gallery =
    property.images && property.images.length > 0
      ? property.images
      : property.image
        ? [property.image]
        : ["assets/img/dashboard/villa-img-1.jpg"];

  const amenityList = property.amenities && property.amenities.length > 0 ? property.amenities : [];

  const details = [
    { label: "Property Type", value: property.type },
    { label: "Bedrooms", value: String(property.beds) },
    { label: "Bathrooms", value: String(property.baths) },
    { label: "Garage", value: property.garage != null ? `${property.garage} Cars` : "—" },
    {
      label: "Available From",
      value: property.availableFrom
        ? new Date(property.availableFrom).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "—",
    },
    { label: "Status", value: property.status },
  ];

  return (
    <div className="p-3 lg:py-6 lg:px-0">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <div className="flex items-center flex-wrap gap-2 mb-1">
            <h1 className="text-gray-900 text-xl lg:text-[28px] font-bold mb-0">{property.name}</h1>
            <span
              className={`inline-flex items-center text-xs font-semibold text-white rounded-md px-2.5 py-1 ${propertyStatusSolid[property.status]}`}
            >
              {property.status}
            </span>
          </div>
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to={all_routes.dashboard} className="hover:text-primary">
              Dashboard
            </Link>
            <i className="icon-chevron-right text-xs" />
            <Link to={all_routes.properties} className="hover:text-primary">
              Properties
            </Link>
            <i className="icon-chevron-right text-xs" />
            <span className="text-gray-900 font-medium">Details</span>
          </nav>
        </div>
        <div className="flex items-center flex-wrap gap-2 md:gap-3">
          <Link
            to={all_routes.properties}
            className="page-back-button inline-flex items-center gap-2 bg-white border border-border-color text-sm font-medium text-gray-900 rounded-full py-2 px-4 hover:bg-light transition"
          >
            <i className="icon-arrow-left" /> Back
          </Link>
          <Link
            to={`${all_routes.editProperty}/${property.id}`}
            className="btn px-4 py-2 rounded-full bg-primary text-white text-sm font-medium inline-flex items-center gap-2 hover:bg-primary-hover transition hover:text-white"
          >
            <i className="icon-pencil-line" /> Edit
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 lg:gap-6">
        <div className="col-span-12 xl:col-span-8">
          <div className={`${CARD} mb-4 lg:mb-6`}>
            <div className="relative mb-3">
              <Swiper
                modules={[Navigation, Thumbs]}
                spaceBetween={10}
                navigation
                thumbs={{ swiper: thumbs && !thumbs.destroyed ? thumbs : null }}
                className="property-gallery-main rounded-lg overflow-hidden"
              >
                {gallery.map((src, i) => (
                  <SwiperSlide key={`${src}-${i}`}>
                    <div className="relative h-[280px] md:h-[420px] bg-gray-100">
                      <ImageWithBasePath
                        src={src}
                        alt={property.name}
                        className="w-full h-full object-cover"
                      />
                      {i === 0 && (
                        <div className="absolute bottom-4 left-4 flex gap-2 z-10">
                          <span
                            className={`text-[12px] font-semibold text-white rounded-md px-2 py-0.5 ${propertyTypeClass[property.type]}`}
                          >
                            {property.type}
                          </span>
                          <span
                            className={`text-[12px] font-semibold text-white rounded-md px-2 py-0.5 ${propertyStatusSolid[property.status]}`}
                          >
                            {property.status}
                          </span>
                        </div>
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <FavouriteButton className="top-4 right-4 z-10" />
            </div>

            {gallery.length > 1 && (
              <Swiper
                modules={[FreeMode, Thumbs]}
                onSwiper={setThumbs}
                spaceBetween={12}
                slidesPerView={4}
                freeMode
                watchSlidesProgress
                className="property-gallery-thumbs"
              >
                {gallery.map((src, i) => (
                  <SwiperSlide
                    key={`thumb-${src}-${i}`}
                    className="cursor-pointer rounded-lg overflow-hidden opacity-60 [&.swiper-slide-thumb-active]:opacity-100 [&.swiper-slide-thumb-active]:border-2 [&.swiper-slide-thumb-active]:border-primary"
                  >
                    <ImageWithBasePath src={src} alt="thumb" className="w-full h-20 md:h-24 object-cover" />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          <div className={`${CARD} mb-4 lg:mb-6`}>
            <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
              <div>
                <p className="text-[13px] text-gray-600 mb-1 flex items-center gap-1">
                  <i className="icon-map-pin text-gray-900" /> {property.location}
                </p>
                <h2 className="text-2xl font-bold text-gray-900 mb-0">{formatPrice(property.price)}</h2>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className={SPEC_PILL}>
                  <i className="icon-bed" /> {property.beds} Beds
                </span>
                <span className={SPEC_PILL}>
                  <i className="icon-bath" /> {property.baths} Baths
                </span>
                <span className={SPEC_PILL}>
                  <i className="icon-maximize" /> {property.sqft.toLocaleString("en-US")} Sq Ft.
                </span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-0">
              {property.description || "No description has been added for this property yet."}
            </p>
          </div>

          <div className={`${CARD} mb-4 lg:mb-6`}>
            <h3 className={HEADING}>Property Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {details.map((item) => (
                <div key={item.label} className="rounded-lg bg-white border border-border-color p-3">
                  <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-900 mb-0">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {amenityList.length > 0 && (
            <div className={`${CARD} mb-4 lg:mb-6`}>
              <h3 className={HEADING}>Amenities</h3>
              <div className="flex flex-wrap gap-2.5">
                {amenityList.map((amenity) => (
                  <span
                    key={amenity}
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 bg-white border border-border-color rounded-full py-1.5 px-3.5"
                  >
                    <i className={`${AMENITY_ICONS[amenity] ?? "icon-check-circle"} text-primary`} /> {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {can("appointments:create") && <div className={CARD}>
            <h3 className={HEADING}>Location</h3>
            <div className="relative h-[280px] bg-gray-100 overflow-hidden rounded-lg flex items-center justify-center">
              <iframe
                src={MAP_EMBED}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Map"
                className="h-full w-full"
              />
            </div>
          </div>}
        </div>

        <div className="col-span-12 xl:col-span-4">
          <div className={`${CARD} mb-4 lg:mb-6`}>
            <h3 className={HEADING}>Listing Agent</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-14 h-14 shrink-0">
                <ImageWithBasePath
                  src={property.agentAvatar}
                  alt={property.agent}
                  className="w-full h-full rounded-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-white rounded-full" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-0.5">{property.agent}</h4>
                <p className="text-[13px] text-gray-600 mb-0">Listing Agent</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 text-sm font-medium text-gray-900 bg-white border border-border-color rounded-full py-2 hover:bg-light transition cursor-pointer"
              >
                <i className="icon-phone" /> Call
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 text-sm font-medium text-white bg-primary rounded-full py-2 hover:bg-primary-hover transition hover:text-white cursor-pointer"
              >
                <i className="icon-message-square" /> Message
              </button>
            </div>
          </div>

          <div className={CARD}>
            <h3 className={HEADING}>Schedule a Visit</h3>
            <form onSubmit={handleVisitRequest} className="space-y-4">
              {visitResult && (
                <div role="status" className={`rounded-lg border px-3 py-2.5 text-sm ${visitResult.kind === "success" ? "border-success/30 bg-success/10 text-success" : "border-danger/30 bg-danger/10 text-danger"}`}>
                  {visitResult.message}
                </div>
              )}
              <div>
                <label className={LABEL_CLASS_TIGHT} htmlFor="full-name">
                  Full Name
                </label>
                <input
                  type="text"
                  id="full-name"
                  required
                  value={visitName}
                  onChange={(event) => setVisitName(event.target.value)}
                  placeholder="Enter your name"
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label className={LABEL_CLASS_TIGHT} htmlFor="visit-email">
                  Email
                </label>
                <input
                  type="email"
                  id="visit-email"
                  required
                  value={visitEmail}
                  onChange={(event) => setVisitEmail(event.target.value)}
                  readOnly={user?.role === "customer" || user?.role === "viewer"}
                  placeholder="Enter your email"
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label className={LABEL_CLASS_TIGHT} htmlFor="date">
                  Preferred Date
                </label>
                <DatePicker inputId="date" value={visitDate} onChange={setVisitDate} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL_CLASS_TIGHT} htmlFor="visit-time">Preferred Time</label>
                  <input id="visit-time" type="time" required value={visitTime} onChange={(event) => setVisitTime(event.target.value)} className={INPUT_CLASS} />
                </div>
                <div>
                  <label className={LABEL_CLASS_TIGHT} htmlFor="visit-whatsapp">WhatsApp</label>
                  <input id="visit-whatsapp" type="tel" required value={visitWhatsapp} onChange={(event) => setVisitWhatsapp(event.target.value)} placeholder="+1 555 000 1234" className={INPUT_CLASS} />
                </div>
              </div>
              <div>
                <label className={LABEL_CLASS_TIGHT} htmlFor="message">
                  Message
                </label>
                <textarea
                  rows={3}
                  id="message"
                  value={visitMessage}
                  onChange={(event) => setVisitMessage(event.target.value)}
                  placeholder="I'm interested in this property..."
                  className={INPUT_CLASS}
                />
              </div>
              <button
                type="submit"
                disabled={visitBusy}
                className="btn w-full px-4 py-2.5 rounded-full bg-primary text-white text-sm font-medium inline-flex items-center justify-center gap-2 hover:bg-primary-hover transition hover:text-white cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <i className="icon-calendar-check-2" /> {visitBusy ? "Scheduling..." : "Request Visit"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="mt-6">
          <h2 className="text-gray-900 text-xl font-bold mb-4">Similar Properties</h2>
          <div className="grid grid-cols-12 gap-4 lg:gap-6">
            {similar.map((item) => (
              <div key={item.id} className="col-span-12 sm:col-span-6 xl:col-span-4">
                <PropertyCard property={item} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
