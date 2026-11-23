import { createAuthClient } from "better-auth/react";
import {
  emailOTPClient,
  jwtClient,
  twoFactorClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  fetchOptions: {
    onSuccess: (ctx) => {
      const authToken = ctx.response.headers.get("set-auth-token"); // get the token from the response headers
      // Store the token securely (e.g., in localStorage)
      if (authToken) {
        localStorage.setItem("bearer_token", authToken);
      }
    },
  },
  plugins: [twoFactorClient(), jwtClient(), emailOTPClient()],
});
export const { signIn, signUp, useSession } = authClient;
