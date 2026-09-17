import { Outlet, useLocation } from "react-router-dom";
import { all_routes } from "../routes/all_routes";

const BRAND_GRADIENT = "bg-gradient-to-br from-primary to-[#084E7F]";
const SIDEBAR_BACKGROUND = "bg-[#0b1220]";

const AuthLayout = () => {
  const { pathname } = useLocation();
  const background =
    pathname === all_routes.login
      ? SIDEBAR_BACKGROUND
      : pathname === all_routes.verifySuccess
        ? "bg-secondary-gradient-100"
        : BRAND_GRADIENT;

  return (
    <div className={`${background} min-h-screen w-full flex items-center justify-center`}>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
