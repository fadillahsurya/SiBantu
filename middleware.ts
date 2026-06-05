import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { UserRole } from "@/lib/types";

const authPaths = ["/login", "/register"];
const publicPaths = ["/"];
const userPaths = ["/dashboard", "/orders", "/history", "/profile"];

function startsWithAny(pathname: string, prefixes: string[]) {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function homeForRole(role: UserRole) {
  if (role === "admin") return "/admin";
  if (role === "worker") return "/worker/dashboard";
  return "/dashboard";
}

function isAllowed(pathname: string, role: UserRole) {
  if (role === "admin") return pathname.startsWith("/admin");
  if (role === "worker") return pathname.startsWith("/worker");
  return startsWithAny(pathname, userPaths);
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const isPublic = publicPaths.includes(pathname) || startsWithAny(pathname, authPaths);
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    if (isPublic) return response;
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "Sesi berakhir. Silakan login kembali.");
    return NextResponse.redirect(loginUrl);
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role, status")
    .eq("id", auth.user.id)
    .single();

  if (!profile) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "Profile akun belum tersedia. Silakan login ulang.");
    await supabase.auth.signOut();
    return NextResponse.redirect(loginUrl);
  }

  if (profile.status === "suspended") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "Akun ini sedang disuspend oleh admin.");
    await supabase.auth.signOut();
    return NextResponse.redirect(loginUrl);
  }

  const role = profile.role as UserRole;

  if (startsWithAny(pathname, authPaths)) {
    return NextResponse.redirect(new URL(homeForRole(role), request.url));
  }

  if (!isPublic && !isAllowed(pathname, role)) {
    return NextResponse.redirect(new URL(homeForRole(role), request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
