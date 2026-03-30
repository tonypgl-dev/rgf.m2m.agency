import { redirect } from "next/navigation";

// DEV MODE — auto-login as test tourist. Restore original page when needed.
export default function RegisterPage() {
  redirect("/auto-login?role=tourist");
}
