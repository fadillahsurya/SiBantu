"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function toggleWorkerOnline(isOnline: boolean) {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return;

  await supabase
    .from("worker_profiles")
    .update({ is_online: isOnline })
    .eq("user_id", auth.user.id);

  revalidatePath("/worker/dashboard");
}

export async function setWorkerStatus(workerId: string, status: "active" | "inactive" | "suspended") {
  const supabase = await createSupabaseServerClient();
  await supabase
    .from("worker_profiles")
    .update({
      status,
      is_online: status === "active",
    })
    .eq("id", workerId);

  const { data: worker } = await supabase
    .from("worker_profiles")
    .select("user_id")
    .eq("id", workerId)
    .single();

  if (worker?.user_id) {
    await supabase
      .from("users")
      .update({ status: status === "suspended" ? "suspended" : "active" })
      .eq("id", worker.user_id);
  }

  revalidatePath("/admin/workers");
  revalidatePath("/admin/users");
}
