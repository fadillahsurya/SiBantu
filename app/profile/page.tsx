import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";

export default function ProfilePage() {
  return <AppShell role="user" title="Profile"><Card><CardContent><h2 className="text-lg font-bold">Rani Pratama</h2><p className="mt-2 text-sm text-zinc-500">Role: User</p><p className="text-sm text-zinc-500">rani@yantosiap.test</p></CardContent></Card></AppShell>;
}
