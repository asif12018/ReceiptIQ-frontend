import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";
import { authClient } from "@/lib/auth-client";
import Sidebar from "@/components/shared/Sidebar";
import FinancialOnboardingModal from "@/components/features/FinancialOnboardingModal";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session) {
    redirect("/login");
  }

  const user = session.user as any;

  // Check cookie set by the modal after a successful profile save.
  // This is the fallback until the backend exposes occupation/monthlyIncome
  // in better-auth's additionalFields.
  const cookieStore = await cookies();
  const profileComplete = cookieStore.get("profile_complete")?.value === "1";

  const needsOnboarding = !profileComplete && (!user.occupation || !user.monthlyIncome);
  if (needsOnboarding) {
     return <FinancialOnboardingModal user={user} />;
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-50 overflow-hidden">
      <Sidebar role={user.role} />
      <main className="flex-1 overflow-y-auto relative">{children}</main>
    </div>
  );
}
