import Link from "next/link";
import { signIn } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/field";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-zinc-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold text-zinc-950">Login Yanto Siap</h1>
          <p className="mt-1 text-sm text-zinc-500">Masuk sebagai user, worker, atau admin.</p>
        </CardHeader>
        <CardContent>
          <form action={signIn} className="space-y-4">
            <div><Label>Email</Label><Input name="email" type="email" required placeholder="nama@email.com" /></div>
            <div><Label>Password</Label><Input name="password" type="password" required placeholder="••••••••" /></div>
            <Button className="w-full">Login</Button>
          </form>
          <p className="mt-5 text-center text-sm text-zinc-500">Belum punya akun? <Link className="font-semibold text-emerald-700" href="/register">Register</Link></p>
        </CardContent>
      </Card>
    </main>
  );
}
