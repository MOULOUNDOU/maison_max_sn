const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "openai/gpt-4o-mini";
const MAX_MESSAGES = 8;
const MAX_PRODUCTS = 12;
const OPENROUTER_TIMEOUT_MS = Number(process.env.OPENROUTER_TIMEOUT_MS || 18000);

const cleanText = (value, max = 1200) =>
  String(value == null ? "" : value)
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);

const cleanArray = (items, maxItems = 8, maxText = 60) =>
  Array.isArray(items) ? items.map((item) => cleanText(item, maxText)).filter(Boolean).slice(0, maxItems) : [];

const cleanAssistantReply = (value) =>
  cleanText(value, 1200)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\*\*/g, "")
    .replace(/[`*_#>]/g, "")
    .replace(/[•●◆▪️]/g, "-")
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/(\d)\s*(FHA|FFA|CFA|XOF|FCFA)\b/gi, "$1 FCFA")
    .replace(/\b(FHA|FFA|CFA|XOF|FCFA)\b/gi, "FCFA")
    .replace(/\s+-\s+/g, ". ")
    .replace(/\s{2,}/g, " ")
    .trim();

const json = (statusCode, body, headers = {}) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    ...headers
  },
  body: JSON.stringify(body)
});

const normalizeOrigin = (origin) => String(origin || "").replace(/\/+$/, "");

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  const normalized = normalizeOrigin(origin);
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalized)) return true;
  try {
    const { protocol, hostname } = new URL(normalized);
    const host = hostname.replace(/^\[|\]$/g, "");
    if (
      protocol.startsWith("http") &&
      ["localhost", "127.0.0.1", "0.0.0.0", "::1"].includes(host)
    ) {
      return true;
    }
  } catch (error) {
    // Continue with configured origins.
  }

  const allowed = [
    "https://maisonmax.sn",
    process.env.SITE_URL,
    process.env.URL,
    process.env.DEPLOY_URL,
    process.env.DEPLOY_PRIME_URL,
    process.env.OPENROUTER_ALLOWED_ORIGIN
  ]
    .map(normalizeOrigin)
    .filter(Boolean);

  const variants = new Set(allowed);
  allowed.forEach((value) => {
    try {
      const url = new URL(value);
      if (url.hostname.startsWith("www.")) {
        url.hostname = url.hostname.replace(/^www\./, "");
      } else {
        url.hostname = `www.${url.hostname}`;
      }
      variants.add(normalizeOrigin(url.toString()));
    } catch (error) {
      // Ignore non-URL values.
    }
  });

  return variants.has(normalized);
};

const corsHeaders = (event) => {
  const origin = event.headers.origin || event.headers.Origin || "";
  if (!isAllowedOrigin(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };
};

const parseBody = (event) => {
  try {
    return JSON.parse(event.body || "{}");
  } catch (error) {
    const invalid = new Error("Requete JSON invalide.");
    invalid.statusCode = 400;
    throw invalid;
  }
};

const sanitizeMessages = (messages) => {
  if (!Array.isArray(messages)) return [];
  return messages
    .slice(-MAX_MESSAGES)
    .map((message) => ({
      role: message.role === "assistant" ? "assistant" : "user",
      content: cleanText(message.content, 1000)
    }))
    .filter((message) => message.content);
};

const sanitizeProduct = (product) => {
  const item = product || {};
  return {
    name: cleanText(item.name, 140),
    category: cleanText(item.category_label || item.category, 80),
    price: Number(item.price || 0),
    sizes: cleanArray(item.sizes),
    colors: cleanArray(item.colors),
    short_description: cleanText(item.short_description, 140)
  };
};

const getProductContext = (context = {}) => ({
  store: cleanText(context.store || "Maison Max", 80),
  currency: cleanText(context.currency || "FCFA", 20),
  city: cleanText(context.city || "Dakar", 80),
  selected_category: cleanText(context.selectedCategory || "all", 80),
  products: Array.isArray(context.products) ? context.products.map(sanitizeProduct).slice(0, MAX_PRODUCTS) : []
});

const titleCase = (value) =>
  cleanText(value, 120)
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const getFallbackAdminSuggestion = (payload = {}) => {
  const draft = payload.product || {};
  const name = cleanText(draft.name || draft.notes || "Produit Maison Max", 90);
  const category = cleanText(draft.category_label || draft.category, 60);
  const colors = cleanArray(draft.colors, 3).join(", ");
  const sizes = cleanArray(draft.sizes, 4).join(", ");
  const price = Number(draft.price || 0);
  const title = titleCase(name).slice(0, 90);
  const details = [category, colors ? `couleurs: ${colors}` : "", sizes ? `tailles: ${sizes}` : ""].filter(Boolean).join(", ");
  const priceText = price > 0 ? ` Prix: ${price} FCFA.` : "";
  return {
    title,
    short_description: cleanAssistantReply(`${title}, une piece elegante et facile a porter chez Maison Max.`).slice(0, 180),
    description: cleanAssistantReply(`${title} disponible chez Maison Max. ${details ? `Details: ${details}.` : ""}${priceText} Ideal pour completer une tenue avec style et simplicite.`).slice(0, 900)
  };
};

const normalizeLoose = (value) =>
  cleanText(value, 300)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const formatPrice = (value) => {
  const amount = Number(value || 0);
  return amount > 0 ? `${new Intl.NumberFormat("fr-FR").format(amount)} FCFA` : "";
};

const localShopReply = (payload = {}) => {
  const messages = sanitizeMessages(payload.messages);
  const last = normalizeLoose(messages[messages.length - 1]?.content || "");
  const context = getProductContext(payload.context || {});
  const products = context.products.filter((product) => product.name && product.price > 0).slice(0, MAX_PRODUCTS);
  if (!last || !products.length) return "";

  const budgetMatch = last.match(/(\d[\d\s]{2,})/);
  const budget = budgetMatch ? Number(budgetMatch[1].replace(/\s/g, "")) : 0;
  const categoryWords = {
    robe: ["robe", "robes"],
    homme: ["homme", "boubou", "chemise"],
    femme: ["femme", "robe", "ensemble"],
    enfant: ["enfant"],
    chaussure: ["chaussure", "chaussures"],
    sac: ["sac", "sacs"]
  };

  let candidates = products;
  Object.values(categoryWords).forEach((words) => {
    if (!words.some((word) => last.includes(word))) return;
    candidates = candidates.filter((product) => {
      const source = normalizeLoose(`${product.name} ${product.category} ${product.short_description}`);
      return words.some((word) => source.includes(word));
    });
  });

  if (budget > 0) {
    candidates = candidates.filter((product) => Number(product.price || 0) <= budget);
  }

  if (!candidates.length) candidates = products;
  candidates = candidates
    .slice()
    .sort((a, b) => {
      if (budget > 0) return Math.abs(a.price - budget) - Math.abs(b.price - budget);
      return a.price - b.price;
    })
    .slice(0, 2);

  if (!candidates.length) return "";
  const suggestions = candidates.map((product) => {
    const extras = [product.colors?.length ? product.colors.slice(0, 2).join(", ") : "", product.sizes?.length ? product.sizes.slice(0, 2).join(", ") : ""]
      .filter(Boolean)
      .join(", ");
    return `${product.name} a ${formatPrice(product.price)}${extras ? ` (${extras})` : ""}`;
  });

  const intro = budget > 0 ? `Pour ${formatPrice(budget)}, je conseille ` : "Je conseille ";
  return cleanAssistantReply(`${intro}${suggestions.join(" ou ")}. Vous voulez commander lequel?`);
};

const buildShopMessages = (payload) => {
  const context = getProductContext(payload.context || {});
  const messages = sanitizeMessages(payload.messages);

  return [
    {
      role: "system",
      content:
        "Tu es l'assistant de vente Maison Max. Reponds en francais simple, sans accents, sans emoji, sans Markdown. Maximum 35 mots. Utilise seulement les produits fournis. N'invente jamais prix, couleur, taille ou remise. Devise: FCFA. Donne 1 ou 2 suggestions. Une seule question courte maximum."
    },
    {
      role: "user",
      content: `Contexte boutique disponible:\n${JSON.stringify(context)}`
    },
    ...messages
  ];
};

const buildAdminMessages = (payload) => {
  const draft = payload.product || {};
  const product = {
    name: cleanText(draft.name, 140),
    category: cleanText(draft.category_label || draft.category, 80),
    subcategory: cleanText(draft.subcategory, 80),
    price: Number(draft.price || 0),
    old_price: draft.old_price == null ? null : Number(draft.old_price || 0),
    sizes: cleanArray(draft.sizes),
    colors: cleanArray(draft.colors),
    short_description: cleanText(draft.short_description, 260),
    description: cleanText(draft.description, 1200),
    notes: cleanText(draft.notes, 1000),
    mode: cleanText(payload.mode || "generate", 40)
  };
  const allowedFacts = [
    product.category ? `categorie: ${product.category}` : "",
    product.subcategory ? `sous-categorie: ${product.subcategory}` : "",
    product.price > 0 ? `prix: ${product.price} FCFA` : "",
    product.sizes.length ? `tailles: ${product.sizes.join(", ")}` : "",
    product.colors.length ? `couleurs: ${product.colors.join(", ")}` : "",
    product.notes ? `notes vendeur: ${product.notes}` : ""
  ]
    .filter(Boolean)
    .join("; ");

  return [
    {
      role: "system",
      content:
        "Tu aides Maison Max a rediger une fiche produit. Francais simple, vendeur, sans accents, sans emoji, sans Markdown. Utilise uniquement les faits fournis. N'invente jamais matiere, qualite, origine, entretien, livraison, tailles, couleurs, remise ou prix. Reponds uniquement avec JSON valide: {\"title\":\"...\",\"short_description\":\"...\",\"description\":\"...\"}. Texte court."
    },
    {
      role: "user",
      content: `Nom actuel: ${product.name || "Produit Maison Max"}\nFaits autorises: ${allowedFacts || "aucun detail supplementaire"}`
    }
  ];
};

const callOpenRouter = async ({ messages, maxTokens = 500, temperature = 0.45, responseFormat = null }) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    const missing = new Error("OPENROUTER_API_KEY n'est pas configure dans Netlify.");
    missing.statusCode = 503;
    throw missing;
  }

  const baseBody = {
    model: process.env.OPENROUTER_MODEL || DEFAULT_MODEL,
    messages,
    temperature,
    max_tokens: maxTokens
  };
  if (responseFormat) baseBody.response_format = responseFormat;

  const send = async (body) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), OPENROUTER_TIMEOUT_MS);
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.SITE_URL || process.env.URL || "https://maisonmax.sn",
        "X-Title": "Maison Max"
      },
      body: JSON.stringify(body),
      signal: controller.signal
    }).finally(() => clearTimeout(timeout));

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = data.error?.message || data.message || "OpenRouter n'a pas pu traiter la demande.";
      const error = new Error(message);
      error.statusCode = response.status;
      throw error;
    }

    const content = cleanText(data.choices?.[0]?.message?.content || "", 4000);
    if (!content) {
      const error = new Error("OpenRouter a renvoye une reponse vide.");
      error.statusCode = 204;
      throw error;
    }

    return content;
  };

  try {
    return await send(baseBody);
  } catch (error) {
    if (responseFormat && [204, 400, 422].includes(Number(error.statusCode))) {
      const fallbackBody = { ...baseBody };
      delete fallbackBody.response_format;
      return send(fallbackBody);
    }
    throw error;
  }
};

const parseSuggestion = (raw) => {
  const text = String(raw || "")
    .replace(/^```json/i, "")
    .replace(/^```/i, "")
    .replace(/```$/i, "")
    .trim();

  let parsed = null;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        parsed = JSON.parse(match[0]);
      } catch (innerError) {
        parsed = {};
      }
    }
  }

  return {
    title: cleanAssistantReply(parsed?.title).slice(0, 140),
    short_description: cleanAssistantReply(parsed?.short_description).slice(0, 220),
    description: cleanAssistantReply(parsed?.description).slice(0, 900)
  };
};

exports.handler = async (event) => {
  const headers = corsHeaders(event);

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return json(405, { error: "Methode non autorisee." }, headers);
  }

  const origin = event.headers.origin || event.headers.Origin || "";
  if (!isAllowedOrigin(origin)) {
    return json(403, { error: "Origine non autorisee." }, headers);
  }

  try {
    const body = parseBody(event);

    if (body.action === "shop-assistant") {
      const instant = localShopReply(body.payload || {});
      if (instant) return json(200, { message: instant, fallback: true }, headers);

      const content = await callOpenRouter({
        messages: buildShopMessages(body.payload || {}),
        maxTokens: 95,
        temperature: 0.25
      });
      return json(200, { message: cleanAssistantReply(content) }, headers);
    }

    if (body.action === "admin-product-copy") {
      const useRemoteAdmin = String(process.env.OPENROUTER_ADMIN_REMOTE || "").toLowerCase() === "true";
      if (!useRemoteAdmin) {
        return json(200, { suggestion: getFallbackAdminSuggestion(body.payload || {}), fallback: true }, headers);
      }

      try {
        const content = await callOpenRouter({
          messages: buildAdminMessages(body.payload || {}),
          maxTokens: 220,
          temperature: 0.28,
          responseFormat: { type: "json_object" }
        });
        const suggestion = parseSuggestion(content);
        if (suggestion.title || suggestion.short_description || suggestion.description) {
          return json(200, { suggestion }, headers);
        }
      } catch (error) {
        if (error.name !== "AbortError") throw error;
      }

      return json(200, { suggestion: getFallbackAdminSuggestion(body.payload || {}), fallback: true }, headers);
    }

    return json(400, { error: "Action IA inconnue." }, headers);
  } catch (error) {
    if (error.name === "AbortError") {
      return json(504, { error: "Le modele IA met trop de temps a repondre. Reessayez ou choisissez un autre modele OpenRouter." }, headers);
    }
    return json(error.statusCode || 500, { error: error.message || "Erreur IA inattendue." }, headers);
  }
};
