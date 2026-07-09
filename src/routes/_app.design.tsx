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
import { Palette, Plus, Pencil, Trash2, Search, Sparkles, Download, Copy, Image as ImageIcon, MessageSquare, Megaphone, Mail, Wand2, Target, Calendar, Hash, Tag, DollarSign, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { usePagination } from "@/hooks/use-pagination";
import { DataPagination } from "@/components/data-pagination";

export const Route = createFileRoute("/_app/design")({
  head: () => ({ meta: [{ title: "Design IA — Excel Academy" }] }),
  component: DesignPage,
});

const types: Design["type"][] = ["Flyer", "Bannière web"];
const canaux: Design["canal"][] = ["Impression", "Site web", "Instagram", "Facebook", "LinkedIn"];
const statuts: Design["statut"][] = ["Brouillon", "En génération", "Prêt", "Publié"];
const tons: NonNullable<Design["ton"]>[] = ["Institutionnel", "Chaleureux", "Festif", "Élégant", "Urgent", "Éducatif"];

const FORMATS: Record<Design["type"], string[]> = {
  "Flyer": ["A5 vertical (148×210 mm)", "A4 vertical (210×297 mm)", "A6 (105×148 mm)", "Carré 15×15 cm"],
  "Bannière web": ["Hero 1600×600", "Bannière 1920×480", "Slider 1440×720", "Sidebar 300×600", "Header email 600×200"],
  "Post réseaux sociaux": ["Instagram Feed 1080×1350", "Instagram Carré 1080×1080", "Story 1080×1920", "Reel/TikTok 1080×1920", "Facebook 1200×630"],
  "Affiche": ["A3 (297×420 mm)", "A2 (420×594 mm)", "Roll-up 85×200 cm"],
  "Texte marketing": ["SMS court (160 car.)", "WhatsApp (300 car.)", "Slogan (max 12 mots)", "Description (500 car.)"],
  "Email campagne": ["Newsletter 600px", "Email transactionnel", "Séquence 3 emails", "Invitation événement"],
};

const CIBLES = [
  "Parents 3ème & Tronc Commun",
  "Élèves Bac Sciences Maths",
  "Prospects Prépa scientifique",
  "Familles Marrakech premium",
  "Anciens élèves / Alumni",
  "Prospects tièdes qualifiés",
  "Entreprises partenaires",
];

const statClr: Record<Design["statut"], string> = {
  Brouillon: "bg-slate-100 text-slate-700 border-slate-200",
  "En génération": "bg-blue-100 text-blue-700 border-blue-200",
  Prêt: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Publié: "bg-purple-100 text-purple-700 border-purple-200",
};

const typeIcon: Record<Design["type"], typeof ImageIcon> = {
  "Flyer": ImageIcon,
  "Bannière web": Megaphone,
  "Post réseaux sociaux": MessageSquare,
  "Affiche": ImageIcon,
  "Texte marketing": MessageSquare,
  "Email campagne": Mail,
};


function emptyForm(): Omit<Design, "id"> {
  return { titre: "", type: "Flyer", canal: "Impression", format: FORMATS["Flyer"][0], brief: "", cible: CIBLES[0], statut: "Brouillon", createdAt: new Date().toISOString().slice(0, 10), contenu: "", slogan: "", cta: "", hashtags: "", palette: "Teal · Or · Blanc", ton: "Institutionnel", dateEvenement: "", imageUrl: "" };
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
    { l: "En génération", v: designs.filter((d) => d.statut === "En génération").length, c: "bg-blue-500", i: Wand2 },
    { l: "Publiés", v: designs.filter((d) => d.statut === "Publié").length, c: "bg-purple-500", i: Megaphone },
  ];

  const openCreate = () => { setEditing(null); setForm(emptyForm()); setOpen(true); };
  const openEdit = (d: Design) => { setEditing(d); setForm({ ...emptyForm(), ...d }); setOpen(true); setSel(null); };

  const aiFill = (brief: string, currentTitle?: string): Partial<Design> => {
    const words = brief.split(/\s+/).filter(Boolean);
    const detectedType: Design["type"] =
      /banni[eè]re|site web|hero|web|slider/i.test(brief) ? "Bannière web" : "Flyer";
    const detectedCanal: Design["canal"] =
      /site web|web|hero|slider/i.test(brief) ? "Site web" :
      /insta/i.test(brief) ? "Instagram" :
      /facebook/i.test(brief) ? "Facebook" :
      /linkedin/i.test(brief) ? "LinkedIn" :
      "Impression";
    const detectedTon: NonNullable<Design["ton"]> =
      /urgent|derni[eè]re|limit/i.test(brief) ? "Urgent" :
      /f[eê]te|festi|portes ouvertes|joyeu/i.test(brief) ? "Festif" :
      /premium|excellence|grande[s]? [eé]cole/i.test(brief) ? "Élégant" :
      /parent|famille|bienvenue/i.test(brief) ? "Chaleureux" :
      /cours|p[eé]dagog|apprentissage|programme/i.test(brief) ? "Éducatif" :
      "Institutionnel";
    return {
      titre: currentTitle || (words.slice(0, 6).join(" ") + (words.length > 6 ? "…" : "")),
      type: detectedType,
      canal: detectedCanal,
      format: FORMATS[detectedType][0],
      ton: detectedTon,
      slogan: "Excel Academy — l'excellence à votre portée",
      cta: /inscri/i.test(brief) ? "Inscrivez-vous dès maintenant" : "Contactez-nous pour en savoir plus",
      hashtags: "#ExcelAcademy #Marrakech #Éducation #Bac2026 #RentréeExcel",
      palette: "Teal · Or · Blanc",
      contenu: `✨ ${currentTitle || "Excel Academy"}\n\n${brief}\n\n📍 Marrakech · 0524 33 21 10 · excelacademy.ma`,
    };
  };

  const runAiFill = () => {
    if (!form.brief.trim()) { toast.error("Décrivez d'abord votre besoin dans le brief"); return; }
    setGenerating(true);
    setTimeout(() => {
      setForm((f) => ({ ...f, ...aiFill(f.brief, f.titre) }));
      setGenerating(false);
      toast.success("Champs pré-remplis par l'IA ✨");
    }, 700);
  };

  const save = () => {
    if (!form.titre || !form.brief) { toast.error("Titre et brief requis"); return; }
    if (editing) { dataStore.updateDesign(editing.id, form); toast.success("Design mis à jour"); }
    else { dataStore.addDesign(form); toast.success("Design créé"); }
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


  const onTypeChange = (v: Design["type"]) => setForm({ ...form, type: v, format: FORMATS[v][0] });


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
              <p className="mt-1 text-white/85 max-w-xl">Flyers, posts Instagram, bannières site web, campagnes email — l'IA rédige et met en page pour Excel Academy.</p>
            </div>
            {canCreate && (
              <Button className="bg-white text-[color:var(--brand)] hover:bg-white/90 gap-2 shadow-lg" onClick={openCreate}>
                <Wand2 className="h-4 w-4" />Nouvelle création
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
                <Input placeholder="Rechercher une création..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-10" />
              </div>
              <Select value={type} onValueChange={setType}><SelectTrigger className="w-52"><SelectValue placeholder="Type" /></SelectTrigger><SelectContent><SelectItem value="all">Tous types</SelectItem>{types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
              <Select value={stat} onValueChange={setStat}><SelectTrigger className="w-40"><SelectValue placeholder="Statut" /></SelectTrigger><SelectContent><SelectItem value="all">Tous statuts</SelectItem>{statuts.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
              {canCreate && <Button className="brand-gradient-warm text-white gap-2" onClick={openCreate}><Plus className="h-4 w-4" />Nouveau</Button>}
            </div>

            <DesignGrid filtered={filtered} onSelect={setSel} />
          </CardContent>
        </Card>
      </main>

      {/* Detail */}
      <Dialog open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
          {sel && (<>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">{(() => { const I = typeIcon[sel.type]; return <I className="h-5 w-5 text-[color:var(--brand-accent)]" />; })()}{sel.titre}</DialogTitle>
              <DialogDescription>{sel.type} · {sel.canal} · {sel.format}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="h-64 rounded-xl overflow-hidden relative bg-muted">
                {sel.imageUrl ? (
                  <img src={sel.imageUrl} alt={sel.titre} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <div className="absolute inset-0 brand-gradient-mesh flex items-center justify-center text-white">
                    {(() => { const Icon = typeIcon[sel.type]; return <Icon className="h-20 w-20 opacity-90" />; })()}
                  </div>
                )}
              </div>
              {sel.slogan && (
                <div className="rounded-xl border-l-4 border-[color:var(--brand-accent)] bg-[color:var(--brand-accent)]/5 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Slogan</div>
                  <div className="text-base font-semibold italic">“{sel.slogan}”</div>
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div className="p-3 rounded-xl border bg-muted/30"><div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Target className="h-3 w-3" />Cible</div><div className="font-medium">{sel.cible}</div></div>
                {sel.ton && <div className="p-3 rounded-xl border bg-muted/30"><div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Tag className="h-3 w-3" />Ton</div><div className="font-medium">{sel.ton}</div></div>}
                {sel.palette && <div className="p-3 rounded-xl border bg-muted/30"><div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Palette className="h-3 w-3" />Palette</div><div className="font-medium">{sel.palette}</div></div>}
                {sel.dateEvenement && <div className="p-3 rounded-xl border bg-muted/30"><div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />Événement</div><div className="font-medium">{sel.dateEvenement}</div></div>}
                {sel.cta && <div className="p-3 rounded-xl border bg-muted/30 col-span-2 md:col-span-1"><div className="text-[10px] uppercase tracking-wider text-muted-foreground">Call-to-action</div><div className="font-medium">{sel.cta}</div></div>}
                {sel.budget !== undefined && sel.budget > 0 && <div className="p-3 rounded-xl border bg-muted/30"><div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1"><DollarSign className="h-3 w-3" />Budget</div><div className="font-medium">{sel.budget.toLocaleString()} MAD</div></div>}
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Brief créatif</div>
                <div className="p-3 rounded-lg bg-muted/30 text-sm">{sel.brief}</div>
              </div>
              {sel.hashtags && (
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1"><Hash className="h-3 w-3" />Hashtags</div>
                  <div className="text-sm text-[color:var(--brand-accent)]">{sel.hashtags}</div>
                </div>
              )}
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
              {canUpdate && <Button variant="outline" className="gap-1" onClick={() => regenerate(sel)} disabled={generating}><Wand2 className="h-4 w-4" />Régénérer</Button>}
              {canUpdate && <Button variant="outline" onClick={() => openEdit(sel)}><Pencil className="h-4 w-4 mr-1" />Modifier</Button>}
              <Button className="brand-gradient-warm text-white gap-1" onClick={() => toast.success("Export lancé")}><Download className="h-4 w-4" />Exporter</Button>
            </DialogFooter>
          </>)}
        </DialogContent>
      </Dialog>

      {/* Create / Edit */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Wand2 className="h-5 w-5 text-[color:var(--brand-accent)]" />{editing ? "Modifier la création" : "Nouvelle création IA"}</DialogTitle>
            <DialogDescription>{editing ? "Ajustez les détails générés par l'IA" : "Décrivez simplement votre besoin — l'IA choisit le format, le ton, le slogan, les hashtags et rédige le contenu."}</DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            {/* AI assist card — shown for new creations */}
            {!editing && (
              <div className="relative overflow-hidden rounded-2xl border border-[color:var(--brand-accent)]/30 bg-gradient-to-br from-[color:var(--brand-accent)]/10 via-white/50 to-[color:var(--brand-cyan)]/10 p-5 space-y-3">
                <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-[color:var(--brand-accent)]/20 blur-2xl" />
                <div className="relative flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl brand-gradient-warm flex items-center justify-center shadow-elegant"><Sparkles className="h-5 w-5 text-white" /></div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">Assistant IA</div>
                    <div className="text-xs text-muted-foreground">Décrivez votre besoin dans le brief, l'IA remplit le reste. Vous pouvez tout ajuster ensuite.</div>
                  </div>
                  <Button size="sm" onClick={runAiFill} disabled={generating} className="brand-gradient-warm text-white gap-1 shadow">
                    {generating ? <Sparkles className="h-4 w-4 animate-pulse" /> : <Wand2 className="h-4 w-4" />}
                    {generating ? "IA…" : "Pré-remplir avec l'IA"}
                  </Button>
                </div>
              </div>
            )}

            {/* Live preview */}
            <div className="relative h-44 rounded-2xl overflow-hidden border bg-muted shadow-elegant">
              {form.imageUrl ? (
                <img src={form.imageUrl} alt="Aperçu" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="absolute inset-0 brand-gradient-mesh flex items-center justify-center text-white/90">
                  {(() => { const I = typeIcon[form.type]; return <I className="h-16 w-16" />; })()}
                </div>
              )}
              <div className="absolute top-2 left-2 flex gap-1">
                <Badge className="bg-white/95 text-foreground border-transparent shadow gap-1">{(() => { const I = typeIcon[form.type]; return <I className="h-3 w-3" />; })()}{form.type}</Badge>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white">
                <div className="text-sm font-semibold line-clamp-1">{form.titre || "Titre de la création"}</div>
                {form.slogan && <div className="text-xs italic opacity-90 line-clamp-1">“{form.slogan}”</div>}
              </div>
            </div>

            <section className="space-y-3 rounded-xl border bg-white/60 p-4">
              <div className="text-xs font-semibold text-[color:var(--brand)] uppercase tracking-wider flex items-center gap-2"><ImageIcon className="h-3.5 w-3.5" />Support</div>
              <div><Label className="text-xs">Titre interne <span className="text-red-500">*</span></Label><Input value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} placeholder="ex: Portes ouvertes — 20 septembre" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Type de support</Label><Select value={form.type} onValueChange={(v) => onTypeChange(v as Design["type"])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
                <div><Label className="text-xs">Canal de diffusion</Label><Select value={form.canal} onValueChange={(v) => setForm({ ...form, canal: v as Design["canal"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{canaux.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
                <div><Label className="text-xs">Format</Label><Select value={form.format} onValueChange={(v) => setForm({ ...form, format: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{FORMATS[form.type].map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent></Select></div>
                <div><Label className="text-xs">Statut</Label><Select value={form.statut} onValueChange={(v) => setForm({ ...form, statut: v as Design["statut"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{statuts.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
              </div>
            </section>

            <section className="space-y-3 rounded-xl border bg-white/60 p-4">
              <div className="text-xs font-semibold text-[color:var(--brand)] uppercase tracking-wider flex items-center gap-2"><Target className="h-3.5 w-3.5" />Cible & Ton</div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Audience cible</Label><Select value={form.cible} onValueChange={(v) => setForm({ ...form, cible: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CIBLES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
                <div><Label className="text-xs">Ton</Label><Select value={form.ton ?? "Institutionnel"} onValueChange={(v) => setForm({ ...form, ton: v as Design["ton"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{tons.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
                <div><Label className="text-xs flex items-center gap-1"><Palette className="h-3 w-3" />Palette</Label><Input value={form.palette ?? ""} onChange={(e) => setForm({ ...form, palette: e.target.value })} placeholder="Teal · Or · Blanc" /></div>
                <div><Label className="text-xs flex items-center gap-1"><Calendar className="h-3 w-3" />Date événement</Label><Input type="date" value={form.dateEvenement ?? ""} onChange={(e) => setForm({ ...form, dateEvenement: e.target.value })} /></div>
              </div>
            </section>

            <section className="space-y-3 rounded-xl border bg-white/60 p-4">
              <div className="text-xs font-semibold text-[color:var(--brand)] uppercase tracking-wider flex items-center gap-2"><MessageSquare className="h-3.5 w-3.5" />Message</div>
              <div><Label className="text-xs">Slogan / accroche</Label><Input value={form.slogan ?? ""} onChange={(e) => setForm({ ...form, slogan: e.target.value })} placeholder="Cap sur les grandes écoles" /></div>
              <div><Label className="text-xs">Call-to-action</Label><Input value={form.cta ?? ""} onChange={(e) => setForm({ ...form, cta: e.target.value })} placeholder="Inscrivez-vous avant le 30 août" /></div>
              <div><Label className="text-xs flex items-center gap-1"><Hash className="h-3 w-3" />Hashtags</Label><Input value={form.hashtags ?? ""} onChange={(e) => setForm({ ...form, hashtags: e.target.value })} placeholder="#ExcelAcademy #Marrakech #Bac2026" /></div>
              <div><Label className="text-xs">Brief détaillé pour l'IA <span className="text-red-500">*</span></Label><Textarea rows={3} value={form.brief} onChange={(e) => setForm({ ...form, brief: e.target.value })} placeholder="Ce que doit contenir le visuel : arguments, offres, éléments obligatoires..." className="resize-none" /></div>
            </section>

            <section className="space-y-3 rounded-xl border bg-white/60 p-4">
              <div className="text-xs font-semibold text-[color:var(--brand)] uppercase tracking-wider flex items-center gap-2"><Upload className="h-3.5 w-3.5" />Visuel de référence</div>
              <div><Label className="text-xs">URL image de référence</Label><Input value={form.imageUrl ?? ""} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." /></div>
            </section>
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
            <Button className="brand-gradient-warm text-white gap-1 shadow-elegant" onClick={save} disabled={generating}>
              <Wand2 className="h-4 w-4" />{editing ? "Enregistrer" : "Créer la campagne"}
            </Button>
          </DialogFooter>

        </DialogContent>
      </Dialog>

    </>
  );
}
