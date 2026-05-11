(function () {
  "use strict";

  const utils = window.MMUtils;
  const api = window.MMSupabase;
  const maxProductImages = 3;
  const adminProductsPageSize = 8;

  const categoryDefaultImages = {
    robes: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&q=80",
    boubous: "https://images.unsplash.com/photo-1608755728617-aefab37d2edd?auto=format&fit=crop&w=500&q=80",
    ensembles: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=80",
    chemises: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=500&q=80",
    pantalons: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=500&q=80",
    chaussures: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80",
    sacs: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=500&q=80",
    accessoires: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=500&q=80",
    "vetements-enfants": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=500&q=80",
    "vetements-homme": "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=500&q=80",
    "vetements-femme": "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=500&q=80"
  };

  const categories = [
    ["robes", "Robes"],
    ["boubous", "Boubous"],
    ["ensembles", "Ensembles"],
    ["chemises", "Chemises"],
    ["pantalons", "Pantalons"],
    ["chaussures", "Chaussures"],
    ["sacs", "Sacs"],
    ["accessoires", "Accessoires"],
    ["vetements-enfants", "Vetements enfants"],
    ["vetements-homme", "Vetements homme"],
    ["vetements-femme", "Vetements femme"]
  ];

  const state = {
    products: [],
    filtered: [],
    editingId: null,
    ready: false,
    selectedImageFiles: [],
    previewObjectUrls: [],
    productsPage: 1,
    categoryImages: {},
    activeSection: "dashboard",
    dashboardCharts: {},
    currentUser: null
  };

  const elements = {};

  const sectionMeta = {
    dashboard: {
      title: "Tableau de bord",
      kicker: "Vue d'ensemble",
      subtitle: "Suivi clair du catalogue Maison Max, des promotions et de la disponibilite."
    },
    products: {
      title: "Produits",
      kicker: "Catalogue",
      subtitle: "Recherchez, filtrez et pilotez les fiches produits de la boutique."
    },
    "add-product": {
      title: "Ajouter un produit",
      kicker: "Catalogue",
      subtitle: "Creez une fiche complete avec prix, disponibilites, tailles, couleurs et images."
    },
    categories: {
      title: "Categories",
      kicker: "Organisation",
      subtitle: "Analysez les univers Maison Max et leur repartition catalogue."
    },
    promotions: {
      title: "Promotions",
      kicker: "Offres",
      subtitle: "Suivez les articles marques en promotion et corrigez les offres."
    },
    orders: {
      title: "Commandes WhatsApp",
      kicker: "Commandes",
      subtitle: "Controlez le numero et le flux de commande WhatsApp public."
    },
    gallery: {
      title: "Galerie / Images",
      kicker: "Visuels",
      subtitle: "Gerez les images des categories visibles sur le site public."
    },
    settings: {
      title: "Parametres boutique",
      kicker: "Configuration",
      subtitle: "Personnalisez les couleurs, la police et la taille du texte de Maison Max."
    }
  };

  const pick = () => {
    elements.setup = document.querySelector("[data-admin-setup]");
    elements.login = document.querySelector("[data-admin-login]");
    elements.app = document.querySelector("[data-admin-app]");
    elements.loginForm = document.querySelector("[data-login-form]");
    elements.productForm = document.querySelector("[data-product-form]");
    elements.productList = document.querySelector("[data-admin-product-list]");
    elements.productPagination = document.querySelector("[data-admin-products-pagination]");
    elements.categoryImageList = document.querySelector("[data-category-image-list]");
    elements.dashboardStats = document.querySelector("[data-dashboard-stats]");
    elements.dashboardCategories = document.querySelector("[data-dashboard-categories]");
    elements.dashboardHealth = document.querySelector("[data-dashboard-health]");
    elements.dashboardRecent = document.querySelector("[data-dashboard-recent]");
    elements.dashboardCharts = Array.from(document.querySelectorAll("[data-admin-chart]"));
    elements.categoryManagement = document.querySelector("[data-admin-category-management]");
    elements.dashboardExport = document.querySelector("[data-admin-export-csv]");
    elements.dashboardScrollForm = document.querySelector("[data-admin-scroll-form]");
    elements.dashboardScrollProducts = document.querySelector("[data-admin-scroll-products]");
    elements.globalSearch = document.querySelector("[data-admin-global-search]");
    elements.quickAdd = document.querySelector("[data-admin-quick-add]");
    elements.search = document.querySelector("[data-admin-search]");
    elements.category = document.querySelector("[data-admin-category]");
    elements.status = document.querySelector("[data-admin-status]");
    elements.formTitle = document.querySelector("[data-form-title]");
    elements.cancelEdit = document.querySelector("[data-cancel-edit]");
    elements.logout = document.querySelector("[data-admin-logout]");
    elements.logoutButtons = Array.from(document.querySelectorAll("[data-admin-logout]"));
    elements.refresh = document.querySelector("[data-admin-refresh]");
    elements.imagesPreview = document.querySelector("[data-images-preview]");
    elements.slug = document.querySelector("#product-slug");
    elements.name = document.querySelector("#product-name");
    elements.imageUpload = document.querySelector("[data-image-upload]");
    elements.imageUrlInputs = Array.from(document.querySelectorAll("[data-image-url]"));
    elements.sections = Array.from(document.querySelectorAll("[data-admin-section]"));
    elements.navButtons = Array.from(document.querySelectorAll("[data-admin-nav]"));
    elements.sidebarToggle = document.querySelector("[data-admin-sidebar-toggle]");
    elements.sidebarClose = document.querySelector("[data-admin-sidebar-close]");
    elements.sidebarOverlay = document.querySelector("[data-admin-sidebar-overlay]");
    elements.sectionTitle = document.querySelector("[data-admin-section-title]");
    elements.sectionKicker = document.querySelector("[data-admin-section-kicker]");
    elements.sectionSubtitle = document.querySelector("[data-admin-section-subtitle]");
    elements.promoList = document.querySelector("[data-admin-promo-list]");
    elements.openProductsPromo = document.querySelector("[data-admin-open-products-promo]");
    elements.whatsappLink = document.querySelector("[data-admin-whatsapp-link]");
    elements.configNodes = Array.from(document.querySelectorAll("[data-admin-config]"));
    elements.themeForm = document.querySelector("[data-admin-theme-form]");
    elements.themeReset = document.querySelector("[data-admin-theme-reset]");
    elements.themePreview = Array.from(document.querySelectorAll("[data-theme-preview]"));
    elements.accountForm = document.querySelector("[data-admin-account-form]");
    elements.currentEmail = document.querySelector("[data-admin-current-email]");
    elements.aiNotes = document.querySelector("[data-admin-ai-notes]");
    elements.aiGenerate = document.querySelector("[data-admin-ai-generate]");
    elements.aiImprove = document.querySelector("[data-admin-ai-improve]");
    elements.aiResult = document.querySelector("[data-admin-ai-result]");
  };

  const showOnly = (section) => {
    [elements.setup, elements.login, elements.app].forEach((node) => {
      if (node) node.hidden = node !== section;
    });
    document.body.classList.toggle("admin-app-active", section === elements.app);
    if (elements.logout) elements.logout.hidden = section !== elements.app;
    if (section !== elements.app) closeAdminSidebar();
  };

  const normalizeSectionId = (sectionId) => {
    const aliases = { whatsapp: "orders", images: "gallery", "gallery-images": "gallery" };
    const clean = String(sectionId || "").replace(/^#/, "").trim();
    if (aliases[clean]) return aliases[clean];
    return sectionMeta[clean] ? clean : "dashboard";
  };

  const getSectionFromHash = () => {
    try {
      return normalizeSectionId(decodeURIComponent(window.location.hash.replace(/^#/, "")));
    } catch (error) {
      return "dashboard";
    }
  };

  const openAdminSidebar = () => {
    document.body.classList.add("admin-sidebar-open");
    if (elements.sidebarToggle) elements.sidebarToggle.setAttribute("aria-expanded", "true");
  };

  const closeAdminSidebar = () => {
    document.body.classList.remove("admin-sidebar-open");
    if (elements.sidebarToggle) elements.sidebarToggle.setAttribute("aria-expanded", "false");
  };

  const updateConfigSummary = () => {
    const config = window.MAISON_MAX_CONFIG || {};
    const values = {
      store: config.STORE_NAME || "Maison Max",
      site: config.SITE_URL || window.location.origin,
      currency: config.CURRENCY || "FCFA",
      supabase: api && api.isConfigured ? "Connecte" : "Non configure",
      bucket: config.PRODUCT_IMAGE_BUCKET || "product-images",
      city: config.DEFAULT_CITY || "Dakar",
      whatsapp: config.WHATSAPP_NUMBER || "Non configure"
    };

    elements.configNodes.forEach((node) => {
      node.textContent = values[node.dataset.adminConfig] || "-";
    });

    if (elements.whatsappLink) {
      const number = config.WHATSAPP_NUMBER || "";
      elements.whatsappLink.href = number ? `https://wa.me/${number}` : "#";
      elements.whatsappLink.toggleAttribute("aria-disabled", !number);
    }
  };

  const getThemeFormValue = () => {
    if (!elements.themeForm) return utils.getStoredTheme();
    const data = new FormData(elements.themeForm);
    return utils.normalizeTheme({
      primary: data.get("primary"),
      secondary: data.get("secondary"),
      button: data.get("button"),
      font: data.get("font"),
      textSize: data.get("textSize")
    });
  };

  const updateThemePreview = (theme = utils.getStoredTheme()) => {
    if (!elements.themeForm) return;
    const normalized = utils.normalizeTheme(theme);
    elements.themeForm.elements.primary.value = normalized.primary;
    elements.themeForm.elements.secondary.value = normalized.secondary;
    elements.themeForm.elements.button.value = normalized.button;
    elements.themeForm.elements.font.value = normalized.font;
    elements.themeForm.elements.textSize.value = normalized.textSize;

    elements.themePreview.forEach((node) => {
      const key = node.dataset.themePreview;
      node.style.backgroundColor = normalized[key] || normalized.primary;
    });
  };

  const applyThemeSetting = (theme, options = {}) => {
    const normalized = utils.storeTheme(theme);
    utils.applyStoreTheme(normalized);
    updateThemePreview(normalized);
    if (options.toast) utils.toast("Theme applique a la boutique");
    return normalized;
  };

  const loadThemeSettings = async () => {
    let theme = utils.getStoredTheme();

    if (api && api.getSiteSetting) {
      try {
        const savedTheme = await api.getSiteSetting("store_theme");
        if (savedTheme && typeof savedTheme === "object") theme = savedTheme;
      } catch (error) {
        // Local theme remains available if Supabase cannot return settings.
      }
    }

    applyThemeSetting(theme);
  };

  const saveThemeSettings = async (event) => {
    event.preventDefault();
    const button = elements.themeForm.querySelector("button[type='submit']");
    const theme = applyThemeSetting(getThemeFormValue());
    utils.setButtonLoading(button, true, "Enregistrement...");

    try {
      if (api && api.setSiteSetting) await api.setSiteSetting("store_theme", theme);
      utils.toast("Parametres boutique enregistres");
    } catch (error) {
      utils.toast("Theme applique localement, mais non enregistre dans Supabase", "error");
    } finally {
      utils.setButtonLoading(button, false);
    }
  };

  const resetThemeSettings = async () => {
    applyThemeSetting(utils.defaultTheme, { toast: true });
    if (!api || !api.setSiteSetting) return;

    try {
      await api.setSiteSetting("store_theme", utils.defaultTheme);
    } catch (error) {
      utils.toast("Theme restaure localement, mais Supabase n'a pas ete mis a jour", "error");
    }
  };

  const loadAdminAccount = async () => {
    if (!elements.accountForm || !api.getCurrentUser) return;

    try {
      state.currentUser = await api.getCurrentUser();
      if (elements.currentEmail) elements.currentEmail.value = state.currentUser?.email || "";
    } catch (error) {
      state.currentUser = null;
      if (elements.currentEmail) elements.currentEmail.value = "";
    }
  };

  const handleAccountSubmit = async (event) => {
    event.preventDefault();
    if (!elements.accountForm || !api.updateAdminCredentials) return;

    const form = elements.accountForm;
    const button = form.querySelector("button[type='submit']");
    const data = new FormData(form);
    const currentEmail = state.currentUser?.email || elements.currentEmail?.value || "";
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");
    const passwordConfirm = String(data.get("password_confirm") || "");
    const payload = {};

    if (email && email !== currentEmail) payload.email = email;

    if (password || passwordConfirm) {
      if (password.length < 8) {
        utils.toast("Le mot de passe doit contenir au moins 8 caracteres.", "error");
        return;
      }
      if (password !== passwordConfirm) {
        utils.toast("Les deux mots de passe ne correspondent pas.", "error");
        return;
      }
      payload.password = password;
    }

    if (!Object.keys(payload).length) {
      utils.toast("Aucune modification a enregistrer.", "error");
      return;
    }

    utils.setButtonLoading(button, true, "Mise a jour...");
    try {
      await api.updateAdminCredentials(payload);
      form.elements.email.value = "";
      form.elements.password.value = "";
      form.elements.password_confirm.value = "";
      await loadAdminAccount();
      utils.toast(payload.email ? "Compte mis a jour. Confirmez le nouvel email si Supabase le demande." : "Mot de passe mis a jour");
    } catch (error) {
      utils.toast(error.message || "Mise a jour du compte impossible", "error");
    } finally {
      utils.setButtonLoading(button, false);
    }
  };

  const openAdminSection = (sectionId, options = {}) => {
    const id = normalizeSectionId(sectionId);
    const meta = sectionMeta[id];

    elements.sections.forEach((section) => {
      section.hidden = section.dataset.adminSection !== id;
    });

    elements.navButtons.forEach((button) => {
      const isActive = button.dataset.adminNav === id;
      button.classList.toggle("is-active", isActive);
      if (isActive) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });

    if (elements.sectionTitle) elements.sectionTitle.textContent = meta.title;
    if (elements.sectionKicker) elements.sectionKicker.textContent = meta.kicker;
    if (elements.sectionSubtitle) elements.sectionSubtitle.textContent = meta.subtitle;
    state.activeSection = id;

    if (id === "dashboard") renderDashboardCharts();
    if (id === "promotions") renderPromotions();
    if (id === "settings" || id === "orders") updateConfigSummary();
    if (id === "settings") loadAdminAccount();

    if (options.updateHash) {
      const hash = `#${id}`;
      if (window.location.hash !== hash) window.location.hash = hash;
    }

    closeAdminSidebar();
    if (options.scroll !== false) window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fillCategorySelects = () => {
    document.querySelectorAll("[data-category-options]").forEach((select) => {
      const current = select.value;
      select.replaceChildren();
      if (select.dataset.categoryOptions === "filter") {
        select.appendChild(utils.createEl("option", { attrs: { value: "all" }, text: "Toutes les categories" }));
      } else {
        select.appendChild(utils.createEl("option", { attrs: { value: "" }, text: "Choisir une categorie" }));
      }
      categories.forEach(([value, label]) => {
        select.appendChild(utils.createEl("option", { attrs: { value }, text: label }));
      });
      if (current) select.value = current;
    });
  };

  const getCategoryLabel = (key) => {
    const found = categories.find(([value]) => value === key);
    return found ? found[1] : key || "Sans categorie";
  };

  const validatePayload = (payload) => {
    if (!payload.name.trim()) return "Le nom du produit est obligatoire.";
    if (!payload.slug.trim()) return "Le slug est obligatoire.";
    if (!payload.category.trim()) return "La categorie est obligatoire.";
    if (!payload.price || Number(payload.price) <= 0) return "Le prix doit etre superieur a zero.";
    if (payload.old_price && Number(payload.old_price) <= Number(payload.price)) {
      return "L'ancien prix doit etre superieur au prix actuel.";
    }
    return "";
  };

  const parsePriceValue = (value) => {
    const digits = String(value || "").replace(/[^\d]/g, "");
    return digits ? Number(digits) : 0;
  };

  const formatPriceInput = (value) => {
    const amount = Number(value || 0);
    return amount > 0 ? new Intl.NumberFormat("fr-FR").format(amount) : "";
  };

  const getImageUrls = () =>
    utils
      .unique(elements.imageUrlInputs.map((input) => input.value.trim()))
      .slice(0, maxProductImages);

  const getImageUrlEntries = () => {
    const seen = new Set();
    return elements.imageUrlInputs
      .map((input) => ({ src: input.value.trim() }))
      .filter((entry) => {
        if (!entry.src || seen.has(entry.src)) return false;
        seen.add(entry.src);
        return true;
      })
      .slice(0, maxProductImages);
  };

  const setImageUrls = (urls = []) => {
    elements.imageUrlInputs.forEach((input, index) => {
      input.value = urls[index] || "";
    });
  };

  const getImageFileKey = (file) => [file.name, file.type, file.size, file.lastModified].join(":");

  const syncImageUploadInput = () => {
    if (!elements.imageUpload) return;
    if (typeof DataTransfer === "undefined") {
      elements.imageUpload.value = "";
      return;
    }
    const transfer = new DataTransfer();
    state.selectedImageFiles.forEach((file) => transfer.items.add(file));
    try {
      elements.imageUpload.files = transfer.files;
    } catch (error) {
      elements.imageUpload.value = "";
    }
  };

  const getSelectedImageFiles = (availableSlots = maxProductImages) =>
    state.selectedImageFiles.slice(0, Math.max(0, availableSlots));

  const addSelectedImageFiles = (files = []) => {
    const incoming = Array.from(files).filter((file) => file.type.startsWith("image/"));
    const urlCount = getImageUrls().length;
    const availableSlots = Math.max(0, maxProductImages - urlCount - state.selectedImageFiles.length);
    const existingKeys = new Set(state.selectedImageFiles.map(getImageFileKey));
    const accepted = [];

    incoming.forEach((file) => {
      const key = getImageFileKey(file);
      if (existingKeys.has(key) || accepted.length >= availableSlots) return;
      accepted.push(file);
      existingKeys.add(key);
    });

    state.selectedImageFiles = [...state.selectedImageFiles, ...accepted];
    syncImageUploadInput();
    return { incomingCount: incoming.length, acceptedCount: accepted.length };
  };

  const removeSelectedImageFile = (fileIndex) => {
    state.selectedImageFiles.splice(fileIndex, 1);
    syncImageUploadInput();
    renderImagePreview();
  };

  const revokePreviewUrls = () => {
    state.previewObjectUrls.forEach((url) => URL.revokeObjectURL(url));
    state.previewObjectUrls = [];
  };

  const getFormPayload = async () => {
    const form = elements.productForm;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const slug = utils.slugify(data.get("slug") || name);
    const existingImages = getImageUrls();
    const files = getSelectedImageFiles(maxProductImages - existingImages.length);
    const uploadedImages = files.length ? await api.uploadProductImages(files, slug) : [];
    const images = utils.unique([...existingImages, ...uploadedImages]).slice(0, maxProductImages);

    return {
      name,
      slug,
      short_description: String(data.get("short_description") || "").trim(),
      description: String(data.get("description") || "").trim(),
      price: parsePriceValue(data.get("price")),
      old_price: parsePriceValue(data.get("old_price")) || null,
      category: String(data.get("category") || "").trim(),
      subcategory: String(data.get("subcategory") || "").trim(),
      sizes: utils.normalizeArray(data.get("sizes")),
      colors: utils.normalizeArray(data.get("colors")),
      images,
      main_image: images[0] || "",
      is_available: Boolean(data.get("is_available")),
      is_featured: Boolean(data.get("is_featured")),
      is_promo: Boolean(data.get("is_promo"))
    };
  };

  const getAiProductDraft = () => {
    const form = elements.productForm;
    const category = String(form.elements.category.value || "").trim();
    return {
      name: String(form.elements.name.value || "").trim(),
      category,
      category_label: getCategoryLabel(category),
      subcategory: String(form.elements.subcategory.value || "").trim(),
      price: parsePriceValue(form.elements.price.value),
      old_price: parsePriceValue(form.elements.old_price.value) || null,
      sizes: utils.normalizeArray(form.elements.sizes.value),
      colors: utils.normalizeArray(form.elements.colors.value),
      short_description: String(form.elements.short_description.value || "").trim(),
      description: String(form.elements.description.value || "").trim(),
      notes: String(elements.aiNotes?.value || "").trim()
    };
  };

  const hasAiDraftContent = (draft) =>
    Boolean(
      draft.name ||
        draft.category ||
        draft.subcategory ||
        draft.notes ||
        draft.short_description ||
        draft.description ||
        draft.sizes.length ||
        draft.colors.length
    );

  const clearAiSuggestion = () => {
    if (elements.aiResult) elements.aiResult.replaceChildren();
  };

  const applyAiSuggestion = (suggestion, fields = ["title", "short_description", "description"]) => {
    const form = elements.productForm;
    if (fields.includes("title") && suggestion.title) {
      form.elements.name.value = suggestion.title;
      if (!state.editingId || !form.elements.slug.value) form.elements.slug.value = utils.slugify(suggestion.title);
    }
    if (fields.includes("short_description") && suggestion.short_description) {
      form.elements.short_description.value = suggestion.short_description;
    }
    if (fields.includes("description") && suggestion.description) {
      form.elements.description.value = suggestion.description;
    }
    utils.toast("Suggestion IA appliquee");
  };

  const renderAiSuggestion = (suggestion) => {
    if (!elements.aiResult) return;
    elements.aiResult.replaceChildren();

    if (!suggestion || (!suggestion.title && !suggestion.short_description && !suggestion.description)) {
      elements.aiResult.appendChild(utils.createEl("div", { className: "admin-ai-empty", text: "Aucune suggestion disponible." }));
      return;
    }

    const card = utils.createEl("article", { className: "admin-ai-suggestion" });
    const preview = utils.createEl("div", { className: "admin-ai-preview" });
    [
      ["Titre", suggestion.title, "admin-ai-title"],
      ["Accroche", suggestion.short_description, "admin-ai-short"],
      ["Description", suggestion.description, ""]
    ].forEach(([label, text, className]) => {
      if (!text) return;
      const block = utils.createEl("div", { className: `admin-ai-field ${className}`.trim() });
      block.appendChild(utils.createEl("span", { text: label }));
      block.appendChild(label === "Titre" ? utils.createEl("h4", { text }) : utils.createEl("p", { text }));
      preview.appendChild(block);
    });
    card.appendChild(preview);

    const actions = utils.createEl("div", { className: "admin-ai-suggestion-actions" });
    const applyAll = utils.createEl("button", { className: "btn btn-primary btn-sm", attrs: { type: "button" } });
    applyAll.innerHTML = '<i class="fa-solid fa-check"></i><span>Tout appliquer</span>';
    applyAll.addEventListener("click", () => applyAiSuggestion(suggestion));

    const titleOnly = utils.createEl("button", { className: "btn btn-light btn-sm", attrs: { type: "button" } });
    titleOnly.innerHTML = '<i class="fa-solid fa-heading"></i><span>Titre</span>';
    titleOnly.addEventListener("click", () => applyAiSuggestion(suggestion, ["title"]));

    const textOnly = utils.createEl("button", { className: "btn btn-light btn-sm", attrs: { type: "button" } });
    textOnly.innerHTML = '<i class="fa-solid fa-align-left"></i><span>Descriptions</span>';
    textOnly.addEventListener("click", () => applyAiSuggestion(suggestion, ["short_description", "description"]));

    actions.append(applyAll, titleOnly, textOnly);
    card.appendChild(actions);
    elements.aiResult.appendChild(card);
  };

  const runProductAi = async (mode, button) => {
    if (!window.MMAI) {
      utils.toast("Assistant IA indisponible.", "error");
      return;
    }

    const draft = getAiProductDraft();
    if (!hasAiDraftContent(draft)) {
      utils.toast("Ajoutez un nom, une categorie ou quelques details pour l'IA.", "error");
      return;
    }

    utils.setButtonLoading(button, true, "IA...");
    try {
      const suggestion = await window.MMAI.generateProductCopy({
        mode,
        product: draft,
        store: window.MAISON_MAX_CONFIG || {}
      });
      renderAiSuggestion(suggestion);
    } catch (error) {
      utils.toast(error.message || "Generation IA impossible", "error");
    } finally {
      utils.setButtonLoading(button, false);
    }
  };

  const resetForm = () => {
    state.editingId = null;
    state.selectedImageFiles = [];
    elements.productForm.reset();
    elements.productForm.querySelector("[name='is_available']").checked = true;
    setImageUrls();
    revokePreviewUrls();
    renderImagePreview();
    elements.formTitle.textContent = "Ajouter un produit";
    elements.cancelEdit.hidden = true;
    clearAiSuggestion();
  };

  const renderImagePreview = () => {
    revokePreviewUrls();
    elements.imagesPreview.replaceChildren();
    const imageUrlEntries = getImageUrlEntries();
    const files = getSelectedImageFiles(maxProductImages - imageUrlEntries.length);
    const previews = [
      ...imageUrlEntries.map((entry, index) => ({
        src: entry.src,
        label: `URL ${index + 1}`,
        type: "url"
      })),
      ...files.map((file, index) => {
        const src = URL.createObjectURL(file);
        state.previewObjectUrls.push(src);
        return { src, label: `Upload ${index + 1}`, type: "file", fileIndex: index };
      })
    ].slice(0, maxProductImages);

    if (!previews.length) {
      elements.imagesPreview.appendChild(
        utils.createEl("div", {
          className: "admin-image-empty",
          text: "Aucune image selectionnee."
        })
      );
      return;
    }

    previews.forEach((preview) => {
      const wrap = utils.createEl("div", { className: "admin-image-thumb" });
      wrap.appendChild(utils.createEl("img", { attrs: { src: preview.src, alt: "Image produit", loading: "lazy" } }));
      const removeButton = utils.createEl("button", {
        className: "admin-image-remove",
        attrs: { type: "button", "aria-label": "Retirer cette image" }
      });
      removeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      removeButton.addEventListener("click", () => {
        if (preview.type === "url") {
          elements.imageUrlInputs.forEach((input) => {
            if (input.value.trim() === preview.src) input.value = "";
          });
          renderImagePreview();
          return;
        }
        removeSelectedImageFile(preview.fileIndex);
      });
      wrap.appendChild(removeButton);
      wrap.appendChild(utils.createEl("span", { text: preview.label }));
      elements.imagesPreview.appendChild(wrap);
    });
  };

  const editProduct = (product) => {
    state.editingId = product.id;
    const form = elements.productForm;
    form.elements.name.value = product.name;
    form.elements.slug.value = product.slug;
    form.elements.short_description.value = product.short_description || "";
    form.elements.description.value = product.description || "";
    form.elements.price.value = formatPriceInput(product.price);
    form.elements.old_price.value = formatPriceInput(product.old_price);
    form.elements.category.value = product.category;
    form.elements.subcategory.value = product.subcategory || "";
    form.elements.sizes.value = (product.sizes || []).join(", ");
    form.elements.colors.value = (product.colors || []).join(", ");
    setImageUrls(utils.unique([product.main_image, ...(product.images || [])]).slice(0, maxProductImages));
    state.selectedImageFiles = [];
    if (elements.imageUpload) elements.imageUpload.value = "";
    form.elements.is_available.checked = product.is_available;
    form.elements.is_featured.checked = product.is_featured;
    form.elements.is_promo.checked = product.is_promo;
    elements.formTitle.textContent = "Modifier le produit";
    elements.cancelEdit.hidden = false;
    clearAiSuggestion();
    renderImagePreview();
    openAdminSection("add-product", { updateHash: true });
    elements.productForm.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const deleteProduct = async (product) => {
    const ok = confirm(`Supprimer "${product.name}" ? Cette action est definitive.`);
    if (!ok) return;

    try {
      await api.deleteProduct(product.id);
      utils.toast("Produit supprime");
      await loadProducts();
    } catch (error) {
      utils.toast(error.message || "Suppression impossible", "error");
    }
  };

  const toggleAvailability = async (product) => {
    try {
      await api.updateProduct(product.id, { is_available: !product.is_available });
      utils.toast("Disponibilite mise a jour");
      await loadProducts();
    } catch (error) {
      utils.toast(error.message || "Mise a jour impossible", "error");
    }
  };

  const createStatus = (product) => {
    const holder = utils.createEl("div", { className: "admin-status-list" });
    holder.appendChild(utils.createEl("span", {
      className: product.is_available ? "status-pill success" : "status-pill danger",
      text: product.is_available ? "Disponible" : "Rupture"
    }));
    if (product.is_featured) holder.appendChild(utils.createEl("span", { className: "status-pill", text: "Vedette" }));
    if (product.is_promo) holder.appendChild(utils.createEl("span", { className: "status-pill promo", text: "Promo" }));
    return holder;
  };

  const getPageWindow = (current, total) => {
    if (total <= 5) return Array.from({ length: total }, (_, index) => index + 1);
    const pages = new Set([1, total, current, current - 1, current + 1]);
    return [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
  };

  const setProductsPage = (page) => {
    const totalPages = Math.max(1, Math.ceil(state.filtered.length / adminProductsPageSize));
    state.productsPage = Math.min(Math.max(1, Number(page) || 1), totalPages);
    renderProducts();
  };

  const renderProductsPagination = (totalPages) => {
    const holder = elements.productPagination;
    if (!holder) return;
    holder.replaceChildren();

    if (!state.filtered.length) {
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
      if (!options.disabled && !options.current) {
        button.addEventListener("click", () => setProductsPage(page));
      }
      return button;
    };

    holder.appendChild(
      makeButton('<i class="fa-solid fa-chevron-left"></i>', state.productsPage - 1, {
        disabled: state.productsPage === 1,
        ariaLabel: "Page precedente"
      })
    );

    const pages = utils.createEl("div", { className: "pagination-pages" });
    let previous = 0;
    getPageWindow(state.productsPage, totalPages).forEach((page) => {
      if (previous && page - previous > 1) {
        pages.appendChild(utils.createEl("span", { className: "pagination-gap", text: "..." }));
      }
      pages.appendChild(makeButton(String(page), page, { current: page === state.productsPage }));
      previous = page;
    });
    holder.appendChild(pages);

    holder.appendChild(
      makeButton('<i class="fa-solid fa-chevron-right"></i>', state.productsPage + 1, {
        disabled: state.productsPage === totalPages,
        ariaLabel: "Page suivante"
      })
    );
  };

  const renderProducts = () => {
    const list = elements.productList;
    if (!list) return;
    list.replaceChildren();

    if (!state.filtered.length) {
      list.appendChild(utils.createEl("div", { className: "empty-state", text: "Aucun produit trouve." }));
      renderProductsPagination(0);
      return;
    }

    const totalPages = Math.max(1, Math.ceil(state.filtered.length / adminProductsPageSize));
    state.productsPage = Math.min(Math.max(1, state.productsPage), totalPages);
    const start = (state.productsPage - 1) * adminProductsPageSize;
    const products = state.filtered.slice(start, start + adminProductsPageSize);

    products.forEach((product) => {
      const row = utils.createEl("article", { className: "admin-product-row" });
      row.appendChild(
        utils.createEl("img", {
          attrs: { src: product.main_image || utils.fallbackImage, alt: product.name, loading: "lazy" }
        })
      );

      const info = utils.createEl("div", { className: "admin-product-info" });
      info.appendChild(utils.createEl("h3", { text: product.name }));
      info.appendChild(utils.createEl("p", { text: `${product.category} - ${utils.formatPrice(product.price)}` }));
      info.appendChild(createStatus(product));

      const actions = utils.createEl("div", { className: "admin-row-actions" });
      const edit = utils.createEl("button", { className: "btn btn-outline btn-sm", attrs: { type: "button" } });
      edit.innerHTML = '<i class="fa-solid fa-pen"></i><span>Modifier</span>';
      edit.addEventListener("click", () => editProduct(product));

      const toggle = utils.createEl("button", { className: "btn btn-light btn-sm", attrs: { type: "button" } });
      toggle.innerHTML = product.is_available
        ? '<i class="fa-solid fa-eye-slash"></i><span>Desactiver</span>'
        : '<i class="fa-solid fa-eye"></i><span>Activer</span>';
      toggle.addEventListener("click", () => toggleAvailability(product));

      const del = utils.createEl("button", { className: "btn btn-danger btn-sm", attrs: { type: "button" } });
      del.innerHTML = '<i class="fa-solid fa-trash"></i><span>Supprimer</span>';
      del.addEventListener("click", () => deleteProduct(product));

      actions.append(edit, toggle, del);
      row.append(info, actions);
      list.appendChild(row);
    });

    renderProductsPagination(totalPages);
  };

  const renderPromotions = () => {
    const list = elements.promoList;
    if (!list) return;
    list.replaceChildren();

    const promos = state.products.filter((product) => product.is_promo);
    if (!promos.length) {
      list.appendChild(
        utils.createEl("div", {
          className: "empty-state",
          text: "Aucun produit en promotion pour le moment."
        })
      );
      return;
    }

    promos.forEach((product) => {
      const row = utils.createEl("article", { className: "admin-product-row" });
      row.appendChild(
        utils.createEl("img", {
          attrs: { src: product.main_image || utils.fallbackImage, alt: product.name, loading: "lazy" }
        })
      );

      const info = utils.createEl("div", { className: "admin-product-info" });
      info.appendChild(utils.createEl("h3", { text: product.name }));
      info.appendChild(
        utils.createEl("p", {
          text: `${getCategoryLabel(product.category)} - ${utils.formatPrice(product.price)}`
        })
      );
      info.appendChild(createStatus(product));

      const actions = utils.createEl("div", { className: "admin-row-actions" });
      const edit = utils.createEl("button", { className: "btn btn-outline btn-sm", attrs: { type: "button" } });
      edit.innerHTML = '<i class="fa-solid fa-pen"></i><span>Modifier</span>';
      edit.addEventListener("click", () => editProduct(product));
      actions.appendChild(edit);

      row.append(info, actions);
      list.appendChild(row);
    });
  };

  const applyFilters = () => {
    const term = (elements.search.value || "").toLowerCase().trim();
    const category = elements.category.value || "all";
    const status = elements.status.value || "all";

    state.productsPage = 1;
    state.filtered = state.products.filter((product) => {
      const matchesTerm = !term || [product.name, product.slug, product.category, product.subcategory]
        .join(" ")
        .toLowerCase()
        .includes(term);
      const matchesCategory = category === "all" || product.category === category;
      const matchesStatus =
        status === "all" ||
        (status === "available" && product.is_available) ||
        (status === "unavailable" && !product.is_available) ||
        (status === "featured" && product.is_featured) ||
        (status === "promo" && product.is_promo);
      return matchesTerm && matchesCategory && matchesStatus;
    });

    renderProducts();
  };

  const loadProducts = async () => {
    elements.productList.replaceChildren();
    elements.productList.appendChild(utils.createEl("div", { className: "empty-state", text: "Chargement des produits..." }));

    try {
      state.products = await api.listProductsForAdmin();
      state.filtered = [...state.products];
      applyFilters();
      renderPromotions();
      renderDashboard();
    } catch (error) {
      state.products = [];
      state.filtered = [];
      renderPromotions();
      renderDashboard();
      elements.productList.replaceChildren();
      elements.productList.appendChild(
        utils.createEl("div", {
          className: "empty-state error",
          text: error.message || "Impossible de charger les produits."
        })
      );
    }
  };

  const getCategoryImage = (key) => state.categoryImages[key] || categoryDefaultImages[key] || utils.fallbackImage;

  const productHasRealImage = (product) => {
    const images = utils.unique([product.main_image, ...(product.images || [])]);
    return images.some((src) => src && src !== utils.fallbackImage);
  };

  const getDashboardSummary = () => {
    const total = state.products.length;
    const available = state.products.filter((product) => product.is_available).length;
    const unavailable = total - available;
    const featured = state.products.filter((product) => product.is_featured).length;
    const promo = state.products.filter((product) => product.is_promo).length;
    const value = state.products.reduce((sum, product) => sum + Number(product.price || 0), 0);

    return { total, available, unavailable, featured, promo, value };
  };

  const renderDashboardStats = () => {
    const holder = elements.dashboardStats;
    if (!holder) return;
    holder.replaceChildren();

    const summary = getDashboardSummary();
    const stats = [
      {
        icon: "fa-boxes-stacked",
        label: "Produits",
        value: summary.total,
        detail: "fiches catalogue"
      },
      {
        icon: "fa-circle-check",
        label: "Disponibles",
        value: summary.available,
        detail: "visibles sur le site",
        tone: "success"
      },
      {
        icon: "fa-triangle-exclamation",
        label: "Rupture",
        value: summary.unavailable,
        detail: "a remettre a jour",
        tone: summary.unavailable ? "warning" : "success"
      },
      {
        icon: "fa-bolt",
        label: "Promotions",
        value: summary.promo,
        detail: "offres actives",
        tone: "promo"
      },
      {
        icon: "fa-star",
        label: "Vedettes",
        value: summary.featured,
        detail: "mis en avant",
        tone: "featured"
      },
      {
        icon: "fa-wallet",
        label: "Valeur catalogue",
        value: utils.formatPrice(summary.value),
        detail: "prix cumules"
      }
    ];

    stats.forEach((stat) => {
      const card = utils.createEl("article", { className: `admin-stat-card ${stat.tone || ""}` });
      card.appendChild(utils.createEl("i", { className: `fa-solid ${stat.icon}` }));
      const content = utils.createEl("div");
      content.appendChild(utils.createEl("span", { text: stat.label }));
      content.appendChild(utils.createEl("strong", { text: stat.value }));
      content.appendChild(utils.createEl("small", { text: stat.detail }));
      card.appendChild(content);
      holder.appendChild(card);
    });
  };

  const chartPalette = ["#6B4F3A", "#E8DCCB", "#16a56f", "#e44834", "#A88768", "#8F735B", "#C28B62", "#B7A48F"];

  const moneyTick = (value) => {
    const amount = Number(value || 0);
    if (amount >= 1000000) return `${Math.round(amount / 1000000)}M`;
    if (amount >= 1000) return `${Math.round(amount / 1000)}k`;
    return String(amount);
  };

  const getChartCanvas = (name) => elements.dashboardCharts.find((canvas) => canvas.dataset.adminChart === name);

  const showChartFallback = (canvas, message) => {
    if (!canvas || canvas.parentElement.querySelector(".admin-chart-fallback")) return;
    canvas.parentElement.appendChild(utils.createEl("div", { className: "admin-chart-fallback", text: message }));
  };

  const clearChartFallback = (canvas) => {
    const fallback = canvas?.parentElement.querySelector(".admin-chart-fallback");
    if (fallback) fallback.remove();
  };

  const destroyDashboardCharts = () => {
    Object.values(state.dashboardCharts).forEach((chart) => chart.destroy());
    state.dashboardCharts = {};
  };

  const makeChart = (name, config) => {
    const canvas = getChartCanvas(name);
    if (!canvas) return;

    if (!window.Chart) {
      showChartFallback(canvas, "Graphique indisponible pour le moment.");
      return;
    }

    clearChartFallback(canvas);
    state.dashboardCharts[name] = new window.Chart(canvas, config);
  };

  const getRecentProductPeriods = () => {
    const periods = [];
    const now = new Date();
    for (let index = 5; index >= 0; index -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      periods.push({
        key,
        label: date.toLocaleDateString("fr-FR", { month: "short" }).replace(".", ""),
        total: 0
      });
    }

    const byKey = new Map(periods.map((period) => [period.key, period]));
    state.products.forEach((product) => {
      const date = product.created_at ? new Date(product.created_at) : null;
      if (!date || Number.isNaN(date.getTime())) return;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const period = byKey.get(key);
      if (period) period.total += 1;
    });

    return periods;
  };

  const getCategoryValueMetrics = () => {
    const totals = new Map(categories.map(([key, label]) => [key, { label, total: 0 }]));
    state.products.forEach((product) => {
      if (!totals.has(product.category)) {
        totals.set(product.category || "sans-categorie", {
          label: getCategoryLabel(product.category),
          total: 0
        });
      }
      totals.get(product.category || "sans-categorie").total += Number(product.price || 0);
    });
    return Array.from(totals.values())
      .filter((item) => item.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  };

  const baseChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          color: "#2E241D",
          font: { family: "Poppins", size: 12, weight: "700" }
        }
      },
      tooltip: {
        backgroundColor: "#4A372A",
        borderColor: "rgba(255,255,255,0.18)",
        borderWidth: 1,
        titleFont: { family: "Poppins", weight: "800" },
        bodyFont: { family: "Poppins", weight: "600" },
        padding: 12
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#7B6A5A", font: { family: "Poppins", size: 11, weight: "700" } }
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(123, 106, 90, 0.16)" },
        ticks: { color: "#7B6A5A", precision: 0, font: { family: "Poppins", size: 11, weight: "700" } }
      }
    }
  };

  const renderDashboardCharts = () => {
    if (state.activeSection !== "dashboard" || !elements.dashboardCharts.length) return;

    destroyDashboardCharts();

    const categoryMetrics = getCategoryMetrics().filter((metric) => metric.total > 0).slice(0, 8);
    const categoryLabels = categoryMetrics.length ? categoryMetrics.map((metric) => metric.label) : ["Aucun produit"];
    const categoryTotals = categoryMetrics.length ? categoryMetrics.map((metric) => metric.total) : [0];
    const summary = getDashboardSummary();

    makeChart("categories", {
      type: "bar",
      data: {
        labels: categoryLabels,
        datasets: [{
          label: "Produits",
          data: categoryTotals,
          backgroundColor: "#6B4F3A",
          borderRadius: 8,
          maxBarThickness: 46
        }]
      },
      options: {
        ...baseChartOptions,
        plugins: { ...baseChartOptions.plugins, legend: { display: false } }
      }
    });

    makeChart("availability", {
      type: "doughnut",
      data: {
        labels: ["Disponibles", "Rupture"],
        datasets: [{
          data: [summary.available, summary.unavailable],
          backgroundColor: ["#16a56f", "#e44834"],
          borderColor: "#FFFFFF",
          borderWidth: 4,
          hoverOffset: 5
        }]
      },
      options: {
        ...baseChartOptions,
        cutout: "68%",
        scales: {}
      }
    });

    makeChart("promotions", {
      type: "doughnut",
      data: {
        labels: ["Promotions", "Vedettes", "Autres"],
        datasets: [{
          data: [
            summary.promo,
            summary.featured,
            state.products.filter((product) => !product.is_promo && !product.is_featured).length
          ],
          backgroundColor: ["#B99B78", "#6B4F3A", "#D2BEA6"],
          borderColor: "#FFFFFF",
          borderWidth: 4,
          hoverOffset: 5
        }]
      },
      options: {
        ...baseChartOptions,
        cutout: "68%",
        scales: {}
      }
    });
  };

  const getCategoryMetrics = () => {
    const labels = new Map(categories);

    state.products.forEach((product) => {
      if (product.category && !labels.has(product.category)) {
        labels.set(product.category, getCategoryLabel(product.category));
      }
    });

    const metrics = Array.from(labels, ([key, label]) => ({
      key,
      label,
      total: 0,
      available: 0,
      promo: 0
    }));
    const byKey = new Map(metrics.map((item) => [item.key, item]));

    state.products.forEach((product) => {
      const metric = byKey.get(product.category);
      if (!metric) return;
      metric.total += 1;
      if (product.is_available) metric.available += 1;
      if (product.is_promo) metric.promo += 1;
    });

    return metrics.sort((a, b) => b.total - a.total || a.label.localeCompare(b.label));
  };

  const renderCategoryMetricList = (holder) => {
    if (!holder) return;
    holder.replaceChildren();

    const metrics = getCategoryMetrics();
    const max = Math.max(1, ...metrics.map((item) => item.total));

    metrics.forEach((metric) => {
      const row = utils.createEl("article", { className: "admin-category-metric" });
      row.appendChild(
        utils.createEl("img", {
          attrs: { src: getCategoryImage(metric.key), alt: metric.label, loading: "lazy" }
        })
      );

      const content = utils.createEl("div", { className: "admin-category-metric-content" });
      const top = utils.createEl("div", { className: "admin-category-metric-top" });
      top.appendChild(utils.createEl("strong", { text: metric.label }));
      top.appendChild(utils.createEl("span", { text: `${metric.total} produit${metric.total > 1 ? "s" : ""}` }));

      const meta = utils.createEl("p", {
        text: `${metric.available} disponible${metric.available > 1 ? "s" : ""} · ${metric.promo} promo${metric.promo > 1 ? "s" : ""}`
      });
      const bar = utils.createEl("div", { className: "admin-metric-bar" });
      const fill = utils.createEl("span");
      fill.style.width = metric.total ? `${Math.max(8, Math.round((metric.total / max) * 100))}%` : "0%";
      bar.appendChild(fill);

      content.append(top, meta, bar);
      row.appendChild(content);
      holder.appendChild(row);
    });
  };

  const renderDashboardCategories = () => {
    renderCategoryMetricList(elements.dashboardCategories);
  };

  const renderCategoryManagement = () => {
    renderCategoryMetricList(elements.categoryManagement);
  };

  const renderDashboardHealth = () => {
    const holder = elements.dashboardHealth;
    if (!holder) return;
    holder.replaceChildren();

    const missingImages = state.products.filter((product) => !productHasRealImage(product));
    const missingDescriptions = state.products.filter(
      (product) => !String(product.short_description || product.description || "").trim()
    );
    const promoWithoutOldPrice = state.products.filter(
      (product) => product.is_promo && (!product.old_price || Number(product.old_price) <= Number(product.price))
    );
    const unavailable = state.products.filter((product) => !product.is_available);

    const items = [
      {
        icon: "fa-image",
        label: "Images",
        value: missingImages.length,
        text: missingImages.length ? "produits sans vraie photo" : "toutes les fiches ont une photo",
        tone: missingImages.length ? "warning" : "success"
      },
      {
        icon: "fa-align-left",
        label: "Descriptions",
        value: missingDescriptions.length,
        text: missingDescriptions.length ? "descriptions a completer" : "descriptions renseignees",
        tone: missingDescriptions.length ? "warning" : "success"
      },
      {
        icon: "fa-tag",
        label: "Promotions",
        value: promoWithoutOldPrice.length,
        text: promoWithoutOldPrice.length ? "promos sans ancien prix clair" : "promotions coherentes",
        tone: promoWithoutOldPrice.length ? "warning" : "success"
      },
      {
        icon: "fa-eye-slash",
        label: "Ruptures",
        value: unavailable.length,
        text: unavailable.length ? "produits desactives" : "catalogue visible",
        tone: unavailable.length ? "neutral" : "success"
      }
    ];

    items.forEach((item) => {
      const row = utils.createEl("article", { className: `admin-health-item ${item.tone}` });
      row.appendChild(utils.createEl("i", { className: `fa-solid ${item.icon}` }));
      const content = utils.createEl("div");
      content.appendChild(utils.createEl("strong", { text: item.label }));
      content.appendChild(utils.createEl("span", { text: `${item.value} ${item.text}` }));
      row.appendChild(content);
      holder.appendChild(row);
    });
  };

  const renderDashboardRecent = () => {
    const holder = elements.dashboardRecent;
    if (!holder) return;
    holder.replaceChildren();

    const recent = [...state.products]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);

    if (!recent.length) {
      holder.appendChild(utils.createEl("div", { className: "empty-state", text: "Aucun produit pour le moment." }));
      return;
    }

    recent.forEach((product) => {
      const row = utils.createEl("article", { className: "admin-recent-item" });
      row.appendChild(
        utils.createEl("img", {
          attrs: { src: product.main_image || utils.fallbackImage, alt: product.name, loading: "lazy" }
        })
      );

      const content = utils.createEl("div");
      content.appendChild(utils.createEl("strong", { text: product.name }));
      content.appendChild(utils.createEl("span", { text: `${getCategoryLabel(product.category)} · ${utils.formatPrice(product.price)}` }));
      row.appendChild(content);
      row.appendChild(
        utils.createEl("span", {
          className: product.is_available ? "status-pill success" : "status-pill danger",
          text: product.is_available ? "Dispo" : "Rupture"
        })
      );
      holder.appendChild(row);
    });
  };

  const renderDashboard = () => {
    renderDashboardStats();
    renderDashboardCharts();
    renderCategoryManagement();
  };

  const escapeCsvValue = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

  const exportProductsCsv = () => {
    if (!state.products.length) {
      utils.toast("Aucun produit a exporter.", "error");
      return;
    }

    const headers = [
      "Nom",
      "Slug",
      "Categorie",
      "Sous-categorie",
      "Prix",
      "Ancien prix",
      "Disponible",
      "Vedette",
      "Promotion",
      "Images"
    ];
    const rows = state.products.map((product) => [
      product.name,
      product.slug,
      getCategoryLabel(product.category),
      product.subcategory,
      product.price,
      product.old_price || "",
      product.is_available ? "Oui" : "Non",
      product.is_featured ? "Oui" : "Non",
      product.is_promo ? "Oui" : "Non",
      utils.unique([product.main_image, ...(product.images || [])]).join(" | ")
    ]);
    const csv = [headers, ...rows].map((row) => row.map(escapeCsvValue).join(",")).join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `maison-max-produits-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    utils.toast("Export CSV telecharge");
  };

  const scrollToProductForm = () => {
    resetForm();
    openAdminSection("add-product", { updateHash: true });
    elements.productForm.scrollIntoView({ behavior: "smooth", block: "start" });
    try {
      elements.name.focus({ preventScroll: true });
    } catch (error) {
      elements.name.focus();
    }
  };

  const scrollToProductList = () => {
    if (elements.status) elements.status.value = "all";
    applyFilters();
    openAdminSection("products", { updateHash: true });
    elements.productList.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openProductsPromotions = () => {
    if (elements.status) elements.status.value = "promo";
    if (elements.category) elements.category.value = "all";
    if (elements.search) elements.search.value = "";
    applyFilters();
    openAdminSection("products", { updateHash: true });
  };

  const applyGlobalSearch = () => {
    const term = String(elements.globalSearch?.value || "").trim();
    if (!term) return;
    if (elements.search) elements.search.value = term;
    if (elements.category) elements.category.value = "all";
    if (elements.status) elements.status.value = "all";
    applyFilters();
    openAdminSection("products", { updateHash: true });
  };

  const saveCategoryImagesSetting = async () => {
    await api.setSiteSetting("category_images", state.categoryImages);
  };

  const saveCategoryImage = async (row, key) => {
    const input = row.querySelector("[data-category-image-url]");
    const fileInput = row.querySelector("[data-category-image-upload]");
    const button = row.querySelector("[data-category-image-save]");
    utils.setButtonLoading(button, true, "...");

    try {
      const file = fileInput.files && fileInput.files[0];
      const uploadedUrl = file ? await api.uploadCategoryImage(file, key) : "";
      const url = uploadedUrl || input.value.trim();

      if (url) state.categoryImages[key] = url;
      else delete state.categoryImages[key];

      await saveCategoryImagesSetting();
      utils.toast("Image de categorie mise a jour");
      renderCategoryImages();
    } catch (error) {
      utils.toast(error.message || "Mise a jour impossible", "error");
    } finally {
      utils.setButtonLoading(button, false);
    }
  };

  const resetCategoryImage = async (key) => {
    try {
      delete state.categoryImages[key];
      await saveCategoryImagesSetting();
      utils.toast("Image de categorie restauree");
      renderCategoryImages();
    } catch (error) {
      utils.toast(error.message || "Restauration impossible", "error");
    }
  };

  const renderCategoryImages = () => {
    if (!elements.categoryImageList) return;
    elements.categoryImageList.replaceChildren();

    categories.forEach(([key, label]) => {
      const row = utils.createEl("article", { className: "admin-category-image-row" });
      const image = utils.createEl("img", {
        attrs: { src: getCategoryImage(key), alt: label, loading: "lazy" }
      });

      const content = utils.createEl("div", { className: "admin-category-image-content" });
      content.appendChild(utils.createEl("h3", { text: label }));

      const field = utils.createEl("label", { className: "field-label" });
      field.appendChild(utils.createEl("span", { text: "URL de l'image" }));
      const input = utils.createEl("input", {
        attrs: {
          type: "url",
          value: state.categoryImages[key] || "",
          placeholder: categoryDefaultImages[key] || "https://...",
          "data-category-image-url": ""
        }
      });
      field.appendChild(input);

      const upload = utils.createEl("label", { className: "field-label" });
      upload.appendChild(utils.createEl("span", { text: "Upload" }));
      const fileInput = utils.createEl("input", {
        attrs: { type: "file", accept: "image/*", "data-category-image-upload": "" }
      });
      upload.appendChild(fileInput);

      const actions = utils.createEl("div", { className: "admin-category-image-actions" });
      const save = utils.createEl("button", {
        className: "btn btn-primary btn-sm",
        attrs: { type: "button", "data-category-image-save": "" }
      });
      save.innerHTML = '<i class="fa-solid fa-floppy-disk"></i><span>Enregistrer</span>';
      const reset = utils.createEl("button", {
        className: "btn btn-light btn-sm",
        attrs: { type: "button" }
      });
      reset.innerHTML = '<i class="fa-solid fa-rotate-left"></i><span>Defaut</span>';
      actions.append(save, reset);

      input.addEventListener("input", () => {
        image.src = input.value.trim() || getCategoryImage(key);
      });
      fileInput.addEventListener("change", () => {
        const file = fileInput.files && fileInput.files[0];
        if (file) image.src = URL.createObjectURL(file);
      });
      save.addEventListener("click", () => saveCategoryImage(row, key));
      reset.addEventListener("click", () => resetCategoryImage(key));

      content.append(field, upload, actions);
      row.append(image, content);
      elements.categoryImageList.appendChild(row);
    });
  };

  const loadCategoryImages = async () => {
    if (!elements.categoryImageList || !api.getSiteSetting) return;

    try {
      const value = await api.getSiteSetting("category_images");
      state.categoryImages = value && typeof value === "object" ? value : {};
    } catch (error) {
      state.categoryImages = {};
      utils.toast("Impossible de charger les images des categories", "error");
    }

    renderCategoryImages();
    renderDashboard();
  };

  const loadAdminData = async () => {
    await Promise.all([loadProducts(), loadCategoryImages(), loadAdminAccount()]);
    renderDashboard();
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const button = elements.loginForm.querySelector("button[type='submit']");
    utils.setButtonLoading(button, true, "Connexion...");

    try {
      const password = elements.loginForm.elements.password.value;
      const emailValue = elements.loginForm.elements.email.value.trim();
      await api.signInAdmin(emailValue, password);
      const profile = await api.getCurrentAdminProfile();
      if (!profile || profile.role !== "admin") {
        await api.signOut();
        throw new Error("Ce compte n'a pas les droits vendeur.");
      }
      showOnly(elements.app);
      openAdminSection(getSectionFromHash(), { scroll: false });
      await loadAdminData();
    } catch (error) {
      utils.toast(error.message || "Connexion impossible", "error");
    } finally {
      utils.setButtonLoading(button, false);
    }
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    const button = elements.productForm.querySelector("button[type='submit']");
    utils.setButtonLoading(button, true, "Enregistrement...");

    try {
      const payload = await getFormPayload();
      const validation = validatePayload(payload);
      if (validation) throw new Error(validation);

      if (state.editingId) {
        await api.updateProduct(state.editingId, payload);
        utils.toast("Produit modifie");
      } else {
        await api.createProduct(payload);
        utils.toast("Produit ajoute");
      }

      resetForm();
      await loadProducts();
    } catch (error) {
      utils.toast(error.message || "Enregistrement impossible", "error");
    } finally {
      utils.setButtonLoading(button, false);
    }
  };

  const bindPasswordToggle = () => {
    const toggle = elements.loginForm.querySelector("[data-password-toggle]");
    const input = elements.loginForm.querySelector("[data-password-input]");
    if (!toggle || !input) return;

    toggle.addEventListener("click", () => {
      const visible = input.type === "text";
      input.type = visible ? "password" : "text";
      toggle.setAttribute("aria-label", visible ? "Afficher le mot de passe" : "Masquer le mot de passe");
      toggle.innerHTML = visible ? '<i class="fa-regular fa-eye"></i>' : '<i class="fa-regular fa-eye-slash"></i>';
    });
  };

  const bind = () => {
    elements.loginForm.addEventListener("submit", handleLogin);
    bindPasswordToggle();
    elements.productForm.addEventListener("submit", handleProductSubmit);
    elements.cancelEdit.addEventListener("click", resetForm);
    elements.refresh.addEventListener("click", loadAdminData);
    elements.dashboardExport?.addEventListener("click", exportProductsCsv);
    elements.dashboardScrollForm?.addEventListener("click", scrollToProductForm);
    elements.dashboardScrollProducts?.addEventListener("click", scrollToProductList);
    elements.openProductsPromo?.addEventListener("click", openProductsPromotions);
    elements.quickAdd?.addEventListener("click", scrollToProductForm);
    elements.themeForm?.addEventListener("submit", saveThemeSettings);
    elements.accountForm?.addEventListener("submit", handleAccountSubmit);
    elements.themeReset?.addEventListener("click", resetThemeSettings);
    elements.themeForm?.addEventListener("input", () => applyThemeSetting(getThemeFormValue()));
    elements.themeForm?.addEventListener("change", () => applyThemeSetting(getThemeFormValue()));
    elements.aiGenerate?.addEventListener("click", () => runProductAi("generate", elements.aiGenerate));
    elements.aiImprove?.addEventListener("click", () => runProductAi("improve", elements.aiImprove));
    elements.globalSearch?.addEventListener("search", applyGlobalSearch);
    elements.globalSearch?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        applyGlobalSearch();
      }
    });

    elements.navButtons.forEach((button) => {
      button.addEventListener("click", () => openAdminSection(button.dataset.adminNav, { updateHash: true }));
    });

    elements.sidebarToggle?.addEventListener("click", openAdminSidebar);
    elements.sidebarClose?.addEventListener("click", closeAdminSidebar);
    elements.sidebarOverlay?.addEventListener("click", closeAdminSidebar);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeAdminSidebar();
    });
    window.addEventListener("hashchange", () => {
      if (elements.app && !elements.app.hidden) openAdminSection(getSectionFromHash(), { scroll: false });
    });

    elements.logoutButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        await api.signOut();
        closeAdminSidebar();
        showOnly(elements.login);
      });
    });

    [elements.search, elements.category, elements.status].forEach((input) => {
      input.addEventListener("input", applyFilters);
      input.addEventListener("change", applyFilters);
    });

    elements.name.addEventListener("input", () => {
      if (!state.editingId || !elements.slug.value) {
        elements.slug.value = utils.slugify(elements.name.value);
      }
    });

    elements.imageUrlInputs.forEach((input) => {
      input.addEventListener("input", renderImagePreview);
    });

    elements.imageUpload.addEventListener("change", () => {
      const result = addSelectedImageFiles(elements.imageUpload.files || []);
      if (result.incomingCount > result.acceptedCount) {
        utils.toast("Maximum 3 images par produit.", "error");
      }
      renderImagePreview();
    });

    renderImagePreview();
  };

  const init = async () => {
    pick();
    fillCategorySelects();

    if (!api || !api.isConfigured) {
      showOnly(elements.setup);
      return;
    }

    bind();

    const session = await api.getSession();
    if (!session) {
      showOnly(elements.login);
      return;
    }

    const profile = await api.getCurrentAdminProfile();
    if (!profile || profile.role !== "admin") {
      showOnly(elements.login);
      utils.toast("Connectez-vous avec un compte vendeur autorise.", "error");
      return;
    }

    showOnly(elements.app);
    await loadThemeSettings();
    openAdminSection(getSectionFromHash(), { scroll: false });
    await loadAdminData();
  };

  document.addEventListener("DOMContentLoaded", init);
})();
