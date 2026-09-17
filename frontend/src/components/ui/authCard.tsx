import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import ImageWithBasePath from "./imageWithBasePath";

type Props = {
  children: React.ReactNode;
  width?: string;
  container?: string;
  cardClass?: string;
  logo?: boolean;
  policyLinks?: boolean;
};

const AuthCard = ({
  children,
  width = "max-w-[420px]",
  container = "login-container",
  cardClass = "bg-white rounded-2xl shadow-2xl p-8",
  logo = true,
  policyLinks = false,
}: Props) => (
  <div className={`${container} p-4 w-full ${width} mx-auto`}>
    {logo && (
      <div className="text-center mb-8">
        <Link to={all_routes.dashboard} className="inline-block">
          <ImageWithBasePath src="logo-thu.png" alt="Logo" className="h-12" />
        </Link>
      </div>
    )}

    <div className={cardClass}>{children}</div>

    {policyLinks ? (
      <div className="text-center mt-8 text-sm text-white">
        <p className="mb-3">
          <a href="#" className="hover:underline transition">
            Privacy Policy
          </a>{" "}
          •{" "}
          <a href="#" className="hover:underline transition">
            Terms of Service
          </a>
        </p>
        <p className="opacity-90">2026 &copy; Realestate. All Rights Reserved</p>
      </div>
    ) : (
      <div className="text-center mt-8 text-sm text-white">
        <p className="opacity-90">2026 &copy; Realestate. All Rights Reserved</p>
      </div>
    )}
  </div>
);

export default AuthCard;
