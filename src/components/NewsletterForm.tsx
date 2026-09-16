import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Veuillez saisir une adresse e-mail valide.");
      return;
    }
    setLoading(true);
    // TODO: connecter un service d'envoi pour stocker les inscrits
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setEmail("");
    toast.success("Merci ! Vous êtes bien inscrit·e à la newsletter.");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={compact ? "flex gap-2" : "mx-auto flex max-w-md gap-2"}
    >
      <Input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Votre adresse e-mail"
        aria-label="Adresse e-mail"
        className="bg-background/60"
      />
      <Button type="submit" disabled={loading} aria-label="S'inscrire à la newsletter">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {!compact && <span className="ml-2">S'inscrire</span>}
      </Button>
    </form>
  );
}
