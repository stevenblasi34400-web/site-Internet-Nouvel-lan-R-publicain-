import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { login } from "@/backend/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_admin/admin/login")({
  component: LoginPage,
});

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ data: { email, code } });
      toast.success("Connexion réussie. Bienvenue.");
      void navigate({ to: "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Échec de la connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Retour au site
        </Link>

        <div className="rounded-2xl border bg-card p-8 shadow-xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border bg-background">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold">Console administrateur</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Connectez-vous pour gérer le contenu de votre site.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="vous@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="code"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Votre code d'accès"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connexion…
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
