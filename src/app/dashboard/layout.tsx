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

  // Fetch the real user profile from the backend to check if onboarding is needed.
  // We cannot rely on Better-Auth's session object because it doesn't expose
  // custom fields like occupation/monthlyIncome.
  let needsOnboarding = true;
  try {
    const profileRes = await fetch(
      `https://receiptiq-backend.onrender.com/api/v1/users/me`,
      {
        headers: {
          // Forward the cookie header so the backend can authenticate the request
          cookie: reqHeaders.get("cookie") ?? "",
        },
        cache: "no-store",
      }
    );

    if (profileRes.ok) {
      const profileData = await profileRes.json();
      const profile = profileData?.data ?? profileData;
      // If the user already has both occupation and a monthlyIncome set, skip onboarding
      needsOnboarding = !profile?.occupation || !profile?.monthlyIncome;
    }
  } catch {
    // If the backend is unreachable, fall through and show the modal as a safe default
    needsOnboarding = true;
  }

  if (needsOnboarding) {
    return <FinancialOnboardingModal user={user} />;
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <div className="fixed inset-y-0 left-0 w-64 z-40 hidden md:block">
        <Sidebar role={user.role} />
      </div>
      <main className="flex-1 md:ml-64 relative min-h-screen">{children}</main>
    </div>
  );
}
