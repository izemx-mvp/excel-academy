import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Users, GraduationCap, MessageSquareWarning, BellRing, TrendingUp, ArrowUpRight, ShieldCheck, UserCog } from "lucide-react";
import { useData } from "@/lib/data-store";
import { useUsers, useCurrentUser } from "@/lib/auth-store";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Tableau de bord — Excel Academy" }] }),
  component: Dashboard,
});

function Dashboard() {
  const data = useData();
  const users = useUsers();
  const me = useCurrentUser();

  const totalDu = data.relances.reduce((s, r) => s + r.montantDu, 0);
  const hotLeads = data.qualifications.filter((q) => q.statut === "Chaud").length;
  const openReclams = data.reclamations.filter((r) => r.statut !== "Résolue").length;

  const stats = [
    { label: "Prospects qualifiés", value: data.qualifications.length, sub: `${hotLeads} chauds`, icon: Users, tone: "from-[color:var(--brand)] to-[color:var(--brand-cyan)]", trend: "+12%", to: "/qualification" },
    { label: "Réclamations", value: data.reclamations.length, sub: `${openReclams} ouvertes`, icon: MessageSquareWarning, tone: "from-orange-500 to-red-500", trend: "-8%", to: "/reclamations" },
    { label: "Relances en cours", value: data.relances.length, sub: `${totalDu.toLocaleString()} MAD`, icon: BellRing, tone: "from-[color:var(--brand-accent)] to-amber-500", trend: "+3", to: "/relance" },
    { label: "Utilisateurs actifs", value: users.filter((u) => u.actif).length, sub: `${users.filter((u) => u.role === "admin").length} admins`, icon: UserCog, tone: "from-emerald-500 to-teal-500", trend: "100%", to: "/utilisateurs" },
  ];

  return (
    <>
      <PageHeader title="Tableau de bord" description="Vue d'ensemble de la plateforme Excel Academy" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="relative overflow-hidden rounded-2xl brand-gradient p-6 md:p-8 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[color:var(--brand-accent)]/40 blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="relative">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur">Rentrée 2025-2026</Badge>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold">Bienvenue {me?.nom} 👋</h2>
            <p className="mt-1 text-white/80 max-w-xl">Suivez la performance de vos agents IA et de la vie académique en temps réel.</p>
            {me?.role === "admin" && (
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to="/utilisateurs"><Button variant="secondary" className="gap-1"><ShieldCheck className="h-4 w-4" />Gérer les utilisateurs</Button></Link>
                <Link to="/base-connaissance"><Button variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white">Base de connaissance</Button></Link>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Link key={s.label} to={s.to}>
              <Card className="relative overflow-hidden group hover:shadow-xl hover:-translate-y-0.5 transition h-full">
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${s.tone}`} />
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${s.tone} flex items-center justify-center shadow-md group-hover:scale-110 transition`}>
                      <s.icon className="h-5 w-5 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-emerald-600 bg-emerald-50 border-emerald-200 gap-1">
                      <TrendingUp className="h-3 w-3" />{s.trend}
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl font-bold text-foreground">{s.value}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                    <div className="text-[11px] text-foreground/60 mt-2">{s.sub}</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardContent className="pt-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">Performance des agents IA <ArrowUpRight className="h-4 w-4 text-emerald-500" /></h3>
                <span className="text-xs text-muted-foreground">Derniers 30 jours</span>
              </div>
              {[
                { name: "Base de connaissance IA", val: 94 },
                { name: "Qualification IA", val: 87 },
                { name: "Réclamations IA", val: 78 },
                { name: "Relance IA", val: 91 },
              ].map((p) => (
                <div key={p.name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium">{p.name}</span>
                    <span className="text-muted-foreground">{p.val}%</span>
                  </div>
                  <Progress value={p.val} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-semibold">Activité récente</h3>
              {[
                { t: "Nouveau prospect chaud", d: "Sara Benjelloun · il y a 2h", c: "bg-emerald-500" },
                { t: "Réclamation escaladée", d: "Salma El Idrissi · il y a 3h", c: "bg-red-500" },
                { t: "Relance envoyée", d: "Hicham Berrada · il y a 5h", c: "bg-[color:var(--brand-accent)]" },
                { t: "Document ajouté", d: "Brochure Bac SM · hier", c: "bg-[color:var(--brand-cyan)]" },
              ].map((a, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className={`h-2 w-2 rounded-full ${a.c} mt-2 shrink-0`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{a.t}</p>
                    <p className="text-xs text-muted-foreground">{a.d}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
