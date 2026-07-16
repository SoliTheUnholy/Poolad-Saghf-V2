import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { getMyProfile } from "@/actions/account";
import { ProfileForm } from "@/components/profile-form";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";
export default async function RegistrationInfoPage() {
  if (!(await getServerSession(authOptions))) redirect("/home/login");
  return (
    <div className="section-shell py-10">
      <ProfileForm profile={await getMyProfile()} onboarding />
    </div>
  );
}
