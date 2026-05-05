(function () {
  "use strict";

  const fallbackImage =
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80";

  const themeStorageKey = "maison_max_theme";
  const defaultTheme = {
    primary: "#6B4F3A",
    secondary: "#F5EFE6",
    button: "#4A372A",
    font: "Manrope",
    textSize: "normal"
  };

  const isHexColor = (value) => /^#[0-9a-f]{6}$/i.test(String(value || "").trim());

  const normalizeTheme = (theme = {}) => ({
    primary: isHexColor(theme.primary) ? theme.primary : defaultTheme.primary,
    secondary: isHexColor(theme.secondary) ? theme.secondary : defaultTheme.secondary,
    button: isHexColor(theme.button) ? theme.button : defaultTheme.button,
    font: ["Inter", "Manrope", "Poppins", "Roboto", "Open Sans"].includes(theme.font) ? theme.font : defaultTheme.font,
    textSize: ["small", "normal", "large"].includes(theme.textSize) ? theme.textSize : defaultTheme.textSize
  });

  const getStoredTheme = () => {
    try {
      return normalizeTheme(JSON.parse(localStorage.getItem(themeStorageKey) || "{}"));
    } catch (error) {
      return { ...defaultTheme };
    }
  };

  const storeTheme = (theme) => {
    const normalized = normalizeTheme(theme);
    localStorage.setItem(themeStorageKey, JSON.stringify(normalized));
    return normalized;
  };

  const applyStoreTheme = (theme) => {
    const normalized = normalizeTheme(theme || getStoredTheme());
    const root = document.documentElement;
    root.style.setProperty("--primary", normalized.primary);
    root.style.setProperty("--primary-dark", normalized.button);
    root.style.setProperty("--primary-deep", normalized.button);
    root.style.setProperty("--accent", normalized.secondary);
    root.style.setProperty("--border", normalized.secondary);
    root.style.setProperty("--bg", normalized.secondary);
    root.style.setProperty("--secondary", normalized.secondary);
    root.style.setProperty("--font-main", `"${normalized.font}", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`);
    root.dataset.textSize = normalized.textSize;
    return normalized;
  };

  applyStoreTheme(getStoredTheme());

  const formatPrice = (value) => {
    const amount = Number(value || 0);
    return `${new Intl.NumberFormat("fr-FR").format(amount)} FCFA`;
  };

  const escapeHTML = (value) => {
    const div = document.createElement("div");
    div.textContent = value == null ? "" : String(value);
    return div.innerHTML;
  };

  const stripHTML = (value) => {
    const div = document.createElement("div");
    div.innerHTML = value == null ? "" : String(value);
    return div.textContent || div.innerText || "";
  };

  const slugify = (value) =>
    String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const unique = (items) => [...new Set((items || []).filter(Boolean))];

  const normalizeArray = (value) => {
    if (Array.isArray(value)) {
      return value.map((item) => String(item).trim()).filter(Boolean);
    }

    if (typeof value === "string") {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [];
  };

  const normalizeProduct = (product) => {
    const images = normalizeArray(product.images);
    const mainImage = product.main_image || images[0] || fallbackImage;

    return {
      id: product.id || product.slug,
      name: product.name || "Produit Maison Max",
      slug: product.slug || slugify(product.name || product.id),
      short_description: product.short_description || "",
      description: product.description || product.short_description || "",
      price: Number(product.price || 0),
      old_price: product.old_price == null ? null : Number(product.old_price),
      category: product.category || "vetements-femme",
      subcategory: product.subcategory || "",
      sizes: normalizeArray(product.sizes),
      colors: normalizeArray(product.colors),
      images,
      main_image: mainImage,
      is_available: product.is_available !== false,
      is_featured: Boolean(product.is_featured),
      is_promo: Boolean(product.is_promo),
      created_at: product.created_at || new Date().toISOString()
    };
  };

  const createEl = (tag, options = {}, children = []) => {
    const el = document.createElement(tag);

    if (options.className) el.className = options.className;
    if (options.text != null) el.textContent = options.text;
    if (options.attrs) {
      Object.entries(options.attrs).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          el.setAttribute(key, String(value));
        }
      });
    }
    if (options.dataset) {
      Object.entries(options.dataset).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          el.dataset[key] = String(value);
        }
      });
    }

    children.forEach((child) => {
      if (child == null) return;
      el.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    });

    return el;
  };

  const debounce = (fn, wait = 250) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), wait);
    };
  };

  const setButtonLoading = (button, isLoading, label) => {
    if (!button) return;
    if (isLoading) {
      button.dataset.originalHtml = button.innerHTML;
      button.disabled = true;
      button.textContent = label || "Chargement...";
    } else {
      button.disabled = false;
      if (button.dataset.originalHtml) {
        button.innerHTML = button.dataset.originalHtml;
      }
    }
  };

  const toast = (message, type = "success") => {
    let holder = document.querySelector("[data-toast-holder]");
    if (!holder) {
      holder = createEl("div", { className: "toast-holder", attrs: { "data-toast-holder": "" } });
      document.body.appendChild(holder);
    }

    const item = createEl("div", { className: `toast toast-${type}` }, [
      createEl("span", { text: message })
    ]);
    holder.appendChild(item);
    setTimeout(() => item.classList.add("is-visible"), 20);
    setTimeout(() => {
      item.classList.remove("is-visible");
      setTimeout(() => item.remove(), 250);
    }, 3600);
  };

  const getQueryParam = (name) => new URLSearchParams(window.location.search).get(name);

  const getProductUrl = (product) => `product.html?slug=${encodeURIComponent(product.slug)}`;

  const safeJsonLd = (data) => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  };

  window.MMUtils = {
    fallbackImage,
    formatPrice,
    escapeHTML,
    stripHTML,
    slugify,
    unique,
    normalizeArray,
    normalizeProduct,
    createEl,
    debounce,
    setButtonLoading,
    toast,
    getQueryParam,
    getProductUrl,
    safeJsonLd,
    defaultTheme,
    normalizeTheme,
    getStoredTheme,
    storeTheme,
    applyStoreTheme
  };
})();
