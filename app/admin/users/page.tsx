import { ShieldCheck, ShieldOff, UserRoundCheck } from "lucide-react";
import { AccountStatusBadge } from "@/components/account-status-badge";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { setUserStatus } from "@/lib/actions/users";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AccountStatus, UserRole } from "@/lib/types";

type AdminUser = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: AccountStatus;
  created_at: string;
};

function roleLabel(role: UserRole) {
  if (role === "admin") return "Admin";
  if (role === "worker") return "Worker";
  return "User";
}

function UserActions({ user }: { user: AdminUser }) {
  if (user.role === "admin") {
    return <span className="text-xs font-semibold text-zinc-400">Dilindungi</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <form action={async () => { "use server"; await setUserStatus(user.id, "active"); }}>
        <Button className="h-9 px-3" variant="secondary" disabled={user.status === "active"}>
          <ShieldCheck className="h-4 w-4" />
          Aktifkan
        </Button>
      </form>
      <form action={async () => { "use server"; await setUserStatus(user.id, "suspended"); }}>
        <Button className="h-9 px-3" variant="danger" disabled={user.status === "suspended"}>
          <ShieldOff className="h-4 w-4" />
          Suspend
        </Button>
      </form>
    </div>
  );
}

export default async function AdminUsersPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("users")
    .select("id, full_name, email, phone, role, status, created_at")
    .order("created_at", { ascending: false });

  const users = (data ?? []) as AdminUser[];
  const activeUsers = users.filter((user) => user.status === "active").length;
  const suspendedUsers = users.filter((user) => user.status === "suspended").length;

  return (
    <AppShell role="admin" title="Data User">
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">Total Akun</p>
          <p className="mt-2 text-3xl font-black text-zinc-950">{users.length}</p>
        </div>
        <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
          <p className="text-sm font-medium text-emerald-700">Aktif</p>
          <p className="mt-2 text-3xl font-black text-emerald-900">{activeUsers}</p>
        </div>
        <div className="rounded-lg border border-rose-100 bg-rose-50 p-4">
          <p className="text-sm font-medium text-rose-700">Suspended</p>
          <p className="mt-2 text-3xl font-black text-rose-900">{suspendedUsers}</p>
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm lg:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="p-4">Nama</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th className="pr-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-zinc-100 align-middle">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-zinc-950 text-white">
                      <UserRoundCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-zinc-950">{user.full_name}</p>
                      <p className="text-xs text-zinc-500">Bergabung {new Date(user.created_at).toLocaleDateString("id-ID")}</p>
                    </div>
                  </div>
                </td>
                <td className="text-zinc-600">{user.email}</td>
                <td className="text-zinc-600">{user.phone}</td>
                <td className="font-semibold text-zinc-700">{roleLabel(user.role)}</td>
                <td><AccountStatusBadge status={user.status} /></td>
                <td className="pr-4"><UserActions user={user} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 lg:hidden">
        {users.map((user) => (
          <div key={user.id} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-zinc-950">{user.full_name}</p>
                <p className="mt-1 break-all text-sm text-zinc-500">{user.email}</p>
                <p className="text-sm text-zinc-500">{user.phone}</p>
              </div>
              <AccountStatusBadge status={user.status} />
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-700">{roleLabel(user.role)}</span>
              <UserActions user={user} />
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
