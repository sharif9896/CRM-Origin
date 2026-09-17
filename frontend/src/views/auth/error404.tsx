import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import AuthCard from "../../components/ui/authCard";

const REASONS = [
  "The page URL might be incorrect",
  "The page has been removed or moved",
  "You may not have permission to access this page",
];

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <AuthCard width="max-w-[600px]">
      <div className="text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-danger/10 mb-6">
            <i className="icon-triangle-alert text-3xl! text-danger" />
          </div>
        </div>

        <h1 className="text-7xl font-black text-gray-900 mb-2">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved. Let's get you back on
          track.
        </p>

        <div className="bg-light rounded-lg border border-border-color p-6 mb-8 text-left">
          <p className="text-sm text-gray-600 mb-2">
            <strong>What happened?</strong>
          </p>
          <ul className="text-sm text-gray-600 space-y-1 p-0">
            {REASONS.map((reason) => (
              <li key={reason} className="flex items-start gap-2">
                <i className="icon-check text-success mt-0.5" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            to={all_routes.dashboard}
            className="btn px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover hover:text-white transition inline-flex items-center justify-center gap-2"
          >
            <i className="icon-house" />
            Back to Dashboard
          </Link>
          {/* The template used href="javascript:history.back()"; this is the router-aware equivalent. */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn px-6 py-3 rounded-lg bg-white border border-border-color text-gray-900 font-semibold hover:bg-light transition inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <i className="icon-arrow-left" />
            Go Back
          </button>
        </div>
      </div>
    </AuthCard>
  );
};

export default Error404;
