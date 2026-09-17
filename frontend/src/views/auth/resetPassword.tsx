import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import AuthCard from "../../components/ui/authCard";
import PasswordInput from "../../components/ui/passwordInput";
import { resetPasswordRequest } from "../../lib/api/auth";
import { ApiError } from "../../lib/apiClient";

const RULES = [
  "At least 6 characters long",
  "Contains uppercase and lowercase letters",
  "Contains at least one number",
  "Contains at least one special character",
];

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("This reset link is invalid or has expired. Please request a new one.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await resetPasswordRequest(token, { password });
      navigate(all_routes.resetSuccess, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "This reset link is invalid or has expired.");
      setSubmitting(false);
    }
  };

  return (
    <AuthCard>
      <Link
        to={all_routes.login}
        className="inline-flex items-center text-sm text-primary hover:text-primary-hover font-medium mb-6 transition gap-1"
      >
        <i className="icon-arrow-left text-xs" />
        Back to Login
      </Link>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <i className="icon-key text-3xl! text-primary" />
        </div>
        <h1 className="text-3xl max-sm:text-xl font-bold text-gray-900 mb-2">Reset Password</h1>
        <p className="text-sm text-gray-600">Choose a new password for your account.</p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-5 rounded-lg border border-danger/30 bg-danger/10 text-danger text-sm px-4 py-3">
            {error}
          </div>
        )}
        <div className="mb-5">
          <PasswordInput
            id="new-password"
            label="New Password"
            value={password}
            onChange={setPassword}
            required
            autoComplete="new-password"
          />
        </div>
        <div className="mb-6">
          <PasswordInput
            id="confirm-password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            required
            autoComplete="new-password"
          />
        </div>

        <div className="bg-light rounded-lg border border-border-color p-4 mb-6">
          <p className="text-sm font-medium text-gray-900 mb-2">Password must:</p>
          <ul className="space-y-1 p-0">
            {RULES.map((rule) => (
              <li key={rule} className="flex items-start gap-2 text-sm text-gray-600">
                <i className="icon-check text-success mt-0.5" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 px-4 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </AuthCard>
  );
};

export default ResetPassword;
