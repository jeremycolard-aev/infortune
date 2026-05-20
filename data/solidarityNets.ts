import type { IndicatorScores } from './profiles';

export interface SolidarityNet {
  profileId: number;
  organization: string;
  description: string;
  bonus: Partial<IndicatorScores>;
  delay: number;
}

export const SOLIDARITY_NETS: SolidarityNet[] = [
  {
    profileId: 1,
    organization: 'France Travail',
    description: 'Accompagnement vers l\'emploi et formations certifiantes',
    bonus: { resilience: 1 },
    delay: 2,
  },
  {
    profileId: 2,
    organization: 'MDPH',
    description: 'Reconnaissance du handicap et accès aux droits associés',
    bonus: { rights: 1 },
    delay: 4,
  },
  {
    profileId: 3,
    organization: 'CAF',
    description: 'Aide au logement et allocations familiales',
    bonus: { finance: 1 },
    delay: 2,
  },
  {
    profileId: 4,
    organization: 'OFII',
    description: 'Intégration et accès aux droits des primo-arrivants',
    bonus: { rights: 1 },
    delay: 5,
  },
  {
    profileId: 5,
    organization: 'Office HLM / DALO',
    description: 'Droit au logement opposable et accès au parc social',
    bonus: { finance: 1 },
    delay: 6,
  },
  {
    profileId: 6,
    organization: 'Défenseur des Droits',
    description: 'Recours contre les discriminations à l\'emploi et au logement',
    bonus: { rights: 1 },
    delay: 3,
  },
  {
    profileId: 7,
    organization: 'CMP',
    description: 'Centre médico-psychologique, suivi psychiatrique de proximité',
    bonus: { health: 1 },
    delay: 3,
  },
  {
    profileId: 8,
    organization: 'CSAPA',
    description: 'Centre de soins, d\'accompagnement et de prévention en addictologie',
    bonus: { health: 1 },
    delay: 2,
  },
  {
    profileId: 9,
    organization: 'CCAS',
    description: 'Centre communal d\'action sociale, lien local et aide de proximité',
    bonus: { social: 1 },
    delay: 1,
  },
  {
    profileId: 10,
    organization: 'Banque de France',
    description: 'Médiation du crédit et traitement du surendettement',
    bonus: { finance: 1 },
    delay: 3,
  },
  {
    profileId: 11,
    organization: 'CPAM',
    description: 'Accès aux droits santé et remboursements',
    bonus: { health: 1 },
    delay: 2,
  },
  {
    profileId: 12,
    organization: 'Cap Emploi',
    description: 'Placement professionnel et sécurisation du parcours',
    bonus: { finance: 1 },
    delay: 1,
  },
  {
    profileId: 13,
    organization: 'SPIP',
    description: 'Service pénitentiaire d\'insertion et de probation',
    bonus: { resilience: 1 },
    delay: 2,
  },
  {
    profileId: 14,
    organization: 'Préfecture / Associations',
    description: 'Accompagnement vers la régularisation administrative',
    bonus: { rights: 1 },
    delay: 6,
  },
];
