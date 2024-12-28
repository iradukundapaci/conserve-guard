"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";

import { logger } from "@/lib/default-logger";
import { useUser } from "@/hooks/use-user";

export interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({
  children,
}: AuthGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const [isChecking, setIsChecking] = React.useState<boolean>(true);

  const isTokenExpired = (): boolean => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return true;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (e) {
      logger.error("[AuthGuard]: Error decoding token", e);
      return true;
    }
  };

  const checkPermissions = React.useCallback(async (): Promise<void> => {
    if (isLoading) {
      return;
    }

    if (error || isTokenExpired()) {
      logger.debug(
        "[AuthGuard]: Token is expired or invalid, redirecting to sign in",
      );
      router.replace("/auth/signin");
      return;
    }

    if (!user) {
      logger.debug(
        "[AuthGuard]: User is not logged in, redirecting to sign in",
      );
      router.replace("/auth/signin");
      return;
    }

    setIsChecking(false);
  }, [user, error, isLoading, router]);

  React.useEffect(() => {
    checkPermissions().catch((e) =>
      logger.error("[AuthGuard]: Error in checkPermissions", e),
    );
  }, [checkPermissions]);

  if (isChecking) {
    return null;
  }

  if (error) {
    return (
      <Alert severity="error">
        {error.message || "An error occurred while authenticating."}
      </Alert>
    );
  }

  return <React.Fragment>{children}</React.Fragment>;
}
