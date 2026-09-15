import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

export function ContactForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // TODO: connecter l'envoi réel (Lovable Cloud) pour recevoir les messages
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    (e.target as HTMLFormElement).reset();
    toast.success("Message envoyé ! Je vous répondrai très vite.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nom</Label>
          <Input id="name" name="name" required placeholder="Votre nom" className="bg-background/60" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" required placeholder="vous@exemple.fr" className="bg-background/60" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">Sujet</Label>
        <Input id="subject" name="subject" required placeholder="Dédicace, interview, librairie…" className="bg-background/60" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required rows={6} placeholder="Votre message…" className="bg-background/60" />
      </div>
      <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto">
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
        Envoyer le message
      </Button>
    </form>
  );
}
