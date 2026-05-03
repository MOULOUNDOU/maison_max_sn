(function () {
  "use strict";

  const config = window.MAISON_MAX_CONFIG || {};
  const utils = window.MMUtils;
  const storageKey = "maison_max_cart";
  let cart = [];

  const loadCart = () => {
    try {
      cart = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (!Array.isArray(cart)) cart = [];
    } catch (error) {
      cart = [];
    }
  };

  const saveCart = () => {
    localStorage.setItem(storageKey, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("mm:cart-updated", { detail: { cart } }));
    renderCart();
  };

  const keyFor = (item) => `${item.slug || item.id}|${item.size || ""}|${item.color || ""}`;

  const add = (product, options = {}) => {
    const size = options.size || (product.sizes && product.sizes[0]) || "";
    const color = options.color || (product.colors && product.colors[0]) || "";
    const quantity = Math.max(1, Number(options.quantity || 1));
    const item = {
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: Number(product.price || 0),
      image: product.main_image || utils.fallbackImage,
      size,
      color,
      quantity
    };

    const existing = cart.find((entry) => keyFor(entry) === keyFor(item));
    if (existing) existing.quantity += quantity;
    else cart.push(item);

    saveCart();
    utils.toast("Produit ajoute au panier");
  };

  const remove = (key) => {
    cart = cart.filter((item) => keyFor(item) !== key);
    saveCart();
  };

  const updateQuantity = (key, quantity) => {
    const item = cart.find((entry) => keyFor(entry) === key);
    if (!item) return;
    item.quantity = Math.max(1, Number(quantity || 1));
    saveCart();
  };

  const clear = () => {
    cart = [];
    saveCart();
  };

  const count = () => cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const total = () => cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);

  const createCartItem = (item) => {
    const key = keyFor(item);
    const card = utils.createEl("article", { className: "cart-item" });
    const image = utils.createEl("img", {
      attrs: {
        src: item.image || utils.fallbackImage,
        alt: item.name,
        loading: "lazy"
      }
    });

    const info = utils.createEl("div", { className: "cart-item-info" });
    info.appendChild(utils.createEl("h4", { text: item.name }));

    const meta = utils.createEl("p", { className: "cart-item-meta" });
    const parts = [];
    if (item.size) parts.push(`Taille ${item.size}`);
    if (item.color) parts.push(item.color);
    meta.textContent = parts.join(" - ") || "Option standard";

    const price = utils.createEl("strong", { text: utils.formatPrice(item.price * item.quantity) });
    info.append(meta, price);

    const controls = utils.createEl("div", { className: "cart-item-controls" });
    const minus = utils.createEl("button", {
      className: "icon-btn small",
      attrs: { type: "button", "aria-label": "Reduire la quantite" }
    });
    minus.innerHTML = '<i class="fa-solid fa-minus"></i>';
    minus.addEventListener("click", () => updateQuantity(key, item.quantity - 1));

    const qty = utils.createEl("input", {
      attrs: { type: "number", min: "1", value: item.quantity, "aria-label": "Quantite" }
    });
    qty.addEventListener("change", () => updateQuantity(key, qty.value));

    const plus = utils.createEl("button", {
      className: "icon-btn small",
      attrs: { type: "button", "aria-label": "Augmenter la quantite" }
    });
    plus.innerHTML = '<i class="fa-solid fa-plus"></i>';
    plus.addEventListener("click", () => updateQuantity(key, item.quantity + 1));

    const del = utils.createEl("button", {
      className: "icon-btn danger small",
      attrs: { type: "button", "aria-label": "Supprimer le produit" }
    });
    del.innerHTML = '<i class="fa-solid fa-trash"></i>';
    del.addEventListener("click", () => remove(key));

    controls.append(minus, qty, plus, del);
    card.append(image, info, controls);
    return card;
  };

  const renderCart = () => {
    const itemCount = count();
    const countNodes = document.querySelectorAll("[data-cart-count]");
    countNodes.forEach((node) => {
      node.textContent = String(itemCount);
    });

    const summaryNodes = document.querySelectorAll("[data-cart-summary]");
    summaryNodes.forEach((node) => {
      node.textContent = `${itemCount} article${itemCount > 1 ? "s" : ""}`;
    });

    const totalNodes = document.querySelectorAll("[data-cart-total]");
    totalNodes.forEach((node) => {
      node.textContent = utils.formatPrice(total());
    });

    const cartList = document.querySelector("[data-cart-list]");
    const empty = document.querySelector("[data-cart-empty]");
    const checkout = document.querySelector("[data-whatsapp-checkout]");
    if (!cartList) return;

    cartList.replaceChildren();
    if (!cart.length) {
      cartList.hidden = true;
      empty && empty.removeAttribute("hidden");
      checkout && checkout.setAttribute("disabled", "disabled");
      return;
    }

    cartList.hidden = false;
    empty && empty.setAttribute("hidden", "hidden");
    checkout && checkout.removeAttribute("disabled");
    cart.forEach((item) => cartList.appendChild(createCartItem(item)));
  };

  const openCart = () => {
    document.body.classList.add("cart-open");
    const drawer = document.querySelector("[data-cart-drawer]");
    drawer && drawer.setAttribute("aria-hidden", "false");
  };

  const closeCart = () => {
    document.body.classList.remove("cart-open");
    const drawer = document.querySelector("[data-cart-drawer]");
    drawer && drawer.setAttribute("aria-hidden", "true");
  };

  const getSelectedCity = () => {
    const city = document.querySelector("[data-delivery-city]");
    return city ? city.value : "";
  };

  const generateMessage = () => {
    const lines = [`Bonjour, je souhaite commander sur ${config.STORE_NAME || "Maison Max"} :`, ""];

    cart.forEach((item, index) => {
      lines.push(`${index + 1}. ${item.name}`);
      lines.push(`   Taille : ${item.size || "A preciser"}`);
      lines.push(`   Couleur : ${item.color || "A preciser"}`);
      lines.push(`   Quantite : ${item.quantity}`);
      const unitPrice = utils.formatPrice(item.price);
      lines.push(
        `   Prix : ${unitPrice}${Number(item.quantity) > 1 ? ` x ${item.quantity}` : ""}`
      );
      lines.push("");
    });

    lines.push(`Total : ${utils.formatPrice(total())}`);
    lines.push("");
    lines.push("Nom :");
    lines.push("Adresse de livraison :");
    lines.push(`Ville : ${getSelectedCity() || ""}`);
    lines.push("Informations complementaires :");
    lines.push("");
    lines.push("Merci.");

    return lines.join("\n");
  };

  const checkoutWhatsApp = () => {
    if (!cart.length) {
      utils.toast("Votre panier est vide", "error");
      return;
    }

    const phone = String(config.WHATSAPP_NUMBER || "").replace(/\D/g, "");
    if (!phone) {
      utils.toast("Numero WhatsApp non configure", "error");
      return;
    }

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(generateMessage())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const bind = () => {
    document.querySelectorAll("[data-cart-open]").forEach((button) => {
      button.addEventListener("click", openCart);
    });

    document.querySelectorAll("[data-cart-close]").forEach((button) => {
      button.addEventListener("click", closeCart);
    });

    document.querySelectorAll("[data-whatsapp-checkout]").forEach((button) => {
      button.addEventListener("click", checkoutWhatsApp);
    });

    document.querySelectorAll("[data-clear-cart]").forEach((button) => {
      button.addEventListener("click", () => {
        if (cart.length && confirm("Vider le panier ?")) clear();
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeCart();
    });

    const overlay = document.querySelector("[data-cart-overlay]");
    overlay && overlay.addEventListener("click", closeCart);
  };

  loadCart();

  window.MMCart = {
    add,
    remove,
    updateQuantity,
    clear,
    count,
    total,
    renderCart,
    openCart,
    closeCart,
    generateMessage,
    checkoutWhatsApp,
    getItems: () => [...cart]
  };

  document.addEventListener("DOMContentLoaded", () => {
    bind();
    renderCart();
  });
})();
