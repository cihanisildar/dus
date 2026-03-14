"use server"

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { userQueries } from "@/lib/db/queries/users";
import type { User } from "@/lib/db/schema";

/**
 * Get the current authenticated user from Supabase Auth.
 * This function handles redirect to login if user is not authenticated.
 * Use this instead of calling supabase.auth.getUser() directly in pages.
 */
export async function getCurrentAuthUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return user;
}

/**
 * Get current user and require them to be active.
 * Redirects to payment if not active, or login if not authenticated.
 * Use this in pages that require premium/active status.
 */
export async function requireActiveUser(): Promise<User> {
  const authUser = await getCurrentAuthUser();
  
  const user = await userQueries.getById(authUser.id);
  
  if (!user) {
    redirect("/login");
  }

  if (user.accountStatus !== "active") {
    redirect("/dashboard/payment");
  }

  return user;
}
