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
    } catch (error) {
      if (error.name === "AbortError") throw error;
      if (/load failed|failed to fetch|network/i.test(error.message || "")) {
        throw new Error("Connexion IA impossible. Ouvrez le site via http://localhost:8888 en local ou verifiez le deploiement Netlify.");
      }
      throw error;
    } finally {
      window.clearTimeout(timeout);
    }
  };

  const appendFormattedInline = (node, text) => {
    const source = String(text || "");
    const pattern = /\*\*([^*]+)\*\*/g;
    let cursor = 0;
    let match;

    while ((match = pattern.exec(source))) {
      if (match.index > cursor) {
        node.appendChild(document.createTextNode(source.slice(cursor, match.index)));
      }
      node.appendChild(utils.createEl("strong", { text: match[1].trim() }));
      cursor = match.index + match[0].length;
    }

    if (cursor < source.length) {
      node.appendChild(document.createTextNode(source.slice(cursor)));
    }
  };

  const renderAssistantText = (bubble, text) => {
    const lines = String(text || "")
      .replace(/\r/g, "")
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);
    let list = null;

    const resetList = () => {
      list = null;
    };

    lines.forEach((line) => {
      const bullet = line.match(/^(?:[-*]|\d+[.)])\s+(.+)$/);
      if (bullet) {
        if (!list) {
          list = utils.createEl("ul");
          bubble.appendChild(list);
        }
        const item = utils.createEl("li");
        appendFormattedInline(item, bullet[1]);
        list.appendChild(item);
        return;
      }

      resetList();
      const paragraph = utils.createEl("p");
      appendFormattedInline(paragraph, line);
      bubble.appendChild(paragraph);
    });

    if (!bubble.childElementCount && !bubble.textContent) {
      bubble.textContent = text || "";
    }
  };

  const createMessage = (role, text) => {
    const item = utils.createEl("div", { className: `ai-message ${role}` });
    const bubble = utils.createEl("div", { className: "ai-message-bubble" });
    if (role === "assistant") renderAssistantText(bubble, text);
    else bubble.textContent = text;
    item.appendChild(bubble);
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

  const getSiteContext = (products, options = {}) => {
    const getCategoryLabel = options.getCategoryLabel || ((value) => value);
    const categories = [...new Set((products || []).map((product) => product.category).filter(Boolean))]
      .map((category) => getCategoryLabel(category))
      .filter(Boolean);

    return {
      whatsapp: String(config.WHATSAPP_NUMBER || "").replace(/\D/g, ""),
      current_page: document.title || "Maison Max",
      current_path: window.location.pathname || "/",
      categories: categories.length
        ? categories
        : ["Robes", "Boubous", "Ensembles", "Chemises", "Pantalons", "Chaussures", "Sacs", "Accessoires"],
      delivery_zones: config.DELIVERY_ZONES || [
        "Dakar",
        "Afrique de l'Ouest",
        "Afrique centrale",
        "Afrique de l'Est",
        "Afrique australe"
      ],
      pages: ["Accueil", "Boutique", "Produit", "Panier", "Livraison", "Contact WhatsApp"],
      services: [
        "Commande par panier puis validation sur WhatsApp",
        "Livraison rapide et securisee en Afrique",
        "Conseils tailles, couleurs et disponibilites sur WhatsApp",
        "Verification possible selon les conditions de livraison"
      ],
      checkout:
        "Ajoutez les articles au panier, choisissez le pays et la ville de livraison, puis envoyez la commande sur WhatsApp.",
      payment:
        "Aucun paiement en ligne n'est pris sur le site. Maison Max confirme la commande et les details sur WhatsApp.",
      support:
        "Pour les retours, verifications ou disponibilites precises, Maison Max confirme chaque cas sur WhatsApp."
    };
  };

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
        content: "Posez votre question sur Maison Max : produits, livraison, panier, tailles, prix ou budget."
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
    launcher.innerHTML = '<img src="assets/logo-maison-max.jpg" alt="" /><i class="fa-solid fa-sparkles"></i><span>IA</span>';

    const widget = utils.createEl("section", {
      className: "ai-shop-widget",
      attrs: { "data-ai-shop-widget": "", "aria-hidden": "true" }
    });

    const header = utils.createEl("div", { className: "ai-shop-header" });
    const avatar = utils.createEl("div", { className: "ai-shop-avatar" });
    avatar.innerHTML = '<img src="assets/logo-maison-max.jpg" alt="Maison Max" />';
    const titleWrap = utils.createEl("div", { className: "ai-shop-copy" });
    titleWrap.appendChild(utils.createEl("span", { text: "Conseil shopping" }));
    titleWrap.appendChild(utils.createEl("strong", { text: "Assistant Maison Max" }));
    titleWrap.appendChild(utils.createEl("small", { text: "Besoin d'aide pour choisir un produit ?" }));
    const close = utils.createEl("button", {
      className: "icon-btn small ai-shop-close",
      attrs: { type: "button", "aria-label": "Fermer l'assistant IA" }
    });
    close.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    const headMain = utils.createEl("div", { className: "ai-shop-title" });
    headMain.append(avatar, titleWrap);
    header.append(headMain, close);

    const messages = utils.createEl("div", {
      className: "ai-shop-messages",
      attrs: { "aria-live": "polite" }
    });
    messages.appendChild(createMessage("assistant", history[0].content));

    const suggestions = utils.createEl("div", { className: "ai-shop-suggestions" });
    [
      "Bonjour",
      "Comment commander ?",
      "Livraison a Dakar",
      "Une robe pour ceremonie",
      "Budget 20 000 FCFA"
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
        autocomplete: "off",
        enterkeyhint: "send",
        "aria-label": "Message pour l'assistant IA"
      }
    });
    const submit = utils.createEl("button", {
      className: "btn btn-primary btn-sm ai-shop-submit",
      attrs: { type: "submit" }
    });
    submit.innerHTML = '<i class="fa-solid fa-paper-plane"></i><span>Envoyer</span>';
    form.append(input, submit);
    widget.append(header, messages, suggestions, form);
    document.body.append(launcher, widget);

    const mobileAssistantQuery = window.matchMedia("(max-width: 760px)");
    let mobileLockActive = false;
    let mobileLockScrollY = 0;
    let mobileViewportBaseHeight = 0;
    let mobileSavedBodyStyles = null;
    let mobileSavedHtmlStyles = null;

    const isMobileAssistant = () => mobileAssistantQuery.matches;

    const restoreMobileScroll = () => {
      if (!mobileLockActive) return;
      document.body.style.top = `-${mobileLockScrollY}px`;
      document.documentElement.style.setProperty("--ai-shop-scroll-lock-top", `-${mobileLockScrollY}px`);
    };

    const instantScrollTo = (top) => {
      const html = document.documentElement;
      const previousScrollBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, top);
      html.style.scrollBehavior = previousScrollBehavior;
    };

    const getMobileLayoutHeight = () =>
      Math.round(
        Math.max(
          window.innerHeight || 0,
          document.documentElement.clientHeight || 0,
          window.visualViewport?.height || 0
        )
      );

    const setMobileKeyboardMetrics = () => {
      if (!isMobileAssistant()) return;
      const viewport = window.visualViewport;
      const viewportHeight = Math.round(
        viewport?.height || window.innerHeight || document.documentElement.clientHeight || 0
      );
      const layoutHeight = getMobileLayoutHeight();
      const viewportOffsetTop = Math.round(viewport?.offsetTop || 0);
      const isTyping = document.activeElement === input;
      if (!mobileViewportBaseHeight || !isTyping) {
        mobileViewportBaseHeight = layoutHeight;
      }
      const keyboardOffset = isTyping ? Math.max(0, mobileViewportBaseHeight - viewportHeight - viewportOffsetTop) : 0;
      if (viewportHeight > 0) {
        document.documentElement.style.setProperty("--ai-shop-mobile-viewport-height", `${viewportHeight}px`);
      }
      document.documentElement.style.setProperty("--ai-shop-keyboard-offset", `${keyboardOffset}px`);
    };

    const focusMobileInputWithoutScroll = (event) => {
      if (!isMobileAssistant() || !widget.classList.contains("is-open")) return;
      if (event?.cancelable) event.preventDefault();
      lockMobilePage();
      try {
        input.focus({ preventScroll: true });
      } catch (error) {
        input.focus();
      }
      keepMobileAssistantStable();
      scheduleMobileKeyboardMetrics();
      restoreMobileScroll();
    };

    const lockMobilePage = () => {
      if (!isMobileAssistant()) return;
      if (mobileLockActive) return;
      mobileLockScrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      mobileSavedBodyStyles = {
        position: document.body.style.position,
        top: document.body.style.top,
        left: document.body.style.left,
        right: document.body.style.right,
        width: document.body.style.width,
        overflow: document.body.style.overflow,
        overscrollBehavior: document.body.style.overscrollBehavior
      };
      mobileSavedHtmlStyles = {
        overflow: document.documentElement.style.overflow,
        overscrollBehavior: document.documentElement.style.overscrollBehavior
      };
      mobileViewportBaseHeight = getMobileLayoutHeight();
      setMobileKeyboardMetrics();
      mobileLockActive = true;
      document.documentElement.style.setProperty("--ai-shop-scroll-lock-top", `-${mobileLockScrollY}px`);
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.overscrollBehavior = "none";
      document.body.style.position = "fixed";
      document.body.style.top = `-${mobileLockScrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.body.style.overscrollBehavior = "none";
      document.documentElement.classList.add("ai-shop-page-locked");
      document.body.classList.add("ai-shop-page-locked");
    };

    const unlockMobilePage = () => {
      if (!mobileLockActive) {
        document.documentElement.style.removeProperty("--ai-shop-mobile-viewport-height");
        document.documentElement.style.removeProperty("--ai-shop-keyboard-offset");
        mobileViewportBaseHeight = 0;
        return;
      }
      const restoreY = mobileLockScrollY;
      mobileLockActive = false;
      document.documentElement.classList.remove("ai-shop-page-locked");
      document.body.classList.remove("ai-shop-page-locked");
      document.documentElement.style.removeProperty("--ai-shop-scroll-lock-top");
      document.documentElement.style.removeProperty("--ai-shop-mobile-viewport-height");
      document.documentElement.style.removeProperty("--ai-shop-keyboard-offset");
      if (mobileSavedHtmlStyles) {
        document.documentElement.style.overflow = mobileSavedHtmlStyles.overflow;
        document.documentElement.style.overscrollBehavior = mobileSavedHtmlStyles.overscrollBehavior;
      }
      if (mobileSavedBodyStyles) {
        document.body.style.position = mobileSavedBodyStyles.position;
        document.body.style.top = mobileSavedBodyStyles.top;
        document.body.style.left = mobileSavedBodyStyles.left;
        document.body.style.right = mobileSavedBodyStyles.right;
        document.body.style.width = mobileSavedBodyStyles.width;
        document.body.style.overflow = mobileSavedBodyStyles.overflow;
        document.body.style.overscrollBehavior = mobileSavedBodyStyles.overscrollBehavior;
      }
      mobileSavedBodyStyles = null;
      mobileSavedHtmlStyles = null;
      mobileViewportBaseHeight = 0;
      instantScrollTo(restoreY);
    };

    const scheduleMobileKeyboardMetrics = () => {
      if (!widget.classList.contains("is-open") || !isMobileAssistant()) return;
      [0, 80, 180, 320].forEach((delay) => {
        window.setTimeout(() => {
          setMobileKeyboardMetrics();
          scrollMessages(messages);
          restoreMobileScroll();
        }, delay);
      });
    };

    const keepMobileAssistantStable = () => {
      if (!widget.classList.contains("is-open")) return;
      if (!isMobileAssistant()) {
        unlockMobilePage();
        return;
      }
      setMobileKeyboardMetrics();
      restoreMobileScroll();
    };

    const setOpen = (isOpen) => {
      widget.classList.toggle("is-open", isOpen);
      widget.setAttribute("aria-hidden", String(!isOpen));
      launcher.setAttribute("aria-expanded", String(isOpen));
      if (isOpen) {
        lockMobilePage();
        if (!isMobileAssistant()) {
          try {
            input.focus({ preventScroll: true });
          } catch (error) {
            input.focus();
          }
        }
        scrollMessages(messages);
      } else {
        unlockMobilePage();
      }
    };

    const getContext = () => {
      const allProducts = options.getProducts ? options.getProducts() || [] : [];
      const visibleProducts = options.getVisibleProducts ? options.getVisibleProducts() || [] : [];
      const featured = allProducts.filter((product) => product.is_featured || product.is_promo);
      const products = mergeProducts([visibleProducts.slice(0, 8), featured.slice(0, 6), allProducts.slice(0, 8)])
        .slice(0, 16)
        .map((product) => normalizeProductForContext(product, options.getCategoryLabel));

      return {
        store: config.STORE_NAME || "Maison Max",
        currency: config.CURRENCY || "FCFA",
        city: config.DEFAULT_CITY || "Dakar",
        selectedCategory: options.getSelectedCategory ? options.getSelectedCategory() : "all",
        site: getSiteContext(allProducts, options),
        products
      };
    };

    const sendMessage = async (content) => {
      const message = String(content || "").trim();
      if (!message) return;
      input.value = "";
      history.push({ role: "user", content: message });
      messages.appendChild(createMessage("user", message));
      const pending = createMessage("assistant", "Je prepare une reponse claire...");
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
    input.addEventListener(window.PointerEvent ? "pointerdown" : "touchstart", focusMobileInputWithoutScroll, {
      passive: false
    });
    input.addEventListener("focus", () => {
      lockMobilePage();
      keepMobileAssistantStable();
      scheduleMobileKeyboardMetrics();
    });
    input.addEventListener("blur", () => {
      window.setTimeout(() => {
        if (mobileLockActive) {
          setMobileKeyboardMetrics();
          restoreMobileScroll();
        }
      }, 120);
    });
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
    document.addEventListener(
      "touchmove",
      (event) => {
        if (!mobileLockActive || !isMobileAssistant()) return;
        if (messages.contains(event.target)) return;
        if (event.cancelable) event.preventDefault();
        restoreMobileScroll();
      },
      { passive: false }
    );
    let messagesTouchY = 0;
    messages.addEventListener(
      "touchstart",
      (event) => {
        messagesTouchY = event.touches?.[0]?.clientY || 0;
      },
      { passive: true }
    );
    messages.addEventListener(
      "touchmove",
      (event) => {
        if (!mobileLockActive || !isMobileAssistant()) return;
        const currentY = event.touches?.[0]?.clientY || messagesTouchY;
        const deltaY = currentY - messagesTouchY;
        const canScroll = messages.scrollHeight > messages.clientHeight;
        const atTop = messages.scrollTop <= 0;
        const atBottom = messages.scrollTop + messages.clientHeight >= messages.scrollHeight - 1;
        if (!canScroll || (atTop && deltaY > 0) || (atBottom && deltaY < 0)) {
          if (event.cancelable) event.preventDefault();
          restoreMobileScroll();
        }
        messagesTouchY = currentY;
      },
      { passive: false }
    );
    window.addEventListener("resize", keepMobileAssistantStable, { passive: true });
    window.addEventListener("scroll", keepMobileAssistantStable, { passive: true });
    window.visualViewport?.addEventListener("resize", keepMobileAssistantStable, { passive: true });
    window.visualViewport?.addEventListener("scroll", keepMobileAssistantStable, { passive: true });
    if (mobileAssistantQuery.addEventListener) {
      mobileAssistantQuery.addEventListener("change", keepMobileAssistantStable);
    } else {
      mobileAssistantQuery.addListener(keepMobileAssistantStable);
    }
  };

  const generateProductCopy = async (payload) => {
    const data = await request("admin-product-copy", payload);
    return data.suggestion || {};
  };

  window.MMAI = {
    request,
    initShopAssistant,
    generateProductCopy
  };
})();
