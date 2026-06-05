import Link from "next/link";
import { signUp } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/field";

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-zinc-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold text-zinc-950">Register</h1>
          <p className="mt-1 text-sm text-zinc-500">Buat akun untuk pesan bantuan atau menerima pekerjaan.</p>
        </CardHeader>
        <CardContent>
          <form action={signUp} className="space-y-4">
            <div><Label>Nama Lengkap</Label><Input name="full_name" required /></div>
            <div><Label>Email</Label><Input name="email" type="email" required /></div>
            <div><Label>No. HP</Label><Input name="phone" required /></div>
            <div><Label>Role</Label><Select name="role" required><option value="user">User</option><option value="worker">Worker</option></Select></div>
            <div><Label>Password</Label><Input name="password" type="password" required minLength={6} /></div>
            <Button className="w-full">Buat Akun</Button>
          </form>
          <p className="mt-5 text-center text-sm text-zinc-500">Sudah punya akun? <Link className="font-semibold text-emerald-700" href="/login">Login</Link></p>
        </CardContent>
      </Card>
    </main>
  );
}
