import type { IndicatorScores } from './profiles';

export interface WheelEvent {
  profileId: number;
  fortune: {
    title: string;
    effect: Partial<IndicatorScores>;
    phrase: string;
  };
  infortune: {
    title: string;
    effect: Partial<IndicatorScores>;
    phrase: string;
  };
}

export const WHEEL_EVENTS: WheelEvent[] = [
  {
    profileId: 1,
    fortune: {
      title: 'Atelier de reconversion',
      effect: { resilience: 2 },
      phrase: 'Samira découvre qu\'elle a un talent caché pour la gestion de projet. Son ancienne cheffe de cuisine en est la première surprise.',
    },
    infortune: {
      title: 'Employeur en faillite',
      effect: { finance: -2 },
      phrase: 'Trois mois de salaire envolés. Samira regarde le RIB de son compte et soupire. "Au moins, les pâtes restent pas chères."',
    },
  },
  {
    profileId: 2,
    fortune: {
      title: 'Véhicule adapté + accompagnement',
      effect: { health: 1 },
      phrase: 'Hervé reprend le volant pour la première fois depuis l\'accident. Symboliquement et littéralement.',
    },
    infortune: {
      title: 'Dossier MDPH rejeté',
      effect: { rights: -2 },
      phrase: 'Formulaire 2789-B refusé pour "case non cochée". Hervé relève que la case en question n\'existait pas sur sa version du formulaire.',
    },
  },
  {
    profileId: 3,
    fortune: {
      title: 'Voisin bienveillant comme soutien',
      effect: { social: 2 },
      phrase: 'M. Bernard du 3ème frappe à sa porte avec une tarte aux pommes. "J\'en fais trop, prenez." C\'est le début d\'une belle amitié.',
    },
    infortune: {
      title: 'Ex ne paie plus la pension',
      effect: { finance: -2 },
      phrase: 'Le virement n\'est pas passé. Le suivant non plus. La CAF met 6 semaines à répondre. Léa compte ses tickets restaurants.',
    },
  },
  {
    profileId: 4,
    fortune: {
      title: 'Bénévole aide pour le français',
      effect: { rights: 1, social: 1 },
      phrase: 'Aïssa apprend le mot "paperasse". Son professeur bénévole lui confirme que oui, c\'est vraiment comme ça qu\'on appelle ça.',
    },
    infortune: {
      title: 'Hébergement d\'urgence prend fin',
      effect: { finance: -2, health: -1 },
      phrase: 'Place disponible jusqu\'au 15. On est le 14. Aïssa range ses affaires dans deux sacs. Ce n\'est pas la première fois.',
    },
  },
  {
    profileId: 5,
    fortune: {
      title: 'Colocation solidaire accepte',
      effect: { social: 2, health: 1 },
      phrase: 'Thomas reçoit la clé. Sa fille lui demande si leur nouvelle chambre a une fenêtre. Elle a même deux volets.',
    },
    infortune: {
      title: 'Dossier DALO refusé',
      effect: { rights: -2 },
      phrase: 'Commission réunie, dossier étudié, demande rejetée. Thomas note que la commission se réunit dans un immeuble très bien chauffé.',
    },
  },
  {
    profileId: 6,
    fortune: {
      title: 'Entreprise inclusive embauche',
      effect: { finance: 2 },
      phrase: 'Karim signe le CDI. Son manager lui dit qu\'on le choisit pour ses compétences. Il le croit à moitié, mais c\'est un début.',
    },
    infortune: {
      title: 'Refus de location à cause du nom',
      effect: { rights: -2 },
      phrase: 'L\'appartement était parfait. "Dossier non retenu." Karim envoie le même dossier avec le prénom Pierre. Réponse en 24h : bienvenue.',
    },
  },
  {
    profileId: 7,
    fortune: {
      title: 'Super thérapeute trouvé',
      effect: { health: 2 },
      phrase: 'Chloé sort de la séance en pleurant, mais d\'un bon pleurs. La différence est réelle, même si intraduisible.',
    },
    infortune: {
      title: 'La psy part à l\'étranger',
      effect: { health: -2 },
      phrase: 'Dr. Martin part faire une mission humanitaire. Chloé est contente pour elle. Chloé est aussi un peu effondrée pour elle-même.',
    },
  },
  {
    profileId: 8,
    fortune: {
      title: 'Groupe de parole CSAPA',
      effect: { resilience: 2, social: 1 },
      phrase: 'Marc prend la parole pour la première fois. Juste pour dire son prénom. Le groupe applaudit. Marc ne comprend pas tout à fait pourquoi, mais ça fait du bien.',
    },
    infortune: {
      title: 'Rechute + éloignement des proches',
      effect: { health: -1, social: -2 },
      phrase: 'Marc ne répond plus aux messages depuis trois jours. Ses contacts comprennent. Ils restent disponibles. C\'est tout ce qu\'ils peuvent faire.',
    },
  },
  {
    profileId: 9,
    fortune: {
      title: 'Jardinage avec la voisine',
      effect: { social: 2, health: 1 },
      phrase: 'Colette et Mme Petit plantent des courgettes. Elles parlent de leurs maris, de leurs enfants, et finalement d\'elles-mêmes.',
    },
    infortune: {
      title: 'Chute → immobilisation',
      effect: { health: -2 },
      phrase: 'Colette a glissé sur le carrelage de la salle de bain. Six semaines plâtrée. Elle demande si le jardin va souffrir. Oui, un peu.',
    },
  },
  {
    profileId: 10,
    fortune: {
      title: 'Médiatrice négocie avec la banque',
      effect: { rights: 2, finance: 1 },
      phrase: 'La médiatrice sort de la réunion avec un plan d\'apurement. Pascal sort avec un contrat signé et les larmes aux yeux.',
    },
    infortune: {
      title: 'Prêt passe en contentieux',
      effect: { finance: -2 },
      phrase: 'Lettre recommandée, huissier, tribunal. Pascal a essayé d\'appeler. Le numéro du conseiller n\'était plus attribué.',
    },
  },
  {
    profileId: 11,
    fortune: {
      title: 'Assurance débloque l\'indemnité',
      effect: { health: 2, resilience: 1 },
      phrase: 'Après 18 mois de procédure, le virement arrive. Jérôme relit plusieurs fois le relevé de compte. C\'est bien réel.',
    },
    infortune: {
      title: 'Erreur administrative bloque le versement',
      effect: { finance: -2 },
      phrase: 'Un "S" manquant dans le nom. Trois mois de blocage. Jérôme qui gérait autrefois des équipes de 40 personnes attend la hotline.',
    },
  },
  {
    profileId: 12,
    fortune: {
      title: 'CDI proposé après CDD exemplaire',
      effect: { finance: 3 },
      phrase: 'Hugo signe le CDI au crayon à papier pour commencer. Non, au stylo, rit son responsable. C\'est du solide cette fois.',
    },
    infortune: {
      title: 'Fin de mission sans préavis',
      effect: { finance: -2, resilience: -1 },
      phrase: '"On n\'a plus besoin de toi à partir de lundi." C\'est vendredi soir. Hugo fixe son téléphone, puis le repose sur la table.',
    },
  },
  {
    profileId: 13,
    fortune: {
      title: 'Chantier d\'insertion + confiance du formateur',
      effect: { resilience: 2, social: 1 },
      phrase: 'Le chef de chantier dit à Karl : "T\'es le meilleur sur la pose." C\'est la première fois depuis longtemps que quelqu\'un dit ça à Karl.',
    },
    infortune: {
      title: 'Erreur dans le dossier judiciaire',
      effect: { rights: -2 },
      phrase: 'Une date erronée dans le casier. Karl doit prouver qu\'il n\'était pas là où le document dit qu\'il était. Il ne sait plus très bien par où commencer.',
    },
  },
  {
    profileId: 14,
    fortune: {
      title: 'Association aide pour la régularisation',
      effect: { rights: 2 },
      phrase: 'Maria reçoit son titre de séjour. Elle le plastifie immédiatement. Deux fois.',
    },
    infortune: {
      title: 'Obligation de quitter le territoire',
      effect: { resilience: -3 },
      phrase: 'L\'OQTF arrive par courrier. Maria relit la lettre trois fois en espérant avoir mal compris. Elle n\'a pas mal compris.',
    },
  },
];
