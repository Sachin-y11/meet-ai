import { authSettings } from "@/lib/auth-settings";
import SignUpView from "@/modules/auth/ui/views/sign-up-view";

export default function page() {
  return <SignUpView providers={authSettings.enabledSocialProviders} />;
}
