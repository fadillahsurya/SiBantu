import Link from "next/link";
import { AuthAlert } from "@/components/auth-alert";
import { AuthSubmitButton } from "@/components/auth-submit-button";
import { PasswordField } from "@/components/password-field";
import { signIn } from "@/lib/actions/auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/field";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,#ecfdf5,transparent_28rem),#fafafa] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Yanto Siap</p>
          <h1 className="mt-2 text-2xl font-black text-zinc-950">Login</h1>
          <p className="mt-1 text-sm leading-6 text-zinc-500">Masuk sebagai user, worker, atau admin. Kamu akan diarahkan sesuai role akun.</p>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <AuthAlert error={params.error} message={params.message} />
          </div>
          <form action={signIn} className="space-y-4">
            <div><Label>Email</Label><Input name="email" type="email" required placeholder="nama@email.com" /></div>
            <PasswordField />
            <AuthSubmitButton>Login</AuthSubmitButton>
          </form>
          <p className="mt-5 text-center text-sm text-zinc-500">
            Belum punya akun? <Link className="font-bold text-emerald-700" href="/register">Register</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
