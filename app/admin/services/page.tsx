import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/field";
import { createService, toggleService } from "@/lib/actions/services";
import { services } from "@/lib/data/mock";

export default function AdminServicesPage() {
  return (
    <AppShell role="admin" title="Data Layanan">
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1fr]">
        <Card><CardHeader><h2 className="font-bold">Tambah Layanan</h2></CardHeader><CardContent><form action={createService} className="grid gap-4"><div><Label>Nama</Label><Input name="name" required /></div><div><Label>Deskripsi</Label><Textarea name="description" /></div><label className="flex items-center gap-2 text-sm"><input name="is_active" type="checkbox" defaultChecked /> Aktif</label><Button>Simpan</Button></form></CardContent></Card>
        <div className="grid gap-3">{services.map((service) => <div key={service.id} className="flex items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-white p-4"><div><h3 className="font-semibold">{service.name}</h3><p className="text-sm text-zinc-500">{service.description}</p></div><form action={async () => { "use server"; await toggleService(service.id, !service.is_active); }}><Button variant="secondary">{service.is_active ? "Nonaktifkan" : "Aktifkan"}</Button></form></div>)}</div>
      </div>
    </AppShell>
  );
}
