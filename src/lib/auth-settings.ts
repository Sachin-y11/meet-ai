import type { OAuthProvider } from "./auth-types";

type OAuthCredentials = {
  clientId: string;
  clientSecret: string;
};

function readOAuthCredentials(
  provider: string,
): OAuthCredentials | undefined {
  const clientId = process.env[`${provider}_CLIENT_ID`]?.trim();
  const clientSecret = process.env[`${provider}_CLIENT_SECRET`]?.trim();

  if (!clientId && !clientSecret) {
    return undefined;
  }

  if (!clientId || !clientSecret) {
    throw new Error(
      `${provider}_CLIENT_ID and ${provider}_CLIENT_SECRET must both be set.`,
    );
  }

  return { clientId, clientSecret };
}

function parseOrigin(value: string): string {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error(
      `BETTER_AUTH_TRUSTED_ORIGINS contains an invalid origin: ${value}`,
    );
  }

  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      `BETTER_AUTH_TRUSTED_ORIGINS entries must be plain HTTP(S) origins: ${value}`,
    );
  }

  if (process.env.NODE_ENV === "production" && url.protocol !== "https:") {
    throw new Error(
      "BETTER_AUTH_TRUSTED_ORIGINS must use HTTPS in production.",
    );
  }

  return url.origin;
}

const isProduction = process.env.NODE_ENV === "production";
const baseURL =
  process.env.BETTER_AUTH_URL?.trim() ||
  (isProduction ? undefined : "http://localhost:3000");

if (!baseURL) {
  throw new Error("BETTER_AUTH_URL must be set in production.");
}

let parsedBaseURL: URL;

try {
  parsedBaseURL = new URL(baseURL);
} catch {
  throw new Error("BETTER_AUTH_URL must be an absolute HTTP(S) URL.");
}

if (
  !["http:", "https:"].includes(parsedBaseURL.protocol) ||
  parsedBaseURL.username ||
  parsedBaseURL.password ||
  parsedBaseURL.pathname !== "/" ||
  parsedBaseURL.search ||
  parsedBaseURL.hash
) {
  throw new Error(
    "BETTER_AUTH_URL must be an origin without credentials, path, query, or fragment.",
  );
}

if (isProduction && parsedBaseURL.protocol !== "https:") {
  throw new Error("BETTER_AUTH_URL must use HTTPS in production.");
}

const secret = process.env.BETTER_AUTH_SECRET;

if (!secret || secret.length < 32) {
  throw new Error("BETTER_AUTH_SECRET must be set and at least 32 characters.");
}

const google = readOAuthCredentials("GOOGLE");
const github = readOAuthCredentials("GITHUB");
const enabledSocialProviders: OAuthProvider[] = [];

if (google) enabledSocialProviders.push("google");
if (github) enabledSocialProviders.push("github");

const trustedOrigins = new Set([parsedBaseURL.origin]);

for (const origin of process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",") ?? []) {
  const trimmedOrigin = origin.trim();

  if (trimmedOrigin) {
    trustedOrigins.add(parseOrigin(trimmedOrigin));
  }
}

export const authSettings = {
  baseURL: parsedBaseURL.origin,
  secret,
  trustedOrigins: [...trustedOrigins],
  enabledSocialProviders,
  socialProviders: {
    ...(google ? { google } : {}),
    ...(github ? { github } : {}),
  },
};
