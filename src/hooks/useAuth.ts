import { trpc } from "@/providers/trpc";
import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { LOGIN_PATH } from "@/const";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

// Unified user shape for both auth systems
export type AuthUser = {
  id: number;
  name: string | null;
  email: string | null;
  avatar: string | null;
  role: "user" | "admin";
  points: number;
  createdAt: Date;
  unionId?: string;
  username?: string;
  authType: "oauth" | "local";
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = LOGIN_PATH } =
    options ?? {};

  const navigate = useNavigate();
  const utils = trpc.useUtils();

  // Query OAuth user
  const {
    data: oauthUser,
    isLoading: oauthLoading,
  } = trpc.auth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  // Query local auth user
  const {
    data: localUser,
    isLoading: localLoading,
  } = trpc.localAuth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
  });

  // Unified user: prefer OAuth, fallback to local
  const user: AuthUser | null = useMemo(() => {
    if (oauthUser) {
      return {
        ...oauthUser,
        name: oauthUser.name || "用户",
        authType: "oauth" as const,
      };
    }
    if (localUser) {
      return {
        ...localUser,
        name: localUser.name || localUser.username || "用户",
        authType: "local" as const,
      };
    }
    return null;
  }, [oauthUser, localUser]);

  const isLoading = oauthLoading || localLoading;

  const logout = useCallback(() => {
    // Always clear local auth token
    localStorage.removeItem("local_auth_token");
    // Always call OAuth logout (it's a no-op if not OAuth)
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        window.location.href = "/";
      },
    });
  }, [logoutMutation]);

  useEffect(() => {
    if (redirectOnUnauthenticated && !isLoading && !user) {
      const currentPath = window.location.pathname;
      if (currentPath !== redirectPath) {
        navigate(redirectPath);
      }
    }
  }, [redirectOnUnauthenticated, isLoading, user, navigate, redirectPath]);

  return useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading: isLoading || logoutMutation.isPending,
      logout,
      refresh: () => {
        utils.auth.me.invalidate();
        utils.localAuth.me.invalidate();
      },
    }),
    [user, isLoading, logoutMutation.isPending, logout, utils],
  );
}
