import {
  createFileRoute,
  Outlet,
  Link,
  redirect,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { me, logout } from "@/backend/admin.functions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_admin")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin/login") return;
  },
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { to: "/admin/articles", label: "Articles", icon: Newspaper },
  { to: "/admin/livres", label: "Livres", icon: BookOpen },
  { to: "/admin/pages", label: "Pages", icon: FileText },
  { to: "/admin/accueil", label: "Page d'accueil", icon: Home },
  { to: "/admin/reglages", label: "Réglages", icon: Settings },
] as const;

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const router = useRouter();
  const isLogin = pathname === "/admin/login";

  const session = useQuery({
    queryKey: ["admin-me"],
    queryFn: () => me(),
    staleTime: 30_000,
  });

  useEffect(() => {
    if (isLogin) return;
    if (session.isSuccess && !session.data.isAuthenticated) {
      void router.navigate({ to: "/admin/login" });
    }
  }, [session.data, session.isSuccess, isLogin, router]);

  if (isLogin) {
    return <Outlet />;
  }

  if (session.isLoading || !session.data?.isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <ShieldCheck className="h-8 w-8 animate-pulse text-primary" />
          <p className="text-sm">Vérification de la session…</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    await session.refetch();
    void router.navigate({ to: "/admin/login" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <aside className="flex shrink-0 flex-col border-b bg-card/40 md:w-64 md:border-b-0 md:border-r">
        <div className="flex items-center gap-2 px-5 py-5">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <span className="font-display text-lg font-bold">Console admin</span>
        </div>
        <nav className="flex-1 px-3 pb-4" aria-label="Navigation admin">
          <ul className="flex flex-row gap-1 md:flex-col">
            {NAV.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <li key={item.to} className="md:list-none">
                  <Link
                    to={item.to}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                    style={
                      active
                        ? {
                            backgroundColor: "var(--color-primary)",
                            color: "var(--color-primary-foreground)",
                          }
                        : { color: "var(--color-muted-foreground)" }
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="hidden md:inline">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="hidden border-t p-3 md:block">
          <Button asChild variant="ghost" size="sm" className="w-full justify-start">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" /> Voir le site
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="mt-1 w-full justify-start text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" /> Déconnexion
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden">
        <div className="container-site py-8 md:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
