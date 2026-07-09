import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger } from "@/components/ui/dialog";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { dataStore, useData } from "@/lib/data-store";
import { useCan, PermissionDenied } from "@/components/permission-guard";
import { KbBlocksSection } from "@/components/kb-blocks-section";
import { FileText, Download, Search, Pencil, Trash2, Plus, School, Calendar, CreditCard, HomeIcon, HelpCircle, ArrowUpRight, Building2, Clock, Mail, Phone } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import type { Formation } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/base-connaissance")({
  head: () => ({ meta: [{ title: "Base de connaissance IA — Excel Academy" }] }),
  component: Base,
});

function Base() {
  const canRead = useCan("base-connaissance", "read");
  const canCreate = useCan("base-connaissance", "create");
  const canUpdate = useCan("base-connaissance", "update");
  const canDelete = useCan("base-connaissance", "delete");

  if (!canRead) {
    return (<><PageHeader title="Base de connaissance IA" /><PermissionDenied label="consulter la base de connaissance" /></>);
  }

  return (
    <>
      <PageHeader title="Base de connaissance IA" description="Toutes les données que votre agent IA utilise" />
      <main className="flex-1 p-4 md:p-6">
        <Tabs defaultValue="ecole" className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="flex-wrap h-auto">
              <TabsTrigger value="ecole" className="gap-2"><School className="h-4 w-4" />École & Formations</TabsTrigger>
              <TabsTrigger value="inscriptions" className="gap-2"><CreditCard className="h-4 w-4" />Inscriptions & Paiement</TabsTrigger>
              <TabsTrigger value="vie" className="gap-2"><HomeIcon className="h-4 w-4" />Vie scolaire</TabsTrigger>
              <TabsTrigger value="faq" className="gap-2"><HelpCircle className="h-4 w-4" />FAQ</TabsTrigger>
              <TabsTrigger value="escalade" className="gap-2"><ArrowUpRight className="h-4 w-4" />Escalade</TabsTrigger>
            </TabsList>
          </div>

          {/* École & Formations */}
          <TabsContent value="ecole">
            <Tabs defaultValue="contacts">
              <div className="flex justify-center mb-4">
                <TabsList>
                  <TabsTrigger value="contacts">Adresses & Contacts</TabsTrigger>
                  <TabsTrigger value="formations">Formations</TabsTrigger>
                  <TabsTrigger value="calendrier">Calendrier</TabsTrigger>
                  <TabsTrigger value="docs">Documents</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="contacts"><ContactsTab canCreate={canCreate} canUpdate={canUpdate} canDelete={canDelete} /></TabsContent>
              <TabsContent value="formations"><FormationsTab canCreate={canCreate} canUpdate={canUpdate} canDelete={canDelete} /></TabsContent>
              <TabsContent value="calendrier"><CalendrierTab canCreate={canCreate} canUpdate={canUpdate} canDelete={canDelete} /></TabsContent>
              <TabsContent value="docs"><DocsTab category="Formations" canCreate={canCreate} canUpdate={canUpdate} canDelete={canDelete} /></TabsContent>
            </Tabs>
          </TabsContent>

          {/* Inscriptions & Paiement */}
          <TabsContent value="inscriptions">
            <Tabs defaultValue="procedure">
              <div className="flex justify-center mb-4">
                <TabsList>
                  <TabsTrigger value="procedure">Procédure</TabsTrigger>
                  <TabsTrigger value="tarifs">Tarifs</TabsTrigger>
                  <TabsTrigger value="paiement">Modalités</TabsTrigger>
                  <TabsTrigger value="politique">Retard / Annulation</TabsTrigger>
                  <TabsTrigger value="docs">Documents</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="procedure">
                <KbBlocksSection sectionKey="procedure" canCreate={canCreate} canUpdate={canUpdate} canDelete={canDelete} numbered />
              </TabsContent>
              <TabsContent value="tarifs"><TarifsTab /></TabsContent>
              <TabsContent value="paiement">
                <KbBlocksSection sectionKey="paiement" canCreate={canCreate} canUpdate={canUpdate} canDelete={canDelete} />
              </TabsContent>
              <TabsContent value="politique">
                <KbBlocksSection sectionKey="politique" canCreate={canCreate} canUpdate={canUpdate} canDelete={canDelete} />
              </TabsContent>
              <TabsContent value="docs"><DocsTab category="Inscriptions" canCreate={canCreate} canUpdate={canUpdate} canDelete={canDelete} /></TabsContent>
            </Tabs>
          </TabsContent>

          {/* Vie scolaire */}
          <TabsContent value="vie">
            <Tabs defaultValue="reglement">
              <div className="flex justify-center mb-4">
                <TabsList>
                  <TabsTrigger value="reglement">Règlement</TabsTrigger>
                  <TabsTrigger value="edt">Emploi du temps</TabsTrigger>
                  <TabsTrigger value="hebergement">Hébergement</TabsTrigger>
                  <TabsTrigger value="transport">Transport</TabsTrigger>
                  <TabsTrigger value="docs">Documents</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="reglement">
                <KbBlocksSection sectionKey="reglement" canCreate={canCreate} canUpdate={canUpdate} canDelete={canDelete} />
              </TabsContent>
              <TabsContent value="edt">
                <KbBlocksSection sectionKey="edt" canCreate={canCreate} canUpdate={canUpdate} canDelete={canDelete} />
              </TabsContent>
              <TabsContent value="hebergement">
                <KbBlocksSection sectionKey="hebergement" canCreate={canCreate} canUpdate={canUpdate} canDelete={canDelete} />
              </TabsContent>
              <TabsContent value="transport">
                <KbBlocksSection sectionKey="transport" canCreate={canCreate} canUpdate={canUpdate} canDelete={canDelete} />
              </TabsContent>
              <TabsContent value="docs"><DocsTab category="Vie scolaire" canCreate={canCreate} canUpdate={canUpdate} canDelete={canDelete} /></TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="faq"><FaqTab canCreate={canCreate} canUpdate={canUpdate} canDelete={canDelete} /></TabsContent>
          <TabsContent value="escalade">
            <KbBlocksSection sectionKey="escalade" canCreate={canCreate} canUpdate={canUpdate} canDelete={canDelete} />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}

type CrudProps = { canCreate: boolean; canUpdate: boolean; canDelete: boolean };

function ContactsTab({ canCreate, canUpdate, canDelete }: CrudProps) {
  const { contacts } = useData();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<typeof contacts[number] | null>(null);
  const [form, setForm] = useState({ departement: "", responsable: "", email: "", tel: "", horaires: "" });

  const openCreate = () => { setEditing(null); setForm({ departement: "", responsable: "", email: "", tel: "", horaires: "" }); setOpen(true); };
  const openEdit = (c: typeof contacts[number]) => { setEditing(c); setForm(c); setOpen(true); };
  const save = () => {
    if (!form.departement || !form.responsable) { toast.error("Champs requis"); return; }
    if (editing) { dataStore.updateContact(editing.departement, form); toast.success("Contact mis à jour"); }
    else { dataStore.addContact(form); toast.success("Contact ajouté"); }
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      {canCreate && <div className="flex justify-end"><Button onClick={openCreate} className="brand-gradient-warm text-white gap-2"><Plus className="h-4 w-4" />Nouveau contact</Button></div>}
      <div className="grid gap-4 md:grid-cols-2">
        {contacts.map((c) => (
          <Card key={c.departement} className="hover:shadow-lg transition">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg brand-gradient flex items-center justify-center shrink-0"><Building2 className="h-5 w-5 text-white" /></div>
                <div className="flex-1">
                  <div className="font-semibold">{c.departement}</div>
                  <div className="text-sm mt-1">{c.responsable}</div>
                  <div className="text-xs text-muted-foreground mt-2 space-y-1">
                    <div className="flex items-center gap-2"><Mail className="h-3 w-3" />{c.email}</div>
                    <div className="flex items-center gap-2"><Phone className="h-3 w-3" />{c.tel}</div>
                    <div className="flex items-center gap-2"><Clock className="h-3 w-3" />{c.horaires}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  {canUpdate && <Button size="icon" variant="ghost" onClick={() => openEdit(c)}><Pencil className="h-3.5 w-3.5" /></Button>}
                  {canDelete && <ConfirmDelete label={c.departement} onDelete={() => { dataStore.removeContact(c.departement); toast.success("Contact supprimé"); }} />}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Modifier" : "Nouveau"} contact</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Département</Label><Input value={form.departement} onChange={(e) => setForm({ ...form, departement: e.target.value })} disabled={!!editing} /></div>
            <div><Label>Responsable</Label><Input value={form.responsable} onChange={(e) => setForm({ ...form, responsable: e.target.value })} /></div>
            <div><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><Label>Téléphone</Label><Input value={form.tel} onChange={(e) => setForm({ ...form, tel: e.target.value })} /></div>
            <div><Label>Horaires</Label><Input value={form.horaires} onChange={(e) => setForm({ ...form, horaires: e.target.value })} /></div>
          </div>
          <DialogFooter><Button className="brand-gradient-warm text-white" onClick={save}>Enregistrer</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FormationsTab({ canCreate, canUpdate, canDelete }: CrudProps) {
  const { formations } = useData();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Formation | null>(null);
  const [form, setForm] = useState<Omit<Formation, "id">>({ nom: "", duree: "", prerequis: "", debouches: "", frais: 0 });

  const openCreate = () => { setEditing(null); setForm({ nom: "", duree: "", prerequis: "", debouches: "", frais: 0 }); setOpen(true); };
  const openEdit = (f: Formation) => { setEditing(f); setForm(f); setOpen(true); };
  const save = () => {
    if (!form.nom) { toast.error("Nom requis"); return; }
    if (editing) { dataStore.updateFormation(editing.id, form); toast.success("Formation mise à jour"); }
    else { dataStore.addFormation(form); toast.success("Formation ajoutée"); }
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      {canCreate && <div className="flex justify-end"><Button onClick={openCreate} className="brand-gradient-warm text-white gap-2"><Plus className="h-4 w-4" />Nouvelle formation</Button></div>}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {formations.map((f) => (
          <Card key={f.id} className="hover:shadow-lg transition">
            <div className="h-1 brand-gradient-warm" />
            <CardContent className="pt-6 space-y-2 text-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="font-semibold">{f.nom}</div>
                <div className="flex gap-1 shrink-0">
                  {canUpdate && <Button size="icon" variant="ghost" onClick={() => openEdit(f)}><Pencil className="h-3.5 w-3.5" /></Button>}
                  {canDelete && <ConfirmDelete label={f.nom} onDelete={() => { dataStore.removeFormation(f.id); toast.success("Formation supprimée"); }} />}
                </div>
              </div>
              <div><span className="text-muted-foreground">Durée :</span> <strong>{f.duree}</strong></div>
              <div><span className="text-muted-foreground">Prérequis :</span> {f.prerequis}</div>
              <div><span className="text-muted-foreground">Débouchés :</span> {f.debouches}</div>
              <div className="font-semibold text-[color:var(--brand)]">{f.frais.toLocaleString()} MAD /an</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Modifier" : "Nouvelle"} formation</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Nom</Label><Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Durée</Label><Input value={form.duree} onChange={(e) => setForm({ ...form, duree: e.target.value })} /></div>
              <div><Label>Prérequis</Label><Input value={form.prerequis} onChange={(e) => setForm({ ...form, prerequis: e.target.value })} /></div>
            </div>
            <div><Label>Débouchés</Label><Input value={form.debouches} onChange={(e) => setForm({ ...form, debouches: e.target.value })} /></div>
            <div><Label>Frais annuels (MAD)</Label><Input type="number" value={form.frais} onChange={(e) => setForm({ ...form, frais: +e.target.value })} /></div>
          </div>
          <DialogFooter><Button className="brand-gradient-warm text-white" onClick={save}>Enregistrer</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CalendrierTab({ canCreate, canUpdate, canDelete }: CrudProps) {
  const { calendrier } = useData();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<typeof calendrier[number] | null>(null);
  const [form, setForm] = useState({ evt: "", date: "" });

  const save = () => {
    if (!form.evt || !form.date) { toast.error("Champs requis"); return; }
    if (editing) { dataStore.updateEvent(editing.evt, form); toast.success("Événement mis à jour"); }
    else { dataStore.addEvent(form); toast.success("Événement ajouté"); }
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      {canCreate && <div className="flex justify-end"><Button onClick={() => { setEditing(null); setForm({ evt: "", date: "" }); setOpen(true); }} className="brand-gradient-warm text-white gap-2"><Plus className="h-4 w-4" />Nouvel événement</Button></div>}
      <Card><CardContent className="p-0"><Table>
        <TableHeader><TableRow><TableHead>Événement</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
        <TableBody>
          {calendrier.map((e) => (
            <TableRow key={e.evt}>
              <TableCell className="font-medium flex items-center gap-2"><Calendar className="h-4 w-4 text-[color:var(--brand-accent)]" />{e.evt}</TableCell>
              <TableCell>{e.date}</TableCell>
              <TableCell className="text-right">
                {canUpdate && <Button size="icon" variant="ghost" onClick={() => { setEditing(e); setForm(e); setOpen(true); }}><Pencil className="h-3.5 w-3.5" /></Button>}
                {canDelete && <ConfirmDelete label={e.evt} onDelete={() => { dataStore.removeEvent(e.evt); toast.success("Supprimé"); }} />}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table></CardContent></Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Modifier" : "Nouvel"} événement</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Événement</Label><Input value={form.evt} onChange={(e) => setForm({ ...form, evt: e.target.value })} /></div>
            <div><Label>Date</Label><Input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="ex: 05 septembre 2025" /></div>
          </div>
          <DialogFooter><Button className="brand-gradient-warm text-white" onClick={save}>Enregistrer</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TarifsTab() {
  const { formations } = useData();
  return <Card><CardContent className="p-0"><Table>
    <TableHeader><TableRow><TableHead>Formation</TableHead><TableHead>Durée</TableHead><TableHead className="text-right">Frais annuels</TableHead></TableRow></TableHeader>
    <TableBody>
      {formations.map((f) => (
        <TableRow key={f.id}>
          <TableCell className="font-medium">{f.nom}</TableCell>
          <TableCell>{f.duree}</TableCell>
          <TableCell className="text-right font-semibold text-[color:var(--brand)]">{f.frais.toLocaleString()} MAD</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table></CardContent></Card>;
}

function DocsTab({ category, canCreate, canUpdate, canDelete }: { category: string } & CrudProps) {
  const { documents } = useData();
  const docs = documents.filter((d) => d.categorie === category);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<typeof documents[number] | null>(null);
  const [form, setForm] = useState({ nom: "", type: "PDF", categorie: category, taille: "" });

  const save = () => {
    if (!form.nom) { toast.error("Nom requis"); return; }
    if (editing) { dataStore.updateDoc(editing.nom, form); toast.success("Document mis à jour"); }
    else { dataStore.addDoc(form); toast.success("Document ajouté"); }
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      {canCreate && <div className="flex justify-end"><Button onClick={() => { setEditing(null); setForm({ nom: "", type: "PDF", categorie: category, taille: "" }); setOpen(true); }} className="brand-gradient-warm text-white gap-2"><Plus className="h-4 w-4" />Nouveau document</Button></div>}
      <div className="grid gap-3 md:grid-cols-2">
        {docs.map((d) => (
          <Card key={d.nom} className="hover:shadow-md transition">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[color:var(--brand-accent)]/10 flex items-center justify-center"><FileText className="h-5 w-5 text-[color:var(--brand-accent)]" /></div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{d.nom}</div>
                <div className="text-xs text-muted-foreground">{d.type} · {d.taille}</div>
              </div>
              <Button size="icon" variant="ghost" onClick={() => toast.success(`${d.nom} téléchargé`)}><Download className="h-4 w-4" /></Button>
              {canUpdate && <Button size="icon" variant="ghost" onClick={() => { setEditing(d); setForm(d); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>}
              {canDelete && <ConfirmDelete label={d.nom} onDelete={() => { dataStore.removeDoc(d.nom); toast.success("Supprimé"); }} />}
            </CardContent>
          </Card>
        ))}
        {docs.length === 0 && <p className="col-span-2 text-center text-sm text-muted-foreground py-8">Aucun document</p>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Modifier" : "Nouveau"} document</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Nom</Label><Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="PDF">PDF</SelectItem><SelectItem value="Excel">Excel</SelectItem><SelectItem value="Word">Word</SelectItem></SelectContent>
                </Select>
              </div>
              <div><Label>Taille</Label><Input value={form.taille} onChange={(e) => setForm({ ...form, taille: e.target.value })} placeholder="ex: 2.4 MB" /></div>
            </div>
          </div>
          <DialogFooter><Button className="brand-gradient-warm text-white" onClick={save}>Enregistrer</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FaqTab({ canCreate, canUpdate, canDelete }: CrudProps) {
  const { faqs } = useData();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<typeof faqs[number] | null>(null);
  const [form, setForm] = useState({ q: "", r: "", cat: "Général" });
  const filtered = useMemo(() => faqs.filter((f) => f.q.toLowerCase().includes(q.toLowerCase()) || f.r.toLowerCase().includes(q.toLowerCase())), [faqs, q]);
  const cats = ["Général", "Inscription", "Paiement", "Transport", "Hébergement", "Pédagogique"];

  const save = () => {
    if (!form.q || !form.r) { toast.error("Champs requis"); return; }
    if (editing) { dataStore.updateFaq(editing.q, form); toast.success("FAQ mise à jour"); }
    else { dataStore.addFaq(form); toast.success("FAQ ajoutée"); }
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher dans la FAQ..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-10" />
        </div>
        {canCreate && <Button onClick={() => { setEditing(null); setForm({ q: "", r: "", cat: "Général" }); setOpen(true); }} className="brand-gradient-warm text-white gap-2"><Plus className="h-4 w-4" />Nouvelle FAQ</Button>}
      </div>
      <div className="space-y-2">
        {filtered.map((f, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex gap-3 items-start">
              <Badge variant="secondary" className="shrink-0 mt-1">{f.cat}</Badge>
              <div className="flex-1">
                <div className="font-medium text-sm">{f.q}</div>
                <div className="text-sm text-muted-foreground mt-1">{f.r}</div>
              </div>
              <div className="flex gap-1 shrink-0">
                {canUpdate && <Button size="icon" variant="ghost" onClick={() => { setEditing(f); setForm(f); setOpen(true); }}><Pencil className="h-3.5 w-3.5" /></Button>}
                {canDelete && <ConfirmDelete label="cette FAQ" onDelete={() => { dataStore.removeFaq(f.q); toast.success("Supprimé"); }} />}
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">Aucun résultat</p>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Modifier" : "Nouvelle"} FAQ</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Catégorie</Label>
              <Select value={form.cat} onValueChange={(v) => setForm({ ...form, cat: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{cats.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Question</Label><Input value={form.q} onChange={(e) => setForm({ ...form, q: e.target.value })} /></div>
            <div><Label>Réponse</Label><Textarea rows={4} value={form.r} onChange={(e) => setForm({ ...form, r: e.target.value })} /></div>
          </div>
          <DialogFooter><Button className="brand-gradient-warm text-white" onClick={save}>Enregistrer</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


function ConfirmDelete({ label, onDelete }: { label: string; onDelete: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="ghost" className="text-red-600 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer {label} ?</AlertDialogTitle>
          <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">Supprimer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
