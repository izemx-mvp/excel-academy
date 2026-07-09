import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { dataStore, useData } from "@/lib/data-store";
import type { KbBlock } from "@/lib/mock-data";
import { toast } from "sonner";

type Props = {
  sectionKey: string;
  emptyLabel?: string;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  numbered?: boolean;
};

export function KbBlocksSection({ sectionKey, emptyLabel = "Aucun élément", canCreate, canUpdate, canDelete, numbered }: Props) {
  const { kbBlocks } = useData();
  const blocks = kbBlocks.filter((b) => b.section === sectionKey);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<KbBlock | null>(null);
  const [form, setForm] = useState({ title: "", body: "" });

  const openCreate = () => { setEditing(null); setForm({ title: "", body: "" }); setOpen(true); };
  const openEdit = (b: KbBlock) => { setEditing(b); setForm({ title: b.title, body: b.body }); setOpen(true); };
  const save = () => {
    if (!form.title) { toast.error("Titre requis"); return; }
    if (editing) { dataStore.updateBlock(editing.id, form); toast.success("Mis à jour"); }
    else { dataStore.addBlock({ section: sectionKey, ...form }); toast.success("Ajouté"); }
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      {canCreate && (
        <div className="flex justify-end">
          <Button onClick={openCreate} className="btn-shine brand-gradient-warm text-white gap-2 shadow-elegant">
            <Plus className="h-4 w-4" />Nouveau
          </Button>
        </div>
      )}
      <div className="grid gap-3 md:grid-cols-2">
        {blocks.map((b, i) => (
          <Card key={b.id} className="card-hover border-l-4 border-l-[color:var(--brand-accent)]">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-start gap-3">
                {numbered && (
                  <div className="h-8 w-8 rounded-full brand-gradient-warm text-white flex items-center justify-center font-bold text-sm shrink-0 shadow">
                    {i + 1}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{b.title}</div>
                  <div className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{b.body}</div>
                </div>
                <div className="flex gap-1 shrink-0">
                  {canUpdate && (
                    <Button size="icon" variant="ghost" onClick={() => openEdit(b)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {canDelete && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost" className="text-red-600 hover:bg-red-50">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer ?</AlertDialogTitle>
                          <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => { dataStore.removeBlock(b.id); toast.success("Supprimé"); }} className="bg-red-600 hover:bg-red-700">Supprimer</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {blocks.length === 0 && <p className="col-span-2 text-center text-sm text-muted-foreground py-8">{emptyLabel}</p>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Modifier" : "Nouveau"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Titre</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Contenu</Label><Textarea rows={5} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></div>
          </div>
          <DialogFooter><Button className="btn-shine brand-gradient-warm text-white" onClick={save}>Enregistrer</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
