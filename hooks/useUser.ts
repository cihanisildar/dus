"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { getCurrentUser } from "@/lib/actions/user-actions";
import type { User } from "@supabase/supabase-js";

export function useUser() {
  const queryClient = useQueryClient();

  // Use TanStack Query to fetch user data via server action
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: async () => {
      return await getCurrentUser();
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: false,
  });

  // Minimal client-side subscription for real-time auth state changes
  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Invalidate and refetch user query when auth state changes
      queryClient.setQueryData(["user"], session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  return { user: user ?? null, loading: isLoading };
}
