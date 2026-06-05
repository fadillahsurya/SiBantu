"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { UserRole } from "@/lib/types";

export async function signIn(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);

  const { data: profile } = await supabase
    .from("users")
    .select("role, status")
    .eq("id", data.user.id)
    .single();

  if (profile?.status === "suspended") {
    await supabase.auth.signOut();
    redirect("/login?error=Akun%20ini%20sedang%20disuspend%20oleh%20admin");
  }

  if (profile?.role === "admin") redirect("/admin");
  if (profile?.role === "worker") redirect("/worker/dashboard");

  redirect("/dashboard");
}

export async function signUp(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const role = String(formData.get("role")) as UserRole;
  const fullName = String(formData.get("full_name"));
  const email = String(formData.get("email"));
  const phone = String(formData.get("phone"));
  const password = String(formData.get("password"));

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, phone, role } },
  });

  if (error || !data.user) {
    redirect(`/register?error=${encodeURIComponent(error?.message ?? "Registration failed")}`);
  }

  await supabase.from("users").insert({
    id: data.user.id,
    full_name: fullName,
    email,
    phone,
    role,
  });

  if (role === "worker") {
    await supabase.from("worker_profiles").insert({ user_id: data.user.id });
  }

  if (role === "worker") redirect("/worker/dashboard");

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
