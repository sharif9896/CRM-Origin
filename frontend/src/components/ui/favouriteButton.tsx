import { useState } from "react";

const FavouriteButton = ({ className = "top-3 right-3" }: { className?: string }) => {
  const [active, setActive] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setActive((v) => !v)}
      aria-label="Favorite property"
      aria-pressed={active}
      className={`favourite absolute ${className} size-10 rounded-full hover:bg-white text-lg hover:text-danger flex items-center justify-center shadow-xs cursor-pointer transition-colors backdrop-blur-md ${
        active ? "bg-danger text-white" : "bg-white-500 text-gray-900"
      }`}
    >
      <i className="icon-heart text-lg font-bold" />
    </button>
  );
};

export default FavouriteButton;
