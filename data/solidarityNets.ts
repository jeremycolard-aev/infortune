import { SolidarityNet } from './types';

export const SOLIDARITY_NETS: SolidarityNet[] = [
  { profileId: 1,  organization: 'France Travail',       bonus: { indicator: 'resilience', delta: 1 }, delay: 2 },
  { profileId: 2,  organization: 'MDPH',                 bonus: { indicator: 'rights',     delta: 1 }, delay: 4 },
  { profileId: 3,  organization: 'CAF',                  bonus: { indicator: 'financial',  delta: 1 }, delay: 2 },
  { profileId: 4,  organization: 'OFII',                 bonus: { indicator: 'rights',     delta: 1 }, delay: 5 },
  { profileId: 5,  organization: 'Office HLM / DALO',    bonus: { indicator: 'financial',  delta: 1 }, delay: 6 },
  { profileId: 6,  organization: 'Défenseur des Droits', bonus: { indicator: 'rights',     delta: 1 }, delay: 3 },
  { profileId: 7,  organization: 'CMP',                  bonus: { indicator: 'health',     delta: 1 }, delay: 3 },
  { profileId: 8,  organization: 'CSAPA',                bonus: { indicator: 'health',     delta: 1 }, delay: 2 },
  { profileId: 9,  organization: 'CCAS',                 bonus: { indicator: 'social',     delta: 1 }, delay: 1 },
  { profileId: 10, organization: 'Banque de France',     bonus: { indicator: 'financial',  delta: 1 }, delay: 3 },
  { profileId: 11, organization: 'CPAM',                 bonus: { indicator: 'health',     delta: 1 }, delay: 2 },
  { profileId: 12, organization: 'Cap Emploi',           bonus: { indicator: 'financial',  delta: 1 }, delay: 1 },
  { profileId: 13, organization: 'SPIP',                 bonus: { indicator: 'resilience', delta: 1 }, delay: 2 },
  { profileId: 14, organization: 'Préfecture / Assos',   bonus: { indicator: 'rights',     delta: 1 }, delay: 6 },
];
