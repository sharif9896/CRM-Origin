import { useDispatch, useSelector, shallowEqual } from "react-redux";
import type { AppDispatch, RootState } from ".";

/** Typed wrappers so components never re-annotate the store's types. */
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const useTheme = () => useAppSelector((state) => state.theme.value);

export const useAuth = () =>
  useAppSelector((state) => ({
    user: state.auth.user,
    token: state.auth.token,
    status: state.auth.status,
    error: state.auth.error,
    isAuthenticated: Boolean(state.auth.token),
  }), shallowEqual);
