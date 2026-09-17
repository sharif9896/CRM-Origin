import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import AuthCard from "../../components/ui/authCard";
import { verifyEmailRequest } from "../../lib/api/auth";
import { ApiError } from "../../lib/apiClient";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- A missing route token is an invalid verification request.
      setStatus("error");
      setError("This verification link is invalid.");
      return;
    }
    verifyEmailRequest(token)
      .then(() => setStatus("success"))
      .catch((err) => {
        setStatus("error");
        setError(err instanceof ApiError ? err.message : "This verification link is invalid or has expired.");
      });
  }, [token]);

  return (
    <AuthCard>
      <div className="text-center mb-8">
        <div
          className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            status === "success" ? "bg-success/10" : status === "error" ? "bg-danger/10" : "bg-info/10"
          }`}
        >
          {status === "pending" && (
            <div className="animate-spin rounded-full h-7 w-7 border-2 border-info border-t-transparent" />
          )}
          {status === "success" && <i className="icon-mail-check text-3xl! text-success" />}
          {status === "error" && <i className="icon-mail-x text-3xl! text-danger" />}
        </div>

        <h1 className="text-3xl max-sm:text-xl font-bold text-gray-900 mb-2">
          {status === "pending" && "Verifying Your Email..."}
          {status === "success" && "Email Verified!"}
          {status === "error" && "Verification Failed"}
        </h1>

        <p className="text-sm text-gray-600">
          {status === "pending" && "Please wait a moment while we confirm your email address."}
          {status === "success" && "Your email address has been verified successfully."}
          {status === "error" && (error ?? "This link is invalid or has expired.")}
        </p>
      </div>

      {status === "success" && (
        <button
          type="button"
          onClick={() => navigate(all_routes.dashboard, { replace: true })}
          className="w-full py-3 px-4 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover transition cursor-pointer"
        >
          Continue to Dashboard
        </button>
      )}

      {status === "error" && (
        <Link
          to={all_routes.login}
          className="block text-center w-full py-3 px-4 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover transition"
        >
          Back to Login
        </Link>
      )}
    </AuthCard>
  );
};

export default VerifyEmail;
