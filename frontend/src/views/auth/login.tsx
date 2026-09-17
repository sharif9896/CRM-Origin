import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import type { Location } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import AuthCard from "../../components/ui/authCard";
import PasswordInput from "../../components/ui/passwordInput";
import { useAppDispatch } from "../../store/hooks";
import { login } from "../../store/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("admin@realestate.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await dispatch(login({ email, password })).unwrap();
      const from = (location.state as { from?: Location } | null)?.from?.pathname;
      navigate(from || all_routes.dashboard, { replace: true });
    } catch (err) {
      setError(typeof err === "string" ? err : "Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard>
      <div className="text-center mb-8">
        <h1 className="text-3xl max-sm:text-xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-sm text-gray-600">Sign in to your account to continue</p>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-danger/30 bg-danger/10 text-danger text-sm px-4 py-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-5">
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
            autoComplete="email"
            className="form-input w-full bg-white border border-border-color text-sm text-gray-900 rounded-lg py-2 px-3 focus:ring-0 focus:border-primary"
          />
        </div>

        <div className="mb-2">
          <PasswordInput
            id="login-password"
            label="Password"
            value={password}
            onChange={setPassword}
            required
            autoComplete="current-password"
          />
        </div>

        <div className="text-right mb-6">
          <Link
            to={all_routes.forgotPassword}
            className="text-sm text-primary hover:text-primary-hover font-medium transition"
          >
            Forgot password?
          </Link>
        </div>

        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="remember"
            className="w-4 h-4 text-primary border-border-color rounded focus:ring-0 cursor-pointer focus:outline-none focus:ring-offset-0"
          />
          <label htmlFor="remember" className="ms-3 text-sm font-medium text-gray-900 cursor-pointer">
            Remember me
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 px-4 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to={all_routes.register}
            className="text-primary font-semibold hover:text-primary-hover transition"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </AuthCard>
  );
};

export default Login;
