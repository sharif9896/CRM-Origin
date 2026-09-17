import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import type { Tour } from "../../data/types";
import { image_path } from "../../environment";
import { useCrud } from "../../hooks/useCrud";
import ImageWithBasePath from "../../components/ui/imageWithBasePath";
import PageHeader from "../../components/ui/pageHeader";
import TourFormModal, { type TourFormValues } from "./tourFormModal";

const ManualTour = () => {
  // Every tour is shown as a card, so the grid is unpaged and unfiltered.
  const crud = useCrud<Tour>("tours", { pageSize: 100 });
  const [playing, setPlaying] = useState<Tour | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Tour | null>(null);

  const [saveError, setSaveError] = useState<string | null>(null);

  const openAdd = () => {
    setEditing(null);
    setSaveError(null);
    setFormOpen(true);
  };

  const openEdit = (tour: Tour) => {
    setEditing(tour);
    setSaveError(null);
    setFormOpen(true);
  };

  const handleSave = async (values: TourFormValues) => {
    setSaveError(null);
    try {
      if (editing) {
        await crud.update(editing.id, values);
      } else {
        await crud.add({
          ...values,
          image: "assets/img/dashboard/villa-img-1.jpg",
          views: 0,
        } as Omit<Tour, "id">);
      }
      setFormOpen(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save tour");
    }
  };

  return (
    <div className="p-3 lg:py-6 lg:px-0">
      {crud.error && <div className="ws-error" role="alert">{crud.error}<button onClick={() => void crud.reset()}>Retry</button></div>}
      {crud.loading && <div className="ws-notice" role="status">Loading records?</div>}
      <PageHeader
        title="Manual Tour"
        action={
          <button
            type="button"
            onClick={openAdd}
            className="btn px-4 py-2 rounded-full bg-primary text-white text-sm font-medium inline-flex items-center gap-2 hover:bg-primary-hover transition cursor-pointer"
          >
            <span className="flex">
              <i className="icon-plus" />
            </span>
            Add Tour
          </button>
        }
      />

      {crud.rows.length === 0 ? (
        <div className="bg-white-50 rounded-lg border border-border-color p-12 text-center">
          <i className="icon-video-off text-3xl text-gray-400 mb-2 block" />
          <p className="mb-0">No tours yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          {crud.rows.map((tour) => (
            <div key={tour.id} className="col-span-12 sm:col-span-6 xl:col-span-4">
              <div className="bg-white-50 rounded-xl border border-border-color shadow-xs overflow-hidden h-full hover:shadow-md transition-shadow">
                <div className="relative h-44 bg-gray-100 overflow-hidden group">
                  <ImageWithBasePath
                    src={tour.image}
                    alt={tour.property}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setPlaying(tour)}
                    aria-label={`Play tour of ${tour.property}`}
                    className="absolute inset-0 flex items-center justify-center bg-gray-900/30 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <span className="size-14 rounded-full bg-white/90 text-primary flex items-center justify-center text-xl">
                      <i className="icon-play" />
                    </span>
                  </button>
                  <span className="absolute bottom-3 right-3 text-[12px] font-semibold text-white bg-gray-900/70 rounded-md px-2 py-0.5">
                    {tour.duration}
                  </span>
                  <span
                    className={`absolute top-3 left-3 text-[12px] font-semibold text-white rounded-md px-2 py-0.5 ${
                      tour.status === "Published" ? "bg-info" : "bg-warning"
                    }`}
                  >
                    {tour.status}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">{tour.property}</h3>
                  <p className="text-[13px] text-gray-600 mb-3 flex items-center gap-1">
                    <i className="icon-map-pin" /> {tour.location}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-gray-600 inline-flex items-center gap-1.5">
                      <i className="icon-eye text-gray-500" />
                      {tour.views.toLocaleString()} views
                    </span>
                    <button
                      type="button"
                      onClick={() => openEdit(tour)}
                      className="size-8 rounded-full hover:bg-gray-100 text-gray-900 flex items-center justify-center transition-colors cursor-pointer"
                      aria-label={`Edit ${tour.property}`}
                    >
                      <i className="icon-pencil-line text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <TourFormModal
          open
          editing={editing}
          errorMessage={saveError}
          onClose={() => setFormOpen(false)}
          onSave={handleSave}
        />
      )}

      {/*
        Tours carry a still and a duration but no video source, so the lightbox
        opens the tour image rather than pretending to play footage. Slides span
        the current page so the arrows walk between tours.
      */}
      <Lightbox
        open={playing !== null}
        close={() => setPlaying(null)}
        index={Math.max(
          crud.rows.findIndex((t) => t.id === playing?.id),
          0,
        )}
        slides={crud.rows.map((tour) => ({
          src: `${image_path}${tour.image.replace(/^\//, "")}`,
          alt: tour.property,
          title: tour.property,
          description: `${tour.location} — ${tour.duration}`,
        }))}
      />
    </div>
  );
};

export default ManualTour;
