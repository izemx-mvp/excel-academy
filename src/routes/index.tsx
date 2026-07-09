import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Lock, Mail, Sparkles, ArrowRight } from "lucide-react";
import { LOGO_URL } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { DEMO_CREDENTIALS } from "@/lib/mock-data";
import { authStore } from "@/lib/auth-store";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Connexion — Excel Academy" },
      { name: "description", content: "Portail interne Excel Academy Marrakech — Achieve Excellence." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.password);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("excel_auth")) {
      navigate({ to: "/dashboard" });
    }
  }, [navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const users = authStore.snapshot();
      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.actif);
      if (found && (password === DEMO_CREDENTIALS.password || email === DEMO_CREDENTIALS.email)) {
        localStorage.setItem("excel_auth", "1");
        authStore.setCurrent(found.email);
        toast.success(`Bienvenue ${found.nom}`);
        navigate({ to: "/dashboard" });
      } else {
        toast.error("Identifiants incorrects ou compte inactif");
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 brand-gradient-mesh" />
      <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-[color:var(--brand-accent)] blur-3xl opacity-30 -translate-y-1/3 translate-x-1/3 animate-float-slow" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-[color:var(--brand-cyan)] blur-3xl opacity-25 translate-y-1/3 -translate-x-1/3 animate-float-slow" style={{ animationDelay: "3s" }} />
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "42px 42px" }} />

      <div className="relative w-full max-w-5xl grid md:grid-cols-2 gap-10 items-center">
        <div className="hidden md:block text-white space-y-8 p-4">
          <div className="inline-flex items-center gap-2 rounded-full glass-dark px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[color:var(--brand-accent)]" />
            <span className="text-xs font-medium tracking-[0.15em]">PLATEFORME INTERNE IA</span>
          </div>
          <img src={LOGO_URL} alt="Excel Academy" className="logo-invert h-28 md:h-32 w-auto drop-shadow-2xl" />
          <p className="text-white/75 max-w-md leading-relaxed text-lg">
            Base de connaissance, qualification, réclamations et relances —{" "}
            <span className="text-[color:var(--brand-accent)] font-semibold">automatisées par IA.</span>
          </p>
          <div className="flex gap-8 pt-4">
            {[
              { k: "1200+", v: "Élèves" },
              { k: "45", v: "Enseignants" },
              { k: "98%", v: "Réussite" },
            ].map((s) => (
              <div key={s.v}>
                <div className="text-4xl font-bold text-[color:var(--brand-accent)]">{s.k}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/60 mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        <Card className="border-0 shadow-2xl glass rounded-3xl">
          <CardContent className="p-8 md:p-10">
            <div className="flex justify-center mb-8">
              <img src={LOGO_URL} alt="Excel Academy" className="h-16 md:h-20 w-auto" />
            </div>

            <h2 className="text-3xl font-bold text-foreground text-center">Bon retour 👋</h2>
            <p className="text-sm text-muted-foreground mt-1 text-center">Connectez-vous à votre espace</p>

            <form onSubmit={submit} className="mt-8 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12 bg-white/60 border-white/60" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 h-12 bg-white/60 border-white/60" />
                </div>
              </div>
              <div className="rounded-xl bg-[color:var(--brand-accent)]/10 border border-[color:var(--brand-accent)]/30 p-3 text-xs">
                <strong className="text-[color:var(--brand)]">Démo :</strong> identifiants pré-remplis. Cliquez sur Se connecter.
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="btn-shine w-full h-12 text-white font-semibold shadow-glow brand-gradient-warm hover:opacity-95 transition group"
              >
                {loading ? "Connexion..." : (<>Se connecter <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition" /></>)}
              </Button>
            </form>

            <p className="mt-6 text-[11px] text-center text-muted-foreground">
              © 2026 Excel Academy Marrakech · Tous droits réservés
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
