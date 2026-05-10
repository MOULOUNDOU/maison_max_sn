(function () {
  "use strict";

  const utils = window.MMUtils;
  const config = window.MAISON_MAX_CONFIG || {};
  const endpoint = "/.netlify/functions/ai";

  const request = async (action, payload = {}) => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 22000);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload }),
        signal: controller.signal
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `Service IA indisponible (${response.status}).`);
      return data;
    } finally {
      window.clearTimeout(timeout);
    }
  };

  const createMessage = (role, text) => {
    const item = utils.createEl("div", { className: `ai-message ${role}` });
    item.appendChild(utils.createEl("span", { text }));
    return item;
  };

  const scrollMessages = (holder) => {
    window.requestAnimationFrame(() => {
      holder.scrollTop = holder.scrollHeight;
    });
  };

  const normalizeProductForContext = (product, getCategoryLabel) => ({
    name: product.name,
    slug: product.slug,
    category: product.category,
    category_label: getCategoryLabel ? getCategoryLabel(product.category) : product.category,
    price: product.price,
    old_price: product.old_price,
    sizes: product.sizes || [],
    colors: product.colors || [],
    short_description: product.short_description || product.description || "",
    is_available: product.is_available !== false
  });

  const mergeProducts = (groups) => {
    const seen = new Set();
    const products = [];
    groups.flat().forEach((product) => {
      if (!product) return;
      const key = product.id || product.slug || product.name;
      if (!key || seen.has(key)) return;
      seen.add(key);
      products.push(product);
    });
    return products;
  };

  const initShopAssistant = (options = {}) => {
    if (!utils || document.body.classList.contains("admin-body") || document.querySelector("[data-ai-shop-widget]")) {
      return;
    }

    const history = [
      {
        role: "assistant",
        content: "Bonjour, je peux vous aider a choisir une tenue, une taille, une couleur ou un budget."
      }
    ];

    const launcher = utils.createEl("button", {
      className: "ai-shop-launcher",
      attrs: {
        type: "button",
        "aria-label": "Ouvrir l'assistant IA",
        "aria-expanded": "false",
        "data-ai-shop-launcher": ""
      }
    });
    launcher.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i><span>IA</span>';

    const widget = utils.createEl("section", {
      className: "ai-shop-widget",
      attrs: { "data-ai-shop-widget": "", "aria-hidden": "true" }
    });

    const header = utils.createEl("div", { className: "ai-shop-header" });
    const titleWrap = utils.createEl("div");
    titleWrap.appendChild(utils.createEl("span", { text: "Maison Max" }));
    titleWrap.appendChild(utils.createEl("strong", { text: "Assistant IA" }));
    const close = utils.createEl("button", {
      className: "icon-btn small",
      attrs: { type: "button", "aria-label": "Fermer l'assistant IA" }
    });
    close.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    header.append(titleWrap, close);

    const messages = utils.createEl("div", {
      className: "ai-shop-messages",
      attrs: { "aria-live": "polite" }
    });
    messages.appendChild(createMessage("assistant", history[0].content));

    const suggestions = utils.createEl("div", { className: "ai-shop-suggestions" });
    [
      "Une robe pour ceremonie",
      "Un cadeau a 20 000 FCFA",
      "Des chaussures disponibles"
    ].forEach((text) => {
      const chip = utils.createEl("button", { attrs: { type: "button" }, text });
      suggestions.appendChild(chip);
    });

    const form = utils.createEl("form", { className: "ai-shop-form" });
    const input = utils.createEl("input", {
      attrs: {
        type: "text",
        maxlength: "260",
        placeholder: "Demander un conseil...",
        "aria-label": "Message pour l'assistant IA"
      }
    });
    const submit = utils.createEl("button", {
      className: "btn btn-primary btn-sm",
      attrs: { type: "submit" }
    });
    submit.innerHTML = '<i class="fa-solid fa-paper-plane"></i><span>Envoyer</span>';
    form.append(input, submit);
    widget.append(header, messages, suggestions, form);
    document.body.append(launcher, widget);

    const setOpen = (isOpen) => {
      widget.classList.toggle("is-open", isOpen);
      widget.setAttribute("aria-hidden", String(!isOpen));
      launcher.setAttribute("aria-expanded", String(isOpen));
      if (isOpen) {
        input.focus();
        scrollMessages(messages);
      }
    };

    const getContext = () => {
      const allProducts = options.getProducts ? options.getProducts() || [] : [];
      const visibleProducts = options.getVisibleProducts ? options.getVisibleProducts() || [] : [];
      const featured = allProducts.filter((product) => product.is_featured || product.is_promo);
      const products = mergeProducts([visibleProducts.slice(0, 8), featured.slice(0, 4), allProducts.slice(0, 4)])
        .slice(0, 12)
        .map((product) => normalizeProductForContext(product, options.getCategoryLabel));

      return {
        store: config.STORE_NAME || "Maison Max",
        currency: config.CURRENCY || "FCFA",
        city: config.DEFAULT_CITY || "Dakar",
        selectedCategory: options.getSelectedCategory ? options.getSelectedCategory() : "all",
        products
      };
    };

    const sendMessage = async (content) => {
      const message = String(content || "").trim();
      if (!message) return;
      input.value = "";
      history.push({ role: "user", content: message });
      messages.appendChild(createMessage("user", message));
      const pending = createMessage("assistant", "Je cherche la meilleure reponse...");
      pending.classList.add("is-pending");
      messages.appendChild(pending);
      scrollMessages(messages);
      utils.setButtonLoading(submit, true, "...");

      try {
        const data = await request("shop-assistant", {
          messages: history.slice(-8),
          context: getContext()
        });
        const answer = data.message || "Je peux vous aider a choisir un produit Maison Max.";
        history.push({ role: "assistant", content: answer });
        pending.replaceWith(createMessage("assistant", answer));
      } catch (error) {
        const message =
          error.name === "AbortError"
            ? "La reponse IA prend trop de temps. Verifiez votre connexion ou reessayez."
            : error.message || "L'assistant IA est indisponible pour le moment.";
        pending.replaceWith(createMessage("assistant", message));
      } finally {
        utils.setButtonLoading(submit, false);
        scrollMessages(messages);
      }
    };

    launcher.addEventListener("click", () => setOpen(!widget.classList.contains("is-open")));
    close.addEventListener("click", () => setOpen(false));
    suggestions.addEventListener("click", (event) => {
      const chip = event.target.closest("button");
      if (!chip) return;
      sendMessage(chip.textContent);
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      sendMessage(input.value);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
  };

  const generateProductCopy = async (payload) => {
    const data = await request("admin-product-copy", payload);
    return { ...(data.suggestion || {}), fallback: Boolean(data.fallback) };
  };

  window.MMAI = {
    request,
    initShopAssistant,
    generateProductCopy
  };
})();
