import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  loginRequest,
  registerRequest,
  meRequest,
  type AuthUser,
} from "../lib/api/auth";
import { ApiError } from "../lib/apiClient";
import { getToken, setToken } from "../lib/apiClient";

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  /** "idle" until we've attempted to restore a session from a stored token. */
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: AuthState = {
  token: getToken(),
  user: null,
  status: "idle",
  error: null,
};

const errorMessage = (err: unknown) =>
  err instanceof ApiError ? err.message : "Something went wrong. Please try again.";

export const login = createAsyncThunk(
  "auth/login",
  async (body: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await loginRequest(body);
      return res;
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  },
);

export const register = createAsyncThunk(
  "auth/register",
  async (
    body: { name: string; email: string; password: string; phone?: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await registerRequest(body);
      return res;
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  },
);

/** Restores a session on app load if a token is already stored. */
export const fetchMe = createAsyncThunk("auth/fetchMe", async (_: void, { rejectWithValue }) => {
  try {
    const res = await meRequest();
    return res.data;
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.status = "idle";
      setToken(null);
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; user: AuthUser }>) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user;
        setToken(action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Login failed";
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        register.fulfilled,
        (state, action: PayloadAction<{ token: string; user: AuthUser }>) => {
          state.status = "succeeded";
          state.token = action.payload.token;
          state.user = action.payload.user;
          setToken(action.payload.token);
        },
      )
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Registration failed";
      })
      .addCase(fetchMe.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMe.fulfilled, (state, action: PayloadAction<AuthUser>) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state) => {
        // Stored token is invalid/expired - clear everything and force re-login.
        state.status = "failed";
        state.token = null;
        state.user = null;
        setToken(null);
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
