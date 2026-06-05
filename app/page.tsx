import { ArrowRight, MapPin, WalletCards, Zap } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { services } from "@/lib/data/mock";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50">
      <section className="bg-emerald-700 text-white">
        <div className="mx-auto grid min-h-[92vh] max-w-7xl content-center gap-10 px-4 py-12 md:grid-cols-[1.1fr_0.9fr] md:px-8">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-100">Bantuan rumah tangga terdekat</p>
            <h1 className="mt-5 max-w-3xl text-5xl font-black leading-tight md:text-7xl">Yanto Siap</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-emerald-50">
              Pesan worker terdekat untuk perbaikan ringan, bersih-bersih, setrika, siram tanaman, dan pekerjaan rumah harian. Status order berjalan realtime, pembayaran tetap tunai.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/register" variant="secondary">Mulai Pesan <ArrowRight className="h-4 w-4" /></ButtonLink>
              <ButtonLink href="/login" className="bg-zinc-950 text-white hover:bg-zinc-800">Login Worker</ButtonLink>
            </div>
          </div>
          <div className="grid content-center gap-4">
            <div className="rounded-lg bg-white p-5 text-zinc-950 shadow-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-emerald-700">Order Aktif</p>
                  <h2 className="mt-1 text-2xl font-bold">Perbaikan Genteng</h2>
                </div>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">Menuju Lokasi</span>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-md bg-zinc-50 p-4"><Zap className="h-5 w-5 text-emerald-600" /><p className="mt-3 text-sm font-semibold">Dispatch cepat</p></div>
                <div className="rounded-md bg-zinc-50 p-4"><MapPin className="h-5 w-5 text-emerald-600" /><p className="mt-3 text-sm font-semibold">Worker terdekat</p></div>
                <div className="rounded-md bg-zinc-50 p-4"><WalletCards className="h-5 w-5 text-emerald-600" /><p className="mt-3 text-sm font-semibold">Bayar tunai</p></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {services.slice(0, 4).map((service) => (
                <div key={service.id} className="rounded-lg bg-emerald-800/70 p-4 text-sm font-semibold text-white ring-1 ring-white/20">
                  {service.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
