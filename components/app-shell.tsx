import Link from "next/link";
import { ReactNode } from "react";
import { Home, ClipboardList, History, User, Users, BriefcaseBusiness, Settings, Sparkles } from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

const nav = {
  user: [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/orders", label: "Order", icon: ClipboardList },
    { href: "/history", label: "Riwayat", icon: History },
    { href: "/profile", label: "Profile", icon: User },
  ],
  worker: [
    { href: "/worker/dashboard", label: "Dashboard", icon: Home },
    { href: "/worker/jobs", label: "Job", icon: BriefcaseBusiness },
    { href: "/worker/history", label: "Riwayat", icon: History },
    { href: "/worker/profile", label: "Profile", icon: User },
  ],
  admin: [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/workers", label: "Worker", icon: BriefcaseBusiness },
    { href: "/admin/users", label: "User", icon: Users },
    { href: "/admin/orders", label: "Order", icon: ClipboardList },
    { href: "/admin/services", label: "Layanan", icon: Settings },
  ],
};

export function AppShell({ children, role, title }: { children: ReactNode; role: keyof typeof nav; title: string }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ecfdf5,transparent_34rem),linear-gradient(180deg,#fafafa,#f4f4f5)]">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-zinc-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-xl lg:block">
        <Link href="/" className="flex items-center gap-3 text-xl font-black text-zinc-950">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-zinc-950 text-white">
            <Sparkles className="h-5 w-5" />
          </span>
          Yanto Siap
        </Link>
        <nav className="mt-8 space-y-1">
          {nav[role].map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold text-zinc-600 transition hover:bg-emerald-50 hover:text-emerald-700">
              <item.icon className="h-4 w-4" /> {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-white/85 px-4 py-3 shadow-sm backdrop-blur-xl lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Yanto Siap</p>
              <h1 className="text-xl font-black text-zinc-950 sm:text-2xl">{title}</h1>
            </div>
            <form action={signOut}><Button variant="secondary">Logout</Button></form>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto lg:hidden">
            {nav[role].map((item) => (
              <Link key={item.href} href={item.href} className="flex shrink-0 items-center gap-2 rounded-lg bg-zinc-100 px-3 py-2 text-sm font-bold text-zinc-700 transition hover:bg-emerald-50 hover:text-emerald-700">
                <item.icon className="h-4 w-4" /> {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
