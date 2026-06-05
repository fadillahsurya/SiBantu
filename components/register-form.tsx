import Link from "next/link";
import { AuthAlert } from "@/components/auth-alert";
import { AuthSubmitButton } from "@/components/auth-submit-button";
import { PasswordField } from "@/components/password-field";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/field";
import { signUp } from "@/lib/actions/auth";
import { UserRole } from "@/lib/types";

export function RegisterForm({
  role,
  error,
  message,
}: {
  role: Extract<UserRole, "user" | "worker">;
  error?: string;
  message?: string;
}) {
  const isWorker = role === "worker";

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,#ecfdf5,transparent_28rem),#fafafa] px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Yanto Siap</p>
          <h1 className="mt-2 text-2xl font-black text-zinc-950">
            {isWorker ? "Daftar sebagai Worker" : "Daftar sebagai User"}
          </h1>
          <p className="mt-1 text-sm leading-6 text-zinc-500">
            {isWorker
              ? "Terima pekerjaan rumah tangga ringan dari pengguna terdekat."
              : "Pesan bantuan pekerjaan rumah tangga ringan dengan proses sederhana."}
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <AuthAlert error={error} message={message} />
          </div>
          <form action={signUp} className="space-y-4">
            <input type="hidden" name="role" value={role} />
            <div><Label>Nama Lengkap</Label><Input name="full_name" required placeholder="Nama lengkap" /></div>
            <div><Label>Email</Label><Input name="email" type="email" required placeholder="nama@email.com" /></div>
            <div><Label>No. HP</Label><Input name="phone" required placeholder="08xxxxxxxxxx" /></div>
            <PasswordField />
            <AuthSubmitButton>Buat Akun</AuthSubmitButton>
          </form>
          <p className="mt-5 text-center text-sm text-zinc-500">
            Sudah punya akun? <Link className="font-bold text-emerald-700" href="/login">Login</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
