"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function createService(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  await supabase.from("services").insert({
    name: String(formData.get("name")),
    description: String(formData.get("description") ?? ""),
    is_active: formData.get("is_active") === "on",
  });
  revalidatePath("/admin/services");
}

export async function toggleService(serviceId: string, isActive: boolean) {
  const supabase = await createSupabaseServerClient();
  await supabase.from("services").update({ is_active: isActive }).eq("id", serviceId);
  revalidatePath("/admin/services");
}
