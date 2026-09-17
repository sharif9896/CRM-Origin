import { useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import AuthCard from "../../components/ui/authCard";
import { forgotPasswordRequest } from "../../lib/api/auth";
import { ApiError } from "../../lib/apiClient";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await forgotPasswordRequest({ email });
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
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
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-4">
          <i className="icon-mail text-3xl! text-success" />
        </div>
        <h1 className="text-3xl max-sm:text-xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
        <p className="text-sm text-gray-600">
          No worries! Enter your email and we'll send you a link to reset your password.
        </p>
      </div>

      {sent ? (
        <div className="rounded-lg border border-success/30 bg-success/10 text-sm text-gray-700 px-4 py-4 text-center">
          <i className="icon-mail-check text-2xl text-success block mb-2" />
          If an account exists for <span className="font-semibold">{email}</span>, a reset link has
          been sent. Check your inbox (and in local development, the backend server's console log).
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-5 rounded-lg border border-danger/30 bg-danger/10 text-danger text-sm px-4 py-3">
              {error}
            </div>
          )}
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="name@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input w-full bg-white border border-border-color text-sm text-gray-900 rounded-lg py-2 px-3 focus:ring-0 focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      )}

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Remember your password?{" "}
          <Link to={all_routes.login} className="text-primary font-semibold hover:text-primary-hover transition">
            Sign in
          </Link>
        </p>
      </div>
    </AuthCard>
  );
};

export default ForgotPassword;
