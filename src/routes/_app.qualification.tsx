import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { dataStore, useData } from "@/lib/data-store";
import { useCan, PermissionDenied } from "@/components/permission-guard";
import type { Qualification } from "@/lib/mock-data";
import { PHASES } from "@/lib/mock-data";
import { Search, Flame, Eye, Send, Plus, Pencil, Trash2, Phone, Mail, User, Wallet, GraduationCap, CalendarDays, Sparkles, Trophy, XCircle, CircleDashed, PhoneCall, CalendarClock, School, Ban } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { usePagination } from "@/hooks/use-pagination";
import { DataPagination } from "@/components/data-pagination";

export const Route = createFileRoute("/_app/qualification")({
  head: () => ({ meta: [{ title: "Qualification IA — Excel Academy" }] }),
  component: QualificationPage,
});


const statutClr: Record<Qualification["statut"], string> = {
  Chaud: "bg-red-100 text-red-700 border-red-200",
  Tiède: "bg-orange-100 text-orange-700 border-orange-200",
  Froid: "bg-blue-100 text-blue-700 border-blue-200",
};

const phaseMeta: Record<Qualification["phase"], { icon: typeof Flame; clr: string; emoji: string }> = {
  "Nouveau":       { icon: CircleDashed,  clr: "bg-slate-100 text-slate-700 border-slate-200",      emoji: "✨" },
  "Contacté":      { icon: PhoneCall,     clr: "bg-sky-100 text-sky-700 border-sky-200",            emoji: "📞" },
  "RDV planifié":  { icon: CalendarClock, clr: "bg-violet-100 text-violet-700 border-violet-200",   emoji: "📅" },
  "Visite école":  { icon: School,        clr: "bg-amber-100 text-amber-700 border-amber-200",      emoji: "🏫" },
  "Gagné":         { icon: Trophy,        clr: "bg-emerald-100 text-emerald-700 border-emerald-200",emoji: "🏆" },
  "Perdu":         { icon: XCircle,       clr: "bg-red-100 text-red-700 border-red-200",            emoji: "❌" },
  "Abandonné":     { icon: Ban,           clr: "bg-zinc-100 text-zinc-700 border-zinc-200",         emoji: "🚫" },
};

function emptyForm(): Omit<Qualification, "id"> {
  return { nom: "", telephone: "", email: "", formation: "", budget: "", score: 50, statut: "Tiède", phase: "Nouveau", date: new Date().toISOString().slice(0, 10), notes: "" };
}

function QualificationPage() {
  const canRead = useCan("qualification", "read");
  const canCreate = useCan("qualification", "create");
  const canUpdate = useCan("qualification", "update");
  const canDelete = useCan("qualification", "delete");

  const { qualifications, formations } = useData();
  const [q, setQ] = useState("");
  const [statut, setStatut] = useState("all");
  const [phase, setPhase] = useState("all");
  const [formation, setFormation] = useState("all");
  const [sel, setSel] = useState<Qualification | null>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Qualification | null>(null);
  const [form, setForm] = useState<Omit<Qualification, "id">>(emptyForm());

  if (!canRead) return (<><PageHeader title="Qualification IA" /><PermissionDenied label="consulter les prospects" /></>);

  const filtered = useMemo(() => qualifications.filter((it) =>
    (statut === "all" || it.statut === statut) &&
    (phase === "all" || it.phase === phase) &&
    (formation === "all" || it.formation === formation) &&
    (q === "" || it.nom.toLowerCase().includes(q.toLowerCase()) || it.email.toLowerCase().includes(q.toLowerCase()) || it.telephone.includes(q))
  ), [qualifications, q, statut, phase, formation]);
  const { page, setPage, pageCount, total, pageItems, pageSize } = usePagination(filtered, 8);

  const openCreate = () => { setEditing(null); setForm(emptyForm()); setOpen(true); };
  const openEdit = (it: Qualification) => { setEditing(it); setForm(it); setOpen(true); setSel(null); };
  const save = () => {
    if (!form.nom || !form.email) { toast.error("Nom et email requis"); return; }
    if (editing) { dataStore.updateQual(editing.id, form); toast.success("Prospect mis à jour"); }
    else { dataStore.addQual(form); toast.success("Prospect ajouté"); }
    setOpen(false);
  };

  return (
    <>
      <PageHeader title="Qualification IA" description="Prospects qualifiés automatiquement par l'agent IA" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(["Nouveau", "Contacté", "RDV planifié", "Visite école", "Gagné", "Perdu", "Abandonné"] as const).map((p) => {
            const meta = phaseMeta[p];
            const Icon = meta.icon;
            const count = qualifications.filter((i) => i.phase === p).length;
            return (
              <button key={p} onClick={() => setPhase(phase === p ? "all" : p)} className={`text-left rounded-xl border p-3 flex items-center gap-3 hover:shadow-md transition ${phase === p ? "ring-2 ring-[color:var(--brand)] " : ""}${meta.clr}`}>
                <div className="h-9 w-9 rounded-lg bg-white/70 flex items-center justify-center"><Icon className="h-4 w-4" /></div>
                <div className="min-w-0"><div className="text-xl font-bold leading-none">{count}</div><div className="text-[11px] mt-1 truncate">{p}</div></div>
              </button>
            );
          })}
        </div>

        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Rechercher nom, email, téléphone..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-10" />
              </div>
              <Select value={statut} onValueChange={setStatut}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Statut" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  <SelectItem value="Chaud">Chaud</SelectItem>
                  <SelectItem value="Tiède">Tiède</SelectItem>
                  <SelectItem value="Froid">Froid</SelectItem>
                </SelectContent>
              </Select>
              <Select value={formation} onValueChange={setFormation}>
                <SelectTrigger className="w-52"><SelectValue placeholder="Formation" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes formations</SelectItem>
                  {formations.map((f) => <SelectItem key={f.id} value={f.nom}>{f.nom}</SelectItem>)}
                </SelectContent>
              </Select>
              {canCreate && <Button className="brand-gradient-warm text-white gap-2 shadow-md" onClick={openCreate}><Plus className="h-4 w-4" />Ajouter</Button>}
            </div>

            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prospect</TableHead>
                    <TableHead>Formation</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Score IA</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageItems.map((it) => (
                    <TableRow key={it.id}>
                      <TableCell>
                        <div className="font-medium">{it.nom}</div>
                        <div className="text-xs text-muted-foreground">{it.email}</div>
                      </TableCell>
                      <TableCell className="text-sm">{it.formation}</TableCell>
                      <TableCell className="text-sm">{it.budget}</TableCell>
                      <TableCell><div className="flex items-center gap-2 min-w-[120px]"><Progress value={it.score} className="h-1.5" /><span className="text-xs font-semibold w-8">{it.score}</span></div></TableCell>
                      <TableCell>
                        {canUpdate ? (
                          <Select value={it.statut} onValueChange={(v) => { dataStore.updateQual(it.id, { statut: v as Qualification["statut"] }); toast.success(`Statut → ${v}`); }}>
                            <SelectTrigger className={`h-8 w-28 border ${statutClr[it.statut]}`}><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Chaud">Chaud</SelectItem>
                              <SelectItem value="Tiède">Tiède</SelectItem>
                              <SelectItem value="Froid">Froid</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant="outline" className={statutClr[it.statut]}>{it.statut}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button size="icon" variant="ghost" onClick={() => setSel(it)} title="Voir détails"><Eye className="h-4 w-4" /></Button>
                        {canUpdate && <Button size="icon" variant="ghost" onClick={() => openEdit(it)} title="Modifier"><Pencil className="h-4 w-4" /></Button>}
                        {canDelete && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild><Button size="icon" variant="ghost" className="text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader><AlertDialogTitle>Supprimer {it.nom} ?</AlertDialogTitle><AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription></AlertDialogHeader>
                              <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => { dataStore.removeQual(it.id); toast.success("Prospect supprimé"); }} className="bg-red-600 hover:bg-red-700">Supprimer</AlertDialogAction></AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Aucun prospect trouvé</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
            <DataPagination page={page} pageCount={pageCount} total={total} pageSize={pageSize} onChange={setPage} label="prospects" />
          </CardContent>
        </Card>
      </main>

      {/* Detail dialog */}
      <Dialog open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden">
          {sel && (<>
            <div className="brand-gradient-mesh p-6 text-white relative">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
              <div className="relative flex items-start gap-4">
                <div className="h-16 w-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center text-2xl font-bold shadow-lg">
                  {sel.nom.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-2xl text-white">{sel.nom}</DialogTitle>
                  <DialogDescription className="text-white/80">Qualification du {sel.date}</DialogDescription>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge className={`${statutClr[sel.statut]} border`}>{sel.statut}</Badge>
                    <div className="text-xs text-white/80">Score IA <strong className="text-[color:var(--brand-accent)]">{sel.score}/100</strong></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { i: Mail, l: "Email", v: sel.email, href: `mailto:${sel.email}` },
                  { i: Phone, l: "Téléphone", v: sel.telephone, href: `tel:${sel.telephone}` },
                  { i: GraduationCap, l: "Formation", v: sel.formation },
                  { i: Wallet, l: "Budget", v: sel.budget },
                ].map((f) => (
                  <div key={f.l} className="flex items-start gap-3 p-3 rounded-xl border bg-muted/30">
                    <div className="h-9 w-9 rounded-lg bg-[color:var(--brand-accent)]/10 flex items-center justify-center shrink-0">
                      <f.i className="h-4 w-4 text-[color:var(--brand-accent)]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{f.l}</div>
                      {f.href ? <a href={f.href} className="text-sm font-medium hover:underline break-all">{f.v}</a> : <div className="text-sm font-medium truncate">{f.v}</div>}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2"><User className="h-3.5 w-3.5" />Score IA</div>
                <div className="flex items-center gap-3"><Progress value={sel.score} className="h-2.5 flex-1" /><span className="font-bold text-lg text-[color:var(--brand)]">{sel.score}</span></div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5" />Notes de l'agent IA</div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-[color:var(--brand-accent)]/5 to-[color:var(--brand-cyan)]/5 border border-[color:var(--brand-accent)]/20 text-sm leading-relaxed">{sel.notes}</div>
              </div>
            </div>

            <DialogFooter className="px-6 pb-6 gap-2">
              {canUpdate && <Button variant="outline" onClick={() => openEdit(sel)}><Pencil className="h-4 w-4 mr-1" />Modifier</Button>}
              <Button className="btn-shine brand-gradient-warm text-white gap-2 shadow-elegant" onClick={() => { toast.success(`Email envoyé à ${sel.nom}`); setSel(null); }}><Send className="h-4 w-4" />Contacter</Button>
            </DialogFooter>
          </>)}
        </DialogContent>
      </Dialog>

      {/* Create/Edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-[color:var(--brand-accent)]" />{editing ? "Modifier le prospect" : "Nouveau prospect"}</DialogTitle>
            <DialogDescription>Fiche qualifiée par l'agent IA — mise à jour manuelle possible</DialogDescription>
          </DialogHeader>
          <div className="space-y-5">
            <section className="space-y-3 rounded-xl border bg-white/60 p-4">
              <div className="text-xs font-semibold text-[color:var(--brand)] uppercase tracking-wider flex items-center gap-2"><User className="h-3.5 w-3.5" />Identité</div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Nom complet</Label><Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} placeholder="Sara Benjelloun" /></div>
                <div><Label className="text-xs flex items-center gap-1"><Mail className="h-3 w-3" />Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="sara@gmail.com" /></div>
                <div><Label className="text-xs flex items-center gap-1"><Phone className="h-3 w-3" />Téléphone</Label><Input value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} placeholder="0661 234 567" /></div>
                <div><Label className="text-xs flex items-center gap-1"><Wallet className="h-3 w-3" />Budget</Label><Input value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="ex: 25-30k MAD" /></div>
              </div>
            </section>

            <section className="space-y-3 rounded-xl border bg-white/60 p-4">
              <div className="text-xs font-semibold text-[color:var(--brand)] uppercase tracking-wider flex items-center gap-2"><GraduationCap className="h-3.5 w-3.5" />Projet d'études</div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Formation visée</Label>
                  <Select value={form.formation} onValueChange={(v) => setForm({ ...form, formation: v })}>
                    <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                    <SelectContent>{formations.map((f) => <SelectItem key={f.id} value={f.nom}>{f.nom}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label className="text-xs">Statut du lead</Label>
                  <Select value={form.statut} onValueChange={(v) => setForm({ ...form, statut: v as Qualification["statut"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Chaud">🔥 Chaud</SelectItem><SelectItem value="Tiède">🌤️ Tiède</SelectItem><SelectItem value="Froid">❄️ Froid</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div><div className="flex justify-between mb-1"><Label className="text-xs">Score IA</Label><span className="text-sm font-bold text-[color:var(--brand)]">{form.score}/100</span></div><Slider value={[form.score]} onValueChange={(v) => setForm({ ...form, score: v[0] })} min={0} max={100} /></div>
            </section>

            <section className="space-y-3 rounded-xl border bg-white/60 p-4">
              <div className="text-xs font-semibold text-[color:var(--brand)] uppercase tracking-wider flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5" />Notes de l'agent</div>
              <Textarea rows={4} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Motivations, freins, prochaines actions..." />
            </section>
          </div>
          <DialogFooter><Button className="brand-gradient-warm text-white shadow-elegant" onClick={save}>{editing ? "Enregistrer" : "Créer le prospect"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
