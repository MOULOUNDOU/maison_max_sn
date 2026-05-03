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

  const demoProducts = [
    {
      id: "demo-robe-elegante-wax",
      name: "Robe elegante wax",
      slug: "robe-elegante-wax",
      short_description: "Robe fluide en wax premium, coupe chic pour ceremonies et sorties.",
      description:
        "Robe elegante confectionnee dans un tissu wax lumineux avec une coupe confortable. Ideale pour les receptions, les sorties a Dakar et les evenements familiaux.",
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
    selectedCategory: "all",
    search: "",
    minPrice: "",
    maxPrice: "",
    sort: "category",
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

  const filterProducts = () => {
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

    if (state.sort === "category") sortByCategory(products);
    else if (state.sort === "price-asc") products.sort((a, b) => a.price - b.price);
    else if (state.sort === "price-desc") products.sort((a, b) => b.price - a.price);
    else if (state.sort === "promo") {
      products.sort((a, b) => Number(b.is_promo) - Number(a.is_promo) || b.price - a.price);
    } else if (state.sort === "newest") {
      products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    state.visibleProducts = products;
    renderProductGrid();
  };

  const createBadge = (text, type) =>
    utils.createEl("span", { className: `product-badge ${type || ""}`, text });

  const createPriceNode = (product) => {
    const price = utils.createEl("div", { className: "product-price" });
    price.appendChild(utils.createEl("strong", { text: utils.formatPrice(product.price) }));
    if (product.old_price && product.old_price > product.price) {
      price.appendChild(utils.createEl("span", { text: utils.formatPrice(product.old_price) }));
    }
    return price;
  };

  const createProductCard = (product) => {
    const card = utils.createEl("article", { className: "product-card" });

    const media = utils.createEl("a", {
      className: "product-media",
      attrs: { href: utils.getProductUrl(product), "aria-label": `Voir ${product.name}` }
    });
    media.appendChild(
      utils.createEl("img", {
        attrs: {
          src: product.main_image || utils.fallbackImage,
          alt: product.name,
          loading: "lazy"
        }
      })
    );

    const badges = utils.createEl("div", { className: "badge-stack" });
    if (product.is_promo) badges.appendChild(createBadge("Promo", "promo"));
    if (product.is_featured) badges.appendChild(createBadge("Vedette", "featured"));
    if (!product.is_available) badges.appendChild(createBadge("Rupture", "danger"));
    if (badges.childElementCount) media.appendChild(badges);

    const body = utils.createEl("div", { className: "product-body" });
    body.appendChild(utils.createEl("p", { className: "product-category", text: getCategoryLabel(product.category) }));
    body.appendChild(utils.createEl("h3", { text: product.name }));
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
    viewButton.addEventListener("click", () => openProductModal(product));

    actions.append(addButton, viewButton);
    body.appendChild(actions);
    card.append(media, body);
    return card;
  };

  const renderProductGrid = () => {
    const grid = document.querySelector("[data-products-grid]");
    const empty = document.querySelector("[data-products-empty]");
    if (!grid) return;

    grid.replaceChildren();

    if (state.loading) return;

    if (!state.visibleProducts.length) {
      empty && empty.removeAttribute("hidden");
      return;
    }

    empty && empty.setAttribute("hidden", "hidden");
    state.visibleProducts.forEach((product) => grid.appendChild(createProductCard(product)));
    renderProductStructuredData(state.visibleProducts.slice(0, 10));
  };

  const renderCategories = () => {
    const holder = document.querySelector("[data-category-circles]");
    if (!holder) return;
    holder.replaceChildren();

    categories.forEach((category) => {
      const button = utils.createEl("button", {
        className: "category-circle",
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
        document.querySelector("#catalogue")?.scrollIntoView({ behavior: "smooth" });
      });
      holder.appendChild(button);
    });
  };

  const createMiniProduct = (product) => {
    const item = utils.createEl("article", { className: "mini-product" });
    item.appendChild(
      utils.createEl("img", {
        attrs: { src: product.main_image || utils.fallbackImage, alt: product.name, loading: "lazy" }
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
    const image = utils.createEl("img", {
      attrs: { src: product.main_image || utils.fallbackImage, alt: product.name, loading: "lazy" }
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
      ["vetements-femme", "vetements-homme", "pantalons"].forEach((key) => {
        select.appendChild(utils.createEl("option", { attrs: { value: key }, text: getCategoryLabel(key) }));
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
    const main = utils.createEl("img", {
      className: "modal-main-image",
      attrs: { src: product.main_image || utils.fallbackImage, alt: product.name }
    });
    gallery.appendChild(main);

    const thumbs = utils.createEl("div", { className: "modal-thumbs" });
    const galleryImages = utils.unique([product.main_image, ...(product.images || [])]);
    galleryImages.forEach((src) => {
      const button = utils.createEl("button", { attrs: { type: "button" } });
      button.appendChild(utils.createEl("img", { attrs: { src, alt: product.name, loading: "lazy" } }));
      button.addEventListener("click", () => {
        main.src = src;
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
      if (event.key === "Escape") closeProductModal();
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

    document.title = `${product.name} | Maison Max Senegal`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute("content", product.short_description || product.description);

    detail.replaceChildren();
    const imageWrap = utils.createEl("div", { className: "product-page-gallery" });
    imageWrap.appendChild(
      utils.createEl("img", {
        attrs: { src: product.main_image || utils.fallbackImage, alt: product.name, loading: "eager" }
      })
    );

    const info = utils.createEl("div", { className: "product-page-info" });
    const labels = utils.createEl("div", { className: "modal-label-row" });
    if (product.is_promo) labels.appendChild(createBadge("Promo", "promo"));
    if (product.is_featured) labels.appendChild(createBadge("Vedette", "featured"));
    labels.appendChild(createBadge(product.is_available ? "Disponible" : "Rupture", product.is_available ? "success" : "danger"));
    info.appendChild(labels);
    info.appendChild(utils.createEl("p", { className: "product-category", text: getCategoryLabel(product.category) }));
    info.appendChild(utils.createEl("h1", { text: product.name }));
    info.appendChild(utils.createEl("p", { className: "lead-text", text: product.description || product.short_description }));
    info.appendChild(createPriceNode(product));

    const form = utils.createEl("form", { className: "option-form product-page-form" });
    const sizeSelect = createOptionSelect("Taille", product.sizes, "size");
    const colorSelect = createOptionSelect("Couleur", product.colors, "color");
    if (sizeSelect) form.appendChild(sizeSelect.wrap);
    if (colorSelect) form.appendChild(colorSelect.wrap);
    const qtyWrap = utils.createEl("label", { className: "field-label" });
    qtyWrap.appendChild(utils.createEl("span", { text: "Quantite" }));
    const qty = utils.createEl("input", { attrs: { type: "number", min: "1", value: "1" } });
    qtyWrap.appendChild(qty);
    form.appendChild(qtyWrap);
    const addButton = utils.createEl("button", {
      className: "btn btn-primary",
      attrs: { type: "submit", disabled: product.is_available ? null : "disabled" }
    });
    addButton.innerHTML = '<i class="fa-solid fa-cart-plus"></i><span>Ajouter au panier</span>';
    form.appendChild(addButton);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      window.MMCart.add(product, {
        size: sizeSelect ? sizeSelect.input.value : "",
        color: colorSelect ? colorSelect.input.value : "",
        quantity: qty.value
      });
      window.MMCart.openCart();
    });
    info.appendChild(form);
    detail.append(imageWrap, info);

    utils.safeJsonLd({
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      image: product.images && product.images.length ? product.images : [product.main_image],
      description: product.description || product.short_description,
      brand: { "@type": "Brand", name: "Maison Max" },
      offers: {
        "@type": "Offer",
        priceCurrency: "XOF",
        price: product.price,
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
  };

  const bindMobileMenu = () => {
    const toggle = document.querySelector("[data-menu-toggle]");
    const menu = document.querySelector("[data-main-nav]");
    if (!toggle || !menu) return;
    toggle.addEventListener("click", () => {
      const opened = menu.classList.toggle("is-open");
      toggle.classList.toggle("is-active", opened);
      toggle.setAttribute("aria-expanded", String(opened));
    });

    menu.querySelectorAll("a, button").forEach((item) => {
      item.addEventListener("click", () => {
        menu.classList.remove("is-open");
        toggle.classList.remove("is-active");
        toggle.setAttribute("aria-expanded", "false");
      });
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

  const initHome = () => {
    if (!document.querySelector("[data-products-grid]")) return;
    syncCategoryOptions();
    renderCategories();
    bindFilters();
    loadProducts();
  };

  document.addEventListener("DOMContentLoaded", () => {
    bindMobileMenu();
    bindProductModal();
    bindNewsletter();
    hydrateWhatsAppLinks();
    initHome();
    hydrateProductPage();
  });
})();
