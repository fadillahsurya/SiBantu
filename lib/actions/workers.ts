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
  await supabase.from("worker_profiles").update({ status }).eq("id", workerId);
  revalidatePath("/admin/workers");
}
