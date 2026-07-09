import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { dataStore, useData } from "@/lib/data-store";
import { useCan, PermissionDenied } from "@/components/permission-guard";
import { useUsers, useCurrentUser } from "@/lib/auth-store";
import type { Reclamation } from "@/lib/mock-data";
import { Search, Eye, CheckCircle2, ArrowUpRight, AlertTriangle, MessageSquareWarning, Plus, Pencil, Trash2, Send, UserCheck, Lock } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/reclamations")({
  head: () => ({ meta: [{ title: "Réclamations IA — Excel Academy" }] }),
  component: ReclamPage,
});

const prioClr: Record<Reclamation["priorite"], string> = {
  Basse: "bg-slate-100 text-slate-700 border-slate-200",
  Moyenne: "bg-blue-100 text-blue-700 border-blue-200",
  Haute: "bg-orange-100 text-orange-700 border-orange-200",
  Urgente: "bg-red-100 text-red-700 border-red-200",
};
const statClr: Record<Reclamation["statut"], string> = {
  Nouvelle: "bg-blue-100 text-blue-700 border-blue-200",
  "En cours": "bg-amber-100 text-amber-700 border-amber-200",
  Résolue: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Escaladée: "bg-red-100 text-red-700 border-red-200",
};
const cats: Reclamation["categorie"][] = ["Pédagogique", "Administrative", "Financière", "Transport", "Hébergement"];
const prios: Reclamation["priorite"][] = ["Basse", "Moyenne", "Haute", "Urgente"];
const stats: Reclamation["statut"][] = ["Nouvelle", "En cours", "Résolue", "Escaladée"];

function emptyForm(): Omit<Reclamation, "id"> {
  return { nom: "", email: "", telephone: "", categorie: "Administrative", priorite: "Moyenne", statut: "Nouvelle", sujet: "", description: "", date: new Date().toISOString().slice(0, 10), messages: [] };
}

function ReclamPage() {
  const canRead = useCan("reclamations", "read");
  const canCreate = useCan("reclamations", "create");
  const canUpdate = useCan("reclamations", "update");
  const canDelete = useCan("reclamations", "delete");

  const { reclamations } = useData();
  const users = useUsers();
  const me = useCurrentUser();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [prio, setPrio] = useState("all");
  const [stat, setStat] = useState("all");
  const [sel, setSel] = useState<Reclamation | null>(null);
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Reclamation | null>(null);
  const [form, setForm] = useState<Omit<Reclamation, "id">>(emptyForm());

  // Keep sel in sync with store
  const current = sel ? reclamations.find((r) => r.id === sel.id) ?? null : null;

  if (!canRead) return (<><PageHeader title="Réclamations IA" /><PermissionDenied label="consulter les réclamations" /></>);

  const filtered = useMemo(() => reclamations.filter((r) =>
    (cat === "all" || r.categorie === cat) &&
    (prio === "all" || r.priorite === prio) &&
    (stat === "all" || r.statut === stat) &&
    (q === "" || r.nom.toLowerCase().includes(q.toLowerCase()) || r.sujet.toLowerCase().includes(q.toLowerCase()))
  ), [reclamations, q, cat, prio, stat]);

  const summary = [
    { l: "Nouvelles", v: reclamations.filter((i) => i.statut === "Nouvelle").length, c: "bg-blue-500", i: MessageSquareWarning },
    { l: "En cours", v: reclamations.filter((i) => i.statut === "En cours").length, c: "bg-amber-500", i: AlertTriangle },
    { l: "Escaladées", v: reclamations.filter((i) => i.statut === "Escaladée").length, c: "bg-red-500", i: ArrowUpRight },
    { l: "Résolues", v: reclamations.filter((i) => i.statut === "Résolue").length, c: "bg-emerald-500", i: CheckCircle2 },
  ];

  const setStatus = (id: string, s: Reclamation["statut"]) => dataStore.updateReclam(id, { statut: s });
  const assign = (id: string, userId: string) => {
    const u = users.find((x) => x.id === userId);
    dataStore.updateReclam(id, { assigneeId: userId, assigneeNom: u?.nom, statut: "En cours" });
    toast.success(`Ticket assigné à ${u?.nom}`);
  };
  const sendMessage = (r: Reclamation) => {
    if (!msg.trim()) return;
    dataStore.addReclamMessage(r.id, { from: "agent", author: me?.nom ?? "Agent", text: msg.trim() });
    setMsg("");
  };

  const openCreate = () => { setEditing(null); setForm(emptyForm()); setOpen(true); };
  const openEdit = (r: Reclamation) => { setEditing(r); setForm(r); setOpen(true); setSel(null); };
  const save = () => {
    if (!form.nom || !form.sujet) { toast.error("Nom et sujet requis"); return; }
    if (editing) { dataStore.updateReclam(editing.id, form); toast.success("Réclamation mise à jour"); }
    else { dataStore.addReclam(form); toast.success("Réclamation ajoutée"); }
    setOpen(false);
  };

  const ticketOpen = current && current.statut !== "Résolue";

  return (
    <>
      <PageHeader title="Réclamations IA" description="Tickets clients — assignation, échanges et résolution" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
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
              <Select value={cat} onValueChange={setCat}><SelectTrigger className="w-44"><SelectValue placeholder="Catégorie" /></SelectTrigger><SelectContent><SelectItem value="all">Toutes catégories</SelectItem>{cats.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
              <Select value={prio} onValueChange={setPrio}><SelectTrigger className="w-36"><SelectValue placeholder="Priorité" /></SelectTrigger><SelectContent><SelectItem value="all">Toutes priorités</SelectItem>{prios.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
              <Select value={stat} onValueChange={setStat}><SelectTrigger className="w-36"><SelectValue placeholder="Statut" /></SelectTrigger><SelectContent><SelectItem value="all">Tous statuts</SelectItem>{stats.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
              {canCreate && <Button className="brand-gradient-warm text-white gap-2" onClick={openCreate}><Plus className="h-4 w-4" />Ajouter</Button>}
            </div>

            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Sujet</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Priorité</TableHead>
                    <TableHead>Assigné à</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell><div className="font-medium">{r.nom}</div><div className="text-xs text-muted-foreground">{r.email}</div></TableCell>
                      <TableCell className="max-w-[220px] truncate">{r.sujet}</TableCell>
                      <TableCell><Badge variant="outline">{r.categorie}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className={prioClr[r.priorite]}>{r.priorite}</Badge></TableCell>
                      <TableCell className="text-xs">{r.assigneeNom ?? <span className="text-muted-foreground italic">Non assigné</span>}</TableCell>
                      <TableCell><Badge variant="outline" className={statClr[r.statut]}>{r.statut}</Badge></TableCell>
                      <TableCell className="text-xs">{r.date}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button size="icon" variant="ghost" onClick={() => { setSel(r); setMsg(""); }}><Eye className="h-4 w-4" /></Button>
                        {canUpdate && <Button size="icon" variant="ghost" onClick={() => openEdit(r)}><Pencil className="h-4 w-4" /></Button>}
                        {canDelete && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild><Button size="icon" variant="ghost" className="text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader><AlertDialogTitle>Supprimer cette réclamation ?</AlertDialogTitle><AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription></AlertDialogHeader>
                              <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => { dataStore.removeReclam(r.id); toast.success("Supprimé"); }} className="bg-red-600 hover:bg-red-700">Supprimer</AlertDialogAction></AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">Aucune réclamation</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Ticket detail */}
      <Dialog open={!!current} onOpenChange={(o) => !o && setSel(null)}>
        <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
          {current && (<>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">Ticket #{current.id.slice(-4)} · {current.sujet}</DialogTitle>
              <DialogDescription>{current.nom} · {current.email} · {current.telephone}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{current.categorie}</Badge>
                <Badge variant="outline" className={prioClr[current.priorite]}>{current.priorite}</Badge>
                <Badge variant="outline" className={statClr[current.statut]}>{current.statut}</Badge>
              </div>

              <div className="p-3 rounded-lg border-l-4 border-l-[color:var(--brand-accent)] bg-muted/30">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Problème du client</div>
                <div className="text-sm">{current.description}</div>
              </div>

              {canUpdate && (
                <div className="grid grid-cols-[1fr_auto] gap-2 items-end">
                  <div>
                    <Label className="text-xs flex items-center gap-1 mb-1"><UserCheck className="h-3 w-3" />Assigner à un agent</Label>
                    <Select value={current.assigneeId ?? ""} onValueChange={(v) => assign(current.id, v)}>
                      <SelectTrigger><SelectValue placeholder="Choisir un agent..." /></SelectTrigger>
                      <SelectContent>{users.filter((u) => u.actif).map((u) => <SelectItem key={u.id} value={u.id}>{u.nom} · {u.role}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Conversation</div>
                <div className="rounded-xl border bg-muted/20 p-3 space-y-2 max-h-72 overflow-y-auto">
                  {(current.messages ?? []).length === 0 && <p className="text-xs text-muted-foreground italic text-center py-4">Aucun message. Démarrez l'échange avec le client ci-dessous.</p>}
                  {(current.messages ?? []).map((m) => {
                    const mine = m.from === "agent";
                    return (
                      <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm ${mine ? "bg-[color:var(--brand)] text-white rounded-br-sm" : "bg-white border rounded-bl-sm"}`}>
                          <div className={`text-[10px] uppercase tracking-wider mb-0.5 ${mine ? "text-white/70" : "text-muted-foreground"}`}>{m.author} · {m.at}</div>
                          <div className="whitespace-pre-wrap">{m.text}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {canUpdate && ticketOpen ? (
                  <div className="mt-2 flex gap-2">
                    <Textarea rows={2} placeholder="Répondre au client..." value={msg} onChange={(e) => setMsg(e.target.value)} />
                    <Button className="brand-gradient-warm text-white shrink-0 h-auto" onClick={() => sendMessage(current)}><Send className="h-4 w-4" /></Button>
                  </div>
                ) : (
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground p-2 rounded-lg bg-muted/50"><Lock className="h-3.5 w-3.5" />Ticket résolu — conversation verrouillée.</div>
                )}
              </div>
            </div>
            <DialogFooter className="flex-wrap gap-2">
              {canUpdate && ticketOpen && <>
                <Button variant="outline" className="gap-1" onClick={() => { setStatus(current.id, "Escaladée"); toast.success("Escaladée à la direction"); }}><ArrowUpRight className="h-4 w-4" />Escalader</Button>
                <Button className="brand-gradient-warm text-white gap-1" onClick={() => { setStatus(current.id, "Résolue"); toast.success("Ticket résolu"); }}><CheckCircle2 className="h-4 w-4" />Marquer résolu</Button>
              </>}
            </DialogFooter>
          </>)}
        </DialogContent>
      </Dialog>

      {/* Create/Edit */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Modifier" : "Nouvelle"} réclamation</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Nom</Label><Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} /></div>
              <div><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div><Label>Téléphone</Label><Input value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} /></div>
              <div><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
              <div><Label>Catégorie</Label><Select value={form.categorie} onValueChange={(v) => setForm({ ...form, categorie: v as Reclamation["categorie"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{cats.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Priorité</Label><Select value={form.priorite} onValueChange={(v) => setForm({ ...form, priorite: v as Reclamation["priorite"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{prios.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Statut</Label><Select value={form.statut} onValueChange={(v) => setForm({ ...form, statut: v as Reclamation["statut"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{stats.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Assigné à</Label>
                <Select value={form.assigneeId ?? ""} onValueChange={(v) => { const u = users.find((x) => x.id === v); setForm({ ...form, assigneeId: v, assigneeNom: u?.nom }); }}>
                  <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                  <SelectContent>{users.filter((u) => u.actif).map((u) => <SelectItem key={u.id} value={u.id}>{u.nom}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Sujet</Label><Input value={form.sujet} onChange={(e) => setForm({ ...form, sujet: e.target.value })} /></div>
            <div><Label>Problème du client</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          </div>
          <DialogFooter><Button className="brand-gradient-warm text-white" onClick={save}>Enregistrer</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
