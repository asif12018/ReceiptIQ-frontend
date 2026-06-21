import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { authClient } from "@/lib/auth-client";
import Sidebar from "@/components/shared/Sidebar";
import FinancialOnboardingModal from "@/components/features/FinancialOnboardingModal";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const reqHeaders = await headers();

  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: reqHeaders,
    },
  });

  if (!session) {
    redirect("/login");
  }

  const user = session.user as any;

  let needsOnboarding = true;

  // 1. Fast path: check if the client cookie is already set
  const cookiesStr = reqHeaders.get("cookie") || "";
  if (cookiesStr.includes("profile_complete=1")) {
    needsOnboarding = false;
  } 
  // 2. Fast path: if Better-Auth session includes them (due to additionalFields)
  else if (user.occupation && user.monthlyIncome) {
    needsOnboarding = false;
  } 
  // 3. Fallback: Fetch the real user profile from the backend
  else {
    try {
      const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
      const profileRes = await fetch(
        `${backendUrl}/api/v1/users/me`,
        {
          headers: {
            cookie: cookiesStr,
          },
          cache: "no-store",
        }
      );

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        const profile = profileData?.data ?? profileData;
        needsOnboarding = !profile?.occupation || !profile?.monthlyIncome;
      }
    } catch {
      needsOnboarding = true;
    }
  }

  if (needsOnboarding) {
    return <FinancialOnboardingModal user={user} />;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <Sidebar role={user.role} />
      <main className="flex-1 md:ml-64 relative min-h-screen pt-16 md:pt-0 pb-24 md:pb-0">{children}</main>
    </div>
  );
}
