import { useSyncExternalStore } from "react";

export type Section = "base-connaissance" | "qualification" | "reclamations" | "relance" | "utilisateurs";
export type Perm = "read" | "create" | "update" | "delete";
export type Role = "admin" | "collaborateur";

export type Permissions = Record<Section, Record<Perm, boolean>>;

export type AppUser = {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  role: Role;
  actif: boolean;
  createdAt: string;
  permissions: Permissions;
};

const ALL: Permissions = {
  "base-connaissance": { read: true, create: true, update: true, delete: true },
  qualification: { read: true, create: true, update: true, delete: true },
  reclamations: { read: true, create: true, update: true, delete: true },
  relance: { read: true, create: true, update: true, delete: true },
  utilisateurs: { read: true, create: true, update: true, delete: true },
};

const emptyPerms = (): Permissions => ({
  "base-connaissance": { read: false, create: false, update: false, delete: false },
  qualification: { read: false, create: false, update: false, delete: false },
  reclamations: { read: false, create: false, update: false, delete: false },
  relance: { read: false, create: false, update: false, delete: false },
  utilisateurs: { read: false, create: false, update: false, delete: false },
});

export const DEFAULT_USERS: AppUser[] = [
  {
    id: "u1",
    nom: "Admin Excel",
    email: "admin@excelacademy.ma",
    telephone: "0524 33 21 10",
    role: "admin",
    actif: true,
    createdAt: "2026-01-05",
    permissions: ALL,
  },
  {
    id: "u2",
    nom: "Fatima Zahra",
    email: "scolarite@excelacademy.ma",
    telephone: "0524 33 21 11",
    role: "collaborateur",
    actif: true,
    createdAt: "2026-02-10",
    permissions: {
      ...emptyPerms(),
      "base-connaissance": { read: true, create: true, update: true, delete: false },
      qualification: { read: true, create: true, update: true, delete: false },
      reclamations: { read: true, create: false, update: true, delete: false },
      relance: { read: true, create: false, update: false, delete: false },
    },
  },
  {
    id: "u3",
    nom: "Youssef Benali",
    email: "compta@excelacademy.ma",
    telephone: "0524 33 21 12",
    role: "collaborateur",
    actif: true,
    createdAt: "2026-03-01",
    permissions: {
      ...emptyPerms(),
      relance: { read: true, create: true, update: true, delete: true },
      reclamations: { read: true, create: false, update: true, delete: false },
    },
  },
  {
    id: "u4",
    nom: "Naima Idrissi",
    email: "vie-scolaire@excelacademy.ma",
    telephone: "0524 33 21 13",
    role: "collaborateur",
    actif: false,
    createdAt: "2026-04-15",
    permissions: {
      ...emptyPerms(),
      qualification: { read: true, create: false, update: false, delete: false },
      reclamations: { read: true, create: true, update: true, delete: false },
    },
  },
];

const KEY = "excel_users_v1";
const CUR = "excel_current_user";

const load = (): AppUser[] => {
  if (typeof window === "undefined") return DEFAULT_USERS;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
};

let users: AppUser[] = load();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const persist = () => {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(users));
  emit();
};

export const authStore = {
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  snapshot() {
    return users;
  },
  reset() {
    users = DEFAULT_USERS;
    persist();
  },
  add(u: Omit<AppUser, "id" | "createdAt">) {
    const nu: AppUser = {
      ...u,
      id: `u${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    users = [nu, ...users];
    persist();
    return nu;
  },
  update(id: string, patch: Partial<AppUser>) {
    users = users.map((u) => (u.id === id ? { ...u, ...patch } : u));
    persist();
  },
  remove(id: string) {
    users = users.filter((u) => u.id !== id);
    persist();
  },
  setCurrent(email: string) {
    if (typeof window !== "undefined") localStorage.setItem(CUR, email);
    emit();
  },
  currentEmail(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(CUR);
  },
  current(): AppUser | null {
    const email = this.currentEmail();
    return users.find((u) => u.email === email) ?? null;
  },
  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(CUR);
      localStorage.removeItem("excel_auth");
    }
    emit();
  },
};

export function useUsers() {
  return useSyncExternalStore(authStore.subscribe, authStore.snapshot, () => DEFAULT_USERS);
}

export function useCurrentUser(): AppUser | null {
  useSyncExternalStore(authStore.subscribe, authStore.snapshot, () => DEFAULT_USERS);
  return authStore.current();
}

export function can(user: AppUser | null, section: Section, perm: Perm): boolean {
  if (!user) return false;
  if (user.role === "admin") return true;
  return !!user.permissions?.[section]?.[perm];
}

export const SECTIONS: { id: Section; label: string }[] = [
  { id: "base-connaissance", label: "Base de connaissance IA" },
  { id: "qualification", label: "Qualification IA" },
  { id: "reclamations", label: "Réclamations IA" },
  { id: "relance", label: "Relance IA" },
  { id: "utilisateurs", label: "Gestion utilisateurs" },
];
