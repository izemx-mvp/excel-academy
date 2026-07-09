import { useSyncExternalStore } from "react";
import {
  formations as seedFormations,
  contacts as seedContacts,
  socials as seedSocials,
  faqs as seedFaqs,
  documents as seedDocs,
  qualifications as seedQuals,
  reclamations as seedReclams,
  relances as seedRelances,
  designs as seedDesigns,
  kbBlocks as seedKbBlocks,
  type Contact,
  type Socials,
  type Formation,
  type Qualification,
  type Reclamation,
  type Relance,
  type Design,
  type KbBlock,
  type TicketMessage,
} from "./mock-data";

type Faq = (typeof seedFaqs)[number];
type Doc = (typeof seedDocs)[number];

type State = {
  formations: Formation[];
  contacts: Contact[];
  socials: Socials;
  faqs: Faq[];
  documents: Doc[];
  qualifications: Qualification[];
  reclamations: Reclamation[];
  relances: Relance[];
  designs: Design[];
  kbBlocks: KbBlock[];
};

const KEY = "excel_data_v5";

const seed = (): State => ({
  formations: seedFormations,
  contacts: seedContacts,
  socials: seedSocials,
  faqs: seedFaqs,
  documents: seedDocs,
  qualifications: seedQuals,
  reclamations: seedReclams,
  relances: seedRelances,
  designs: seedDesigns,
  kbBlocks: seedKbBlocks,
});


const load = (): State => {
  if (typeof window === "undefined") return seed();
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : seed();
  } catch {
    return seed();
  }
};

let state: State = load();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const persist = () => {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(state));
  emit();
};

const uid = () => `${Date.now()}${Math.floor(Math.random() * 1000)}`;

export const dataStore = {
  subscribe(cb: () => void) { listeners.add(cb); return () => listeners.delete(cb); },
  snapshot() { return state; },
  reset() { state = seed(); persist(); },

  addFormation(f: Omit<Formation, "id">) { state = { ...state, formations: [{ ...f, id: uid() }, ...state.formations] }; persist(); },
  updateFormation(id: string, p: Partial<Formation>) { state = { ...state, formations: state.formations.map((x) => x.id === id ? { ...x, ...p } : x) }; persist(); },
  removeFormation(id: string) { state = { ...state, formations: state.formations.filter((x) => x.id !== id) }; persist(); },

  addContact(c: Contact) { state = { ...state, contacts: [c, ...state.contacts] }; persist(); },
  updateContact(dept: string, p: Partial<Contact>) { state = { ...state, contacts: state.contacts.map((x) => x.departement === dept ? { ...x, ...p } : x) }; persist(); },
  removeContact(dept: string) { state = { ...state, contacts: state.contacts.filter((x) => x.departement !== dept) }; persist(); },

  updateSocials(p: Partial<Socials>) { state = { ...state, socials: { ...state.socials, ...p } }; persist(); },


  addFaq(f: Faq) { state = { ...state, faqs: [f, ...state.faqs] }; persist(); },
  updateFaq(oldQ: string, p: Partial<Faq>) { state = { ...state, faqs: state.faqs.map((x) => x.q === oldQ ? { ...x, ...p } : x) }; persist(); },
  removeFaq(q: string) { state = { ...state, faqs: state.faqs.filter((x) => x.q !== q) }; persist(); },

  addDoc(d: Doc) { state = { ...state, documents: [d, ...state.documents] }; persist(); },
  updateDoc(oldName: string, p: Partial<Doc>) { state = { ...state, documents: state.documents.map((x) => x.nom === oldName ? { ...x, ...p } : x) }; persist(); },
  removeDoc(nom: string) { state = { ...state, documents: state.documents.filter((x) => x.nom !== nom) }; persist(); },

  addQual(q: Omit<Qualification, "id">) { state = { ...state, qualifications: [{ ...q, id: uid() }, ...state.qualifications] }; persist(); },
  updateQual(id: string, p: Partial<Qualification>) { state = { ...state, qualifications: state.qualifications.map((x) => x.id === id ? { ...x, ...p } : x) }; persist(); },
  removeQual(id: string) { state = { ...state, qualifications: state.qualifications.filter((x) => x.id !== id) }; persist(); },

  addReclam(r: Omit<Reclamation, "id">) { state = { ...state, reclamations: [{ ...r, id: uid(), messages: r.messages ?? [] }, ...state.reclamations] }; persist(); },
  updateReclam(id: string, p: Partial<Reclamation>) { state = { ...state, reclamations: state.reclamations.map((x) => x.id === id ? { ...x, ...p } : x) }; persist(); },
  removeReclam(id: string) { state = { ...state, reclamations: state.reclamations.filter((x) => x.id !== id) }; persist(); },
  addReclamMessage(id: string, msg: Omit<TicketMessage, "id" | "at">) {
    state = { ...state, reclamations: state.reclamations.map((x) => x.id === id ? { ...x, messages: [...(x.messages ?? []), { ...msg, id: uid(), at: new Date().toISOString().slice(0, 16).replace("T", " ") }] } : x) };
    persist();
  },

  addRelance(r: Omit<Relance, "id">) { state = { ...state, relances: [{ ...r, id: uid() }, ...state.relances] }; persist(); },
  updateRelance(id: string, p: Partial<Relance>) { state = { ...state, relances: state.relances.map((x) => x.id === id ? { ...x, ...p } : x) }; persist(); },
  removeRelance(id: string) { state = { ...state, relances: state.relances.filter((x) => x.id !== id) }; persist(); },

  addDesign(d: Omit<Design, "id">) { state = { ...state, designs: [{ ...d, id: uid() }, ...state.designs] }; persist(); },
  updateDesign(id: string, p: Partial<Design>) { state = { ...state, designs: state.designs.map((x) => x.id === id ? { ...x, ...p } : x) }; persist(); },
  removeDesign(id: string) { state = { ...state, designs: state.designs.filter((x) => x.id !== id) }; persist(); },

  addBlock(b: Omit<KbBlock, "id">) { state = { ...state, kbBlocks: [{ ...b, id: uid() }, ...state.kbBlocks] }; persist(); },
  updateBlock(id: string, p: Partial<KbBlock>) { state = { ...state, kbBlocks: state.kbBlocks.map((x) => x.id === id ? { ...x, ...p } : x) }; persist(); },
  removeBlock(id: string) { state = { ...state, kbBlocks: state.kbBlocks.filter((x) => x.id !== id) }; persist(); },
};

export function useData() {
  return useSyncExternalStore(dataStore.subscribe, dataStore.snapshot, seed);
}
