import { redirect } from "next/navigation";

export default function MyResumesRedirectPage() {
  redirect("/dashboard/resumes");
}
