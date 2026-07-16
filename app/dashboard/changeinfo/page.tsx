import { getMyProfile } from "@/actions/account";
import { ProfileForm } from "@/components/profile-form";
import { PageMotion, Reveal } from "@/components/motion-primitives";

export const dynamic = "force-dynamic";
export default async function ChangeInfoPage() { return <PageMotion><Reveal><ProfileForm profile={await getMyProfile()} /></Reveal></PageMotion>; }
