import { Navigate, Route, Routes } from "react-router-dom";
import { all_routes } from "./all_routes";
import { authRoutes, publicRoutes } from "./router.link";
import PublicLayout from "../layout/publicLayout";
import AuthLayout from "../layout/authLayout";
import RequireAuth from "./requireAuth";

const ALLRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to={all_routes.dashboard} replace />} />

    {/* Main app - requires a logged-in session */}
    <Route element={<RequireAuth />}>
      <Route element={<PublicLayout />}>
        {publicRoutes.map((route) => (
          <Route path={route.path} element={route.element} key={route.path} />
        ))}
      </Route>
    </Route>

    {/* Login / register / password reset - no auth required */}
    <Route element={<AuthLayout />}>
      {authRoutes.map((route) => (
        <Route path={route.path} element={route.element} key={route.path} />
      ))}
      <Route path="*" element={<Navigate to={all_routes.error404} replace />} />
    </Route>
  </Routes>
);

export default ALLRoutes;
