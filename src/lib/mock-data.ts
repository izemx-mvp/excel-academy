export const DEMO_CREDENTIALS = {
  email: "admin@excelacademy.ma",
  password: "Excel@2026",
};

export type Formation = {
  id: string;
  nom: string;
  duree: string;
  prerequis: string;
  debouches: string;
  frais: number;
  dateDebut?: string;
};

export const formations: Formation[] = [
  { id: "f1", nom: "Baccalauréat Sciences Maths", duree: "3 ans", prerequis: "Brevet", debouches: "Écoles d'ingénieurs", frais: 32000, dateDebut: "05 septembre 2025" },
  { id: "f2", nom: "Baccalauréat Sciences Exp.", duree: "3 ans", prerequis: "Brevet", debouches: "Médecine, Pharmacie", frais: 30000, dateDebut: "05 septembre 2025" },
  { id: "f3", nom: "Baccalauréat Économie", duree: "3 ans", prerequis: "Brevet", debouches: "Commerce, Gestion", frais: 28000, dateDebut: "05 septembre 2025" },
  { id: "f4", nom: "Classe Préparatoire", duree: "2 ans", prerequis: "Bac +", debouches: "Grandes Écoles", frais: 45000, dateDebut: "15 septembre 2025" },
  { id: "f5", nom: "Primaire", duree: "6 ans", prerequis: "-", debouches: "Collège", frais: 22000, dateDebut: "05 septembre 2025" },
  { id: "f6", nom: "Collège", duree: "3 ans", prerequis: "CEP", debouches: "Lycée", frais: 25000, dateDebut: "05 septembre 2025" },
];

export const JOURS_SEMAINE = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"] as const;
export type JourSemaine = typeof JOURS_SEMAINE[number];
export type DayHours = { actif: boolean; debut: string; fin: string };
export type HoursByDay = Record<JourSemaine, DayHours>;

export function defaultHoursByDay(): HoursByDay {
  return {
    Lun: { actif: true, debut: "08:00", fin: "17:00" },
    Mar: { actif: true, debut: "08:00", fin: "17:00" },
    Mer: { actif: true, debut: "08:00", fin: "17:00" },
    Jeu: { actif: true, debut: "08:00", fin: "17:00" },
    Ven: { actif: true, debut: "08:00", fin: "17:00" },
    Sam: { actif: true, debut: "09:00", fin: "13:00" },
    Dim: { actif: false, debut: "10:00", fin: "13:00" },
  };
}

export function formatHours(h: HoursByDay | undefined, fallback = ""): string {
  if (!h) return fallback;
  const parts: string[] = [];
  let i = 0;
  while (i < JOURS_SEMAINE.length) {
    const j = JOURS_SEMAINE[i];
    if (!h[j].actif) { i++; continue; }
    let k = i;
    while (k + 1 < JOURS_SEMAINE.length && h[JOURS_SEMAINE[k + 1]].actif && h[JOURS_SEMAINE[k + 1]].debut === h[j].debut && h[JOURS_SEMAINE[k + 1]].fin === h[j].fin) k++;
    parts.push(i === k ? `${j} ${h[j].debut}-${h[j].fin}` : `${j}-${JOURS_SEMAINE[k]} ${h[j].debut}-${h[j].fin}`);
    i = k + 1;
  }
  return parts.join(" · ") || "Fermé";
}

export type Contact = {
  departement: string;
  responsable: string;
  email: string;
  tel: string;
  horaires: string;
  horairesJours?: HoursByDay;
  adresse?: string;
};

export type Socials = {
  website?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  tiktok?: string;
  youtube?: string;
  whatsapp?: string;
};

export const socials: Socials = {
  website: "https://excelacademy.ma",
  facebook: "https://facebook.com/excelacademy.ma",
  instagram: "https://instagram.com/excelacademy.ma",
  linkedin: "https://linkedin.com/school/excelacademy",
  tiktok: "https://tiktok.com/@excelacademy.ma",
  youtube: "https://youtube.com/@excelacademy",
  whatsapp: "https://wa.me/212524332110",
};

export const contacts: Contact[] = [
  { departement: "Direction Générale — Campus Guéliz", responsable: "M. Karim El Amrani", email: "direction@excelacademy.ma", tel: "0524 33 21 10", horaires: "Lun-Ven 8h-17h", adresse: "Av. Mohammed V, Guéliz, Marrakech" },
  { departement: "Scolarité — Campus Hivernage", responsable: "Mme Fatima Zahra", email: "scolarite@excelacademy.ma", tel: "0524 33 21 11", horaires: "Lun-Sam 8h-16h", adresse: "Rue Ibn Aicha, Hivernage, Marrakech" },
  { departement: "Comptabilité", responsable: "M. Youssef Benali", email: "compta@excelacademy.ma", tel: "0524 33 21 12", horaires: "Lun-Ven 9h-16h", adresse: "Av. Mohammed V, Guéliz, Marrakech" },
  { departement: "Vie Scolaire", responsable: "Mme Naima Idrissi", email: "vie-scolaire@excelacademy.ma", tel: "0524 33 21 13", horaires: "Lun-Ven 8h-18h", adresse: "Campus Targa, Marrakech" },
];


export const faqs = [
  { q: "Quels sont les horaires d'ouverture ?", r: "Nos bureaux sont ouverts du lundi au vendredi de 8h à 17h et le samedi de 8h à 13h.", cat: "Général" },
  { q: "Comment puis-je m'inscrire ?", r: "L'inscription se fait en ligne via notre plateforme ou directement au bureau de la scolarité avec les documents requis.", cat: "Inscription" },
  { q: "Quels sont les moyens de paiement acceptés ?", r: "Nous acceptons les virements bancaires, chèques, espèces et paiement par carte bancaire.", cat: "Paiement" },
  { q: "Y a-t-il un service de transport scolaire ?", r: "Oui, nous couvrons 8 zones de Marrakech. Les tarifs varient selon la zone.", cat: "Transport" },
  { q: "L'école propose-t-elle un hébergement ?", r: "Oui, nous disposons de chambres individuelles et partagées avec réservation obligatoire.", cat: "Hébergement" },
  { q: "Quelle est la politique d'annulation ?", r: "Annulation possible jusqu'à 15 jours avant la rentrée avec remboursement à 70%.", cat: "Paiement" },
  { q: "Quel est le règlement intérieur concernant les absences ?", r: "Toute absence doit être justifiée sous 48h. Au-delà de 3 absences non justifiées, un avertissement est adressé aux parents.", cat: "Vie scolaire" },
];

export const documents = [
  { nom: "Brochure Bac Sciences Maths", type: "PDF", categorie: "Formations", taille: "2.4 MB" },
  { nom: "Calendrier académique 2025-2026", type: "PDF", categorie: "Formations", taille: "890 KB" },
  { nom: "Plaquette générale", type: "PDF", categorie: "Formations", taille: "5.1 MB" },
  { nom: "Formulaire d'inscription", type: "PDF", categorie: "Inscriptions", taille: "340 KB" },
  { nom: "Grille tarifaire 2025-2026", type: "Excel", categorie: "Inscriptions", taille: "120 KB" },
  { nom: "Règlement intérieur", type: "PDF", categorie: "Vie scolaire", taille: "1.2 MB" },
  { nom: "Plan des zones transport", type: "PDF", categorie: "Vie scolaire", taille: "780 KB" },
];

export const PHASES = ["Nouveau", "Contacté", "RDV planifié", "Visite école", "Gagné", "Perdu", "Abandonné"] as const;
export type PhaseProspect = typeof PHASES[number];

export type Qualification = {
  id: string;
  nom: string;
  telephone: string;
  email: string;
  formation: string;
  budget: string;
  score: number;
  statut: "Chaud" | "Tiède" | "Froid";
  phase: PhaseProspect;
  date: string;
  notes: string;
  motifPerte?: string;
};

export const qualifications: Qualification[] = [
  { id: "q1", nom: "Sara Benjelloun", telephone: "0661 234 567", email: "sara.b@gmail.com", formation: "Bac Sciences Maths", budget: "30-35k MAD", score: 92, statut: "Chaud", phase: "RDV planifié", date: "2026-07-08", notes: "Très motivée, demande visite de l'établissement" },
  { id: "q2", nom: "Ahmed Tazi", telephone: "0662 345 678", email: "a.tazi@gmail.com", formation: "Classe Préparatoire", budget: "40-50k MAD", score: 88, statut: "Chaud", phase: "Visite école", date: "2026-07-07", notes: "Frère déjà inscrit" },
  { id: "q3", nom: "Leila Fassi", telephone: "0663 456 789", email: "leila.f@outlook.com", formation: "Bac Économie", budget: "25-30k MAD", score: 65, statut: "Tiède", phase: "Contacté", date: "2026-07-06", notes: "Compare avec autre école" },
  { id: "q4", nom: "Mehdi Alaoui", telephone: "0664 567 890", email: "mehdi.a@yahoo.fr", formation: "Bac Sciences Exp.", budget: "25-30k MAD", score: 71, statut: "Tiède", phase: "Contacté", date: "2026-07-05", notes: "Attente de bourse" },
  { id: "q5", nom: "Yasmine Chraibi", telephone: "0665 678 901", email: "y.chraibi@gmail.com", formation: "Collège", budget: "20-25k MAD", score: 45, statut: "Froid", phase: "Nouveau", date: "2026-07-04", notes: "Simple demande d'info" },
  { id: "q6", nom: "Omar Bennis", telephone: "0666 789 012", email: "omar.bennis@gmail.com", formation: "Bac Sciences Maths", budget: "30-35k MAD", score: 84, statut: "Chaud", phase: "Gagné", date: "2026-07-03", notes: "Inscription confirmée — acompte versé" },
  { id: "q7", nom: "Kenza Amrani", telephone: "0667 890 123", email: "k.amrani@gmail.com", formation: "Bac Économie", budget: "25-30k MAD", score: 30, statut: "Froid", phase: "Perdu", date: "2026-07-02", notes: "A choisi une autre école", motifPerte: "Concurrence — prix" },
];

export type TicketMessage = {
  id: string;
  from: "agent" | "client";
  author: string;
  text: string;
  at: string;
};

export type Reclamation = {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  categorie: "Pédagogique" | "Administrative" | "Financière" | "Transport" | "Hébergement";
  priorite: "Basse" | "Moyenne" | "Haute" | "Urgente";
  statut: "Nouvelle" | "En cours" | "Résolue" | "Escaladée";
  sujet: string;
  description: string;
  date: string;
  assigneeId?: string;
  assigneeNom?: string;
  messages?: TicketMessage[];
};

export const reclamations: Reclamation[] = [
  { id: "r1", nom: "Karim Bourhim", email: "k.bourhim@gmail.com", telephone: "0671 111 222", categorie: "Pédagogique", priorite: "Haute", statut: "En cours", sujet: "Retard livraison manuels", description: "Les manuels du 2ème trimestre ne sont pas encore distribués.", date: "2026-07-08", assigneeId: "u2", assigneeNom: "Fatima Zahra", messages: [
    { id: "m1", from: "client", author: "Karim Bourhim", text: "Bonjour, mon fils n'a toujours pas reçu ses manuels alors que le trimestre commence lundi.", at: "2026-07-08 09:12" },
    { id: "m2", from: "agent", author: "Fatima Zahra", text: "Bonjour M. Bourhim, je vérifie avec le fournisseur et reviens vers vous aujourd'hui.", at: "2026-07-08 10:45" },
  ]},
  { id: "r2", nom: "Salma El Idrissi", email: "salma.ei@gmail.com", telephone: "0672 222 333", categorie: "Financière", priorite: "Urgente", statut: "Escaladée", sujet: "Double prélèvement", description: "Prélèvement en double sur mon compte pour les frais de mars.", date: "2026-07-07", assigneeId: "u3", assigneeNom: "Youssef Benali", messages: [] },
  { id: "r3", nom: "Nabil Rachidi", email: "n.rachidi@outlook.com", telephone: "0673 333 444", categorie: "Transport", priorite: "Moyenne", statut: "Résolue", sujet: "Bus en retard", description: "Le bus zone 4 arrive systématiquement en retard depuis 2 semaines.", date: "2026-07-05", messages: [] },
  { id: "r4", nom: "Amina Sqalli", email: "a.sqalli@gmail.com", telephone: "0674 444 555", categorie: "Administrative", priorite: "Basse", statut: "Nouvelle", sujet: "Attestation de scolarité", description: "Attente d'attestation depuis 3 semaines.", date: "2026-07-08", messages: [] },
  { id: "r5", nom: "Rachid Kabbaj", email: "r.kabbaj@gmail.com", telephone: "0675 555 666", categorie: "Hébergement", priorite: "Moyenne", statut: "En cours", sujet: "Problème climatisation chambre", description: "Climatisation chambre 204 en panne depuis 5 jours.", date: "2026-07-06", assigneeId: "u4", assigneeNom: "Naima Idrissi", messages: [] },
];

export type Relance = {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  formation: string;
  montantDu: number;
  dateEcheance: string;
  nbRelances: number;
  derniereRelance: string | null;
  statut: "En attente" | "Relancé" | "Payé" | "Escaladé";
};

export const relances: Relance[] = [
  { id: "l1", nom: "Hicham Berrada", email: "h.berrada@gmail.com", telephone: "0681 111 222", formation: "Bac Sciences Maths", montantDu: 8000, dateEcheance: "2026-06-15", nbRelances: 2, derniereRelance: "2026-07-02", statut: "Relancé" },
  { id: "l2", nom: "Nadia El Mansouri", email: "nadia.em@gmail.com", telephone: "0682 222 333", formation: "Classe Préparatoire", montantDu: 15000, dateEcheance: "2026-06-01", nbRelances: 3, derniereRelance: "2026-07-06", statut: "Escaladé" },
  { id: "l3", nom: "Younes Chakir", email: "y.chakir@gmail.com", telephone: "0683 333 444", formation: "Bac Économie", montantDu: 5500, dateEcheance: "2026-07-01", nbRelances: 0, derniereRelance: null, statut: "En attente" },
  { id: "l4", nom: "Fatima Zahra Alami", email: "fz.alami@gmail.com", telephone: "0684 444 555", formation: "Collège", montantDu: 4200, dateEcheance: "2026-06-20", nbRelances: 1, derniereRelance: "2026-06-28", statut: "Relancé" },
  { id: "l5", nom: "Anas Filali", email: "anas.f@gmail.com", telephone: "0685 555 666", formation: "Bac Sciences Exp.", montantDu: 7500, dateEcheance: "2026-06-10", nbRelances: 2, derniereRelance: "2026-07-04", statut: "Relancé" },
  { id: "l6", nom: "Meryem Ouazzani", email: "m.ouazzani@gmail.com", telephone: "0686 666 777", formation: "Primaire", montantDu: 3800, dateEcheance: "2026-07-05", nbRelances: 0, derniereRelance: null, statut: "En attente" },
];

import flyerBacSm from "@/assets/design-flyer-bac-sm.jpg";
import postPortesOuvertes from "@/assets/design-post-portes-ouvertes.jpg";
import bannerBourses from "@/assets/design-banner-bourses.jpg";
import emailPrepa from "@/assets/design-email-prepa.jpg";
import whatsappRelance from "@/assets/design-whatsapp-relance.jpg";

export type Design = {
  id: string;
  titre: string;
  type: "Flyer" | "Post réseaux sociaux" | "Bannière web" | "Affiche" | "Texte marketing" | "Email campagne";
  canal: "Instagram" | "Facebook" | "LinkedIn" | "Site web" | "Impression" | "WhatsApp" | "Email" | "TikTok" | "YouTube";
  format: string;
  brief: string;
  cible: string;
  statut: "Brouillon" | "En génération" | "Prêt" | "Publié";
  createdAt: string;
  imageUrl?: string;
  slogan?: string;
  cta?: string;
  hashtags?: string;
  palette?: string;
  ton?: "Institutionnel" | "Chaleureux" | "Festif" | "Élégant" | "Urgent" | "Éducatif";
  dateEvenement?: string;
  budget?: number;
  contenu?: string;
};

export const designs: Design[] = [
  { id: "d1", titre: "Rentrée 2025-2026 — Bac Sciences Maths", type: "Flyer", canal: "Impression", format: "A5 vertical (148×210 mm)", brief: "Mettre en avant les taux de réussite (98%) et les débouchés vers les grandes écoles d'ingénieurs.", cible: "Parents d'élèves 3ème & Tronc Commun", statut: "Prêt", createdAt: "2026-07-08", imageUrl: flyerBacSm, slogan: "Cap sur les grandes écoles", cta: "Inscrivez-vous avant le 30 août", palette: "Teal · Or · Blanc", ton: "Institutionnel", dateEvenement: "2025-09-05", budget: 4500, contenu: "Excel Academy — Cap sur les grandes écoles.\n98% de réussite au Bac SM · Prépas intégrées · Encadrement premium.\nInscriptions ouvertes · Marrakech · 0524 33 21 11" },
  { id: "d2", titre: "Portes ouvertes — 20 septembre", type: "Post réseaux sociaux", canal: "Instagram", format: "1080×1350 (portrait)", brief: "Ambiance festive, mettre en avant campus Guéliz.", cible: "Familles Marrakech", statut: "Publié", createdAt: "2026-07-05", imageUrl: postPortesOuvertes, slogan: "Découvrez votre futur campus", cta: "Réservez votre créneau", hashtags: "#ExcelAcademy #PortesOuvertes #Marrakech #Éducation", palette: "Terracotta · Or · Ciel", ton: "Festif", dateEvenement: "2025-09-20", contenu: "🎓 Journée Portes Ouvertes\n20 septembre · 9h-17h · Campus Guéliz\nVisites guidées · Rencontre équipe pédagogique · Cadeaux à gagner." },
  { id: "d3", titre: "Campagne bourses au mérite", type: "Bannière web", canal: "Site web", format: "1600×600 (bannière large)", brief: "50 bourses jusqu'à 40% pour les meilleurs dossiers.", cible: "Élèves & parents à haut potentiel", statut: "En génération", createdAt: "2026-07-09", imageUrl: bannerBourses, slogan: "50 bourses jusqu'à 40%", cta: "Déposer mon dossier", palette: "Vert profond · Or", ton: "Élégant", dateEvenement: "2025-08-31" },
  { id: "d4", titre: "Relance inscription — WhatsApp", type: "Texte marketing", canal: "WhatsApp", format: "Court (max 300 caractères)", brief: "Ton chaleureux, rappeler date limite d'inscription et proposer un rendez-vous.", cible: "Prospects tièdes qualifiés", statut: "Brouillon", createdAt: "2026-07-09", imageUrl: whatsappRelance, slogan: "On garde votre place ?", cta: "Répondez OUI pour un rappel", palette: "Teal WhatsApp", ton: "Chaleureux", contenu: "Bonjour {{prenom}} 👋\nIl reste quelques places en {{formation}} pour la rentrée. On vous garde une entrée jusqu'au vendredi.\nRépondez OUI et on vous rappelle sous 24h.\n— Excel Academy" },
  { id: "d5", titre: "Email — Classes Prépa", type: "Email campagne", canal: "Email", format: "Newsletter responsive 600px", brief: "Convertir les prospects intéressés par la prépa, mettre en avant les 4 admis à Polytechnique.", cible: "Prospects Prépa", statut: "Prêt", createdAt: "2026-07-07", imageUrl: emailPrepa, slogan: "Votre place aux Grandes Écoles commence ici", cta: "Réserver un entretien gratuit", palette: "Navy · Or", ton: "Élégant", budget: 2000, contenu: "Objet : Votre place aux Grandes Écoles commence ici.\n\nExcel Academy vous propose 2 ans de préparation intensive, avec 4 admis à Polytechnique cette année. Rendez-vous pour un entretien gratuit." },
];

export type KbBlock = { id: string; section: string; title: string; body: string };
export const kbBlocks: KbBlock[] = [];
