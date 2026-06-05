"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AccountStatus } from "@/lib/types";

export async function setUserStatus(userId: string, status: AccountStatus) {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user || auth.user.id === userId) return;

  const { data: targetUser } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();

  if (targetUser?.role === "admin") return;

  await supabase.from("users").update({ status }).eq("id", userId);

  if (targetUser?.role === "worker") {
    await supabase
      .from("worker_profiles")
      .update({
        status: status === "active" ? "active" : "suspended",
        is_online: status === "active",
      })
      .eq("user_id", userId);
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin/workers");
}
