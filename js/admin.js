(function () {
  "use strict";

  const utils = window.MMUtils;
  const api = window.MMSupabase;
  const maxProductImages = 3;

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
    previewObjectUrls: []
  };

  const elements = {};

  const pick = () => {
    elements.setup = document.querySelector("[data-admin-setup]");
    elements.login = document.querySelector("[data-admin-login]");
    elements.app = document.querySelector("[data-admin-app]");
    elements.loginForm = document.querySelector("[data-login-form]");
    elements.productForm = document.querySelector("[data-product-form]");
    elements.productList = document.querySelector("[data-admin-product-list]");
    elements.search = document.querySelector("[data-admin-search]");
    elements.category = document.querySelector("[data-admin-category]");
    elements.status = document.querySelector("[data-admin-status]");
    elements.formTitle = document.querySelector("[data-form-title]");
    elements.cancelEdit = document.querySelector("[data-cancel-edit]");
    elements.logout = document.querySelector("[data-admin-logout]");
    elements.refresh = document.querySelector("[data-admin-refresh]");
    elements.imagesPreview = document.querySelector("[data-images-preview]");
    elements.slug = document.querySelector("#product-slug");
    elements.name = document.querySelector("#product-name");
    elements.imageUpload = document.querySelector("[data-image-upload]");
    elements.imageUrlInputs = Array.from(document.querySelectorAll("[data-image-url]"));
  };

  const showOnly = (section) => {
    [elements.setup, elements.login, elements.app].forEach((node) => {
      if (node) node.hidden = node !== section;
    });
    if (elements.logout) elements.logout.hidden = section !== elements.app;
  };

  const fillCategorySelects = () => {
    document.querySelectorAll("[data-category-options]").forEach((select) => {
      const current = select.value;
      select.replaceChildren();
      if (select.dataset.categoryOptions === "filter") {
        select.appendChild(utils.createEl("option", { attrs: { value: "all" }, text: "Toutes les categories" }));
      }
      categories.forEach(([value, label]) => {
        select.appendChild(utils.createEl("option", { attrs: { value }, text: label }));
      });
      if (current) select.value = current;
    });
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

  const setImageUrls = (urls = []) => {
    elements.imageUrlInputs.forEach((input, index) => {
      input.value = urls[index] || "";
    });
  };

  const getSelectedImageFiles = (availableSlots = maxProductImages) =>
    Array.from(elements.imageUpload?.files || [])
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, Math.max(0, availableSlots));

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

  const resetForm = () => {
    state.editingId = null;
    elements.productForm.reset();
    elements.productForm.querySelector("[name='is_available']").checked = true;
    setImageUrls();
    revokePreviewUrls();
    renderImagePreview();
    elements.formTitle.textContent = "Ajouter un produit";
    elements.cancelEdit.hidden = true;
  };

  const renderImagePreview = () => {
    revokePreviewUrls();
    elements.imagesPreview.replaceChildren();
    const imageUrls = getImageUrls();
    const files = getSelectedImageFiles(maxProductImages - imageUrls.length);
    const previews = [
      ...imageUrls.map((url, index) => ({ src: url, label: `URL ${index + 1}` })),
      ...files.map((file, index) => {
        const src = URL.createObjectURL(file);
        state.previewObjectUrls.push(src);
        return { src, label: `Upload ${index + 1}` };
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
    if (elements.imageUpload) elements.imageUpload.value = "";
    form.elements.is_available.checked = product.is_available;
    form.elements.is_featured.checked = product.is_featured;
    form.elements.is_promo.checked = product.is_promo;
    elements.formTitle.textContent = "Modifier le produit";
    elements.cancelEdit.hidden = false;
    renderImagePreview();
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const renderProducts = () => {
    const list = elements.productList;
    if (!list) return;
    list.replaceChildren();

    if (!state.filtered.length) {
      list.appendChild(utils.createEl("div", { className: "empty-state", text: "Aucun produit trouve." }));
      return;
    }

    state.filtered.forEach((product) => {
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
  };

  const applyFilters = () => {
    const term = (elements.search.value || "").toLowerCase().trim();
    const category = elements.category.value || "all";
    const status = elements.status.value || "all";

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
    } catch (error) {
      elements.productList.replaceChildren();
      elements.productList.appendChild(
        utils.createEl("div", {
          className: "empty-state error",
          text: error.message || "Impossible de charger les produits."
        })
      );
    }
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
      await loadProducts();
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

  const bind = () => {
    elements.loginForm.addEventListener("submit", handleLogin);
    elements.productForm.addEventListener("submit", handleProductSubmit);
    elements.cancelEdit.addEventListener("click", resetForm);
    elements.refresh.addEventListener("click", loadProducts);
    elements.logout.addEventListener("click", async () => {
      await api.signOut();
      showOnly(elements.login);
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
      const urls = getImageUrls();
      const files = Array.from(elements.imageUpload.files || []);
      if (urls.length + files.length > maxProductImages) {
        utils.toast("Seules 3 images seront enregistrees pour ce produit.", "error");
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
    await loadProducts();
  };

  document.addEventListener("DOMContentLoaded", init);
})();
