(function () {
  "use strict";

  const utils = window.MMUtils;
  const config = window.MAISON_MAX_CONFIG || {};

  const categories = [
    {
      key: "robes",
      label: "Robes",
      image:
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&q=80"
    },
    {
      key: "boubous",
      label: "Boubous",
      image:
        "https://images.unsplash.com/photo-1608755728617-aefab37d2edd?auto=format&fit=crop&w=500&q=80"
    },
    {
      key: "ensembles",
      label: "Ensembles",
      image:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=80"
    },
    {
      key: "chemises",
      label: "Chemises",
      image:
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=500&q=80"
    },
    {
      key: "pantalons",
      label: "Pantalons",
      image:
        "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=500&q=80"
    },
    {
      key: "vetements-femme",
      label: "Femme",
      image:
        "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=500&q=80"
    },
    {
      key: "vetements-homme",
      label: "Homme",
      image:
        "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=500&q=80"
    },
    {
      key: "chaussures",
      label: "Chaussures",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80"
    },
    {
      key: "sacs",
      label: "Sacs",
      image:
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=500&q=80"
    },
    {
      key: "accessoires",
      label: "Accessoires",
      image:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=500&q=80"
    },
    {
      key: "vetements-enfants",
      label: "Enfants",
      image:
        "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=500&q=80"
    }
  ];

  const featuredCategoryKeys = [
    "robes",
    "boubous",
    "ensembles",
    "chemises",
    "pantalons",
    "vetements-femme",
    "vetements-homme",
    "chaussures",
    "sacs"
  ];

  const categoryOrder = [
    "robes",
    "boubous",
    "ensembles",
    "chemises",
    "pantalons",
    "vetements-femme",
    "vetements-homme",
    "vetements-enfants",
    "chaussures",
    "sacs",
    "accessoires"
  ];

  const fallbackGalleryImages = [
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=82",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=82",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=82",
    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=82"
  ];

  const heroImagePool = [
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1500&q=84",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1500&q=84",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1500&q=84",
    "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=1500&q=84",
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1500&q=84",
    "https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&w=1500&q=84"
  ];

  const promoImagePools = [
    [
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80"
    ],
    [
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1608755728617-aefab37d2edd?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&w=700&q=80"
    ],
    [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=700&q=80"
    ],
    [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=700&q=80"
    ]
  ];

  const categoryGalleryImages = {
    robes: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=82"
    ],
    boubous: [
      "https://images.unsplash.com/photo-1608755728617-aefab37d2edd?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=82"
    ],
    ensembles: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=82"
    ],
    chemises: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&w=900&q=82"
    ],
    pantalons: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=82"
    ],
    "vetements-femme": [
      "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=82"
    ],
    "vetements-homme": [
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&w=900&q=82"
    ],
    chaussures: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=82"
    ],
    sacs: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&q=82"
    ],
    accessoires: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1586078130702-d208859b6223?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=900&q=82"
    ],
    "vetements-enfants": [
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=900&q=82"
    ]
  };

  let productCarouselTimers = [];
  let productNavigationTimer = null;

  const demoProducts = [
    {
      id: "demo-robe-elegante-wax",
      name: "Robe elegante wax",
      slug: "robe-elegante-wax",
      short_description: "Robe fluide en wax premium, coupe chic pour ceremonies et sorties.",
      description:
        "Robe elegante confectionnee dans un tissu wax lumineux avec une coupe confortable. Ideale pour les receptions, les sorties en Afrique et les evenements familiaux.",
      price: 15000,
      old_price: 20000,
      category: "robes",
      subcategory: "Femme",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Rouge", "Jaune", "Bleu"],
      images: [
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&w=900&q=80"
      ],
      main_image:
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80",
      is_available: true,
      is_featured: true,
      is_promo: true,
      created_at: "2026-04-21T10:00:00Z"
    },
    {
      id: "demo-boubou-homme-brode",
      name: "Boubou homme brode",
      slug: "boubou-homme-brode",
      short_description: "Boubou deux pieces avec broderie sobre et finition premium.",
      description:
        "Boubou homme ample, elegant et facile a porter. Finitions propres, col brode et tissu agreable pour les grandes occasions.",
      price: 28000,
      old_price: 35000,
      category: "boubous",
      subcategory: "Homme",
      sizes: ["M", "L", "XL", "XXL"],
      colors: ["Blanc", "Bleu nuit", "Beige"],
      images: [
        "https://images.unsplash.com/photo-1608755728617-aefab37d2edd?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=900&q=80"
      ],
      main_image:
        "https://images.unsplash.com/photo-1608755728617-aefab37d2edd?auto=format&fit=crop&w=900&q=80",
      is_available: true,
      is_featured: true,
      is_promo: true,
      created_at: "2026-04-18T10:00:00Z"
    },
    {
      id: "demo-ensemble-bazin-femme",
      name: "Ensemble bazin femme",
      slug: "ensemble-bazin-femme",
      short_description: "Ensemble chic en bazin riche, parfait pour ceremonies.",
      description:
        "Ensemble femme compose d'un haut structure et d'une jupe droite. Le bazin garde une belle tenue et donne un rendu premium.",
      price: 32000,
      old_price: null,
      category: "ensembles",
      subcategory: "Femme",
      sizes: ["S", "M", "L"],
      colors: ["Or", "Vert", "Violet"],
      images: [
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"
      ],
      main_image:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
      is_available: true,
      is_featured: true,
      is_promo: false,
      created_at: "2026-04-15T10:00:00Z"
    },
    {
      id: "demo-chemise-lin-homme",
      name: "Chemise homme en lin",
      slug: "chemise-homme-lin",
      short_description: "Chemise respirante, coupe moderne et facile a associer.",
      description:
        "Chemise homme en lin melange pour les journees chaudes. Col propre, coupe actuelle et boutons ton sur ton.",
      price: 12000,
      old_price: 15000,
      category: "chemises",
      subcategory: "Homme",
      sizes: ["M", "L", "XL"],
      colors: ["Blanc", "Ciel", "Sable"],
      images: [
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80"
      ],
      main_image:
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80",
      is_available: true,
      is_featured: false,
      is_promo: true,
      created_at: "2026-04-10T10:00:00Z"
    },
    {
      id: "demo-pantalon-chino",
      name: "Pantalon chino ajustable",
      slug: "pantalon-chino-ajustable",
      short_description: "Pantalon polyvalent pour bureau, sorties et ceremonies simples.",
      description:
        "Pantalon chino coupe droite, confortable et resistant. Une piece facile a porter avec chemise, polo ou boubou leger.",
      price: 14000,
      old_price: null,
      category: "pantalons",
      subcategory: "Homme",
      sizes: ["38", "40", "42", "44"],
      colors: ["Noir", "Marine", "Kaki"],
      images: [
        "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80"
      ],
      main_image:
        "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80",
      is_available: true,
      is_featured: false,
      is_promo: false,
      created_at: "2026-04-08T10:00:00Z"
    },
    {
      id: "demo-sandales-cuir",
      name: "Sandales en cuir",
      slug: "sandales-cuir-senegal",
      short_description: "Sandales solides avec finitions artisanales.",
      description:
        "Sandales en cuir avec semelle confortable. Un choix elegant pour accompagner boubou, ensemble ou tenue casual.",
      price: 18000,
      old_price: 22000,
      category: "chaussures",
      subcategory: "Mixte",
      sizes: ["39", "40", "41", "42", "43"],
      colors: ["Marron", "Noir"],
      images: [
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80"
      ],
      main_image:
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80",
      is_available: true,
      is_featured: true,
      is_promo: true,
      created_at: "2026-04-07T10:00:00Z"
    },
    {
      id: "demo-sac-main-pagne",
      name: "Sac a main pagne tisse",
      slug: "sac-main-pagne-tisse",
      short_description: "Sac chic avec details textiles et fermeture zippee.",
      description:
        "Sac a main compact avec motifs inspires des textiles africains. Pratique pour les sorties et facile a assortir.",
      price: 16500,
      old_price: null,
      category: "sacs",
      subcategory: "Femme",
      sizes: [],
      colors: ["Moutarde", "Noir", "Rouge"],
      images: [
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80"
      ],
      main_image:
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
      is_available: true,
      is_featured: false,
      is_promo: false,
      created_at: "2026-04-06T10:00:00Z"
    },
    {
      id: "demo-boubou-enfant",
      name: "Boubou enfant ceremonie",
      slug: "boubou-enfant-ceremonie",
      short_description: "Tenue enfant confortable pour Tabaski, baptemes et fetes.",
      description:
        "Boubou enfant doux et leger avec une belle finition. Disponible en plusieurs tailles et couleurs lumineuses.",
      price: 10000,
      old_price: 13000,
      category: "vetements-enfants",
      subcategory: "Enfant",
      sizes: ["2 ans", "4 ans", "6 ans", "8 ans"],
      colors: ["Blanc", "Bleu", "Rose"],
      images: [
        "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80"
      ],
      main_image:
        "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80",
      is_available: true,
      is_featured: true,
      is_promo: true,
      created_at: "2026-04-05T10:00:00Z"
    },
    {
      id: "demo-tailleur-femme",
      name: "Tailleur femme urbain",
      slug: "tailleur-femme-urbain",
      short_description: "Tailleur moderne pour bureau, rendez-vous et evenements.",
      description:
        "Tailleur femme compose d'une veste structuree et d'un pantalon fluide. Look professionnel avec une touche mode.",
      price: 30000,
      old_price: 38000,
      category: "vetements-femme",
      subcategory: "Femme",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Noir", "Camel", "Bleu"],
      images: [
        "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=900&q=80"
      ],
      main_image:
        "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=900&q=80",
      is_available: true,
      is_featured: false,
      is_promo: true,
      created_at: "2026-04-04T10:00:00Z"
    },
    {
      id: "demo-baskets-mode",
      name: "Baskets mode blanches",
      slug: "baskets-mode-blanches",
      short_description: "Baskets legeres pour un style propre au quotidien.",
      description:
        "Baskets blanches a semelle confortable. Elles se portent facilement avec jean, robe casual ou ensemble leger.",
      price: 22000,
      old_price: null,
      category: "chaussures",
      subcategory: "Mixte",
      sizes: ["38", "39", "40", "41", "42", "43"],
      colors: ["Blanc"],
      images: [
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80"
      ],
      main_image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80",
      is_available: true,
      is_featured: false,
      is_promo: false,
      created_at: "2026-04-03T10:00:00Z"
    },
    {
      id: "demo-foulard-satin",
      name: "Foulard satin imprime",
      slug: "foulard-satin-imprime",
      short_description: "Accessoire doux pour sublimer robes, chemises et coiffures.",
      description:
        "Foulard en satin imprime, leger et agreable. Parfait pour une finition elegante sur une tenue simple.",
      price: 6000,
      old_price: 8000,
      category: "accessoires",
      subcategory: "Femme",
      sizes: [],
      colors: ["Or", "Rose", "Vert"],
      images: [
        "https://images.unsplash.com/photo-1586078130702-d208859b6223?auto=format&fit=crop&w=900&q=80"
      ],
      main_image:
        "https://images.unsplash.com/photo-1586078130702-d208859b6223?auto=format&fit=crop&w=900&q=80",
      is_available: true,
      is_featured: false,
      is_promo: true,
      created_at: "2026-04-01T10:00:00Z"
    },
    {
      id: "demo-ensemble-homme-weekend",
      name: "Ensemble homme week-end",
      slug: "ensemble-homme-weekend",
      short_description: "Ensemble relax en coton, parfait pour sorties et voyages.",
      description:
        "Ensemble homme deux pieces avec haut leger et pantalon assorti. Un choix sobre, confortable et moderne.",
      price: 24000,
      old_price: null,
      category: "vetements-homme",
      subcategory: "Homme",
      sizes: ["M", "L", "XL"],
      colors: ["Kaki", "Noir", "Ecru"],
      images: [
        "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=900&q=80"
      ],
      main_image:
        "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=900&q=80",
      is_available: true,
      is_featured: true,
      is_promo: false,
      created_at: "2026-03-28T10:00:00Z"
    }
  ].map(utils.normalizeProduct);

  const state = {
    products: [],
    visibleProducts: [],
    productImageOrders: new Map(),
    selectedCategory: "all",
    search: "",
    minPrice: "",
    maxPrice: "",
    sort: "random",
    page: 1,
    loading: true,
    error: ""
  };

  const getCategoryLabel = (key) => {
    const found = categories.find((category) => category.key === key);
    const custom = {
      "vetements-femme": "Femme",
      "vetements-homme": "Homme",
      "pantalons": "Pantalons"
    };
    return found ? found.label : custom[key] || key;
  };

  const categoryRank = (category) => {
    const index = categoryOrder.indexOf(category);
    return index === -1 ? categoryOrder.length : index;
  };

  const sortByCategory = (products) =>
    products.sort(
      (a, b) =>
        categoryRank(a.category) - categoryRank(b.category) ||
        new Date(b.created_at) - new Date(a.created_at)
    );

  const shuffleItems = (items) => {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
  };

  const shuffleProducts = (products) => {
    for (let index = products.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [products[index], products[swapIndex]] = [products[swapIndex], products[index]];
    }
    return products;
  };

  const isDemoMode = () => !window.MMSupabase || !window.MMSupabase.isConfigured;

  const setLoading = (loading) => {
    state.loading = loading;
    const skeleton = document.querySelector("[data-product-skeleton]");
    if (skeleton) skeleton.hidden = !loading;
  };

  const showError = (message) => {
    const node = document.querySelector("[data-product-error]");
    if (!node) return;
    node.textContent = message || "";
    node.hidden = !message;
  };

  const getProductsPageSize = () => {
    const isMobile = window.matchMedia && window.matchMedia("(max-width: 820px)").matches;
    const isLargeScreen = window.matchMedia && window.matchMedia("(min-width: 1100px)").matches;
    const isHomePage = document.body.classList.contains("home-page");
    if (isLargeScreen) return 10;
    if (isHomePage) return 6;
    return isMobile ? 6 : 8;
  };

  const getPageWindow = (current, total) => {
    if (total <= 5) return Array.from({ length: total }, (_, index) => index + 1);
    const pages = new Set([1, total, current, current - 1, current + 1]);
    return [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
  };

  const filterProducts = ({ resetPage = true } = {}) => {
    const search = state.search.trim().toLowerCase();
    const min = Number(state.minPrice || 0);
    const max = Number(state.maxPrice || 0);

    let products = [...state.products];

    if (state.selectedCategory !== "all") {
      products = products.filter((product) => product.category === state.selectedCategory);
    }

    if (search) {
      products = products.filter((product) => {
        const source = [
          product.name,
          product.short_description,
          product.description,
          product.category,
          product.subcategory
        ]
          .join(" ")
          .toLowerCase();
        return source.includes(search);
      });
    }

    if (min > 0) products = products.filter((product) => product.price >= min);
    if (max > 0) products = products.filter((product) => product.price <= max);

    if (state.sort === "random") shuffleProducts(products);
    else if (state.sort === "category") sortByCategory(products);
    else if (state.sort === "price-asc") products.sort((a, b) => a.price - b.price);
    else if (state.sort === "price-desc") products.sort((a, b) => b.price - a.price);
    else if (state.sort === "promo") {
      products.sort((a, b) => Number(b.is_promo) - Number(a.is_promo) || b.price - a.price);
    } else if (state.sort === "newest") {
      products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    state.visibleProducts = products;
    if (resetPage) state.page = 1;
    renderProductGrid();
  };

  const createBadge = (text, type) =>
    utils.createEl("span", { className: `product-badge ${type || ""}`, text });

  const createProductRating = () => {
    const rating = utils.createEl("div", { className: "product-rating", attrs: { "aria-hidden": "true" } });
    for (let index = 0; index < 5; index += 1) {
      rating.appendChild(utils.createEl("i", { className: "fa-solid fa-star" }));
    }
    return rating;
  };

  const createPriceNode = (product) => {
    const price = utils.createEl("div", { className: "product-price" });
    price.appendChild(utils.createEl("strong", { text: utils.formatPrice(product.price) }));
    if (product.old_price && product.old_price > product.price) {
      price.appendChild(utils.createEl("span", { text: utils.formatPrice(product.old_price) }));
    }
    return price;
  };

  const openImageViewer = (src, alt = "Image produit") => {
    if (!src) return;
    let viewer = document.querySelector("[data-image-viewer]");
    if (!viewer) {
      viewer = utils.createEl("div", {
        className: "image-viewer",
        attrs: { "data-image-viewer": "", "aria-hidden": "true" }
      });
      viewer.innerHTML = `
        <div class="image-viewer-frame">
          <button class="image-viewer-close" type="button" data-image-viewer-close aria-label="Fermer l'image">
            <i class="fa-solid fa-xmark"></i>
          </button>
          <img data-image-viewer-img alt="" />
        </div>
      `;
      document.body.appendChild(viewer);
      viewer.addEventListener("click", (event) => {
        if (event.target === viewer) closeImageViewer();
      });
      viewer.querySelector("[data-image-viewer-close]")?.addEventListener("click", closeImageViewer);
    }

    const image = viewer.querySelector("[data-image-viewer-img]");
    image.src = src;
    image.alt = alt;
    viewer.classList.add("is-open");
    viewer.setAttribute("aria-hidden", "false");
    document.body.classList.add("image-viewer-open");
  };

  const closeImageViewer = () => {
    const viewer = document.querySelector("[data-image-viewer]");
    if (!viewer) return;
    viewer.classList.remove("is-open");
    viewer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("image-viewer-open");
  };

  const createProductImage = ({ className = "", src, alt, loading = "lazy", attrs = {}, viewer = true } = {}) => {
    const imageAttrs = {
      ...attrs,
      src: attrs.src || src || utils.fallbackImage,
      alt: attrs.alt || alt || "Produit Maison Max"
    };
    if (loading) imageAttrs.loading = loading;

    const image = utils.createEl("img", { className, attrs: imageAttrs });
    image.addEventListener("error", () => {
      if (image.dataset.fallbackApplied === "true") return;
      image.dataset.fallbackApplied = "true";
      image.src = utils.fallbackImage;
    });
    if (viewer) {
      image.classList.add("is-viewable");
      image.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        openImageViewer(image.currentSrc || image.src, image.alt);
      });
    }
    return image;
  };

  const setProductImageSource = (image, src) => {
    if (!image) return;
    delete image.dataset.fallbackApplied;
    image.src = src || utils.fallbackImage;
  };

  const getRandomizedProductGallery = (product, gallery) => {
    if (gallery.length < 2) return gallery;

    const keySource = product.id || product.slug || product.name || "product";
    const cacheKey = `${keySource}:${gallery.join("|")}`;
    if (!state.productImageOrders.has(cacheKey)) {
      const shuffled = shuffleItems(gallery);
      if (shuffled.length > 1 && shuffled.every((src, index) => src === gallery[index])) {
        shuffled.push(shuffled.shift());
      }
      state.productImageOrders.set(cacheKey, shuffled);
    }
    return [...state.productImageOrders.get(cacheKey)];
  };

  const getProductGallery = (product) => {
    const savedGallery = utils.unique([product.main_image, ...(product.images || [])]);
    const isDemoProduct = String(product.id || "").startsWith("demo-");
    let gallery;

    if (!isDemoProduct) {
      gallery = savedGallery.length ? savedGallery : [utils.fallbackImage];
      return getRandomizedProductGallery(product, gallery);
    }

    const fallback = categoryGalleryImages[product.category] || fallbackGalleryImages;
    gallery = utils.unique([...savedGallery, ...fallback, ...fallbackGalleryImages]);
    return getRandomizedProductGallery(product, gallery.slice(0, Math.max(3, Math.min(gallery.length, 5))));
  };

  const getProductDisplayImage = (product) => getProductGallery(product)[0] || product.main_image || utils.fallbackImage;

  const mergeProductContext = (...groups) => {
    const seen = new Set();
    const products = [];
    groups.flat().forEach((product) => {
      const key = product && (product.id || product.slug || product.name);
      if (!key || seen.has(key)) return;
      seen.add(key);
      products.push(product);
    });
    return products;
  };

  const getProductSlideDuration = (product, index) => {
    const durations = [3600, 5200, 6800, 4500, 6100];
    const categoryIndex = Math.max(0, categoryOrder.indexOf(product.category));
    return durations[index % durations.length] + (categoryIndex % 3) * 300;
  };

  const setProductCarouselIndex = (carousel, index) => {
    const images = Array.from(carousel.querySelectorAll(".product-carousel-image"));
    const dots = Array.from(carousel.querySelectorAll(".product-carousel-dots span"));
    if (!images.length) return;
    const nextIndex = (index + images.length) % images.length;
    carousel.dataset.index = String(nextIndex);
    images.forEach((image, imageIndex) => image.classList.toggle("is-active", imageIndex === nextIndex));
    dots.forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === nextIndex));
  };

  const getCurrentSlideDuration = (carousel) => {
    const images = carousel.querySelectorAll(".product-carousel-image");
    const index = Number(carousel.dataset.index || 0);
    return Number(images[index]?.dataset.duration || 5000);
  };

  const scheduleProductCarousel = (carousel, timerIndex) => {
    const images = carousel.querySelectorAll(".product-carousel-image");
    if (images.length < 2) return;

    productCarouselTimers[timerIndex] = setTimeout(() => {
      if (!carousel.isConnected) return;
      const currentImages = carousel.querySelectorAll(".product-carousel-image");
      if (currentImages.length < 2) return;
      const next = (Number(carousel.dataset.index || 0) + 1) % currentImages.length;
      setProductCarouselIndex(carousel, next);
      scheduleProductCarousel(carousel, timerIndex);
    }, getCurrentSlideDuration(carousel));
  };

  const restartProductCarousel = (carousel) => {
    const timerIndex = Number(carousel.dataset.timerIndex);
    if (!Number.isInteger(timerIndex)) return;
    clearTimeout(productCarouselTimers[timerIndex]);
    scheduleProductCarousel(carousel, timerIndex);
  };

  const startProductCarousels = () => {
    productCarouselTimers.forEach((t) => clearTimeout(t));
    productCarouselTimers = [];
    const carousels = Array.from(document.querySelectorAll("[data-product-carousel]"));
    if (!carousels.length) return;

    carousels.forEach((carousel, i) => {
      carousel.dataset.timerIndex = String(i);
      setProductCarouselIndex(carousel, 0);
      scheduleProductCarousel(carousel, i);
    });
  };

  const getProductClickLoader = () => {
    let loader = document.querySelector("[data-product-click-loader]");
    if (loader) return loader;

    loader = utils.createEl("div", {
      className: "product-click-loader",
      attrs: { "data-product-click-loader": "", "aria-live": "polite", "aria-hidden": "true" }
    });
    loader.innerHTML = `
      <div class="product-click-loader-box">
        <img src="assets/logo-maison-max.jpg" alt="Maison Max" width="42" height="42" />
        <span class="product-click-spinner" aria-hidden="true"></span>
        <span>Chargement du produit...</span>
      </div>
    `;
    document.body.appendChild(loader);
    return loader;
  };

  const showProductClickLoader = () => {
    const loader = getProductClickLoader();
    loader.setAttribute("aria-hidden", "false");
    loader.classList.add("is-visible");
    document.body.classList.add("product-loading-open");
  };

  const hideProductClickLoader = () => {
    const loader = document.querySelector("[data-product-click-loader]");
    window.clearTimeout(productNavigationTimer);
    productNavigationTimer = null;
    loader?.setAttribute("aria-hidden", "true");
    loader?.classList.remove("is-visible");
    document.body.classList.remove("product-loading-open");
  };

  const runAfterProductLoader = (callback) => {
    showProductClickLoader();
    window.clearTimeout(productNavigationTimer);
    productNavigationTimer = window.setTimeout(() => {
      productNavigationTimer = null;
      hideProductClickLoader();
      callback();
    }, 500);
  };

  const openProductWithLoader = (url) => {
    showProductClickLoader();
    window.clearTimeout(productNavigationTimer);
    productNavigationTimer = window.setTimeout(() => {
      productNavigationTimer = null;
      window.location.href = url;
    }, 500);
  };

  const openProductModalWithLoader = (product) => {
    runAfterProductLoader(() => openProductModal(product));
  };

  const handleProductLinkClick = (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    const link = event.currentTarget;
    const target = link.getAttribute("target");
    if (target && target !== "_self") return;

    event.preventDefault();
    openProductWithLoader(link.href);
  };

  const createProductCard = (product) => {
    const card = utils.createEl("article", { className: "product-card" });

    const media = utils.createEl("a", {
      className: "product-media",
      attrs: { href: utils.getProductUrl(product), "aria-label": `Voir ${product.name}` }
    });
    media.addEventListener("click", handleProductLinkClick);
    const productCarousel = utils.createEl("div", {
      className: "product-image-carousel",
      attrs: { "data-product-carousel": "", "data-index": "0" }
    });
    const gallery = getProductGallery(product);
    gallery.forEach((src, index) => {
      productCarousel.appendChild(
        createProductImage({
          className: `product-carousel-image ${index === 0 ? "is-active" : ""}`,
          src,
          alt: product.name,
          loading: "lazy",
          attrs: { "data-duration": getProductSlideDuration(product, index) }
        })
      );
    });
    const carouselDots = utils.createEl("div", { className: "product-carousel-dots" });
    gallery.forEach((_, index) => {
      carouselDots.appendChild(utils.createEl("span", { className: index === 0 ? "is-active" : "" }));
    });
    productCarousel.appendChild(carouselDots);
    if (gallery.length > 1) {
      const prevBtn = utils.createEl("button", {
        className: "carousel-arrow carousel-arrow-prev",
        attrs: { type: "button", "aria-label": "Image precedente" }
      });
      prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
      const nextBtn = utils.createEl("button", {
        className: "carousel-arrow carousel-arrow-next",
        attrs: { type: "button", "aria-label": "Image suivante" }
      });
      nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
      const navigate = (dir, e) => {
        e.preventDefault();
        e.stopPropagation();
        const images = productCarousel.querySelectorAll(".product-carousel-image");
        if (!images.length) return;
        const current = Number(productCarousel.dataset.index || 0);
        setProductCarouselIndex(productCarousel, current + dir);
        restartProductCarousel(productCarousel);
      };
      prevBtn.addEventListener("click", (e) => navigate(-1, e));
      nextBtn.addEventListener("click", (e) => navigate(1, e));
      productCarousel.appendChild(prevBtn);
      productCarousel.appendChild(nextBtn);
    }
    media.appendChild(productCarousel);

    const badges = utils.createEl("div", { className: "badge-stack" });
    if (product.is_promo) badges.appendChild(createBadge("Promo", "promo"));
    if (product.is_featured) badges.appendChild(createBadge("Vedette", "featured"));
    if (!product.is_available) badges.appendChild(createBadge("Rupture", "danger"));
    if (badges.childElementCount) media.appendChild(badges);

    const body = utils.createEl("div", { className: "product-body" });
    body.appendChild(utils.createEl("p", { className: "product-category", text: getCategoryLabel(product.category) }));
    body.appendChild(utils.createEl("h3", { text: product.name }));
    body.appendChild(createProductRating());
    body.appendChild(
      utils.createEl("p", {
        className: "product-desc",
        text: product.short_description || product.description
      })
    );
    body.appendChild(createPriceNode(product));

    const actions = utils.createEl("div", { className: "product-actions" });
    const addButton = utils.createEl("button", {
      className: "btn btn-primary btn-sm",
      attrs: { type: "button" }
    });
    addButton.innerHTML = '<i class="fa-solid fa-cart-plus"></i><span>Ajouter</span>';
    addButton.addEventListener("click", () => {
      if ((product.sizes && product.sizes.length) || (product.colors && product.colors.length)) {
        openProductModal(product);
      } else {
        window.MMCart.add(product);
        window.MMCart.openCart();
      }
    });

    const viewButton = utils.createEl("button", {
      className: "icon-btn",
      attrs: { type: "button", "aria-label": "Voir les details" }
    });
    viewButton.innerHTML = '<i class="fa-regular fa-eye"></i>';
    viewButton.addEventListener("click", () => openProductModalWithLoader(product));

    actions.append(addButton, viewButton);
    body.appendChild(actions);
    card.append(media, body);
    return card;
  };

  const setProductPage = (page) => {
    state.page = Math.max(1, Number(page) || 1);
    renderProductGrid();
    document.querySelector("#catalogue")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const renderPagination = (totalPages) => {
    const holder = document.querySelector("[data-products-pagination]");
    if (!holder) return;
    holder.replaceChildren();

    if (state.loading || totalPages < 1) {
      holder.hidden = true;
      return;
    }

    holder.hidden = false;

    const makeButton = (label, page, options = {}) => {
      const button = utils.createEl("button", {
        className: `pagination-btn ${options.current ? "is-current" : ""}`,
        attrs: {
          type: "button",
          disabled: options.disabled ? "disabled" : null,
          "aria-label": options.ariaLabel || `Page ${page}`,
          "aria-current": options.current ? "page" : null
        }
      });
      button.innerHTML = label;
      if (!options.disabled && !options.current) button.addEventListener("click", () => setProductPage(page));
      return button;
    };

    holder.appendChild(
      makeButton('<i class="fa-solid fa-chevron-left"></i>', state.page - 1, {
        disabled: state.page === 1,
        ariaLabel: "Page precedente"
      })
    );

    const pages = utils.createEl("div", { className: "pagination-pages" });
    let previous = 0;
    getPageWindow(state.page, totalPages).forEach((page) => {
      if (previous && page - previous > 1) {
        pages.appendChild(utils.createEl("span", { className: "pagination-gap", text: "..." }));
      }
      pages.appendChild(makeButton(String(page), page, { current: page === state.page }));
      previous = page;
    });
    holder.appendChild(pages);

    holder.appendChild(
      makeButton('<i class="fa-solid fa-chevron-right"></i>', state.page + 1, {
        disabled: state.page === totalPages,
        ariaLabel: "Page suivante"
      })
    );
  };

  const renderProductGrid = () => {
    const grid = document.querySelector("[data-products-grid]");
    const empty = document.querySelector("[data-products-empty]");
    if (!grid) return;

    grid.replaceChildren();

    if (state.loading) {
      renderPagination(0);
      return;
    }

    if (!state.visibleProducts.length) {
      empty && empty.removeAttribute("hidden");
      renderPagination(0);
      return;
    }

    empty && empty.setAttribute("hidden", "hidden");
    const pageSize = getProductsPageSize();
    const totalPages = Math.max(1, Math.ceil(state.visibleProducts.length / pageSize));
    state.page = Math.min(Math.max(1, state.page), totalPages);
    const start = (state.page - 1) * pageSize;
    const products = state.visibleProducts.slice(start, start + pageSize);
    products.forEach((product) => grid.appendChild(createProductCard(product)));
    startProductCarousels();
    renderPagination(totalPages);
    renderProductStructuredData(state.visibleProducts.slice(0, 10));
  };

  const renderCategories = () => {
    const holder = document.querySelector("[data-category-circles]");
    const menuHolder = document.querySelector("[data-menu-categories]");

    if (holder) holder.replaceChildren();
    if (menuHolder) menuHolder.replaceChildren();

    const createCategoryButton = (category, className) => {
      const button = utils.createEl("button", {
        className,
        attrs: { type: "button" }
      });
      button.appendChild(
        utils.createEl("img", {
          attrs: {
            src: category.image,
            alt: category.label,
            loading: "lazy"
          }
        })
      );
      button.appendChild(utils.createEl("span", { text: category.label }));
      button.addEventListener("click", () => {
        state.selectedCategory = category.key;
        const categoryFilter = document.querySelector("[data-category-filter]");
        if (categoryFilter) categoryFilter.value = category.key;
        filterProducts();

        const target = document.querySelector("#catalogue");
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        } else {
          window.location.href = `boutique.html?category=${encodeURIComponent(category.key)}`;
        }
      });
      return button;
    };

    const featuredCategories = categories.filter((category) => featuredCategoryKeys.includes(category.key));

    featuredCategories.forEach((category) => {
      if (holder) holder.appendChild(createCategoryButton(category, "category-circle"));
    });

    categories.forEach((category) => {
      if (menuHolder) menuHolder.appendChild(createCategoryButton(category, "menu-category-card"));
    });

    if (holder) {
      const track = utils.createEl("div", { className: "category-circles-track" });
      while (holder.firstChild) track.appendChild(holder.firstChild);
      featuredCategories.forEach((category) => {
        const dup = createCategoryButton(category, "category-circle");
        dup.classList.add("category-circle-dup");
        track.appendChild(dup);
      });
      holder.appendChild(track);
    }
  };

  const createMiniProduct = (product) => {
    const item = utils.createEl("article", { className: "mini-product" });
    item.appendChild(
      createProductImage({
        src: getProductDisplayImage(product),
        alt: product.name,
        loading: "lazy"
      })
    );
    const info = utils.createEl("div");
    info.appendChild(utils.createEl("h4", { text: product.name }));
    info.appendChild(utils.createEl("p", { text: utils.formatPrice(product.price) }));
    item.appendChild(info);
    item.addEventListener("click", () => openProductModal(product));
    return item;
  };

  const renderSidebar = () => {
    const recommended = document.querySelector("[data-recommended-products]");
    const promo = document.querySelector("[data-sidebar-promos]");
    if (recommended) {
      recommended.replaceChildren();
      state.products
        .filter((product) => product.is_featured)
        .slice(0, 4)
        .forEach((product) => recommended.appendChild(createMiniProduct(product)));
    }

    if (promo) {
      promo.replaceChildren();
      state.products
        .filter((product) => product.is_promo)
        .slice(0, 4)
        .forEach((product) => promo.appendChild(createMiniProduct(product)));
    }
  };

  const renderHotDeal = () => {
    const holder = document.querySelector("[data-hot-deal]");
    if (!holder) return;
    const product =
      state.products.find((item) => item.is_promo && item.old_price && item.old_price > item.price) ||
      state.products[0];
    if (!product) return;

    holder.replaceChildren();
    const image = createProductImage({
      src: getProductDisplayImage(product),
      alt: product.name,
      loading: "lazy"
    });
    const content = utils.createEl("div", { className: "hot-deal-content" });
    content.appendChild(createBadge("Hot Deal", "promo"));
    content.appendChild(utils.createEl("h3", { text: product.name }));
    content.appendChild(utils.createEl("p", { text: product.short_description || product.description }));
    content.appendChild(createPriceNode(product));

    const button = utils.createEl("button", {
      className: "btn btn-primary",
      attrs: { type: "button" }
    });
    button.innerHTML = '<i class="fa-solid fa-bag-shopping"></i><span>Voir l\'offre</span>';
    button.addEventListener("click", () => openProductModal(product));
    content.appendChild(button);
    holder.append(image, content);
  };

  const syncCategoryOptions = () => {
    const selects = document.querySelectorAll("[data-category-filter], [data-hero-category]");
    selects.forEach((select) => {
      const current = select.value;
      select.replaceChildren();
      select.appendChild(utils.createEl("option", { attrs: { value: "all" }, text: "Toutes les categories" }));
      categories.forEach((category) => {
        select.appendChild(utils.createEl("option", { attrs: { value: category.key }, text: category.label }));
      });
      select.value = current || "all";
    });
  };

  const openProductModal = (product) => {
    const modal = document.querySelector("[data-product-modal]");
    const body = document.querySelector("[data-product-modal-body]");
    if (!modal || !body) return;

    body.replaceChildren();

    const gallery = utils.createEl("div", { className: "modal-gallery" });
    const galleryImages = getProductGallery(product);
    const main = createProductImage({
      className: "modal-main-image",
      src: galleryImages[0] || utils.fallbackImage,
      alt: product.name,
      loading: "eager"
    });
    gallery.appendChild(main);

    const thumbs = utils.createEl("div", { className: "modal-thumbs" });
    galleryImages.forEach((src) => {
      const button = utils.createEl("button", { attrs: { type: "button" } });
      button.appendChild(createProductImage({ src, alt: product.name, loading: "lazy", viewer: false }));
      button.addEventListener("click", () => {
        setProductImageSource(main, src);
      });
      thumbs.appendChild(button);
    });
    gallery.appendChild(thumbs);

    const detail = utils.createEl("div", { className: "modal-product-detail" });
    const labelRow = utils.createEl("div", { className: "modal-label-row" });
    if (product.is_promo) labelRow.appendChild(createBadge("Promo", "promo"));
    if (product.is_featured) labelRow.appendChild(createBadge("Vedette", "featured"));
    labelRow.appendChild(createBadge(product.is_available ? "Disponible" : "Rupture", product.is_available ? "success" : "danger"));

    detail.appendChild(labelRow);
    detail.appendChild(utils.createEl("p", { className: "product-category", text: getCategoryLabel(product.category) }));
    detail.appendChild(utils.createEl("h2", { text: product.name }));
    detail.appendChild(utils.createEl("p", { className: "modal-description", text: product.description || product.short_description }));
    detail.appendChild(createPriceNode(product));

    const form = utils.createEl("form", { className: "option-form" });

    const sizeSelect = createOptionSelect("Taille", product.sizes, "size");
    const colorSelect = createOptionSelect("Couleur", product.colors, "color");
    if (sizeSelect) form.appendChild(sizeSelect.wrap);
    if (colorSelect) form.appendChild(colorSelect.wrap);

    const qtyWrap = utils.createEl("label", { className: "field-label" });
    qtyWrap.appendChild(utils.createEl("span", { text: "Quantite" }));
    const qty = utils.createEl("input", { attrs: { type: "number", min: "1", value: "1" } });
    qtyWrap.appendChild(qty);
    form.appendChild(qtyWrap);

    const actions = utils.createEl("div", { className: "modal-actions" });
    const addButton = utils.createEl("button", {
      className: "btn btn-primary",
      attrs: { type: "submit", disabled: product.is_available ? null : "disabled" }
    });
    addButton.innerHTML = '<i class="fa-solid fa-cart-plus"></i><span>Ajouter au panier</span>';

    const whatsappButton = utils.createEl("button", {
      className: "btn btn-outline",
      attrs: { type: "button" }
    });
    whatsappButton.innerHTML = '<i class="fa-brands fa-whatsapp"></i><span>Commander</span>';

    actions.append(addButton, whatsappButton);
    form.appendChild(actions);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      window.MMCart.add(product, {
        size: sizeSelect ? sizeSelect.input.value : "",
        color: colorSelect ? colorSelect.input.value : "",
        quantity: qty.value
      });
      closeProductModal();
      window.MMCart.openCart();
    });

    whatsappButton.addEventListener("click", () => {
      window.MMCart.add(product, {
        size: sizeSelect ? sizeSelect.input.value : "",
        color: colorSelect ? colorSelect.input.value : "",
        quantity: qty.value
      });
      window.MMCart.checkoutWhatsApp();
    });

    detail.appendChild(form);
    body.append(gallery, detail);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  };

  const createOptionSelect = (label, items, name) => {
    if (!items || !items.length) return null;
    const wrap = utils.createEl("label", { className: "field-label" });
    wrap.appendChild(utils.createEl("span", { text: label }));
    const input = utils.createEl("select", { attrs: { name } });
    items.forEach((item) => input.appendChild(utils.createEl("option", { attrs: { value: item }, text: item })));
    wrap.appendChild(input);
    return { wrap, input };
  };

  const closeProductModal = () => {
    const modal = document.querySelector("[data-product-modal]");
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };

  const bindProductModal = () => {
    document.querySelectorAll("[data-product-modal-close]").forEach((button) => {
      button.addEventListener("click", closeProductModal);
    });

    const overlay = document.querySelector("[data-product-modal-overlay]");
    overlay && overlay.addEventListener("click", closeProductModal);

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (document.querySelector("[data-image-viewer].is-open")) {
        closeImageViewer();
        return;
      }
      closeProductModal();
    });
  };

  const renderProductStructuredData = (products) => {
    const existing = document.querySelector("[data-product-jsonld]");
    if (existing) existing.remove();

    if (!products.length) return;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.productJsonld = "true";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: product.name,
          image: product.main_image,
          description: product.short_description || product.description,
          category: getCategoryLabel(product.category),
          offers: {
            "@type": "Offer",
            priceCurrency: "XOF",
            price: product.price,
            availability: product.is_available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url: `${config.SITE_URL || window.location.origin}/${utils.getProductUrl(product)}`
          }
        }
      }))
    });
    document.head.appendChild(script);
  };

  const loadCategoryImageSettings = async () => {
    if (isDemoMode() || !window.MMSupabase.getSiteSetting) return;

    try {
      const imageSettings = await window.MMSupabase.getSiteSetting("category_images");
      if (!imageSettings || typeof imageSettings !== "object") return;

      categories.forEach((category) => {
        if (imageSettings[category.key]) {
          category.image = imageSettings[category.key];
        }
      });
    } catch (error) {
      // Keep the built-in category images if Supabase settings cannot load.
    }
  };

  const loadThemeSettings = async () => {
    if (isDemoMode() || !window.MMSupabase.getSiteSetting || !utils.applyStoreTheme) return;

    try {
      const theme = await window.MMSupabase.getSiteSetting("store_theme");
      if (!theme || typeof theme !== "object") return;
      const normalized = utils.storeTheme(theme);
      utils.applyStoreTheme(normalized);
    } catch (error) {
      utils.applyStoreTheme(utils.getStoredTheme());
    }
  };

  const createProductChoice = (label, items, name) => {
    if (!items || !items.length) return null;
    const wrap = utils.createEl("label", { className: "field-label product-choice-field" });
    wrap.appendChild(utils.createEl("span", { text: label }));
    const input = utils.createEl("select", { attrs: { name, required: "required" } });
    input.appendChild(utils.createEl("option", { attrs: { value: "" }, text: `Choisir ${label.toLowerCase()}` }));
    items.forEach((item) => input.appendChild(utils.createEl("option", { attrs: { value: item }, text: item })));
    wrap.appendChild(input);
    return { wrap, input };
  };

  const createProductService = (icon, title, text) => {
    const item = utils.createEl("article", { className: "product-service-item" });
    item.appendChild(utils.createEl("i", { className: icon.includes(" ") ? icon : `fa-solid ${icon}` }));
    const body = utils.createEl("div");
    body.appendChild(utils.createEl("strong", { text: title }));
    body.appendChild(utils.createEl("span", { text }));
    item.appendChild(body);
    return item;
  };

  const createProductInfoPanel = (title, children = []) => {
    const panel = utils.createEl("article", { className: "product-detail-panel" });
    panel.appendChild(utils.createEl("h2", { text: title }));
    children.forEach((child) => panel.appendChild(child));
    return panel;
  };

  const hydrateProductPage = async () => {
    const detail = document.querySelector("[data-product-page]");
    if (!detail) return;

    const slug = utils.getQueryParam("slug");
    const empty = document.querySelector("[data-product-page-empty]");
    const loading = document.querySelector("[data-product-page-loading]");

    if (!slug) {
      loading && (loading.hidden = true);
      empty && empty.removeAttribute("hidden");
      return;
    }

    let product = null;
    try {
      if (window.MMSupabase && window.MMSupabase.isConfigured) {
        product = await window.MMSupabase.getProductBySlug(slug);
      } else {
        product = demoProducts.find((item) => item.slug === slug);
      }
    } catch (error) {
      product = demoProducts.find((item) => item.slug === slug);
    }

    loading && (loading.hidden = true);
    if (!product) {
      empty && empty.removeAttribute("hidden");
      return;
    }

    let relatedProducts = [];
    try {
      if (window.MMSupabase && window.MMSupabase.isConfigured) {
        relatedProducts = await window.MMSupabase.listProducts({ category: product.category });
      } else {
        relatedProducts = demoProducts.filter((item) => item.category === product.category);
      }
    } catch (error) {
      relatedProducts = demoProducts.filter((item) => item.category === product.category);
    }
    relatedProducts = relatedProducts.filter((item) => item.slug !== product.slug).slice(0, 4);

    document.title = `${product.name} | Maison Max Afrique`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      const productSeoDescription = product.short_description || product.description || "Produit Maison Max";
      metaDescription.setAttribute("content", `${productSeoDescription} Livraison vetements Afrique avec Maison Max.`);
    }
    const productUrl = `${config.SITE_URL || window.location.origin}/${utils.getProductUrl(product)}`;
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", productUrl);
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", productUrl);
    const breadcrumbCurrent = document.querySelector(".breadcrumb span");
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = product.name;

    detail.replaceChildren();
    const galleryImages = getProductGallery(product);
    const imageWrap = utils.createEl("div", { className: "product-page-gallery" });
    const mainImage = createProductImage({
      className: "product-detail-main-image",
      src: galleryImages[0] || utils.fallbackImage,
      alt: product.name,
      loading: "eager"
    });
    imageWrap.appendChild(mainImage);

    if (galleryImages.length > 1) {
      const thumbs = utils.createEl("div", { className: "product-detail-thumbs" });
      galleryImages.forEach((src, index) => {
        const button = utils.createEl("button", {
          className: index === 0 ? "is-active" : "",
          attrs: { type: "button", "aria-label": `Image ${index + 1} de ${product.name}` }
        });
        button.appendChild(createProductImage({ src, alt: product.name, loading: "lazy", viewer: false }));
        button.addEventListener("click", () => {
          setProductImageSource(mainImage, src);
          thumbs.querySelectorAll("button").forEach((item) => item.classList.toggle("is-active", item === button));
        });
        thumbs.appendChild(button);
      });
      imageWrap.appendChild(thumbs);
    }

    const info = utils.createEl("div", { className: "product-page-info" });
    const labels = utils.createEl("div", { className: "modal-label-row" });
    if (product.is_promo) labels.appendChild(createBadge("Promo", "promo"));
    if (product.is_featured) labels.appendChild(createBadge("Vedette", "featured"));
    labels.appendChild(createBadge(product.is_available ? "Disponible" : "Rupture", product.is_available ? "success" : "danger"));
    info.appendChild(labels);
    info.appendChild(utils.createEl("p", { className: "product-category", text: getCategoryLabel(product.category) }));
    info.appendChild(utils.createEl("h1", { text: product.name }));
    info.appendChild(utils.createEl("p", { className: "lead-text", text: product.short_description || product.description }));
    info.appendChild(createPriceNode(product));

    const form = utils.createEl("form", { className: "option-form product-page-form" });
    const sizeSelect = createProductChoice("Taille", product.sizes, "size");
    const colorSelect = createProductChoice("Couleur", product.colors, "color");
    if (sizeSelect) form.appendChild(sizeSelect.wrap);
    if (colorSelect) form.appendChild(colorSelect.wrap);
    const qtyWrap = utils.createEl("label", { className: "field-label product-choice-field" });
    qtyWrap.appendChild(utils.createEl("span", { text: "Quantite" }));
    const qty = utils.createEl("input", { attrs: { type: "number", min: "1", value: "1", inputmode: "numeric" } });
    qtyWrap.appendChild(qty);
    form.appendChild(qtyWrap);
    const actions = utils.createEl("div", { className: "product-page-actions" });
    const addButton = utils.createEl("button", {
      className: "btn btn-primary",
      attrs: { type: "submit", disabled: product.is_available ? null : "disabled" }
    });
    addButton.innerHTML = '<i class="fa-solid fa-cart-plus"></i><span>Ajouter au panier</span>';
    const whatsappButton = utils.createEl("button", {
      className: "btn btn-outline",
      attrs: { type: "button", disabled: product.is_available ? null : "disabled" }
    });
    whatsappButton.innerHTML = '<i class="fa-brands fa-whatsapp"></i><span>Commander sur WhatsApp</span>';
    actions.append(addButton, whatsappButton);
    form.appendChild(actions);

    const addCurrentToCart = () => {
      window.MMCart.add(product, {
        size: sizeSelect ? sizeSelect.input.value : "",
        color: colorSelect ? colorSelect.input.value : "",
        quantity: qty.value
      });
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      addCurrentToCart();
      window.MMCart.openCart();
    });

    whatsappButton.addEventListener("click", () => {
      if (!form.reportValidity()) return;
      addCurrentToCart();
      window.MMCart.checkoutWhatsApp();
    });

    info.appendChild(form);

    const services = utils.createEl("div", { className: "product-service-grid" });
    services.appendChild(createProductService("fa-truck-fast", "Livraison Afrique", "Livraison rapide et securisee en Afrique de l'Ouest, centrale, de l'Est et australe."));
    services.appendChild(createProductService("fa-brands fa-whatsapp", "Commande WhatsApp", "Validation simple du panier et confirmation directe."));
    services.appendChild(createProductService("fa-rotate-left", "Verification possible", "Controle selon les conditions de livraison et de disponibilite."));
    services.appendChild(createProductService("fa-headset", "Support client", "Conseils tailles, couleurs et disponibilites sur WhatsApp."));
    info.appendChild(services);

    detail.append(imageWrap, info);

    const descriptionText = product.description || product.short_description || "Description detaillee a venir.";
    const detailList = utils.createEl("dl", { className: "product-detail-list" });
    [
      ["Categorie", getCategoryLabel(product.category)],
      ["Sous-categorie", product.subcategory || "Non precisee"],
      ["Tailles", product.sizes && product.sizes.length ? product.sizes.join(", ") : "Selon disponibilite"],
      ["Couleurs", product.colors && product.colors.length ? product.colors.join(", ") : "Selon disponibilite"],
      ["Disponibilite", product.is_available ? "Disponible" : "Rupture"]
    ].forEach(([term, value]) => {
      detailList.appendChild(utils.createEl("dt", { text: term }));
      detailList.appendChild(utils.createEl("dd", { text: value }));
    });

    const detailSections = utils.createEl("section", { className: "product-detail-sections" });
    detailSections.appendChild(createProductInfoPanel("Description", [utils.createEl("p", { text: descriptionText })]));
    detailSections.appendChild(createProductInfoPanel("Details du produit", [detailList]));
    detailSections.appendChild(
      createProductInfoPanel("Livraison & commande", [
        utils.createEl("p", {
          text: "Ajoutez l'article au panier, choisissez votre pays ou ville de livraison, puis envoyez la commande sur WhatsApp pour finaliser avec Maison Max depuis toute l'Afrique."
        })
      ])
    );
    detail.appendChild(detailSections);

    if (relatedProducts.length) {
      const related = utils.createEl("section", { className: "related-products-section" });
      const header = utils.createEl("div", { className: "section-heading compact" });
      const titleWrap = utils.createEl("div");
      titleWrap.appendChild(utils.createEl("span", { text: "Selection Maison Max" }));
      titleWrap.appendChild(utils.createEl("h2", { text: "Produits similaires" }));
      header.appendChild(titleWrap);
      related.appendChild(header);
      const grid = utils.createEl("div", { className: "products-grid related-products-grid" });
      relatedProducts.forEach((item) => grid.appendChild(createProductCard(item)));
      related.appendChild(grid);
      detail.appendChild(related);
      startProductCarousels();
    }

    state.products = mergeProductContext([product], relatedProducts);
    state.visibleProducts = state.products;

    utils.safeJsonLd({
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      url: productUrl,
      image: product.images && product.images.length ? product.images : [product.main_image],
      description: product.description || product.short_description,
      brand: { "@type": "Brand", name: "Maison Max" },
      offers: {
        "@type": "Offer",
        priceCurrency: "XOF",
        price: product.price,
        url: productUrl,
        availability: product.is_available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
      }
    });
  };

  const bindFilters = () => {
    document.querySelectorAll("form[role='search']").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        document.querySelector("#catalogue")?.scrollIntoView({ behavior: "smooth" });
      });
    });

    const searchInputs = document.querySelectorAll("[data-product-search]");
    const updateSearch = utils.debounce((value) => {
      state.search = value;
      filterProducts();
    }, 180);
    searchInputs.forEach((input) => {
      input.addEventListener("input", () => {
        searchInputs.forEach((other) => {
          if (other !== input) other.value = input.value;
        });
        updateSearch(input.value);
      });
    });

    document.querySelectorAll("[data-category-filter], [data-hero-category]").forEach((select) => {
      select.addEventListener("change", () => {
        state.selectedCategory = select.value;
        document.querySelectorAll("[data-category-filter], [data-hero-category]").forEach((other) => {
          other.value = select.value;
        });
        filterProducts();
      });
    });

    const min = document.querySelector("[data-min-price]");
    const max = document.querySelector("[data-max-price]");
    const sort = document.querySelector("[data-sort]");

    min && min.addEventListener("input", utils.debounce(() => {
      state.minPrice = min.value;
      filterProducts();
    }, 200));
    max && max.addEventListener("input", utils.debounce(() => {
      state.maxPrice = max.value;
      filterProducts();
    }, 200));
    sort && sort.addEventListener("change", () => {
      state.sort = sort.value;
      filterProducts();
    });

    document.querySelectorAll("[data-category-shortcut]").forEach((button) => {
      button.addEventListener("click", () => {
        state.selectedCategory = button.dataset.categoryShortcut || button.dataset.categoryShortcutValue || "all";
        document.querySelectorAll("[data-category-filter], [data-hero-category]").forEach((select) => {
          select.value = state.selectedCategory;
        });
        filterProducts();
        document.querySelector("#catalogue")?.scrollIntoView({ behavior: "smooth" });
      });
    });

    window.addEventListener("resize", utils.debounce(() => {
      renderProductGrid();
    }, 180));
  };

  const bindMobileMenu = () => {
    const toggle = document.querySelector("[data-menu-toggle]");
    const menu = document.querySelector("[data-main-nav]");
    if (!toggle || !menu) return;

    const closeMenu = () => {
      menu.classList.remove("is-open");
      toggle.classList.remove("is-active");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("mobile-menu-open");
    };

    toggle.addEventListener("click", () => {
      const opened = menu.classList.toggle("is-open");
      toggle.classList.toggle("is-active", opened);
      toggle.setAttribute("aria-expanded", String(opened));
      document.body.classList.toggle("mobile-menu-open", opened);
    });

    menu.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  };

  const bindNewsletter = () => {
    const form = document.querySelector("[data-newsletter-form]");
    if (!form) return;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      form.reset();
      utils.toast("Merci, votre inscription est prise en compte.");
    });
  };

  const hydrateWhatsAppLinks = () => {
    const phone = String(config.WHATSAPP_NUMBER || "").replace(/\D/g, "");
    if (!phone) return;
    document.querySelectorAll("[data-whatsapp-floating]").forEach((link) => {
      link.setAttribute("href", `https://wa.me/${phone}`);
    });
  };

  const initRandomHeroImages = () => {
    const heroSlides = Array.from(document.querySelectorAll(".hero-slide"));
    shuffleItems(heroImagePool).slice(0, heroSlides.length).forEach((src, index) => {
      heroSlides[index].src = src;
    });

    document.querySelectorAll(".promo-card img").forEach((image, index) => {
      const pool = promoImagePools[index] || fallbackGalleryImages;
      image.src = pool[Math.floor(Math.random() * pool.length)];
    });
  };

  const loadProducts = async () => {
    setLoading(true);
    showError("");

    try {
      if (isDemoMode()) {
        state.products = demoProducts;
      } else {
        state.products = await window.MMSupabase.listProducts();
      }
    } catch (error) {
      state.products = [];
      showError("Impossible de charger les produits pour le moment.");
    } finally {
      setLoading(false);
      filterProducts();
      renderSidebar();
      renderHotDeal();
    }
  };

  const initHome = async () => {
    if (!document.querySelector("[data-products-grid]")) return;
    await loadCategoryImageSettings();
    syncCategoryOptions();
    renderCategories();
    bindFilters();

    const requestedCategory = utils.getQueryParam("category");
    if (requestedCategory) {
      state.selectedCategory = requestedCategory;
      document.querySelectorAll("[data-category-filter], [data-hero-category]").forEach((select) => {
        select.value = requestedCategory;
      });
    }

    loadProducts();
  };

  document.addEventListener("DOMContentLoaded", () => {
    bindMobileMenu();
    bindProductModal();
    bindNewsletter();
    hydrateWhatsAppLinks();
    initRandomHeroImages();
    loadThemeSettings();
    if (window.MMAI) {
      window.MMAI.initShopAssistant({
        getProducts: () => state.products,
        getVisibleProducts: () => state.visibleProducts,
        getSelectedCategory: () => state.selectedCategory,
        getCategoryLabel
      });
    }
    initHome();
    hydrateProductPage();
  });

  window.addEventListener("pageshow", hideProductClickLoader);
})();
