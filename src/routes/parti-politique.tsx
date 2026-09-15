import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import partiImg from "@/assets/parti.jpg";

export const Route = createFileRoute("/parti-politique")({
  component: PartiLayout,
});

const TABS = [
  { to: "/parti-politique", label: "Le mouvement", exact: true },
  { to: "/parti-politique/programme", label: "Programme", exact: false },
  { to: "/parti-politique/rejoindre", label: "Nous rejoindre", exact: false },
] as const;

function PartiLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div>
      <section className="relative overflow-hidden border-b">
        <img
          src={partiImg}
          alt="Réunion publique du mouvement au crépuscule"
          width={1536}
          height={768}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.14 0.012 70 / 60%) 0%, var(--color-background) 100%)",
          }}
        />
        <div className="container-site relative pb-8 pt-20 md:pt-28">
          <p className="kicker">Engagement politique</p>
          <h1 className="heading-hero mt-3 max-w-3xl text-4xl md:text-6xl">
            Le <span className="text-primary italic">mouvement</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Des idées aux actes : un mouvement citoyen pour redonner sa force
            à la politique de proximité.
          </p>

          <nav className="mt-10 flex flex-wrap gap-2" aria-label="Section mouvement politique">
            {TABS.map((tab) => {
              const active = tab.exact ? pathname === tab.to : pathname.startsWith(tab.to);
              return (
                <Link
                  key={tab.to}
                  to={tab.to}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "bg-background/60 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </section>

      <Outlet />
    </div>
  );
}
