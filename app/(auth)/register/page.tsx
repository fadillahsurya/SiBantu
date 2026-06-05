import { BriefcaseBusiness, UserRound } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function RegisterRolePage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,#ecfdf5,transparent_28rem),#fafafa] px-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Yanto Siap</p>
          <h1 className="mt-2 text-2xl font-black text-zinc-950">Pilih tipe akun</h1>
          <p className="mt-1 text-sm leading-6 text-zinc-500">Admin tidak bisa dibuat dari halaman publik. Pilih user atau worker untuk onboarding demo.</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
              <UserRound className="h-7 w-7 text-emerald-700" />
              <h2 className="mt-4 text-lg font-black text-zinc-950">User</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-500">Buat order dan pantau status pekerjaan secara realtime.</p>
              <ButtonLink className="mt-5 w-full" href="/register/user">Daftar User</ButtonLink>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
              <BriefcaseBusiness className="h-7 w-7 text-emerald-700" />
              <h2 className="mt-4 text-lg font-black text-zinc-950">Worker</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-500">Aktifkan status online dan terima job dari lokasi terdekat.</p>
              <ButtonLink className="mt-5 w-full" href="/register/worker">Daftar Worker</ButtonLink>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
