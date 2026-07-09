import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

import { dataStore, useData } from "@/lib/data-store";
import { useCan, PermissionDenied } from "@/components/permission-guard";
import type { Relance } from "@/lib/mock-data";
import { Search, Eye, Send, BellRing, Settings2, DollarSign, Clock, MailCheck, Plus, Pencil, Trash2, CalendarClock } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/relance")({
  head: () => ({ meta: [{ title: "Relance IA — Excel Academy" }] }),
  component: RelancePage,
});

const statClr: Record<Relance["statut"], string> = {
  "En attente": "bg-slate-100 text-slate-700 border-slate-200",
  Relancé: "bg-blue-100 text-blue-700 border-blue-200",
  Payé: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Escaladé: "bg-red-100 text-red-700 border-red-200",
};
const statuts: Relance["statut"][] = ["En attente", "Relancé", "Payé", "Escaladé"];

function emptyForm(): Omit<Relance, "id"> {
  return { nom: "", email: "", telephone: "", formation: "", montantDu: 0, dateEcheance: new Date().toISOString().slice(0, 10), nbRelances: 0, derniereRelance: null, statut: "En attente" };
}

const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"] as const;
type Jour = typeof JOURS[number];
type DayHours = { actif: boolean; debut: string; fin: string };

function defaultHours(): Record<Jour, DayHours> {
  return {
    Lun: { actif: true, debut: "09:00", fin: "18:00" },
    Mar: { actif: true, debut: "09:00", fin: "18:00" },
    Mer: { actif: true, debut: "09:00", fin: "18:00" },
    Jeu: { actif: true, debut: "09:00", fin: "18:00" },
    Ven: { actif: true, debut: "09:00", fin: "17:00" },
    Sam: { actif: false, debut: "10:00", fin: "13:00" },
    Dim: { actif: false, debut: "10:00", fin: "13:00" },
  };
}

function RelancePage() {
  const canRead = useCan("relance", "read");
  const canCreate = useCan("relance", "create");
  const canUpdate = useCan("relance", "update");
  const canDelete = useCan("relance", "delete");

  const { relances, formations } = useData();
  const [q, setQ] = useState("");
  const [stat, setStat] = useState("all");
  const [sel, setSel] = useState<Relance | null>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Relance | null>(null);
  const [form, setForm] = useState<Omit<Relance, "id">>(emptyForm());

  const [maxRelances, setMaxRelances] = useState([3]);
  const [delaiEntre, setDelaiEntre] = useState([7]);
  const [attentePremiere, setAttentePremiere] = useState([5]);
  const [autoEscalade, setAutoEscalade] = useState(true);
  const [hours, setHours] = useState<Record<Jour, DayHours>>(defaultHours());

  if (!canRead) return (<><PageHeader title="Relance IA" /><PermissionDenied label="consulter les relances" /></>);

  const filtered = useMemo(() => relances.filter((r) =>
    (stat === "all" || r.statut === stat) &&
    (q === "" || r.nom.toLowerCase().includes(q.toLowerCase()) || r.email.toLowerCase().includes(q.toLowerCase()))
  ), [relances, q, stat]);

  const total = relances.reduce((s, r) => s + r.montantDu, 0);
  const nbEscal = relances.filter((r) => r.statut === "Escaladé").length;

  const relancer = (r: Relance) => {
    if (!canUpdate) { toast.error("Permission requise"); return; }
    const today = new Date().toISOString().slice(0, 10);
    const nb = r.nbRelances + 1;
    dataStore.updateRelance(r.id, { nbRelances: nb, derniereRelance: today, statut: nb >= maxRelances[0] && autoEscalade ? "Escaladé" : "Relancé" });
    toast.success(`Relance envoyée à ${r.nom}`);
    if (sel?.id === r.id) setSel(null);
  };

  const openCreate = () => { setEditing(null); setForm(emptyForm()); setOpen(true); };
  const openEdit = (r: Relance) => { setEditing(r); setForm(r); setOpen(true); setSel(null); };
  const save = () => {
    if (!form.nom || !form.montantDu) { toast.error("Nom et montant requis"); return; }
    if (editing) { dataStore.updateRelance(editing.id, form); toast.success("Dossier mis à jour"); }
    else { dataStore.addRelance(form); toast.success("Dossier ajouté"); }
    setOpen(false);
  };

  const updateHour = (j: Jour, patch: Partial<DayHours>) => setHours((h) => ({ ...h, [j]: { ...h[j], ...patch } }));

  return (
    <>
      <PageHeader title="Relance IA" description="Automatisez le recouvrement des impayés" />
      <main className="flex-1 p-4 md:p-6">
        <Tabs defaultValue="liste">
          <div className="flex justify-center mb-6">
            <TabsList>
              <TabsTrigger value="liste" className="gap-2"><BellRing className="h-4 w-4" />Relances</TabsTrigger>
              <TabsTrigger value="config" className="gap-2"><Settings2 className="h-4 w-4" />Configuration</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="liste" className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="overflow-hidden hover:shadow-lg transition"><div className="h-1 bg-[color:var(--brand)]" />
                <CardContent className="pt-6 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl brand-gradient flex items-center justify-center shadow"><DollarSign className="h-5 w-5 text-white" /></div>
                  <div><div className="text-2xl font-bold">{total.toLocaleString()} MAD</div><div className="text-xs text-muted-foreground">Total dû</div></div>
                </CardContent></Card>
              <Card className="overflow-hidden hover:shadow-lg transition"><div className="h-1 bg-[color:var(--brand-accent)]" />
                <CardContent className="pt-6 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl brand-gradient-warm flex items-center justify-center shadow"><BellRing className="h-5 w-5 text-white" /></div>
                  <div><div className="text-2xl font-bold">{relances.length}</div><div className="text-xs text-muted-foreground">Dossiers actifs</div></div>
                </CardContent></Card>
              <Card className="overflow-hidden hover:shadow-lg transition"><div className="h-1 bg-red-500" />
                <CardContent className="pt-6 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-red-500 flex items-center justify-center shadow"><MailCheck className="h-5 w-5 text-white" /></div>
                  <div><div className="text-2xl font-bold">{nbEscal}</div><div className="text-xs text-muted-foreground">Escaladés</div></div>
                </CardContent></Card>
            </div>

            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex flex-wrap gap-3">
                  <div className="relative flex-1 min-w-[220px]">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Rechercher..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-10" />
                  </div>
                  <Select value={stat} onValueChange={setStat}>
                    <SelectTrigger className="w-40"><SelectValue placeholder="Statut" /></SelectTrigger>
                    <SelectContent><SelectItem value="all">Tous statuts</SelectItem>{statuts.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                  {canUpdate && filtered.length > 0 && <Button variant="outline" onClick={() => filtered.forEach(relancer)}>Relancer tous ({filtered.length})</Button>}
                  {canCreate && <Button className="brand-gradient-warm text-white gap-2" onClick={openCreate}><Plus className="h-4 w-4" />Ajouter</Button>}
                </div>

                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Formation</TableHead>
                        <TableHead className="text-right">Montant dû</TableHead>
                        <TableHead>Échéance</TableHead>
                        <TableHead>Relances</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell><div className="font-medium">{r.nom}</div><div className="text-xs text-muted-foreground">{r.telephone}</div></TableCell>
                          <TableCell className="text-sm">{r.formation}</TableCell>
                          <TableCell className="text-right font-semibold text-[color:var(--brand)]">{r.montantDu.toLocaleString()} MAD</TableCell>
                          <TableCell className="text-xs">{r.dateEcheance}</TableCell>
                          <TableCell><Badge variant="secondary">{r.nbRelances} / {maxRelances[0]}</Badge></TableCell>
                          <TableCell><Badge variant="outline" className={statClr[r.statut]}>{r.statut}</Badge></TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button size="icon" variant="ghost" onClick={() => setSel(r)} title="Voir détails"><Eye className="h-4 w-4" /></Button>
                            {canUpdate && <Button size="icon" variant="ghost" onClick={() => relancer(r)} title="Relancer"><Send className="h-4 w-4" /></Button>}
                            {canUpdate && <Button size="icon" variant="ghost" onClick={() => openEdit(r)} title="Modifier"><Pencil className="h-4 w-4" /></Button>}
                            {canDelete && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild><Button size="icon" variant="ghost" className="text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader><AlertDialogTitle>Supprimer ce dossier ?</AlertDialogTitle><AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription></AlertDialogHeader>
                                  <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => { dataStore.removeRelance(r.id); toast.success("Supprimé"); }} className="bg-red-600 hover:bg-red-700">Supprimer</AlertDialogAction></AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {filtered.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Aucune relance</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-[color:var(--brand-accent)]" />Cadence des relances</CardTitle>
                  <CardDescription>Configurez la fréquence et la limite d'envoi</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2"><Label>Nombre maximum de relances</Label><span className="font-bold text-[color:var(--brand)]">{maxRelances[0]}</span></div>
                    <Slider value={maxRelances} onValueChange={setMaxRelances} min={1} max={10} step={1} disabled={!canUpdate} />
                    <p className="text-xs text-muted-foreground mt-1">Après {maxRelances[0]} relances sans paiement, escalade automatique.</p>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2"><Label>Délai entre chaque relance</Label><span className="font-bold text-[color:var(--brand)]">{delaiEntre[0]} jours</span></div>
                    <Slider value={delaiEntre} onValueChange={setDelaiEntre} min={1} max={30} step={1} disabled={!canUpdate} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2"><Label>Attente avant la 1ère relance</Label><span className="font-bold text-[color:var(--brand)]">{attentePremiere[0]} jours</span></div>
                    <Slider value={attentePremiere} onValueChange={setAttentePremiere} min={0} max={30} step={1} disabled={!canUpdate} />
                    <p className="text-xs text-muted-foreground mt-1">Délai après la date d'échéance avant la première relance.</p>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border bg-amber-50">
                    <div><Label className="cursor-pointer">Escalade automatique</Label><p className="text-xs text-muted-foreground">Transfert à la comptabilité après épuisement</p></div>
                    <Switch checked={autoEscalade} onCheckedChange={setAutoEscalade} disabled={!canUpdate} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><CalendarClock className="h-5 w-5 text-[color:var(--brand-accent)]" />Heures de réponse par jour</CardTitle>
                  <CardDescription>Fenêtre horaire d'envoi propre à chaque jour de la semaine</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {JOURS.map((j) => {
                    const h = hours[j];
                    return (
                      <div key={j} className={`grid grid-cols-[80px_1fr_1fr_auto] items-center gap-3 rounded-xl border p-3 transition ${h.actif ? "bg-background" : "bg-muted/40 opacity-70"}`}>
                        <div className="font-semibold text-sm">{j}</div>
                        <div>
                          <Label className="text-[10px] uppercase text-muted-foreground">Début</Label>
                          <Input type="time" value={h.debut} onChange={(e) => updateHour(j, { debut: e.target.value })} disabled={!canUpdate || !h.actif} />
                        </div>
                        <div>
                          <Label className="text-[10px] uppercase text-muted-foreground">Fin</Label>
                          <Input type="time" value={h.fin} onChange={(e) => updateHour(j, { fin: e.target.value })} disabled={!canUpdate || !h.actif} />
                        </div>
                        <Switch checked={h.actif} onCheckedChange={(v) => updateHour(j, { actif: v })} disabled={!canUpdate} />
                      </div>
                    );
                  })}
                  {canUpdate && <Button className="btn-shine brand-gradient-warm text-white w-full mt-2" onClick={() => toast.success("Configuration enregistrée")}>Enregistrer la configuration</Button>}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <DialogContent className="max-w-xl">
          {sel && (<>
            <DialogHeader><DialogTitle className="text-xl">{sel.nom}</DialogTitle><DialogDescription>{sel.email} · {sel.telephone}</DialogDescription></DialogHeader>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-xl border bg-muted/30"><div className="text-[10px] uppercase tracking-wider text-muted-foreground">Formation</div><div className="font-medium">{sel.formation}</div></div>
                <div className="p-3 rounded-xl border bg-muted/30"><div className="text-[10px] uppercase tracking-wider text-muted-foreground">Montant dû</div><div className="font-bold text-[color:var(--brand)]">{sel.montantDu.toLocaleString()} MAD</div></div>
                <div className="p-3 rounded-xl border bg-muted/30"><div className="text-[10px] uppercase tracking-wider text-muted-foreground">Échéance</div><div className="font-medium">{sel.dateEcheance}</div></div>
                <div className="p-3 rounded-xl border bg-muted/30"><div className="text-[10px] uppercase tracking-wider text-muted-foreground">Dernière relance</div><div className="font-medium">{sel.derniereRelance ?? "—"}</div></div>
              </div>
              <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">Statut :</span><Badge variant="outline" className={statClr[sel.statut]}>{sel.statut}</Badge></div>
            </div>
            <DialogFooter className="gap-2">
              {canUpdate && <Button variant="outline" onClick={() => { dataStore.updateRelance(sel.id, { statut: "Payé" }); toast.success("Marqué comme payé"); setSel(null); }}>Marquer payé</Button>}
              {canUpdate && <Button className="btn-shine brand-gradient-warm text-white gap-1" onClick={() => relancer(sel)}><Send className="h-4 w-4" />Relancer</Button>}
            </DialogFooter>
          </>)}
        </DialogContent>
      </Dialog>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Modifier" : "Nouveau"} dossier</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Nom</Label><Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} /></div>
              <div><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div><Label>Téléphone</Label><Input value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} /></div>
              <div><Label>Montant dû (MAD)</Label><Input type="number" value={form.montantDu} onChange={(e) => setForm({ ...form, montantDu: +e.target.value })} /></div>
              <div><Label>Échéance</Label><Input type="date" value={form.dateEcheance} onChange={(e) => setForm({ ...form, dateEcheance: e.target.value })} /></div>
              <div><Label>Statut</Label><Select value={form.statut} onValueChange={(v) => setForm({ ...form, statut: v as Relance["statut"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{statuts.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div><Label>Formation</Label>
              <Select value={form.formation} onValueChange={(v) => setForm({ ...form, formation: v })}>
                <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                <SelectContent>{formations.map((f) => <SelectItem key={f.id} value={f.nom}>{f.nom}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter><Button className="btn-shine brand-gradient-warm text-white" onClick={save}>Enregistrer</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
