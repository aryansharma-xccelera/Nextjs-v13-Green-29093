"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/stores/auth-store";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "authenticated">("checking");

  useEffect(() => {
    if (getCurrentUser()) {
      setStatus("authenticated");
    } else {
      router.replace("/login");
    }
  }, [router]);

  if (status === "checking") {
    return <LoadingSpinner label="Checking session..." />;
  }

  return <>{children}</>;
}
