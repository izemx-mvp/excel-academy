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
};

export const formations: Formation[] = [
  { id: "f1", nom: "Baccalauréat Sciences Maths", duree: "3 ans", prerequis: "Brevet", debouches: "Écoles d'ingénieurs", frais: 32000 },
  { id: "f2", nom: "Baccalauréat Sciences Exp.", duree: "3 ans", prerequis: "Brevet", debouches: "Médecine, Pharmacie", frais: 30000 },
  { id: "f3", nom: "Baccalauréat Économie", duree: "3 ans", prerequis: "Brevet", debouches: "Commerce, Gestion", frais: 28000 },
  { id: "f4", nom: "Classe Préparatoire", duree: "2 ans", prerequis: "Bac +", debouches: "Grandes Écoles", frais: 45000 },
  { id: "f5", nom: "Primaire", duree: "6 ans", prerequis: "-", debouches: "Collège", frais: 22000 },
  { id: "f6", nom: "Collège", duree: "3 ans", prerequis: "CEP", debouches: "Lycée", frais: 25000 },
];

export const contacts = [
  { departement: "Direction Générale", responsable: "M. Karim El Amrani", email: "direction@excelacademy.ma", tel: "0524 33 21 10", horaires: "Lun-Ven 8h-17h" },
  { departement: "Scolarité", responsable: "Mme Fatima Zahra", email: "scolarite@excelacademy.ma", tel: "0524 33 21 11", horaires: "Lun-Sam 8h-16h" },
  { departement: "Comptabilité", responsable: "M. Youssef Benali", email: "compta@excelacademy.ma", tel: "0524 33 21 12", horaires: "Lun-Ven 9h-16h" },
  { departement: "Vie Scolaire", responsable: "Mme Naima Idrissi", email: "vie-scolaire@excelacademy.ma", tel: "0524 33 21 13", horaires: "Lun-Ven 8h-18h" },
];

export const calendrier = [
  { evt: "Rentrée scolaire", date: "05 septembre 2025" },
  { evt: "Vacances Toussaint", date: "25 oct - 04 nov 2025" },
  { evt: "Examens 1er semestre", date: "15 - 22 janvier 2026" },
  { evt: "Vacances de printemps", date: "10 - 24 avril 2026" },
  { evt: "Examens finaux", date: "10 - 25 juin 2026" },
];

export const faqs = [
  { q: "Quels sont les horaires d'ouverture ?", r: "Nos bureaux sont ouverts du lundi au vendredi de 8h à 17h et le samedi de 8h à 13h.", cat: "Général" },
  { q: "Comment puis-je m'inscrire ?", r: "L'inscription se fait en ligne via notre plateforme ou directement au bureau de la scolarité avec les documents requis.", cat: "Inscription" },
  { q: "Quels sont les moyens de paiement acceptés ?", r: "Nous acceptons les virements bancaires, chèques, espèces et paiement par carte bancaire.", cat: "Paiement" },
  { q: "Y a-t-il un service de transport scolaire ?", r: "Oui, nous couvrons 8 zones de Marrakech. Les tarifs varient selon la zone.", cat: "Transport" },
  { q: "L'école propose-t-elle un hébergement ?", r: "Oui, nous disposons de chambres individuelles et partagées avec réservation obligatoire.", cat: "Hébergement" },
  { q: "Quelle est la politique d'annulation ?", r: "Annulation possible jusqu'à 15 jours avant la rentrée avec remboursement à 70%.", cat: "Paiement" },
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

export type Qualification = {
  id: string;
  nom: string;
  telephone: string;
  email: string;
  formation: string;
  budget: string;
  score: number;
  statut: "Chaud" | "Tiède" | "Froid";
  date: string;
  notes: string;
};

export const qualifications: Qualification[] = [
  { id: "q1", nom: "Sara Benjelloun", telephone: "0661 234 567", email: "sara.b@gmail.com", formation: "Bac Sciences Maths", budget: "30-35k MAD", score: 92, statut: "Chaud", date: "2026-07-08", notes: "Très motivée, demande visite de l'établissement" },
  { id: "q2", nom: "Ahmed Tazi", telephone: "0662 345 678", email: "a.tazi@gmail.com", formation: "Classe Préparatoire", budget: "40-50k MAD", score: 88, statut: "Chaud", date: "2026-07-07", notes: "Frère déjà inscrit" },
  { id: "q3", nom: "Leila Fassi", telephone: "0663 456 789", email: "leila.f@outlook.com", formation: "Bac Économie", budget: "25-30k MAD", score: 65, statut: "Tiède", date: "2026-07-06", notes: "Compare avec autre école" },
  { id: "q4", nom: "Mehdi Alaoui", telephone: "0664 567 890", email: "mehdi.a@yahoo.fr", formation: "Bac Sciences Exp.", budget: "25-30k MAD", score: 71, statut: "Tiède", date: "2026-07-05", notes: "Attente de bourse" },
  { id: "q5", nom: "Yasmine Chraibi", telephone: "0665 678 901", email: "y.chraibi@gmail.com", formation: "Collège", budget: "20-25k MAD", score: 45, statut: "Froid", date: "2026-07-04", notes: "Simple demande d'info" },
  { id: "q6", nom: "Omar Bennis", telephone: "0666 789 012", email: "omar.bennis@gmail.com", formation: "Bac Sciences Maths", budget: "30-35k MAD", score: 84, statut: "Chaud", date: "2026-07-03", notes: "Prêt à s'inscrire cette semaine" },
];

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
};

export const reclamations: Reclamation[] = [
  { id: "r1", nom: "Karim Bourhim", email: "k.bourhim@gmail.com", telephone: "0671 111 222", categorie: "Pédagogique", priorite: "Haute", statut: "En cours", sujet: "Retard livraison manuels", description: "Les manuels du 2ème trimestre ne sont pas encore distribués.", date: "2026-07-08" },
  { id: "r2", nom: "Salma El Idrissi", email: "salma.ei@gmail.com", telephone: "0672 222 333", categorie: "Financière", priorite: "Urgente", statut: "Escaladée", sujet: "Double prélèvement", description: "Prélèvement en double sur mon compte pour les frais de mars.", date: "2026-07-07" },
  { id: "r3", nom: "Nabil Rachidi", email: "n.rachidi@outlook.com", telephone: "0673 333 444", categorie: "Transport", priorite: "Moyenne", statut: "Résolue", sujet: "Bus en retard", description: "Le bus zone 4 arrive systématiquement en retard depuis 2 semaines.", date: "2026-07-05" },
  { id: "r4", nom: "Amina Sqalli", email: "a.sqalli@gmail.com", telephone: "0674 444 555", categorie: "Administrative", priorite: "Basse", statut: "Nouvelle", sujet: "Attestation de scolarité", description: "Attente d'attestation depuis 3 semaines.", date: "2026-07-08" },
  { id: "r5", nom: "Rachid Kabbaj", email: "r.kabbaj@gmail.com", telephone: "0675 555 666", categorie: "Hébergement", priorite: "Moyenne", statut: "En cours", sujet: "Problème climatisation chambre", description: "Climatisation chambre 204 en panne depuis 5 jours.", date: "2026-07-06" },
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
  aRepondu?: boolean;
  reponseDate?: string;
  reponseMessage?: string;
};

export const relances: Relance[] = [
  { id: "l1", nom: "Hicham Berrada", email: "h.berrada@gmail.com", telephone: "0681 111 222", formation: "Bac Sciences Maths", montantDu: 8000, dateEcheance: "2026-06-15", nbRelances: 2, derniereRelance: "2026-07-02", statut: "Relancé", aRepondu: true, reponseDate: "2026-07-03", reponseMessage: "Bonjour, je règle la somme avant le 20 juillet, un souci de trésorerie temporaire. Merci pour votre patience." },
  { id: "l2", nom: "Nadia El Mansouri", email: "nadia.em@gmail.com", telephone: "0682 222 333", formation: "Classe Préparatoire", montantDu: 15000, dateEcheance: "2026-06-01", nbRelances: 3, derniereRelance: "2026-07-06", statut: "Escaladé", aRepondu: false },
  { id: "l3", nom: "Younes Chakir", email: "y.chakir@gmail.com", telephone: "0683 333 444", formation: "Bac Économie", montantDu: 5500, dateEcheance: "2026-07-01", nbRelances: 0, derniereRelance: null, statut: "En attente", aRepondu: false },
  { id: "l4", nom: "Fatima Zahra Alami", email: "fz.alami@gmail.com", telephone: "0684 444 555", formation: "Collège", montantDu: 4200, dateEcheance: "2026-06-20", nbRelances: 1, derniereRelance: "2026-06-28", statut: "Relancé", aRepondu: true, reponseDate: "2026-06-29", reponseMessage: "Merci, j'ai fait le virement hier, la preuve suit par email." },
  { id: "l5", nom: "Anas Filali", email: "anas.f@gmail.com", telephone: "0685 555 666", formation: "Bac Sciences Exp.", montantDu: 7500, dateEcheance: "2026-06-10", nbRelances: 2, derniereRelance: "2026-07-04", statut: "Relancé", aRepondu: false },
  { id: "l6", nom: "Meryem Ouazzani", email: "m.ouazzani@gmail.com", telephone: "0686 666 777", formation: "Primaire", montantDu: 3800, dateEcheance: "2026-07-05", nbRelances: 0, derniereRelance: null, statut: "En attente", aRepondu: false },
];

export type KbBlock = { id: string; section: string; title: string; body: string };

export const kbBlocks: KbBlock[] = [
  // Inscriptions — Procédure
  { id: "p1", section: "procedure", title: "1. Dépôt du dossier", body: "Le candidat dépose son dossier de candidature en ligne ou au bureau de la scolarité." },
  { id: "p2", section: "procedure", title: "2. Entretien de motivation", body: "Entretien individuel avec la commission pédagogique." },
  { id: "p3", section: "procedure", title: "3. Test de niveau", body: "Applicable pour les cycles Collège, Lycée et Classes Prépa." },
  { id: "p4", section: "procedure", title: "4. Validation", body: "La commission valide le dossier sous 7 jours ouvrés." },
  { id: "p5", section: "procedure", title: "5. Signature & paiement", body: "Signature du contrat et paiement des frais d'inscription." },

  // Inscriptions — Paiement
  { id: "pa1", section: "paiement", title: "Échéances", body: "Trimestrielle (3 versements) ou mensuelle (9 versements) selon la formule choisie." },
  { id: "pa2", section: "paiement", title: "Moyens acceptés", body: "Virement bancaire, chèque, carte bancaire, espèces au bureau de la comptabilité." },
  { id: "pa3", section: "paiement", title: "Réductions famille", body: "10% pour le 2ème enfant, 15% pour le 3ème enfant inscrit la même année." },

  // Inscriptions — Politique
  { id: "po1", section: "politique", title: "Retard de paiement", body: "Pénalité de 2% par mois appliquée après 15 jours de retard." },
  { id: "po2", section: "politique", title: "Annulation avant rentrée", body: "Remboursement à 70% si annulation notifiée avant le 15 août." },
  { id: "po3", section: "politique", title: "Annulation en cours d'année", body: "Aucun remboursement des frais déjà versés." },
  { id: "po4", section: "politique", title: "Cas exceptionnels", body: "Étudiés au cas par cas par la direction sur présentation d'un justificatif." },

  // Vie scolaire — Règlement
  { id: "r1", section: "reglement", title: "Absences", body: "Toute absence doit être justifiée sous 48h. Au-delà de 3 absences non justifiées, un avertissement est adressé aux parents." },
  { id: "r2", section: "reglement", title: "Retards", body: "Les retards sont enregistrés. 3 retards équivalent à une absence." },
  { id: "r3", section: "reglement", title: "Tenue vestimentaire", body: "Uniforme obligatoire du lundi au vendredi. Tenue de sport le mercredi." },
  { id: "r4", section: "reglement", title: "Discipline", body: "Toute infraction fait l'objet d'un rapport et peut mener à une convocation du conseil de discipline." },

  // Vie scolaire — Emploi du temps
  { id: "e1", section: "edt", title: "Diffusion", body: "Les emplois du temps sont diffusés via Pronote chaque lundi." },
  { id: "e2", section: "edt", title: "Changements", body: "Les changements d'emploi du temps sont notifiés par SMS aux parents la veille au plus tard." },

  // Vie scolaire — Hébergement
  { id: "h1", section: "hebergement", title: "Chambre individuelle — 18 000 MAD /an", body: "Bureau, salle de bain privée, wifi haut débit, ménage hebdomadaire." },
  { id: "h2", section: "hebergement", title: "Chambre partagée (2 personnes) — 12 000 MAD /an", body: "Salle de bain partagée, wifi, espace de travail commun." },

  // Vie scolaire — Transport
  { id: "t1", section: "transport", title: "Zone 1 — Guéliz, Hivernage", body: "Tarif annuel : 4 500 MAD" },
  { id: "t2", section: "transport", title: "Zone 2 — Médina, Kasbah", body: "Tarif annuel : 5 000 MAD" },
  { id: "t3", section: "transport", title: "Zone 3 — Massira, Daoudiate", body: "Tarif annuel : 5 500 MAD" },
  { id: "t4", section: "transport", title: "Zone 4 — Targa, Amerchich", body: "Tarif annuel : 6 000 MAD" },
  { id: "t5", section: "transport", title: "Zone 5 — Route de l'Ourika", body: "Tarif annuel : 7 500 MAD" },

  // Escalade
  { id: "es1", section: "escalade", title: "Question hors base", body: "L'agent IA n'a pas de réponse fiable → transfert immédiat vers Scolarité." },
  { id: "es2", section: "escalade", title: "Réclamation déguisée", body: "Mots-clés négatifs récurrents (colère, insatisfaction) → transfert Direction." },
  { id: "es3", section: "escalade", title: "Cas sensible", body: "Santé, harcèlement, mineur en difficulté → transfert immédiat Vie Scolaire." },
  { id: "es4", section: "escalade", title: "Demande VIP", body: "Partenaires ou anciens élèves → transfert Direction." },
];

