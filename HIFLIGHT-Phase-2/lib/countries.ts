import type { CountryPage } from "./content";

const FORMALITIES = "Les formalités dépendent de votre nationalité et de la durée du séjour. Vérifiez-les sur le site du ministère français de l’Europe et des Affaires étrangères avant de réserver.";
const SOURCE = "données DGAC reprises par AirAdvisor";

// Classées par volume de passagers au départ de France (DGAC, 2024), puis par thème.
export const countryPages: CountryPage[] = [
  {
    slug: "espagne", name: "Espagne", withArticle: "l’Espagne", toward: "vers l’Espagne",
    stat: `L’Espagne est la première destination aérienne des Français : 17,1 millions de passagers en 2024 (${SOURCE}).`,
    metaTitle: "Vol Espagne pas cher : tous les trajets",
    description: "Comparez les vols vers l’Espagne : Barcelone, Madrid, Malaga, Séville, Palma, Valence. Durée, prix par mois et conseils pour chaque trajet depuis Paris.",
    intro: ["À deux ou trois heures de Paris, l’Espagne se prête aussi bien à un week-end à Barcelone qu’à une semaine de plage : les vols sont fréquents vers les grandes villes comme vers la côte.", "Comparez plusieurs dates et le prix bagage compris : l’écart est surtout marqué en été, quand la demande se concentre sur le littoral."],
    airports: ["Barcelone – El Prat (BCN)", "Madrid – Barajas (MAD)", "Malaga (AGP)", "Séville (SVQ)", "Palma de Majorque (PMI)", "Valence (VLC)"],
    faq: [
      { question: "Quelle ville espagnole choisir pour un week-end ?", answer: "Barcelone et Madrid offrent le plus de vols depuis Paris. Séville, Malaga, Valence et Palma conviennent aux séjours au soleil : comparez les durées et les prix avant de choisir." },
      { question: "Quand partir en Espagne pour payer moins cher ?", answer: "Hors vacances scolaires et ponts, les prix sont en général plus bas, surtout en semaine. L’été concentre la demande sur les destinations balnéaires." }
    ]
  },
  {
    slug: "italie", name: "Italie", withArticle: "l’Italie", toward: "vers l’Italie",
    stat: `L’Italie est la deuxième destination aérienne des Français : 14,4 millions de passagers en 2024 (${SOURCE}).`,
    metaTitle: "Vol Italie pas cher : tous les trajets",
    description: "Comparez les vols vers l’Italie : Rome, Milan, Naples, Venise. Durée, aéroports, prix par mois et conseils pour chaque trajet depuis Paris.",
    intro: ["Rome, Milan, Naples, Venise : la plupart des grandes villes italiennes sont à moins de deux heures de vol de Paris, et chacune a souvent plus d’un aéroport.", "Le billet le moins cher n’est pas toujours le meilleur : l’aéroport d’arrivée change le coût et la durée du transfert jusqu’au centre."],
    airports: ["Rome – Fiumicino (FCO) ou Ciampino (CIA)", "Milan – Malpensa (MXP), Linate (LIN) ou Bergame (BGY)", "Naples – Capodichino (NAP)", "Venise – Marco Polo (VCE)"],
    faq: [
      { question: "Quel aéroport choisir pour Rome ou Milan ?", answer: "Chaque ville compte plusieurs aéroports. Comparez le prix du billet avec le temps et le coût du transfert vers le centre avant de décider." },
      { question: "Quand partir en Italie pour payer moins cher ?", answer: "Les semaines moins touristiques, comme novembre ou février, permettent en général de trouver des vols plus abordables." }
    ]
  },
  {
    slug: "royaume-uni", name: "Royaume-Uni", withArticle: "le Royaume-Uni", toward: "vers le Royaume-Uni",
    stat: `Le Royaume-Uni est la troisième destination aérienne des Français : 12,9 millions de passagers en 2024 (${SOURCE}).`,
    metaTitle: "Vol Royaume-Uni pas cher : tous les trajets",
    description: "Comparez les vols vers le Royaume-Uni : Londres, Édimbourg, Manchester. Durée, aéroports, prix par mois et conseils pour chaque trajet depuis Paris.",
    intro: ["Le Royaume-Uni est à moins de deux heures de vol de Paris, et Londres à elle seule compte cinq aéroports.", "Sur ces courtes distances, comparez aussi le train et le temps de transfert : c’est la durée totale qui compte, autant que le prix du billet."],
    airports: ["Londres – Heathrow, Gatwick, Stansted, Luton ou City", "Édimbourg (EDI)", "Manchester (MAN)"],
    faq: [
      { question: "Faut-il une autorisation pour aller au Royaume-Uni ?", answer: FORMALITIES },
      { question: "Quel aéroport londonien choisir ?", answer: "Comparez le prix du billet avec le coût et la durée du trajet jusqu’au centre : l’aéroport le moins cher n’est pas toujours le plus avantageux au final." }
    ]
  },
  {
    slug: "etats-unis", name: "États-Unis", withArticle: "les États-Unis", toward: "vers les États-Unis",
    stat: `Les États-Unis sont la quatrième destination aérienne des Français : 9,7 millions de passagers en 2024 (${SOURCE}).`,
    metaTitle: "Vol États-Unis pas cher : tous les trajets",
    description: "Comparez les vols vers les États-Unis : New York, Miami, Los Angeles, Washington, Boston. Durée, prix par mois et conseils pour chaque trajet depuis Paris.",
    intro: ["Les grandes métropoles américaines sont reliées à Paris en vol direct, par de nombreuses compagnies qui se font concurrence.", "Bagage en soute, aéroport d’arrivée, formalités d’entrée : trois détails qui changent le prix et le confort du voyage. Regardez-les avant de réserver."],
    airports: ["New York – JFK, Newark (EWR) ou LaGuardia", "Miami (MIA)", "Los Angeles (LAX)", "Washington – Dulles, Reagan ou Baltimore", "Boston – Logan (BOS)"],
    faq: [
      { question: "Quels documents faut-il pour aller aux États-Unis ?", answer: FORMALITIES },
      { question: "Quand partir aux États-Unis pour payer moins cher ?", answer: "Les mois d’hiver hors vacances et le début du printemps offrent souvent de meilleures offres. L’été et les fêtes de fin d’année sont les plus chers." }
    ]
  },
  {
    slug: "maroc", name: "Maroc", withArticle: "le Maroc", toward: "vers le Maroc", currency: "dirham marocain",
    stat: `Le Maroc est la cinquième destination aérienne des Français : 9,3 millions de passagers en 2024 (${SOURCE}).`,
    metaTitle: "Vol Maroc pas cher : tous les trajets",
    description: "Comparez les vols vers le Maroc et depuis le Maroc : Marrakech, Casablanca, Tanger, Fès, Agadir. Prix par mois, compagnies, bagages et aéroports en France.",
    intro: ["Trois heures de vol environ séparent Paris du Maroc, avec des vols réguliers et low cost vers Marrakech, Casablanca, Tanger, Fès et Agadir.", "Le prix du billet n’est qu’une partie de la facture : le bagage en soute, l’aéroport de départ (Roissy, Orly ou Beauvais) et les horaires changent la comparaison."],
    airports: ["Marrakech-Ménara (RAK)", "Casablanca – Mohammed V (CMN)", "Tanger – Ibn Battouta (TNG)", "Fès – Saïss (FEZ)", "Agadir – Al Massira (AGA)"],
    faq: [
      { question: "Quelle ville du Maroc choisir pour un premier voyage ?", answer: "Marrakech est la destination la plus visitée par les voyageurs en séjour, Casablanca est le grand centre économique, et Fès offre une médina classée à l’UNESCO. Le choix dépend de votre projet de voyage." },
      { question: "Quel est le meilleur moment pour partir au Maroc ?", answer: "Le printemps et l’automne sont les saisons les plus agréables dans la plupart des villes, et souvent moins chères que les vacances scolaires. L’été est très chaud à l’intérieur du pays." },
      { question: "Quels documents faut-il pour voyager au Maroc ?", answer: FORMALITIES }
    ]
  },
  {
    slug: "allemagne", name: "Allemagne", withArticle: "l’Allemagne", toward: "vers l’Allemagne",
    stat: `L’Allemagne accueille 7,2 millions de passagers au départ de France en 2024 (${SOURCE}).`,
    metaTitle: "Vol Allemagne pas cher : tous les trajets",
    description: "Comparez les vols vers l’Allemagne : Berlin, Francfort, Munich. Durée, aéroports, prix par mois et conseils pour chaque trajet depuis Paris.",
    intro: ["Entre une heure et demie et deux heures de vol depuis Paris, l’Allemagne offre des villes très différentes : Berlin la culturelle, Francfort la financière, Munich la bavaroise.", "Pour un déplacement professionnel, regardez les horaires du vol retour du soir : ils varient beaucoup d’une compagnie à l’autre."],
    airports: ["Berlin – Brandebourg (BER)", "Francfort (FRA)", "Munich (MUC)"],
    faq: [
      { question: "Faut-il prendre l’avion ou le train pour l’Allemagne ?", answer: "Selon la ville, le train à grande vitesse peut rivaliser avec l’avion en durée totale. Comparez le trajet de centre à centre, transferts compris." },
      { question: "Quand réserver un vol pour l’Allemagne ?", answer: "Les semaines de salons et de grands événements font monter les prix. Comparez plusieurs dates avant de réserver." }
    ]
  },
  {
    slug: "algerie", name: "Algérie", withArticle: "l’Algérie", toward: "vers l’Algérie", currency: "dinar algérien",
    stat: `L’Algérie est la septième destination aérienne des Français : 5,5 millions de passagers en 2024 (${SOURCE}).`,
    metaTitle: "Vol Algérie pas cher : tous les trajets",
    description: "Comparez les vols vers l’Algérie et depuis l’Algérie : Alger, Oran, Constantine, Annaba. Prix par mois, compagnies, bagages et aéroports de départ en France.",
    intro: ["L’Algérie est l’une des destinations les plus demandées au départ de la France, pour retrouver sa famille comme pour voyager. Des vols directs relient Paris, Marseille, Lyon et Toulouse à plusieurs villes algériennes.", "Les prix varient énormément selon la période : l’été, les vacances scolaires et les fêtes concentrent la demande. Comparez plusieurs dates, plusieurs aéroports de départ et la franchise de bagage avant de choisir."],
    airports: ["Alger – Houari-Boumédiène (ALG)", "Oran – Ahmed Ben Bella (ORN)", "Constantine – Mohamed Boudiaf (CZL)", "Annaba – Rabah Bitat (AAE)"],
    faq: [
      { question: "Depuis quelles villes françaises peut-on partir vers l’Algérie ?", answer: "Les départs les plus courants se font depuis Paris, Marseille, Lyon et Toulouse. Les offres changent selon la saison : comparez plusieurs aéroports avant de réserver." },
      { question: "Quel est le moment le moins cher pour voyager en Algérie ?", answer: "En dehors de l’été, des vacances scolaires et des fêtes religieuses, les tarifs sont en général plus bas. Les périodes de janvier-février et de septembre à novembre sont souvent plus abordables." },
      { question: "Quels documents faut-il pour voyager en Algérie ?", answer: FORMALITIES }
    ]
  },
  {
    slug: "turquie", name: "Turquie", withArticle: "la Turquie", toward: "vers la Turquie",
    stat: `La Turquie accueille 4,2 millions de passagers au départ de France en 2024, en hausse d’environ 9 % au premier semestre 2025 (${SOURCE}).`,
    metaTitle: "Vol Turquie pas cher : tous les trajets",
    description: "Comparez les vols vers la Turquie : Istanbul, Antalya. Durée, aéroports, prix par mois et conseils pour chaque trajet depuis Paris.",
    intro: ["Trois à quatre heures de vol depuis Paris : Istanbul pour la ville et la culture, Antalya pour la mer et les séjours balnéaires.", "Istanbul a deux aéroports, tous deux éloignés du centre historique : ajoutez le transfert à votre comparaison."],
    airports: ["Istanbul (IST) ou Sabiha Gökçen (SAW)", "Antalya (AYT)"],
    faq: [
      { question: "Quand partir en Turquie pour payer moins cher ?", answer: "Hors été et vacances scolaires, les prix sont en général plus bas. Le printemps et l’automne sont agréables pour la visite des villes." },
      { question: "Quels documents faut-il pour la Turquie ?", answer: FORMALITIES }
    ]
  },
  {
    slug: "canada", name: "Canada", withArticle: "le Canada", toward: "vers le Canada",
    stat: `Le Canada accueille 3,5 millions de passagers au départ de France en 2024, en hausse d’environ 8,6 % au premier semestre 2025 (${SOURCE}).`,
    metaTitle: "Vol Canada pas cher : tous les trajets",
    description: "Comparez les vols vers le Canada : Montréal, Toronto. Durée, prix par mois et conseils depuis Paris, avec les formalités à vérifier avant le départ.",
    intro: ["Sept à huit heures de vol direct depuis Paris : Montréal la francophone ou Toronto l’anglophone.", "Regardez les formalités d’entrée bien avant le départ : selon votre nationalité, une autorisation de voyage électronique est exigée."],
    airports: ["Montréal – Trudeau (YUL)", "Toronto – Pearson (YYZ)"],
    faq: [
      { question: "Faut-il une autorisation pour aller au Canada ?", answer: FORMALITIES },
      { question: "Quand partir au Canada pour payer moins cher ?", answer: "L’été et la période des fêtes sont les plus chers. Le printemps et l’automne offrent de meilleures offres, avec les couleurs d’automne très demandées à Montréal." }
    ]
  },
  {
    slug: "portugal", name: "Portugal", withArticle: "le Portugal", toward: "vers le Portugal",
    metaTitle: "Vol Portugal pas cher : tous les trajets",
    description: "Comparez les vols vers le Portugal : Lisbonne, Porto, Faro. Durée, prix par mois et conseils pour chaque trajet depuis Paris.",
    intro: ["Deux à trois heures de vol depuis Paris, et des aéroports proches du centre de Lisbonne comme de Porto : le Portugal se prête bien au court séjour.", "L’Algarve, plus au sud, s’atteint par Faro : prévoyez un moyen de transport sur place."],
    airports: ["Lisbonne – Humberto-Delgado (LIS)", "Porto – Francisco Sá Carneiro (OPO)", "Faro (FAO)"],
    faq: [
      { question: "Quelle ville portugaise choisir ?", answer: "Lisbonne et Porto conviennent aux séjours urbains ; Faro est la porte d’entrée de l’Algarve et de ses plages." },
      { question: "Quand partir au Portugal pour payer moins cher ?", answer: "L’été et les ponts de printemps sont les plus chers. L’automne et le début de l’hiver offrent un bon équilibre entre météo et budget." }
    ]
  },
  {
    slug: "asie", name: "Asie et Moyen-Orient", withArticle: "l’Asie et le Moyen-Orient", toward: "vers l’Asie et le Moyen-Orient",
    stat: `Les Émirats arabes unis (2,2 millions de passagers en 2024) et la Chine (1,8 million) progressent depuis la France, tandis que Bangkok, Tokyo et Bali figurent parmi les destinations les plus recherchées par les Français (${SOURCE}).`,
    metaTitle: "Vol Asie pas cher : Bangkok, Tokyo, Dubaï",
    description: "Comparez les vols vers l’Asie et le Moyen-Orient : Dubaï, Bangkok, Tokyo, Bali, Singapour, Séoul, Shanghai. Durée, prix par mois et conseils pour chaque trajet.",
    intro: ["L’Asie domine les recherches de voyages lointains des Français. D’après des analyses de recherches publiées par le secteur, neuf des dix destinations internationales les plus recherchées par les Français se situent hors d’Europe.", "Sur un long-courrier, la durée de l’escale, la franchise de bagage et le moment où vous réservez changent beaucoup le prix. Comparez-les trajet par trajet."],
    airports: ["Dubaï (DXB)", "Bangkok – Suvarnabhumi (BKK)", "Tokyo – Haneda ou Narita", "Bali – Ngurah Rai (DPS)", "Singapour – Changi (SIN)", "Séoul – Incheon (ICN)", "Shanghai – Pudong ou Hongqiao"],
    faq: [
      { question: "Quand réserver un vol vers l’Asie ?", answer: "Selon des analyses du secteur, réserver environ 24 semaines à l’avance donne en moyenne les meilleurs tarifs vers l’Asie. Comparez plusieurs mois avant de choisir." },
      { question: "Quels documents faut-il pour voyager en Asie ?", answer: FORMALITIES }
    ]
  },
  {
    slug: "outre-mer", name: "Outre-mer", withArticle: "l’Outre-mer", toward: "vers l’Outre-mer",
    stat: "Parmi les liaisons intérieures françaises, seules celles entre la métropole et l’Outre-mer progressent en 2025 (DGAC).",
    metaTitle: "Vol Antilles, Réunion, Guyane : tous les trajets",
    description: "Comparez les vols vers l’Outre-mer : Guadeloupe, Martinique, La Réunion, Guyane. Durée, compagnies, prix par mois et conseils pour chaque trajet depuis Paris.",
    intro: ["La Guadeloupe, la Martinique, La Réunion et la Guyane sont reliées à Paris en vol direct, par plusieurs compagnies régulières et à bas coût.", "Les prix grimpent à Noël, en été et pendant les vacances scolaires : réserver plusieurs mois à l’avance reste le meilleur moyen de limiter la facture."],
    airports: ["Pointe-à-Pitre – Le Raizet (PTP)", "Fort-de-France – Aimé-Césaire (FDF)", "La Réunion – Roland-Garros (RUN)", "Cayenne – Félix-Éboué (CAY)"],
    faq: [
      { question: "Faut-il un passeport pour les Antilles et La Réunion ?", answer: "Ce sont des départements français : pour les ressortissants français, une pièce d’identité en cours de validité suffit en général. Vérifiez les conditions selon votre nationalité avant de voyager." },
      { question: "Quelle période est la plus chère pour l’Outre-mer ?", answer: "Les vacances de Noël et d’été sont les plus demandées. Anticipez votre réservation et comparez la franchise de bagage, importante sur un long trajet." }
    ]
  },
  {
    slug: "afrique", name: "Afrique et océan Indien", withArticle: "l’Afrique et l’océan Indien", toward: "vers l’Afrique et l’océan Indien",
    stat: "Les recherches de vols vers l’Afrique progressent depuis la France, d’après les analyses du secteur sur l’été 2026.",
    metaTitle: "Vol Afrique pas cher : Dakar, Abidjan, Le Caire",
    description: "Comparez les vols vers l’Afrique et l’océan Indien : Dakar, Abidjan, Le Caire, Île Maurice. Durée, compagnies, prix par mois et conseils depuis Paris.",
    intro: ["Dakar, Abidjan, Le Caire, l’île Maurice : ces villes sont reliées à Paris par des vols directs, assurés par des compagnies nationales et par Air France.", "L’été et les fêtes de fin d’année concentrent la demande : réservez tôt. Pensez aussi aux vaccinations et aux formalités avant de partir."],
    airports: ["Dakar – Blaise-Diagne (DSS)", "Abidjan – Félix-Houphouët-Boigny (ABJ)", "Le Caire (CAI)", "Île Maurice (MRU)"],
    faq: [
      { question: "Quelles vaccinations pour l’Afrique ?", answer: "Certaines vaccinations, comme la fièvre jaune, peuvent être obligatoires selon la destination. Consultez les recommandations sanitaires officielles avant de réserver." },
      { question: "Quand réserver un vol vers l’Afrique ?", answer: "L’été et les fêtes de fin d’année sont les périodes les plus chères. Anticipez votre réservation de plusieurs mois." }
    ]
  },
  {
    slug: "amerique-latine", name: "Amérique latine et Caraïbes", withArticle: "l’Amérique latine et les Caraïbes", toward: "vers l’Amérique latine et les Caraïbes",
    stat: `Les départs de France vers le Brésil ont progressé d’environ 13,6 % au premier semestre 2025 (${SOURCE}).`,
    metaTitle: "Vol Brésil, Mexique, Caraïbes : tous les trajets",
    description: "Comparez les vols vers l’Amérique latine et les Caraïbes : São Paulo, Rio, Cancún, Punta Cana. Durée, prix par mois et conseils pour chaque trajet depuis Paris.",
    intro: ["Entre neuf et douze heures de vol depuis Paris pour rejoindre le Brésil, le Mexique ou la République dominicaine, avec ou sans escale selon la destination.", "Durée totale, franchise de bagage, formalités d’entrée : tout change d’un pays à l’autre, comparez-les avant de réserver."],
    airports: ["São Paulo – Guarulhos (GRU)", "Rio de Janeiro – Galeão (GIG)", "Cancún (CUN)", "Punta Cana (PUJ)"],
    faq: [
      { question: "Quand partir en Amérique latine pour payer moins cher ?", answer: "Les fêtes de fin d’année, le carnaval au Brésil et l’hiver aux Caraïbes sont les périodes les plus chères. Hors de ces dates, les tarifs sont plus souples." },
      { question: "Quels documents faut-il pour l’Amérique latine ?", answer: FORMALITIES }
    ]
  }
];
