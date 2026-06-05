import { AppShell } from "@/components/app-shell";
import { users } from "@/lib/data/mock";

export default function AdminUsersPage() {
  return (
    <AppShell role="admin" title="Data User">
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-zinc-50 text-zinc-500"><tr><th className="p-4">Nama</th><th>Email</th><th>Phone</th><th>Role</th></tr></thead>
          <tbody>{users.map((user) => <tr key={user.id} className="border-t border-zinc-100"><td className="p-4 font-semibold">{user.full_name}</td><td>{user.email}</td><td>{user.phone}</td><td className="capitalize">{user.role}</td></tr>)}</tbody>
        </table>
      </div>
    </AppShell>
  );
}
