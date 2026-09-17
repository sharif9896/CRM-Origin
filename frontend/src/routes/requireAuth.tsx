import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { all_routes } from "./all_routes";
import { useAppDispatch } from "../store/hooks";
import { useAuth } from "../store/hooks";
import { fetchMe } from "../store/authSlice";

/**
 * Wraps the main app routes (dashboard, leads, properties, ...). If a JWT is
 * stored, it restores the session by calling /auth/me once; otherwise it
 * sends the visitor to the login page, remembering where they were headed.
 */
const RequireAuth = () => {
  const dispatch = useAppDispatch();
  const { token, user, status } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (token && !user && status === "idle") {
      dispatch(fetchMe());
    }
  }, [token, user, status, dispatch]);

  if (!token) {
    return <Navigate to={all_routes.login} replace state={{ from: location }} />;
  }

  // Session restore in flight - avoid flashing protected content (or the
  // login page) before we know whether the stored token is still valid.
  if (!user && (status === "idle" || status === "loading")) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user && status === "failed") {
    return <Navigate to={all_routes.login} replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default RequireAuth;
