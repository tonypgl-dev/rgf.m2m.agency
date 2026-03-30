import { redirect } from "next/navigation";

// DEV MODE — auto-login as test tourist. Restore original page when needed.
export default function LoginPage() {
  redirect("/auto-login?role=tourist");
}
