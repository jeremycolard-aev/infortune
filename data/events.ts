import { WheelEvent } from './types';

export const WHEEL_EVENTS: WheelEvent[] = [
  {
    profileId: 1,
    fortune: {
      title: 'Atelier de reconversion',
      effects: [{ indicator: 'resilience', delta: 2 }],
      phrase: '« Un nouveau départ, avec les bons outils ! »',
    },
    infortune: {
      title: 'Employeur en faillite',
      effects: [{ indicator: 'financial', delta: -2 }],
      phrase: '« Le compte est à sec, mais pas l\'espoir... »',
    },
  },
  {
    profileId: 2,
    fortune: {
      title: 'Véhicule adapté + accompagnement',
      effects: [{ indicator: 'health', delta: 1 }],
      phrase: '« Enfin la mobilité retrouvée ! »',
    },
    infortune: {
      title: 'Dossier MDPH rejeté',
      effects: [{ indicator: 'rights', delta: -2 }],
      phrase: '« La paperasse a encore frappé... »',
    },
  },
  {
    profileId: 3,
    fortune: {
      title: 'Voisin bienveillant comme soutien',
      effects: [{ indicator: 'social', delta: 2 }],
      phrase: '« Parfois, la solidarité vient du palier ! »',
    },
    infortune: {
      title: 'Ex ne paie plus la pension',
      effects: [{ indicator: 'financial', delta: -2 }],
      phrase: '« Les promesses s\'évaporent, pas les factures... »',
    },
  },
  {
    profileId: 4,
    fortune: {
      title: 'Bénévole aide pour le français',
      effects: [{ indicator: 'rights', delta: 1 }, { indicator: 'social', delta: 1 }],
      phrase: '« Les mots ouvrent des portes ! »',
    },
    infortune: {
      title: "Hébergement d'urgence prend fin",
      effects: [{ indicator: 'financial', delta: -2 }, { indicator: 'health', delta: -1 }],
      phrase: '« La précarité ne prévient pas... »',
    },
  },
  {
    profileId: 5,
    fortune: {
      title: 'Colocation solidaire acceptée',
      effects: [{ indicator: 'social', delta: 2 }, { indicator: 'health', delta: 1 }],
      phrase: '« Bienvenue dans la coloc, Thomas ! »',
    },
    infortune: {
      title: 'Dossier DALO refusé',
      effects: [{ indicator: 'rights', delta: -2 }],
      phrase: '« Le droit au logement... c\'est compliqué. »',
    },
  },
  {
    profileId: 6,
    fortune: {
      title: 'Entreprise inclusive embauche',
      effects: [{ indicator: 'financial', delta: 2 }],
      phrase: '« Enfin une chance équitable ! »',
    },
    infortune: {
      title: 'Refus de location à cause du nom',
      effects: [{ indicator: 'rights', delta: -2 }],
      phrase: '« Les préjugés ont la vie dure... »',
    },
  },
  {
    profileId: 7,
    fortune: {
      title: 'Super thérapeute trouvé',
      effects: [{ indicator: 'health', delta: 2 }],
      phrase: '« La parole libère ! »',
    },
    infortune: {
      title: "Psy part à l'étranger",
      effects: [{ indicator: 'health', delta: -2 }],
      phrase: '« Et maintenant, on fait quoi... »',
    },
  },
  {
    profileId: 8,
    fortune: {
      title: 'Groupe de parole CSAPA',
      effects: [{ indicator: 'resilience', delta: 2 }, { indicator: 'social', delta: 1 }],
      phrase: '« Ensemble, on est plus forts ! »',
    },
    infortune: {
      title: 'Rechute + éloignement des proches',
      effects: [{ indicator: 'health', delta: -1 }, { indicator: 'social', delta: -2 }],
      phrase: '« Un pas en arrière, mais pas la fin du chemin. »',
    },
  },
  {
    profileId: 9,
    fortune: {
      title: 'Jardinage avec la voisine',
      effects: [{ indicator: 'social', delta: 2 }, { indicator: 'health', delta: 1 }],
      phrase: '« Les haricots poussent, le moral aussi ! »',
    },
    infortune: {
      title: 'Chute → immobilisation',
      effects: [{ indicator: 'health', delta: -2 }],
      phrase: '« L\'autonomie, ça peut tenir à un trottoir. »',
    },
  },
  {
    profileId: 10,
    fortune: {
      title: 'Médiatrice négocie avec la banque',
      effects: [{ indicator: 'rights', delta: 2 }, { indicator: 'financial', delta: 1 }],
      phrase: '« La dette, ça se renégocie ! »',
    },
    infortune: {
      title: 'Prêt passe en contentieux',
      effects: [{ indicator: 'financial', delta: -2 }],
      phrase: '« Huissier à la porte, moral en berne. »',
    },
  },
  {
    profileId: 11,
    fortune: {
      title: "Assurance débloque l'indemnité",
      effects: [{ indicator: 'health', delta: 2 }, { indicator: 'resilience', delta: 1 }],
      phrase: '« La vie reprend des couleurs ! »',
    },
    infortune: {
      title: 'Erreur administrative bloque versement',
      effects: [{ indicator: 'financial', delta: -2 }],
      phrase: '« Une virgule mal placée, et tout s\'arrête. »',
    },
  },
  {
    profileId: 12,
    fortune: {
      title: 'CDI proposé après CDD exemplaire',
      effects: [{ indicator: 'financial', delta: 3 }],
      phrase: '« La stabilité, enfin ! »',
    },
    infortune: {
      title: 'Fin de mission sans préavis',
      effects: [{ indicator: 'financial', delta: -2 }, { indicator: 'resilience', delta: -1 }],
      phrase: '« L\'intérim c\'est l\'imprévu garanti. »',
    },
  },
  {
    profileId: 13,
    fortune: {
      title: "Chantier d'insertion + confiance formateur",
      effects: [{ indicator: 'resilience', delta: 2 }, { indicator: 'social', delta: 1 }],
      phrase: '« Le marteau et la confiance, dans le même coffre ! »',
    },
    infortune: {
      title: 'Erreur dossier judiciaire',
      effects: [{ indicator: 'rights', delta: -2 }],
      phrase: '« Le passé a encore rattrapé le présent. »',
    },
  },
  {
    profileId: 14,
    fortune: {
      title: 'Association aide pour régularisation',
      effects: [{ indicator: 'rights', delta: 2 }],
      phrase: '« Les papiers, c\'est la liberté ! »',
    },
    infortune: {
      title: 'Obligation de quitter le territoire',
      effects: [{ indicator: 'resilience', delta: -3 }],
      phrase: '« L\'OQTF : trois lettres qui brisent des vies. »',
    },
  },
];
