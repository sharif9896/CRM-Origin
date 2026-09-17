import { useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import type { Property } from "../../data/types";
import ImageWithBasePath from "../../components/ui/imageWithBasePath";
import { formatPrice, propertyStatusSolid, propertyTypeClass } from "./constants";

const PropertyCard = ({ property }: { property: Property }) => {
  
  const [favourite, setFavourite] = useState(false);

  return (
    <div className="border border-border-color rounded-xl overflow-hidden p-5 hover:shadow-md transition-shadow duration-200 bg-white-50 h-full">
      <div className="relative h-50 bg-gray-100 overflow-hidden rounded-lg">
        <Link to={`${all_routes.propertyDetails}/${property.id}`}>
          <ImageWithBasePath
            src={property.image}
            alt={property.name}
            className="w-full h-full object-cover"
          />
        </Link>
        <div className="absolute bottom-3 left-3 flex gap-2 z-10">
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
        <button
          type="button"
          onClick={() => setFavourite((v) => !v)}
          aria-label={favourite ? `Unfavourite ${property.name}` : `Favourite ${property.name}`}
          aria-pressed={favourite}
          className={`favourite absolute top-3 right-3 size-10 rounded-full hover:bg-white text-lg hover:text-danger flex items-center justify-center shadow-xs cursor-pointer transition-colors backdrop-blur-md ${
            favourite ? "bg-danger text-white" : "bg-white-500 text-gray-900"
          }`}
        >
          <i className="icon-heart text-lg font-bold" />
        </button>
      </div>

      <div className="pt-5">
        <h2 className="text-base font-bold text-gray-900 mb-1">
          <Link to={`${all_routes.propertyDetails}/${property.id}`} className="hover:text-primary transition-colors">
            {property.name}
          </Link>
        </h2>
        <p className="text-[13px] text-gray-600 mb-3 flex items-center gap-1">
          <i className="icon-map-pin text-gray-900" /> {property.location}
        </p>
        <h3 className="text-xl max-lg:text-lg font-bold text-gray-900 mb-3">
          {formatPrice(property.price)}
        </h3>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1.5 text-gray-900 text-[13px] font-medium border border-border-color py-1 px-2.5 rounded-full">
            <i className="icon-bed" /> {property.beds}
          </span>
          <span className="flex items-center gap-1.5 text-gray-900 text-[13px] font-medium border border-border-color py-1 px-2.5 rounded-full">
            <i className="icon-bath" /> {property.baths}
          </span>
          <span className="flex items-center gap-1.5 text-gray-900 text-[13px] font-medium border border-border-color py-1 px-2.5 rounded-full">
            <i className="icon-maximize" /> {property.sqft.toLocaleString("en-US")} Sq Ft.
          </span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
