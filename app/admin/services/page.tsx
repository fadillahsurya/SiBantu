import { Plus, Power } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/field";
import { createService, toggleService } from "@/lib/actions/services";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Service } from "@/lib/types";

export default async function AdminServicesPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("services")
    .select("id, name, description, is_active")
    .order("name", { ascending: true });

  const services = (data ?? []) as Service[];

  return (
    <AppShell role="admin" title="Data Layanan">
      <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-black text-zinc-950">Tambah Layanan</h2>
            <p className="mt-1 text-sm text-zinc-500">Layanan aktif akan muncul saat user membuat order.</p>
          </CardHeader>
          <CardContent>
            <form action={createService} className="grid gap-4">
              <div><Label>Nama</Label><Input name="name" required /></div>
              <div><Label>Deskripsi</Label><Textarea name="description" /></div>
              <label className="flex items-center gap-3 rounded-lg bg-zinc-50 p-3 text-sm font-semibold text-zinc-700">
                <input name="is_active" type="checkbox" defaultChecked className="h-4 w-4 accent-emerald-600" />
                Aktif
              </label>
              <Button><Plus className="h-4 w-4" /> Simpan</Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-3">
          {services.map((service) => (
            <div key={service.id} className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-black text-zinc-950">{service.name}</h3>
                  <span className={service.is_active ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200" : "rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-600 ring-1 ring-zinc-200"}>
                    {service.is_active ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-500">{service.description}</p>
              </div>
              <form action={async () => { "use server"; await toggleService(service.id, !service.is_active); }}>
                <Button className="w-full sm:w-auto" variant="secondary">
                  <Power className="h-4 w-4" />
                  {service.is_active ? "Nonaktifkan" : "Aktifkan"}
                </Button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
