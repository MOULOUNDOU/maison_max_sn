(function () {
  "use strict";

  const config = window.MAISON_MAX_CONFIG || {};
  const utils = window.MMUtils;
  const storageKey = "maison_max_cart";
  const defaultDeliveryCountry = "Sénégal";
  const africanCountries = [
    { code: "za", name: "Afrique du Sud" },
    { code: "dz", name: "Algérie" },
    { code: "ao", name: "Angola" },
    { code: "bj", name: "Bénin" },
    { code: "bw", name: "Botswana" },
    { code: "bf", name: "Burkina Faso" },
    { code: "bi", name: "Burundi" },
    { code: "cm", name: "Cameroun" },
    { code: "cv", name: "Cap-Vert" },
    { code: "km", name: "Comores" },
    { code: "cg", name: "Congo" },
    { code: "ci", name: "Côte d'Ivoire" },
    { code: "dj", name: "Djibouti" },
    { code: "eg", name: "Égypte" },
    { code: "er", name: "Érythrée" },
    { code: "sz", name: "Eswatini" },
    { code: "et", name: "Éthiopie" },
    { code: "ga", name: "Gabon" },
    { code: "gm", name: "Gambie" },
    { code: "gh", name: "Ghana" },
    { code: "gn", name: "Guinée" },
    { code: "gq", name: "Guinée équatoriale" },
    { code: "gw", name: "Guinée-Bissau" },
    { code: "ke", name: "Kenya" },
    { code: "ls", name: "Lesotho" },
    { code: "lr", name: "Liberia" },
    { code: "ly", name: "Libye" },
    { code: "mg", name: "Madagascar" },
    { code: "mw", name: "Malawi" },
    { code: "ml", name: "Mali" },
    { code: "ma", name: "Maroc" },
    { code: "mu", name: "Maurice" },
    { code: "mr", name: "Mauritanie" },
    { code: "mz", name: "Mozambique" },
    { code: "na", name: "Namibie" },
    { code: "ne", name: "Niger" },
    { code: "ng", name: "Nigeria" },
    { code: "ug", name: "Ouganda" },
    { code: "cf", name: "République centrafricaine" },
    { code: "cd", name: "République démocratique du Congo" },
    { code: "rw", name: "Rwanda" },
    { code: "st", name: "Sao Tomé-et-Principe" },
    { code: "sn", name: "Sénégal" },
    { code: "sc", name: "Seychelles" },
    { code: "sl", name: "Sierra Leone" },
    { code: "so", name: "Somalie" },
    { code: "sd", name: "Soudan" },
    { code: "ss", name: "Soudan du Sud" },
    { code: "tz", name: "Tanzanie" },
    { code: "td", name: "Tchad" },
    { code: "tg", name: "Togo" },
    { code: "tn", name: "Tunisie" },
    { code: "zm", name: "Zambie" },
    { code: "zw", name: "Zimbabwe" }
  ];
  const deliveryCitiesByCountry = {
    "Afrique du Sud": ["Johannesburg", "Le Cap", "Pretoria", "Durban", "Port Elizabeth", "Bloemfontein"],
    "Algérie": ["Alger", "Oran", "Constantine", "Annaba", "Blida", "Sétif"],
    "Angola": ["Luanda", "Benguela", "Huambo", "Lobito", "Lubango", "Cabinda"],
    "Bénin": ["Cotonou", "Porto-Novo", "Parakou", "Abomey-Calavi", "Bohicon", "Natitingou"],
    "Botswana": ["Gaborone", "Francistown", "Maun", "Molepolole", "Serowe", "Kanye"],
    "Burkina Faso": ["Ouagadougou", "Bobo-Dioulasso", "Koudougou", "Ouahigouya", "Banfora", "Fada N'Gourma"],
    "Burundi": ["Bujumbura", "Gitega", "Ngozi", "Rumonge", "Muyinga", "Ruyigi"],
    "Cameroun": ["Douala", "Yaoundé", "Bafoussam", "Garoua", "Bamenda", "Maroua"],
    "Cap-Vert": ["Praia", "Mindelo", "Santa Maria", "Assomada", "Espargos", "Tarrafal"],
    "Comores": ["Moroni", "Mutsamudu", "Fomboni", "Domoni", "Ouani", "Mitsamiouli"],
    "Congo": ["Brazzaville", "Pointe-Noire", "Dolisie", "Nkayi", "Ouesso", "Owando"],
    "Côte d'Ivoire": ["Abidjan", "Bouaké", "Yamoussoukro", "San Pedro", "Korhogo", "Daloa"],
    "Djibouti": ["Djibouti", "Ali Sabieh", "Tadjourah", "Dikhil", "Obock", "Arta"],
    "Égypte": ["Le Caire", "Alexandrie", "Gizeh", "Louxor", "Assouan", "Port-Saïd"],
    "Érythrée": ["Asmara", "Keren", "Massawa", "Assab", "Mendefera", "Barentu"],
    "Eswatini": ["Mbabane", "Manzini", "Lobamba", "Nhlangano", "Siteki", "Malkerns"],
    "Éthiopie": ["Addis-Abeba", "Dire Dawa", "Mekele", "Gondar", "Adama", "Bahir Dar"],
    "Gabon": ["Libreville", "Port-Gentil", "Franceville", "Oyem", "Moanda", "Lambaréné"],
    "Gambie": ["Banjul", "Serekunda", "Brikama", "Bakau", "Farafenni", "Basse Santa Su"],
    "Ghana": ["Accra", "Kumasi", "Tamale", "Takoradi", "Tema", "Cape Coast"],
    "Guinée": ["Conakry", "Kankan", "Labé", "Nzérékoré", "Kindia", "Mamou"],
    "Guinée équatoriale": ["Malabo", "Bata", "Ebebiyin", "Aconibe", "Luba", "Mongomo"],
    "Guinée-Bissau": ["Bissau", "Bafatá", "Gabú", "Cacheu", "Bolama", "Bissorã"],
    "Kenya": ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika"],
    "Lesotho": ["Maseru", "Teyateyaneng", "Mafeteng", "Hlotse", "Mohale's Hoek", "Quthing"],
    "Liberia": ["Monrovia", "Gbarnga", "Buchanan", "Kakata", "Voinjama", "Harper"],
    "Libye": ["Tripoli", "Benghazi", "Misrata", "Sabha", "Zawiya", "Tobrouk"],
    "Madagascar": ["Antananarivo", "Toamasina", "Antsirabe", "Mahajanga", "Fianarantsoa", "Toliara"],
    "Malawi": ["Lilongwe", "Blantyre", "Mzuzu", "Zomba", "Kasungu", "Mangochi"],
    "Mali": ["Bamako", "Sikasso", "Ségou", "Mopti", "Kayes", "Koutiala"],
    "Maroc": ["Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir"],
    "Maurice": ["Port-Louis", "Curepipe", "Quatre Bornes", "Vacoas-Phoenix", "Beau Bassin-Rose Hill", "Mahébourg"],
    "Mauritanie": ["Nouakchott", "Nouadhibou", "Kiffa", "Rosso", "Zouérat", "Atar"],
    "Mozambique": ["Maputo", "Matola", "Beira", "Nampula", "Chimoio", "Nacala"],
    "Namibie": ["Windhoek", "Walvis Bay", "Swakopmund", "Rundu", "Oshakati", "Keetmanshoop"],
    "Niger": ["Niamey", "Zinder", "Maradi", "Agadez", "Tahoua", "Dosso"],
    "Nigeria": ["Lagos", "Abuja", "Kano", "Ibadan", "Port Harcourt", "Benin City"],
    "Ouganda": ["Kampala", "Entebbe", "Jinja", "Mbarara", "Gulu", "Mbale"],
    "République centrafricaine": ["Bangui", "Bimbo", "Berbérati", "Carnot", "Bambari", "Bouar"],
    "République démocratique du Congo": ["Kinshasa", "Lubumbashi", "Mbuji-Mayi", "Kisangani", "Goma", "Bukavu"],
    "Rwanda": ["Kigali", "Butare", "Gisenyi", "Ruhengeri", "Kibuye", "Cyangugu"],
    "Sao Tomé-et-Principe": ["São Tomé", "Santo António", "Trindade", "Neves", "Guadalupe", "Santana"],
    "Sénégal": ["Dakar", "Thiès", "Saint-Louis", "Kaolack", "Touba", "Ziguinchor", "Mbour", "Rufisque"],
    "Seychelles": ["Victoria", "Beau Vallon", "Anse Royale", "Takamaka", "Cascade", "Bel Ombre"],
    "Sierra Leone": ["Freetown", "Bo", "Kenema", "Makeni", "Koidu", "Port Loko"],
    "Somalie": ["Mogadiscio", "Hargeisa", "Bosaso", "Kismayo", "Berbera", "Baidoa"],
    "Soudan": ["Khartoum", "Omdourman", "Port-Soudan", "Kassala", "El Obeid", "Wad Madani"],
    "Soudan du Sud": ["Juba", "Wau", "Malakal", "Yei", "Aweil", "Bor"],
    "Tanzanie": ["Dar es Salaam", "Dodoma", "Arusha", "Mwanza", "Zanzibar", "Mbeya"],
    "Tchad": ["N'Djamena", "Moundou", "Sarh", "Abéché", "Kélo", "Doba"],
    "Togo": ["Lomé", "Sokodé", "Kara", "Kpalimé", "Atakpamé", "Dapaong"],
    "Tunisie": ["Tunis", "Sfax", "Sousse", "Kairouan", "Bizerte", "Gabès"],
    "Zambie": ["Lusaka", "Ndola", "Kitwe", "Livingstone", "Kabwe", "Chingola"],
    "Zimbabwe": ["Harare", "Bulawayo", "Chitungwiza", "Mutare", "Gweru", "Kwekwe"]
  };
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
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty("--scrollbar-width", scrollbarWidth + "px");
    document.body.classList.add("cart-open");
    const drawer = document.querySelector("[data-cart-drawer]");
    drawer && drawer.setAttribute("aria-hidden", "false");
  };

  const closeCart = () => {
    document.body.classList.remove("cart-open");
    document.documentElement.style.setProperty("--scrollbar-width", "0px");
    const drawer = document.querySelector("[data-cart-drawer]");
    drawer && drawer.setAttribute("aria-hidden", "true");
  };

  const getSelectedCity = () => {
    const city = document.querySelector("[data-delivery-city]");
    return city ? city.value : "";
  };

  const getSelectedCountry = () => {
    const country = document.querySelector("[data-delivery-country]");
    return country ? country.value : defaultDeliveryCountry;
  };

  const getDeliveryCities = (countryName) => deliveryCitiesByCountry[countryName] || [];

  const populateDeliveryCities = (countryName = getSelectedCountry()) => {
    const cities = getDeliveryCities(countryName);
    document.querySelectorAll("[data-delivery-city]").forEach((select) => {
      select.replaceChildren();
      select.required = true;
      cities.forEach((city, index) => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        if (index === 0) option.selected = true;
        select.appendChild(option);
      });
      select.disabled = !cities.length;
      select.setCustomValidity(cities.length ? "" : "Aucune ville disponible pour ce pays.");
    });
  };

  const validateDeliverySelection = () => {
    const country = getSelectedCountry();
    const city = getSelectedCity();
    const cities = getDeliveryCities(country);
    const citySelect = document.querySelector("[data-delivery-city]");
    const isKnownCountry = africanCountries.some((item) => item.name === country);
    const isValidCity = Boolean(city) && cities.includes(city);

    if (!isKnownCountry) {
      utils.toast("Choisissez un pays africain valide.", "error");
      return false;
    }

    if (!isValidCity) {
      citySelect?.setCustomValidity("Choisissez une ville valide pour le pays sélectionné.");
      citySelect?.reportValidity();
      utils.toast("Choisissez une ville valide pour le pays sélectionné.", "error");
      return false;
    }

    citySelect?.setCustomValidity("");
    return true;
  };

  const getFlagUrl = (country) => `https://flagcdn.com/w40/${country.code}.png`;

  const closeCountryPickers = (except = null) => {
    document.querySelectorAll("[data-country-picker]").forEach((picker) => {
      if (picker === except) return;
      picker.classList.remove("is-open");
      picker.querySelector(".country-select-button")?.setAttribute("aria-expanded", "false");
    });
  };

  const updateCountryPicker = (select, picker, country) => {
    const button = picker.querySelector(".country-select-button");
    const flag = picker.querySelector("[data-country-flag]");
    const name = picker.querySelector("[data-country-name]");

    select.value = country.name;
    if (flag) {
      flag.src = getFlagUrl(country);
      flag.alt = `Drapeau ${country.name}`;
    }
    if (name) name.textContent = country.name;
    picker.querySelectorAll("[data-country-option]").forEach((option) => {
      const isSelected = option.dataset.countryOption === country.name;
      option.classList.toggle("is-selected", isSelected);
      option.setAttribute("aria-selected", isSelected ? "true" : "false");
    });
    populateDeliveryCities(country.name);
    button?.focus();
  };

  const populateDeliveryCountries = () => {
    document.querySelectorAll("[data-delivery-country]").forEach((select) => {
      const current = select.value || defaultDeliveryCountry;
      const selectedCountry = africanCountries.find((country) => country.name === current) ||
        africanCountries.find((country) => country.name === defaultDeliveryCountry) ||
        africanCountries[0];

      select.replaceChildren();
      africanCountries.forEach((country) => {
        const option = document.createElement("option");
        option.value = country.name;
        option.textContent = country.name;
        if (country.name === selectedCountry.name) option.selected = true;
        select.appendChild(option);
      });
      select.classList.add("country-native-select");
      select.setAttribute("tabindex", "-1");
      select.setAttribute("aria-hidden", "true");

      const existingPicker = select.parentElement?.querySelector("[data-country-picker]");
      existingPicker && existingPicker.remove();

      const picker = document.createElement("div");
      picker.className = "country-select";
      picker.dataset.countryPicker = "true";

      const button = document.createElement("button");
      button.className = "country-select-button";
      button.type = "button";
      button.setAttribute("aria-haspopup", "listbox");
      button.setAttribute("aria-expanded", "false");
      button.innerHTML = `
        <img data-country-flag src="${getFlagUrl(selectedCountry)}" alt="Drapeau ${selectedCountry.name}" loading="lazy" />
        <span data-country-name>${selectedCountry.name}</span>
        <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
      `;

      const menu = document.createElement("div");
      menu.className = "country-select-menu";
      menu.setAttribute("role", "listbox");
      menu.setAttribute("aria-label", "Pays africains");

      africanCountries.forEach((country) => {
        const optionButton = document.createElement("button");
        optionButton.className = country.name === selectedCountry.name ? "country-select-option is-selected" : "country-select-option";
        optionButton.type = "button";
        optionButton.dataset.countryOption = country.name;
        optionButton.setAttribute("role", "option");
        optionButton.setAttribute("aria-selected", country.name === selectedCountry.name ? "true" : "false");
        optionButton.innerHTML = `
          <img src="${getFlagUrl(country)}" alt="Drapeau ${country.name}" loading="lazy" />
          <span>${country.name}</span>
        `;
        optionButton.addEventListener("click", () => {
          updateCountryPicker(select, picker, country);
          closeCountryPickers();
        });
        menu.appendChild(optionButton);
      });

      button.addEventListener("click", () => {
        const willOpen = !picker.classList.contains("is-open");
        closeCountryPickers(picker);
        picker.classList.toggle("is-open", willOpen);
        button.setAttribute("aria-expanded", willOpen ? "true" : "false");
      });

      button.addEventListener("keydown", (event) => {
        if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          closeCountryPickers(picker);
          picker.classList.add("is-open");
          button.setAttribute("aria-expanded", "true");
          menu.querySelector(".country-select-option")?.focus();
        }
      });

      menu.addEventListener("keydown", (event) => {
        const options = [...menu.querySelectorAll(".country-select-option")];
        const index = options.indexOf(document.activeElement);
        if (event.key === "Escape") {
          closeCountryPickers();
          button.focus();
        }
        if (event.key === "ArrowDown") {
          event.preventDefault();
          options[Math.min(index + 1, options.length - 1)]?.focus();
        }
        if (event.key === "ArrowUp") {
          event.preventDefault();
          options[Math.max(index - 1, 0)]?.focus();
        }
      });

      picker.append(button, menu);
      select.insertAdjacentElement("afterend", picker);
      populateDeliveryCities(selectedCountry.name);
    });
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
    lines.push(`Pays : ${getSelectedCountry() || defaultDeliveryCountry}`);
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

    if (!validateDeliverySelection()) return;

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
      if (event.key === "Escape") closeCountryPickers();
      if (event.key === "Escape") closeCart();
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest("[data-country-picker]")) closeCountryPickers();
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
    populateDeliveryCountries();
    bind();
    renderCart();
  });
})();
