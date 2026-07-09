import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { dataStore, useData } from "@/lib/data-store";
import { useCan, PermissionDenied } from "@/components/permission-guard";
import type { Design } from "@/lib/mock-data";
import { Palette, Plus, Pencil, Trash2, Search, Eye, Sparkles, Download, Copy, Image as ImageIcon, MessageSquare, Megaphone, Mail } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/design")({
  head: () => ({ meta: [{ title: "Design IA — Excel Academy" }] }),
  component: DesignPage,
});

const types: Design["type"][] = ["Flyer", "Post réseaux sociaux", "Bannière web", "Affiche", "Texte marketing", "Email campagne"];
const canaux: Design["canal"][] = ["Instagram", "Facebook", "LinkedIn", "Site web", "Impression", "WhatsApp", "Email"];
const statuts: Design["statut"][] = ["Brouillon", "En génération", "Prêt", "Publié"];

const statClr: Record<Design["statut"], string> = {
  Brouillon: "bg-slate-100 text-slate-700 border-slate-200",
  "En génération": "bg-blue-100 text-blue-700 border-blue-200",
  Prêt: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Publié: "bg-purple-100 text-purple-700 border-purple-200",
};

const typeIcon: Record<Design["type"], typeof ImageIcon> = {
  "Flyer": ImageIcon,
  "Post réseaux sociaux": MessageSquare,
  "Bannière web": Megaphone,
  "Affiche": ImageIcon,
  "Texte marketing": MessageSquare,
  "Email campagne": Mail,
};

function emptyForm(): Omit<Design, "id"> {
  return { titre: "", type: "Flyer", canal: "Instagram", format: "", brief: "", cible: "", statut: "Brouillon", createdAt: new Date().toISOString().slice(0, 10), contenu: "" };
}

function DesignPage() {
  const canRead = useCan("design", "read");
  const canCreate = useCan("design", "create");
  const canUpdate = useCan("design", "update");
  const canDelete = useCan("design", "delete");

  const { designs } = useData();
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [stat, setStat] = useState("all");
  const [sel, setSel] = useState<Design | null>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Design | null>(null);
  const [form, setForm] = useState<Omit<Design, "id">>(emptyForm());
  const [generating, setGenerating] = useState(false);

  if (!canRead) return (<><PageHeader title="Design IA" /><PermissionDenied label="consulter les designs" /></>);

  const filtered = useMemo(() => designs.filter((d) =>
    (type === "all" || d.type === type) &&
    (stat === "all" || d.statut === stat) &&
    (q === "" || d.titre.toLowerCase().includes(q.toLowerCase()) || d.brief.toLowerCase().includes(q.toLowerCase()))
  ), [designs, q, type, stat]);

  const summary = [
    { l: "Total créations", v: designs.length, c: "brand-gradient", i: Palette },
    { l: "Prêts à publier", v: designs.filter((d) => d.statut === "Prêt").length, c: "bg-emerald-500", i: Sparkles },
    { l: "En génération", v: designs.filter((d) => d.statut === "En génération").length, c: "bg-blue-500", i: Sparkles },
    { l: "Publiés", v: designs.filter((d) => d.statut === "Publié").length, c: "bg-purple-500", i: Megaphone },
  ];

  const openCreate = () => { setEditing(null); setForm(emptyForm()); setOpen(true); };
  const openEdit = (d: Design) => { setEditing(d); setForm(d); setOpen(true); setSel(null); };
  const save = () => {
    if (!form.titre || !form.brief) { toast.error("Titre et brief requis"); return; }
    if (editing) { dataStore.updateDesign(editing.id, form); toast.success("Design mis à jour"); }
    else { dataStore.addDesign(form); toast.success("Design ajouté"); }
    setOpen(false);
  };

  const regenerate = (d: Design) => {
    setGenerating(true);
    dataStore.updateDesign(d.id, { statut: "En génération" });
    setTimeout(() => {
      dataStore.updateDesign(d.id, { statut: "Prêt", contenu: d.contenu ?? `Contenu généré par l'IA pour : ${d.titre}\n\nBrief : ${d.brief}\n\nCible : ${d.cible}` });
      toast.success(`« ${d.titre} » régénéré par l'IA`);
      setGenerating(false);
    }, 1200);
  };

  return (
    <>
      <PageHeader title="Design IA" description="Générez flyers, visuels et textes marketing pour Excel Academy" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl brand-gradient-mesh p-6 md:p-8 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-3xl -translate-y-1/2 translate-x-1/4 animate-float-slow" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur gap-1"><Sparkles className="h-3 w-3" />Studio de communication</Badge>
              <h2 className="mt-3 text-2xl md:text-3xl font-bold">Créez vos supports en quelques secondes</h2>
              <p className="mt-1 text-white/80 max-w-xl">Flyers, posts Instagram, bannières site web, campagnes email — l'IA rédige et met en page pour Excel Academy.</p>
            </div>
            {canCreate && (
              <Button className="bg-white text-[color:var(--brand)] hover:bg-white/90 gap-2 shadow-lg" onClick={openCreate}>
                <Sparkles className="h-4 w-4" />Nouvelle création
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summary.map((s) => (
            <Card key={s.l} className="overflow-hidden hover:shadow-lg transition">
              <div className={`h-1 ${s.c}`} />
              <CardContent className="pt-6 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl ${s.c} flex items-center justify-center shadow`}><s.i className="h-5 w-5 text-white" /></div>
                <div><div className="text-2xl font-bold">{s.v}</div><div className="text-xs text-muted-foreground">{s.l}</div></div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Rechercher..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-10" />
              </div>
              <Select value={type} onValueChange={setType}><SelectTrigger className="w-52"><SelectValue placeholder="Type" /></SelectTrigger><SelectContent><SelectItem value="all">Tous types</SelectItem>{types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
              <Select value={stat} onValueChange={setStat}><SelectTrigger className="w-40"><SelectValue placeholder="Statut" /></SelectTrigger><SelectContent><SelectItem value="all">Tous statuts</SelectItem>{statuts.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
              {canCreate && <Button className="brand-gradient-warm text-white gap-2" onClick={openCreate}><Plus className="h-4 w-4" />Nouveau</Button>}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((d) => {
                const Icon = typeIcon[d.type];
                return (
                  <Card key={d.id} className="overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition cursor-pointer group" onClick={() => setSel(d)}>
                    <div className="h-32 brand-gradient-mesh relative flex items-center justify-center">
                      <Icon className="h-14 w-14 text-white/90 group-hover:scale-110 transition" />
                      <Badge className="absolute top-2 right-2 bg-white/90 text-foreground border-transparent shadow">{d.canal}</Badge>
                    </div>
                    <CardContent className="pt-4 pb-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold text-sm leading-tight line-clamp-2 flex-1">{d.titre}</div>
                        <Badge variant="outline" className={statClr[d.statut] + " shrink-0 text-[10px]"}>{d.statut}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1 text-[11px] text-muted-foreground">
                        <span>{d.type}</span><span>·</span><span>{d.format}</span>
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-2">{d.brief}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground pt-1 border-t">Cible : {d.cible}</div>
                    </CardContent>
                  </Card>
                );
              })}
              {filtered.length === 0 && <p className="col-span-full text-center text-sm text-muted-foreground py-10">Aucun design</p>}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Detail */}
      <Dialog open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
          {sel && (<>
            <DialogHeader>
              <DialogTitle>{sel.titre}</DialogTitle>
              <DialogDescription>{sel.type} · {sel.canal} · {sel.format}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="h-48 rounded-xl brand-gradient-mesh flex items-center justify-center text-white">
                {(() => { const Icon = typeIcon[sel.type]; return <Icon className="h-20 w-20 opacity-90" />; })()}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-xl border bg-muted/30"><div className="text-[10px] uppercase tracking-wider text-muted-foreground">Cible</div><div className="font-medium">{sel.cible}</div></div>
                <div className="p-3 rounded-xl border bg-muted/30"><div className="text-[10px] uppercase tracking-wider text-muted-foreground">Statut</div><Badge variant="outline" className={statClr[sel.statut]}>{sel.statut}</Badge></div>
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Brief</div>
                <div className="p-3 rounded-lg bg-muted/30 text-sm">{sel.brief}</div>
              </div>
              {sel.contenu && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Contenu généré</div>
                    <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs" onClick={() => { navigator.clipboard.writeText(sel.contenu ?? ""); toast.success("Copié"); }}>
                      <Copy className="h-3 w-3" />Copier
                    </Button>
                  </div>
                  <div className="p-4 rounded-xl border bg-gradient-to-br from-[color:var(--brand-accent)]/5 to-[color:var(--brand-cyan)]/5 text-sm whitespace-pre-wrap leading-relaxed">{sel.contenu}</div>
                </div>
              )}
            </div>
            <DialogFooter className="flex-wrap gap-2">
              {canUpdate && <Button variant="outline" className="gap-1" onClick={() => regenerate(sel)} disabled={generating}><Sparkles className="h-4 w-4" />Régénérer</Button>}
              {canUpdate && <Button variant="outline" onClick={() => openEdit(sel)}><Pencil className="h-4 w-4 mr-1" />Modifier</Button>}
              {sel.contenu && <Button className="brand-gradient-warm text-white gap-1" onClick={() => toast.success("Export lancé")}><Download className="h-4 w-4" />Exporter</Button>}
            </DialogFooter>
          </>)}
        </DialogContent>
      </Dialog>

      {/* Create / Edit */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-[color:var(--brand-accent)]" />{editing ? "Modifier" : "Nouvelle"} création</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Titre</Label><Input value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} placeholder="ex: Portes ouvertes — 20 septembre" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Type</Label><Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Design["type"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Canal</Label><Select value={form.canal} onValueChange={(v) => setForm({ ...form, canal: v as Design["canal"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{canaux.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Format</Label><Input value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })} placeholder="1080×1350, A5, Newsletter..." /></div>
              <div><Label>Statut</Label><Select value={form.statut} onValueChange={(v) => setForm({ ...form, statut: v as Design["statut"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{statuts.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div><Label>Cible</Label><Input value={form.cible} onChange={(e) => setForm({ ...form, cible: e.target.value })} placeholder="Parents Bac SM, prospects tièdes..." /></div>
            <div><Label>Brief pour l'IA</Label><Textarea rows={3} value={form.brief} onChange={(e) => setForm({ ...form, brief: e.target.value })} placeholder="Ce que doit contenir le visuel / texte : ton, arguments, offre..." /></div>
            <div><Label>Contenu généré (optionnel)</Label><Textarea rows={4} value={form.contenu ?? ""} onChange={(e) => setForm({ ...form, contenu: e.target.value })} placeholder="Sera rempli automatiquement par l'IA une fois généré." /></div>
          </div>
          <DialogFooter className="flex-wrap gap-2">
            {canDelete && editing && (
              <AlertDialog>
                <AlertDialogTrigger asChild><Button variant="ghost" className="text-red-600 mr-auto gap-1"><Trash2 className="h-4 w-4" />Supprimer</Button></AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader><AlertDialogTitle>Supprimer ce design ?</AlertDialogTitle><AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription></AlertDialogHeader>
                  <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => { dataStore.removeDesign(editing.id); toast.success("Supprimé"); setOpen(false); }} className="bg-red-600 hover:bg-red-700">Supprimer</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button className="brand-gradient-warm text-white gap-1" onClick={save}><Sparkles className="h-4 w-4" />{editing ? "Enregistrer" : "Générer avec l'IA"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
