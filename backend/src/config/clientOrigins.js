const DEFAULT_PRODUCTION_CLIENT = "https://socailsync.com";
const DEFAULT_DEVELOPMENT_CLIENT = "http://localhost:5173";

const normalizeOrigin = (value) => {
  if (!value) return "";
  try {
    return new URL(value).origin;
  } catch {
    return value.trim().replace(/\/+$/, "");
  }
};

const configuredOrigins = [process.env.CLIENT_URL, process.env.CLIENT_URLS]
  .filter(Boolean)
  .flatMap((value) => value.split(","))
  .map((value) => normalizeOrigin(value.trim()))
  .filter(Boolean);

const allowedOrigins = new Set([
  DEFAULT_PRODUCTION_CLIENT,
  "https://www.socailsync.com",
  ...configuredOrigins,
  ...(process.env.NODE_ENV !== "production"
    ? [DEFAULT_DEVELOPMENT_CLIENT, "http://127.0.0.1:5173"]
    : []),
]);

const resolveClientUrl = (req) => {
  const requestOrigin = normalizeOrigin(req?.get?.("origin"));
  if (requestOrigin && allowedOrigins.has(requestOrigin)) return requestOrigin;
  return (
    normalizeOrigin(process.env.CLIENT_URL) ||
    (process.env.NODE_ENV === "production"
      ? DEFAULT_PRODUCTION_CLIENT
      : DEFAULT_DEVELOPMENT_CLIENT)
  );
};

module.exports = { allowedOrigins, normalizeOrigin, resolveClientUrl };
