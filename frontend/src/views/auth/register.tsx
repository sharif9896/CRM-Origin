import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import AuthCard from "../../components/ui/authCard";
import PasswordInput from "../../components/ui/passwordInput";
import { useAppDispatch } from "../../store/hooks";
import { register } from "../../store/authSlice";

const INPUT_CLASS =
  "form-input w-full bg-white border border-border-color text-sm text-gray-900 rounded-lg py-2 px-3 focus:ring-0 focus:border-primary";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

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
      await dispatch(
        register({
          name: `${firstName} ${lastName}`.trim(),
          email,
          password,
          phone: phone || undefined,
        }),
      ).unwrap();
      navigate(all_routes.dashboard, { replace: true });
    } catch (err) {
      setError(typeof err === "string" ? err : "Could not create your account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard>
      <div className="text-center mb-8">
        <h1 className="text-3xl max-sm:text-xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p className="text-sm text-gray-600">Get started with your free account today</p>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-danger/30 bg-danger/10 text-danger text-sm px-4 py-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label htmlFor="first-name" className="block text-sm font-medium text-gray-900 mb-2">
              First Name
            </label>
            <input
              type="text"
              id="first-name"
              placeholder="John"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label htmlFor="last-name" className="block text-sm font-medium text-gray-900 mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="last-name"
              placeholder="Doe"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <div className="mb-5">
          <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            placeholder="john.doe@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>

        <div className="mb-5">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            placeholder="+1 555 0100"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>

        <div className="mb-5">
          <PasswordInput
            id="register-password"
            label="Password"
            value={password}
            onChange={setPassword}
            required
            autoComplete="new-password"
          />
        </div>

        <div className="mb-5">
          <PasswordInput
            id="register-confirm"
            label="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            required
            autoComplete="new-password"
          />
        </div>

        <div className="flex items-start mb-6">
          <input
            type="checkbox"
            id="terms"
            required
            className="w-4 h-4 mt-0.5 text-primary border-border-color rounded focus:ring-0 cursor-pointer focus:outline-none focus:ring-offset-0"
          />
          <label htmlFor="terms" className="ms-3 text-sm font-medium text-gray-900 cursor-pointer">
            I agree to the{" "}
            <a href="#" className="text-primary hover:text-primary-hover">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:text-primary-hover">
              Privacy Policy
            </a>
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 px-4 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link to={all_routes.login} className="text-primary font-semibold hover:text-primary-hover transition">
            Sign in
          </Link>
        </p>
      </div>
    </AuthCard>
  );
};

export default Register;
