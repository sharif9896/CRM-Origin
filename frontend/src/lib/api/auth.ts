import { apiRequest } from "../apiClient";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  phone?: string;
  isEmailVerified: boolean;
};

type AuthResponse = { success: boolean; token: string; user: AuthUser };
type MeResponse = { success: boolean; data: AuthUser };
type MessageResponse = { success: boolean; message: string };

export const registerRequest = (body: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) => apiRequest<AuthResponse>("/auth/register", { method: "POST", body });

export const loginRequest = (body: { email: string; password: string }) =>
  apiRequest<AuthResponse>("/auth/login", { method: "POST", body });

export const meRequest = () => apiRequest<MeResponse>("/auth/me");

export const updateProfileRequest = (body: { name?: string; phone?: string; avatar?: string }) =>
  apiRequest<MeResponse>("/auth/update-profile", { method: "PUT", body });

export const updatePasswordRequest = (body: { currentPassword: string; newPassword: string }) =>
  apiRequest<AuthResponse>("/auth/update-password", { method: "PUT", body });

export const forgotPasswordRequest = (body: { email: string }) =>
  apiRequest<MessageResponse>("/auth/forgot-password", { method: "POST", body });

export const resetPasswordRequest = (token: string, body: { password: string }) =>
  apiRequest<AuthResponse>(`/auth/reset-password/${token}`, { method: "PUT", body });

const verificationRequests = new Map<string, Promise<MessageResponse>>();
export const verifyEmailRequest = (token: string) => {
  let request = verificationRequests.get(token);
  if (!request) {
    request = apiRequest<MessageResponse>('/auth/verify-email/' + token);
    verificationRequests.set(token, request);
  }
  return request;
};
