"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { UserRole } from "@/lib/types";

function authMessage(message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes("invalid login credentials")) return "Email atau password salah.";
  if (normalized.includes("email not confirmed")) return "Email belum dikonfirmasi. Silakan cek inbox kamu.";
  if (normalized.includes("email signups are disabled")) return "Registrasi email sedang dimatikan di Supabase. Aktifkan Email provider dan matikan hanya Confirm email.";
  if (normalized.includes("already registered") || normalized.includes("already been registered")) return "Email sudah terdaftar. Silakan login.";
  if (normalized.includes("password")) return "Password minimal 6 karakter dan jangan terlalu mudah ditebak.";
  return message || "Terjadi kesalahan. Coba lagi sebentar.";
}

function roleHome(role?: UserRole | null) {
  if (role === "admin") return "/admin";
  if (role === "worker") return "/worker/dashboard";
  return "/dashboard";
}

export async function signIn(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/login?error=Email%20dan%20password%20wajib%20diisi");
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(`/login?error=${encodeURIComponent(authMessage(error.message))}`);

  let { data: profile } = await supabase
    .from("users")
    .select("role, status")
    .eq("id", data.user.id)
    .single();

  if (!profile) {
    const metadata = data.user.user_metadata;
    const role = metadata.role === "worker" ? "worker" : "user";
    await supabase.from("users").upsert({
      id: data.user.id,
      full_name: String(metadata.full_name ?? data.user.email?.split("@")[0] ?? "User"),
      email: data.user.email ?? email,
      phone: String(metadata.phone ?? "-"),
      role,
      status: "active",
    });

    if (role === "worker") {
      await supabase.from("worker_profiles").upsert({ user_id: data.user.id }, { onConflict: "user_id" });
    }

    const response = await supabase.from("users").select("role, status").eq("id", data.user.id).single();
    profile = response.data;
  }

  if (profile?.status === "suspended") {
    await supabase.auth.signOut();
    redirect("/login?error=Akun%20ini%20sedang%20disuspend%20oleh%20admin");
  }

  redirect(roleHome(profile?.role));
}

export async function signUp(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const roleInput = String(formData.get("role") ?? "");
  const role = roleInput === "worker" ? "worker" : "user";
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const registerPath = role === "worker" ? "/register/worker" : "/register/user";

  if (!fullName || !email || !phone || !password) {
    redirect(`${registerPath}?error=Semua%20field%20wajib%20diisi`);
  }

  if (password.length < 6) {
    redirect(`${registerPath}?error=Password%20minimal%206%20karakter`);
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, phone, role } },
  });

  if (error || !data.user) {
    redirect(`${registerPath}?error=${encodeURIComponent(authMessage(error?.message ?? "Registrasi gagal"))}`);
  }

  if (data.session) {
    await supabase.from("users").upsert({
      id: data.user.id,
      full_name: fullName,
      email,
      phone,
      role,
      status: "active",
    });

    if (role === "worker") {
      await supabase.from("worker_profiles").upsert({ user_id: data.user.id }, { onConflict: "user_id" });
    }

    redirect(roleHome(role));
  }

  redirect(`/login?message=${encodeURIComponent("Registrasi berhasil. Silakan cek email jika konfirmasi diperlukan, lalu login.")}`);
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
