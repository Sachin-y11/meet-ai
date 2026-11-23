import { authSettings } from "@/lib/auth-settings";
import SignInView from "@/modules/auth/ui/views/sign-in-view";

export default function page() {
  return <SignInView providers={authSettings.enabledSocialProviders} />;
}
