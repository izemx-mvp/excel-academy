import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { authStore, useUsers, useCurrentUser, SECTIONS, type AppUser, type Perm, type Role, type Section, type Permissions } from "@/lib/auth-store";
import { PermissionDenied } from "@/components/permission-guard";
import { Users2, Plus, Pencil, Trash2, Search, ShieldCheck, UserCog } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/utilisateurs")({
  head: () => ({ meta: [{ title: "Gestion des utilisateurs — Excel Academy" }] }),
  component: UsersPage,
});

const permsAll = (v: boolean): Permissions => Object.fromEntries(
  SECTIONS.map((s) => [s.id, { read: v, create: v, update: v, delete: v }])
) as Permissions;

function emptyForm(): Omit<AppUser, "id" | "createdAt"> {
  return { nom: "", email: "", telephone: "", role: "collaborateur", actif: true, permissions: permsAll(false) };
}

function UsersPage() {
  const users = useUsers();
  const me = useCurrentUser();
  const [q, setQ] = useState("");
  const [role, setRole] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AppUser | null>(null);
  const [form, setForm] = useState(emptyForm());

  if (me?.role !== "admin") {
    return (
      <>
        <PageHeader title="Gestion des utilisateurs" />
        <PermissionDenied label="gérer les utilisateurs" />
      </>
    );
  }

  const filtered = useMemo(
    () => users.filter((u) =>
      (role === "all" || u.role === role) &&
      (q === "" || u.nom.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()))
    ),
    [users, q, role]
  );

  const openCreate = () => { setEditing(null); setForm(emptyForm()); setOpen(true); };
  const openEdit = (u: AppUser) => { setEditing(u); setForm({ nom: u.nom, email: u.email, telephone: u.telephone, role: u.role, actif: u.actif, permissions: u.permissions }); setOpen(true); };

  const save = () => {
    if (!form.nom || !form.email) { toast.error("Nom et email requis"); return; }
    const perms = form.role === "admin" ? permsAll(true) : form.permissions;
    if (editing) {
      authStore.update(editing.id, { ...form, permissions: perms });
      toast.success("Utilisateur mis à jour");
    } else {
      authStore.add({ ...form, permissions: perms });
      toast.success("Utilisateur créé");
    }
    setOpen(false);
  };

  const remove = (u: AppUser) => {
    if (u.id === me?.id) { toast.error("Vous ne pouvez pas supprimer votre propre compte"); return; }
    authStore.remove(u.id);
    toast.success(`${u.nom} supprimé`);
  };

  const toggleActive = (u: AppUser) => {
    authStore.update(u.id, { actif: !u.actif });
    toast.success(`Compte ${!u.actif ? "activé" : "désactivé"}`);
  };

  return (
    <>
      <PageHeader title="Gestion des utilisateurs" description="Créez et gérez les accès des collaborateurs" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { l: "Utilisateurs", v: users.length, i: Users2, c: "brand-gradient" },
            { l: "Admins", v: users.filter((u) => u.role === "admin").length, i: ShieldCheck, c: "brand-gradient-warm" },
            { l: "Actifs", v: users.filter((u) => u.actif).length, i: UserCog, c: "bg-gradient-to-br from-emerald-500 to-teal-500" },
          ].map((s) => (
            <Card key={s.l} className="hover:shadow-lg transition">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl ${s.c} flex items-center justify-center shadow`}>
                  <s.i className="h-6 w-6 text-white" />
                </div>
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
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous rôles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="collaborateur">Collaborateur</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="brand-gradient-warm text-white gap-2 shadow-md" onClick={openCreate}>
                    <Plus className="h-4 w-4" />Nouvel utilisateur
                  </Button>
                </DialogTrigger>
                <UserFormDialog editing={editing} form={form} setForm={setForm} onSave={save} />
              </Dialog>
            </div>

            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Accès activés</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((u) => {
                    const activeSecs = u.role === "admin" ? SECTIONS.length : SECTIONS.filter((s) => u.permissions[s.id]?.read).length;
                    return (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full brand-gradient text-white flex items-center justify-center font-semibold text-xs shrink-0">
                              {u.nom.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                            </div>
                            <div>
                              <div className="font-medium">{u.nom}</div>
                              <div className="text-xs text-muted-foreground">Créé le {u.createdAt}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><div className="text-sm">{u.email}</div><div className="text-xs text-muted-foreground">{u.telephone}</div></TableCell>
                        <TableCell>
                          {u.role === "admin"
                            ? <Badge className="brand-gradient-warm text-white border-0 gap-1"><ShieldCheck className="h-3 w-3" />Admin</Badge>
                            : <Badge variant="outline">Collaborateur</Badge>}
                        </TableCell>
                        <TableCell><Badge variant="secondary">{activeSecs} / {SECTIONS.length}</Badge></TableCell>
                        <TableCell>
                          <Switch checked={u.actif} onCheckedChange={() => toggleActive(u)} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="icon" variant="ghost" onClick={() => openEdit(u)}><Pencil className="h-4 w-4" /></Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer {u.nom} ?</AlertDialogTitle>
                                <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction onClick={() => remove(u)} className="bg-red-600 hover:bg-red-700">Supprimer</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filtered.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Aucun utilisateur</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

function UserFormDialog({
  editing,
  form,
  setForm,
  onSave,
}: {
  editing: AppUser | null;
  form: Omit<AppUser, "id" | "createdAt">;
  setForm: (f: Omit<AppUser, "id" | "createdAt">) => void;
  onSave: () => void;
}) {
  const setPerm = (sec: Section, p: Perm, v: boolean) => {
    setForm({ ...form, permissions: { ...form.permissions, [sec]: { ...form.permissions[sec], [p]: v } } });
  };
  const bulkForSection = (sec: Section, v: boolean) => {
    setForm({ ...form, permissions: { ...form.permissions, [sec]: { read: v, create: v, update: v, delete: v } } });
  };

  return (
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{editing ? "Modifier l'utilisateur" : "Nouvel utilisateur"}</DialogTitle>
        <DialogDescription>Configurez le rôle et les permissions par interface</DialogDescription>
      </DialogHeader>
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2"><Label>Nom complet</Label><Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} /></div>
          <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="space-y-2"><Label>Téléphone</Label><Input value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} /></div>
          <div className="space-y-2">
            <Label>Rôle</Label>
            <Select value={form.role} onValueChange={(v: Role) => setForm({ ...form, role: v, permissions: v === "admin" ? permsAll(true) : form.permissions })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin — accès total</SelectItem>
                <SelectItem value="collaborateur">Collaborateur — permissions ciblées</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-semibold text-sm">Permissions par interface</div>
              <p className="text-xs text-muted-foreground">Cochez les actions CRUD autorisées</p>
            </div>
            {form.role === "admin" && <Badge className="brand-gradient-warm text-white border-0">Admin : accès total</Badge>}
          </div>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Interface</TableHead>
                  <TableHead className="text-center">Lire</TableHead>
                  <TableHead className="text-center">Créer</TableHead>
                  <TableHead className="text-center">Modifier</TableHead>
                  <TableHead className="text-center">Supprimer</TableHead>
                  <TableHead className="text-right">Tout</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {SECTIONS.map((s) => {
                  const isAdmin = form.role === "admin";
                  const p = isAdmin ? { read: true, create: true, update: true, delete: true } : form.permissions[s.id];
                  const all = p.read && p.create && p.update && p.delete;
                  return (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.label}</TableCell>
                      {(["read", "create", "update", "delete"] as Perm[]).map((k) => (
                        <TableCell key={k} className="text-center">
                          <Checkbox checked={p[k]} disabled={isAdmin} onCheckedChange={(v) => setPerm(s.id, k, !!v)} />
                        </TableCell>
                      ))}
                      <TableCell className="text-right">
                        <Switch checked={all} disabled={isAdmin} onCheckedChange={(v) => bulkForSection(s.id, v)} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/30">
          <Switch checked={form.actif} onCheckedChange={(v) => setForm({ ...form, actif: v })} />
          <div>
            <Label className="cursor-pointer">Compte actif</Label>
            <p className="text-xs text-muted-foreground">Un compte inactif ne peut pas se connecter</p>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button className="brand-gradient-warm text-white" onClick={onSave}>{editing ? "Enregistrer" : "Créer l'utilisateur"}</Button>
      </DialogFooter>
    </DialogContent>
  );
}
