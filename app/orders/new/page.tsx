import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/field";
import { createOrder } from "@/lib/actions/orders";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Service } from "@/lib/types";

export default async function NewOrderPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("services")
    .select("id, name, description, is_active")
    .eq("is_active", true)
    .order("name", { ascending: true });

  const services = (data ?? []) as Service[];

  return (
    <AppShell role="user" title="Buat Order">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <Card>
          <CardHeader><h2 className="text-lg font-bold">Detail Pekerjaan</h2></CardHeader>
          <CardContent>
            <form action={createOrder} className="grid gap-4">
              <div><Label>Layanan</Label><Select name="service_id" required>{services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}</Select></div>
              <div><Label>Alamat</Label><Input name="address" required placeholder="Jl. Melati No. 21, Jakarta" /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>Latitude</Label><Input name="latitude" type="number" step="any" defaultValue="-6.180" required /></div>
                <div><Label>Longitude</Label><Input name="longitude" type="number" step="any" defaultValue="106.830" required /></div>
              </div>
              <div><Label>Catatan</Label><Textarea name="notes" placeholder="Tuliskan instruksi ringkas untuk worker." /></div>
              <Button disabled={services.length === 0}>Buat Order & Cari Worker</Button>
            </form>
          </CardContent>
        </Card>
        <div className="min-h-80 rounded-lg border border-zinc-200 bg-[linear-gradient(135deg,#ecfdf5_25%,#f4f4f5_25%,#f4f4f5_50%,#ecfdf5_50%,#ecfdf5_75%,#f4f4f5_75%)] bg-[length:32px_32px] p-5">
          <div className="rounded-md bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-zinc-950">Map Placeholder</p>
            <p className="mt-1 text-sm text-zinc-500">Integrasikan peta production di sini. MVP mengirim koordinat latitude/longitude ke Supabase.</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
