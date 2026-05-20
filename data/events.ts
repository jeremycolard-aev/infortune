import type { Scores } from './profiles';

type PartialScores = Partial<Scores>;

export interface WheelEvent {
  profileId: number;
  fortune: {
    label: string;
    effect: PartialScores;
    phrase: string;
  };
  infortune: {
    label: string;
    effect: PartialScores;
    phrase: string;
  };
}

export const wheelEvents: WheelEvent[] = [
  {
    profileId: 1,
    fortune: {
      label: "Atelier de reconversion",
      effect: { resilience: 2 },
      phrase: "Samira a sorti le tablier professionnel. Direction la cuisine des possibles !",
    },
    infortune: {
      label: "Employeur en faillite",
      effect: { financial: -2 },
      phrase: "Le restaurant a fermé. Même le plat du jour était en liquidation.",
    },
  },
  {
    profileId: 2,
    fortune: {
      label: "Véhicule adapté + accompagnement",
      effect: { health: 1 },
      phrase: "Hervé a reçu les clés d'un véhicule adapté. Il repart sur les routes !",
    },
    infortune: {
      label: "Dossier MDPH rejeté",
      effect: { rights: -2 },
      phrase: "Le formulaire de 47 pages a été perdu. Retry dans 6 mois.",
    },
  },
  {
    profileId: 3,
    fortune: {
      label: "Voisin bienveillant comme soutien",
      effect: { social: 2 },
      phrase: "Léa a trouvé une oreille attentive au bout du couloir. Vive les voisins !",
    },
    infortune: {
      label: "Ex ne paie plus la pension",
      effect: { financial: -2 },
      phrase: "Le virement n'est pas passé. Encore. Le silence a un coût.",
    },
  },
  {
    profileId: 4,
    fortune: {
      label: "Bénévole aide pour le français",
      effect: { rights: 1, social: 1 },
      phrase: "Aïssa conjugue maintenant l'espoir au présent. Et au futur !",
    },
    infortune: {
      label: "Hébergement d'urgence prend fin",
      effect: { financial: -2, health: -1 },
      phrase: "La date limite n'attendait pas. Les valises non plus.",
    },
  },
  {
    profileId: 5,
    fortune: {
      label: "Colocation solidaire acceptée",
      effect: { social: 2, health: 1 },
      phrase: "Thomas et sa fille ont trouvé une porte ouverte. Enfin !",
    },
    infortune: {
      label: "Dossier DALO refusé",
      effect: { rights: -2 },
      phrase: "Le droit au logement opposable... s'est opposé. Ironique.",
    },
  },
  {
    profileId: 6,
    fortune: {
      label: "Entreprise inclusive embauche",
      effect: { financial: 2 },
      phrase: "Karim a le permis, l'expérience et maintenant le poste. Enfin !",
    },
    infortune: {
      label: "Refus location à cause du nom",
      effect: { rights: -2 },
      phrase: "Le propriétaire avait soudain un 'autre candidat'. Coïncidence.",
    },
  },
  {
    profileId: 7,
    fortune: {
      label: "Super thérapeute trouvé",
      effect: { health: 2 },
      phrase: "Chloé a enfin trouvé quelqu'un qui écoute sans regarder sa montre.",
    },
    infortune: {
      label: "Psy part à l'étranger",
      effect: { health: -2 },
      phrase: "La valise du psy a fait plus de chemin que prévu. Adieu séances.",
    },
  },
  {
    profileId: 8,
    fortune: {
      label: "Groupe de parole CSAPA",
      effect: { resilience: 2, social: 1 },
      phrase: "Marc a pris la parole. Et gardé la tête haute.",
    },
    infortune: {
      label: "Rechute + éloignement des proches",
      effect: { health: -1, social: -2 },
      phrase: "Le chemin de la reconstruction a un virage difficile ce soir.",
    },
  },
  {
    profileId: 9,
    fortune: {
      label: "Jardinage avec la voisine",
      effect: { social: 2, health: 1 },
      phrase: "Colette a planté des courgettes ET une amitié. Double récolte.",
    },
    infortune: {
      label: "Chute → immobilisation",
      effect: { health: -2 },
      phrase: "La marche du jardin a eu raison de Colette. Attention aux dalles !",
    },
  },
  {
    profileId: 10,
    fortune: {
      label: "Médiatrice négocie avec la banque",
      effect: { rights: 2, financial: 1 },
      phrase: "La médiatrice a parlé chiffres. La banque a enfin entendu.",
    },
    infortune: {
      label: "Prêt passe en contentieux",
      effect: { financial: -2 },
      phrase: "Les huissiers ont frappé. Pascal n'avait plus que ses outils.",
    },
  },
  {
    profileId: 11,
    fortune: {
      label: "Assurance débloque l'indemnité",
      effect: { health: 2, resilience: 1 },
      phrase: "Jérôme a reçu le chèque et retrouvé le sourire. Dans l'ordre.",
    },
    infortune: {
      label: "Erreur administrative bloque versement",
      effect: { financial: -2 },
      phrase: "Un chiffre mal saisi. Des mois d'attente. L'administration a ses mystères.",
    },
  },
  {
    profileId: 12,
    fortune: {
      label: "CDI proposé après CDD exemplaire",
      effect: { financial: 3 },
      phrase: "Hugo a signé en CDI. Enfin un contrat qui ne se termine pas trop vite !",
    },
    infortune: {
      label: "Fin de mission sans préavis",
      effect: { financial: -2, resilience: -1 },
      phrase: "La mission s'est arrêtée par SMS. Même pas un merci.",
    },
  },
  {
    profileId: 13,
    fortune: {
      label: "Chantier d'insertion + confiance formateur",
      effect: { resilience: 2, social: 1 },
      phrase: "Karl a construit bien plus qu'un mur ce matin. Il a construit sa confiance.",
    },
    infortune: {
      label: "Erreur dossier judiciaire",
      effect: { rights: -2 },
      phrase: "Une faute de frappe dans le dossier. Et c'est Karl qui paie les frais.",
    },
  },
  {
    profileId: 14,
    fortune: {
      label: "Association aide pour régularisation",
      effect: { rights: 2 },
      phrase: "Maria a reçu le tampon tant attendu. Elle peut enfin souffler.",
    },
    infortune: {
      label: "Obligation de quitter le territoire",
      effect: { resilience: -3 },
      phrase: "L'enveloppe administrative a détruit des mois d'espoir en un instant.",
    },
  },
];
