import type { Scores } from './profiles';

type PartialScores = Partial<Scores>;

export interface SolidarityNet {
  profileId: number;
  organisme: string;
  bonus: PartialScores;
  delayTurns: number;
  description: string;
}

export const solidarityNets: SolidarityNet[] = [
  {
    profileId: 1,
    organisme: "France Travail",
    bonus: { resilience: 1 },
    delayTurns: 2,
    description: "Accompagnement vers l'emploi et formation professionnelle",
  },
  {
    profileId: 2,
    organisme: "MDPH",
    bonus: { rights: 1 },
    delayTurns: 4,
    description: "Maison Départementale des Personnes Handicapées",
  },
  {
    profileId: 3,
    organisme: "CAF",
    bonus: { financial: 1 },
    delayTurns: 2,
    description: "Caisse d'Allocations Familiales – aides au logement",
  },
  {
    profileId: 4,
    organisme: "OFII",
    bonus: { rights: 1 },
    delayTurns: 5,
    description: "Office Français de l'Immigration et de l'Intégration",
  },
  {
    profileId: 5,
    organisme: "Office HLM / DALO",
    bonus: { financial: 1 },
    delayTurns: 6,
    description: "Droit Au Logement Opposable – accès prioritaire au logement social",
  },
  {
    profileId: 6,
    organisme: "Défenseur des Droits",
    bonus: { rights: 1 },
    delayTurns: 3,
    description: "Lutte contre les discriminations à l'emploi et au logement",
  },
  {
    profileId: 7,
    organisme: "CMP",
    bonus: { health: 1 },
    delayTurns: 3,
    description: "Centre Médico-Psychologique – soutien santé mentale",
  },
  {
    profileId: 8,
    organisme: "CSAPA",
    bonus: { health: 1 },
    delayTurns: 2,
    description: "Centre de Soin, d'Accompagnement et de Prévention en Addictologie",
  },
  {
    profileId: 9,
    organisme: "CCAS",
    bonus: { social: 1 },
    delayTurns: 1,
    description: "Centre Communal d'Action Sociale – lien et aide de proximité",
  },
  {
    profileId: 10,
    organisme: "Banque de France",
    bonus: { financial: 1 },
    delayTurns: 3,
    description: "Médiation bancaire et procédure de surendettement",
  },
  {
    profileId: 11,
    organisme: "CPAM",
    bonus: { health: 1 },
    delayTurns: 2,
    description: "Caisse Primaire d'Assurance Maladie – droits santé",
  },
  {
    profileId: 12,
    organisme: "Cap Emploi",
    bonus: { financial: 1 },
    delayTurns: 1,
    description: "Réseau spécialisé insertion professionnelle des personnes handicapées",
  },
  {
    profileId: 13,
    organisme: "SPIP",
    bonus: { resilience: 1 },
    delayTurns: 2,
    description: "Service Pénitentiaire d'Insertion et de Probation",
  },
  {
    profileId: 14,
    organisme: "Préfecture / Assos",
    bonus: { rights: 1 },
    delayTurns: 6,
    description: "Accompagnement associatif pour la régularisation administrative",
  },
];
