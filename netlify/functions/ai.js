const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "openai/gpt-4o-mini";
const MAX_MESSAGES = 6;
const MAX_PRODUCTS = 16;
const OPENROUTER_TIMEOUT_MS = Number(process.env.OPENROUTER_TIMEOUT_MS || 20000);

const cleanText = (value, max = 1200) =>
  String(value == null ? "" : value)
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);

const cleanFormattedText = (value, max = 1600) =>
  String(value == null ? "" : value)
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);

const cleanArray = (items, maxItems = 8, maxText = 60) =>
  Array.isArray(items) ? items.map((item) => cleanText(item, maxText)).filter(Boolean).slice(0, maxItems) : [];

const normalizeMatchText = (value) =>
  cleanText(value, 2400)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const ADMIN_PRODUCT_TYPES = [
  { key: "pantalon", label: "pantalon", patterns: [/\bpantalons?\b/] },
  { key: "robe", label: "robe", patterns: [/(?<!garde[-\s])\brobes?\b/] },
  { key: "boubou", label: "boubou", patterns: [/\bboubous?\b/] },
  { key: "ensemble", label: "ensemble", patterns: [/\bensembles\b/, /\bensemble\s+(hommes?|femmes?|enfants?|mixte)\b/] },
  { key: "chemise", label: "chemise", patterns: [/\bchemises?\b/] },
  { key: "chaussure", label: "chaussure", patterns: [/\bchaussures?\b/, /\bbaskets?\b/, /\bsandales?\b/, /\bmocassins?\b/] },
  { key: "sac", label: "sac", patterns: [/\bsacs?\b/, /\bpochettes?\b/] },
  { key: "accessoire", label: "accessoire", patterns: [/\baccessoires?\b/, /\bbijoux?\b/, /\bceintures?\b/, /\bmontres?\b/] },
  { key: "jupe", label: "jupe", patterns: [/\bjupes?\b/] },
  { key: "foulard", label: "foulard", patterns: [/\bfoulards?\b/, /\bvoiles?\b/] },
  { key: "caftan", label: "caftan", patterns: [/\bcaftans?\b/, /\bkaftans?\b/] },
  { key: "tailleur", label: "tailleur", patterns: [/\btailleurs?\b/] },
  { key: "tshirt", label: "t-shirt", patterns: [/\bt[- ]?shirts?\b/, /\btee[- ]?shirts?\b/] }
];

const ADMIN_AUDIENCES = [
  { key: "homme", label: "homme", patterns: [/\bhommes?\b/, /\bmasculin(?:s|es|e)?\b/] },
  { key: "femme", label: "femme", patterns: [/\bfemmes?\b/, /\bdames?\b/, /\bfeminin(?:s|es|e)?\b/] },
  { key: "enfant", label: "enfant", patterns: [/\benfants?\b/, /\bfilles?\b/, /\bgarcons?\b/, /\bbebes?\b/] },
  { key: "mixte", label: "mixte", patterns: [/\bmixte\b/, /\bunisex(?:e)?\b/] }
];

const ruleMatches = (rule, value) => {
  const text = normalizeMatchText(value);
  return Boolean(text && rule.patterns.some((pattern) => pattern.test(text)));
};

const detectRule = (rules, value) => rules.find((rule) => ruleMatches(rule, value)) || null;

const detectRuleInFields = (rules, fields = []) => {
  for (const field of fields) {
    const match = detectRule(rules, field);
    if (match) return match;
  }
  return null;
};

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

const cleanShopReply = (value) =>
  cleanFormattedText(value, 1600)
    .replace(/[`_#>]/g, "")
    .replace(/[•●◆▪️]/g, "-")
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/(\d)\s*(FHA|FFA|CFA|XOF|FCFA)\b/gi, "$1 FCFA")
    .replace(/\b(FHA|FFA|CFA|XOF|FCFA)\b/gi, "FCFA")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\s+-\s+(?=\*\*|[A-ZÀ-ÖØ-Ý0-9])/g, "\n- ")
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
    "https://maison-max.com",
    "https://www.maison-max.com",
    "https://maisonmax.sn",
    "https://www.maisonmax.sn",
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
    slug: cleanText(item.slug, 140),
    category: cleanText(item.category_label || item.category, 80),
    price: Number(item.price || 0),
    old_price: item.old_price == null ? null : Number(item.old_price || 0),
    sizes: cleanArray(item.sizes),
    colors: cleanArray(item.colors),
    short_description: cleanText(item.short_description, 180),
    is_available: item.is_available !== false
  };
};

const getProductContext = (context = {}) => ({
  store: cleanText(context.store || "Maison Max", 80),
  currency: cleanText(context.currency || "FCFA", 20),
  city: cleanText(context.city || "Dakar", 80),
  selected_category: cleanText(context.selectedCategory || "all", 80),
  site: {
    whatsapp: cleanText(context.site?.whatsapp || "", 40),
    current_page: cleanText(context.site?.current_page || "", 120),
    current_path: cleanText(context.site?.current_path || "", 120),
    categories: cleanArray(context.site?.categories, 24, 60),
    delivery_zones: cleanArray(context.site?.delivery_zones, 32, 80),
    services: cleanArray(context.site?.services, 12, 180),
    pages: cleanArray(context.site?.pages, 12, 120),
    checkout: cleanText(context.site?.checkout, 260),
    payment: cleanText(context.site?.payment, 220),
    support: cleanText(context.site?.support, 220)
  },
  products: Array.isArray(context.products) ? context.products.map(sanitizeProduct).slice(0, MAX_PRODUCTS) : []
});

const buildShopMessages = (payload) => {
  const context = getProductContext(payload.context || {});
  const messages = sanitizeMessages(payload.messages);

  return [
    {
      role: "system",
      content:
        "Tu es l'assistant conversationnel Maison Max, dans le style d'un vrai chat utile et naturel. Reponds toujours de facon improvisee selon le message du client et le contexte fourni, jamais avec une reponse toute faite. Tu peux saluer, discuter, expliquer le site, aider a naviguer, conseiller sur panier, commande WhatsApp, livraison, paiement, categories et produits. Pour les produits, prix, tailles, couleurs, remises et disponibilites, utilise uniquement les donnees fournies. Si une information manque, dis-le simplement et propose de confirmer sur WhatsApp. Reponds en francais naturel, avec accents, sans emoji. Reste concis sauf si le client demande des details. Format: quand la reponse contient plusieurs idees, commence par une phrase courte, puis mets les titres de section en liste, un item par ligne, avec le titre en gras. Exemple: - **Livraison** : details. - **Paiement** : details. N'utilise pas de paragraphes longs quand une liste est plus claire."
    },
    {
      role: "user",
      content: `Contexte boutique disponible:\n${JSON.stringify(context)}`
    },
    ...messages
  ];
};

const buildAdminProduct = (payload = {}) => {
  const draft = payload.product || {};
  const categoryKey = cleanText(draft.category, 80);
  const categoryLabel = categoryKey ? cleanText(draft.category_label, 80) : "";
  const category = cleanText(categoryLabel || categoryKey, 80);
  return {
    name: cleanText(draft.name, 140),
    category,
    category_key: categoryKey,
    category_label: categoryLabel,
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
};

const getAdminProductSignals = (product) => {
  const explicitFields = [
    product.notes,
    product.name,
    product.subcategory,
    product.short_description,
    product.description
  ];
  const categoryFields = [product.category_key, product.category, product.category_label];
  const explicitType = detectRuleInFields(ADMIN_PRODUCT_TYPES, explicitFields);
  const categoryType = detectRuleInFields(ADMIN_PRODUCT_TYPES, categoryFields);
  const explicitAudience = detectRuleInFields(ADMIN_AUDIENCES, explicitFields);
  const categoryAudience = detectRuleInFields(ADMIN_AUDIENCES, categoryFields);

  return {
    expectedType: explicitType || categoryType,
    expectedAudience: explicitAudience || categoryAudience,
    explicitType,
    categoryType,
    explicitAudience,
    categoryAudience,
    hasCategoryConflict: Boolean(
      (explicitType && categoryType && explicitType.key !== categoryType.key) ||
        (explicitAudience && categoryAudience && explicitAudience.key !== categoryAudience.key)
    )
  };
};

const buildAdminMessages = (payload, options = {}) => {
  const product = options.product || buildAdminProduct(payload);
  const signals = getAdminProductSignals(product);
  const includeCategory = product.category && !signals.hasCategoryConflict;
  const forbiddenTypes = signals.expectedType
    ? ADMIN_PRODUCT_TYPES.filter((rule) => rule.key !== signals.expectedType.key)
        .map((rule) => rule.label)
        .join(", ")
    : "";
  const forbiddenAudiences =
    signals.expectedAudience && signals.expectedAudience.key !== "mixte"
      ? ADMIN_AUDIENCES.filter((rule) => ![signals.expectedAudience.key, "mixte"].includes(rule.key))
          .map((rule) => rule.label)
          .join(", ")
      : "";

  const constraints = [
    signals.expectedType ? `type produit obligatoire: ${signals.expectedType.label}` : "",
    signals.expectedAudience ? `public obligatoire: ${signals.expectedAudience.label}` : "",
    forbiddenTypes ? `types interdits dans la reponse: ${forbiddenTypes}` : "",
    forbiddenAudiences ? `publics interdits dans la reponse: ${forbiddenAudiences}` : "",
    "matiere, tissu, origine, marque, entretien, livraison, taille, couleur, remise et prix: uniquement si fournis dans les faits"
  ]
    .filter(Boolean)
    .join("\n- ");

  const allowedFacts = [
    product.name ? `nom actuel: ${product.name}` : "",
    includeCategory ? `categorie: ${product.category}` : "",
    product.subcategory ? `sous-categorie: ${product.subcategory}` : "",
    product.price > 0 ? `prix: ${product.price} FCFA` : "",
    product.old_price && product.old_price > product.price ? `ancien prix: ${product.old_price} FCFA` : "",
    product.sizes.length ? `tailles: ${product.sizes.join(", ")}` : "",
    product.colors.length ? `couleurs: ${product.colors.join(", ")}` : "",
    product.short_description ? `description courte actuelle: ${product.short_description}` : "",
    product.description ? `description actuelle: ${product.description}` : "",
    product.notes ? `details vendeur: ${product.notes}` : ""
  ]
    .filter(Boolean)
    .join("; ");

  const messages = [
    {
      role: "system",
      content:
        "Tu es le redacteur produit intelligent de Maison Max. Francais simple, vendeur, naturel, sans accents, sans emoji, sans Markdown. Improvise comme un vrai assistant: transforme les details vendeur en titre commercial, accroche et description naturelle, sans phrase generique de secours. Regles absolues: si un type produit obligatoire est donne, le titre doit contenir ce type exact et toute la fiche doit parler de ce type. Si le type est pantalon, n'ecris jamais robe, boubou, chemise, chaussure, sac ou autre type. Si un public obligatoire est donne, n'ecris jamais un autre public. Les details vendeur et le nom actuel priment sur une categorie contradictoire. N'invente jamais matiere, tissu, origine, marque, entretien, livraison, taille, couleur, remise ou prix non fournis. Tu peux utiliser un ton vendeur et des adjectifs de style quand ils ne changent pas les faits du produit. Titre: 4 a 9 mots. Description courte: 16 a 28 mots. Description longue: 45 a 75 mots. Reponds uniquement avec JSON valide: {\"title\":\"...\",\"short_description\":\"...\",\"description\":\"...\"}."
    },
    {
      role: "user",
      content: `Mode: ${product.mode === "improve" ? "ameliorer une fiche existante" : "generer une nouvelle fiche"}\nContraintes obligatoires:\n- ${constraints || "respecter uniquement les faits fournis"}\nFaits disponibles: ${allowedFacts || "aucun detail supplementaire"}`
    }
  ];

  if (options.retryReason) {
    messages.push(
      {
        role: "assistant",
        content: cleanText(JSON.stringify(options.previousSuggestion || {}), 1000)
      },
      {
        role: "user",
        content: `La proposition precedente est invalide: ${cleanText(options.retryReason, 260)}. Regenere une nouvelle proposition. Reponds uniquement avec le JSON corrige.`
      }
    );
  }

  return messages;
};

const getOpenRouterKey = () =>
  String(process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_KEY || "")
    .trim()
    .replace(/^Bearer\s+/i, "");

const getModelFallbacks = (preferredModel) =>
  [
    cleanText(preferredModel, 120),
    cleanText(process.env.OPENROUTER_FALLBACK_MODEL, 120),
    DEFAULT_MODEL,
    cleanText(process.env.OPENROUTER_MODEL, 120)
  ].filter(Boolean);

const uniqueModels = (models) => [...new Set(models)];

const callOpenRouter = async ({ messages, maxTokens = 500, temperature = 0.45, responseFormat = null, model = DEFAULT_MODEL }) => {
  const apiKey = getOpenRouterKey();
  if (!apiKey) {
    const missing = new Error("OPENROUTER_API_KEY n'est pas configure dans Netlify.");
    missing.statusCode = 503;
    throw missing;
  }

  const baseBody = {
    model,
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
        "HTTP-Referer": process.env.SITE_URL || process.env.URL || "https://maison-max.com",
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

  const retryable = (error) => {
    const statusCode = Number(error.statusCode || 0);
    return [429, 500, 502, 503, 504].includes(statusCode) || /provider|rate|limit|temporarily/i.test(error.message || "");
  };

  const models = uniqueModels(getModelFallbacks(model));
  let lastError = null;

  for (const modelName of models) {
    try {
      return await send({ ...baseBody, model: modelName });
    } catch (error) {
      lastError = error;
      if (!retryable(error)) break;
    }
  }

  if (lastError && responseFormat && [204, 400, 422].includes(Number(lastError.statusCode))) {
    for (const modelName of models) {
      const fallbackBody = { ...baseBody };
      delete fallbackBody.response_format;
      try {
        return await send({ ...fallbackBody, model: modelName });
      } catch (error) {
        lastError = error;
        if (!retryable(error)) break;
      }
    }
  }

  throw lastError || new Error("OpenRouter n'a pas pu traiter la demande.");
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

const hasAdminSuggestion = (suggestion) =>
  Boolean(suggestion?.title || suggestion?.short_description || suggestion?.description);

const validateAdminSuggestion = (suggestion, product) => {
  if (!hasAdminSuggestion(suggestion)) return "aucune proposition exploitable";

  const signals = getAdminProductSignals(product);
  const combined = [suggestion.title, suggestion.short_description, suggestion.description].join(" ");

  if (signals.expectedType) {
    if (!ruleMatches(signals.expectedType, suggestion.title)) {
      return `le titre doit contenir le type ${signals.expectedType.label}`;
    }
    const wrongType = ADMIN_PRODUCT_TYPES.find(
      (rule) => rule.key !== signals.expectedType.key && ruleMatches(rule, combined)
    );
    if (wrongType) {
      return `la fiche parle de ${wrongType.label} au lieu de ${signals.expectedType.label}`;
    }
  }

  if (signals.expectedAudience && signals.expectedAudience.key !== "mixte") {
    if (!ruleMatches(signals.expectedAudience, combined)) {
      return `la fiche doit parler du public ${signals.expectedAudience.label}`;
    }
    const wrongAudience = ADMIN_AUDIENCES.find(
      (rule) => ![signals.expectedAudience.key, "mixte"].includes(rule.key) && ruleMatches(rule, combined)
    );
    if (wrongAudience) {
      return `la fiche parle du public ${wrongAudience.label} au lieu de ${signals.expectedAudience.label}`;
    }
  }

  return "";
};

const titleCaseAdmin = (value) =>
  cleanText(value, 80)
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const ensureAdminTitleSignals = (suggestion, product) => {
  if (!hasAdminSuggestion(suggestion)) return suggestion;
  const signals = getAdminProductSignals(product);
  const titleParts = [];
  if (signals.expectedType && !ruleMatches(signals.expectedType, suggestion.title)) {
    titleParts.push(titleCaseAdmin(signals.expectedType.label));
  }
  if (
    signals.expectedAudience &&
    signals.expectedAudience.key !== "mixte" &&
    !ruleMatches(signals.expectedAudience, suggestion.title)
  ) {
    titleParts.push(titleCaseAdmin(signals.expectedAudience.label));
  }
  if (!titleParts.length) return suggestion;
  return {
    ...suggestion,
    title: cleanAssistantReply([...titleParts, suggestion.title || "Maison Max"].join(" ")).slice(0, 140)
  };
};

const getAdminArticle = (typeKey = "") => {
  if (["robe", "chemise", "chaussure", "jupe", "pochette"].includes(typeKey)) return "Cette";
  if (["accessoire", "article"].includes(typeKey)) return "Cet";
  return "Ce";
};

const buildSafeAdminSuggestion = (product) => {
  const signals = getAdminProductSignals(product);
  const type = signals.expectedType?.label || "article";
  const typeKey = signals.expectedType?.key || "article";
  const audience = signals.expectedAudience && signals.expectedAudience.key !== "mixte" ? signals.expectedAudience.label : "";
  const base = [type, audience].filter(Boolean).join(" ");
  const colorText = product.colors.slice(0, 2).join(" et ");
  const displayName = [base, colorText].filter(Boolean).join(" ");
  const subject = `${getAdminArticle(typeKey)} ${base}`;
  const titleWords = [
    titleCaseAdmin(type),
    audience ? titleCaseAdmin(audience) : "Produit",
    ...product.colors.slice(0, 2).map(titleCaseAdmin),
    "Maison",
    "Max"
  ];
  const details = [
    product.colors.length ? `couleurs: ${product.colors.join(", ")}` : "",
    product.sizes.length ? `tailles: ${product.sizes.join(", ")}` : "",
    product.price > 0 ? `prix: ${product.price} FCFA` : ""
  ].filter(Boolean);

  return {
    title: cleanAssistantReply(titleWords.join(" ")).slice(0, 140),
    short_description: cleanAssistantReply(
      `${titleCaseAdmin(displayName)} Maison Max, avec une presentation fidele aux informations confirmees.`
    ).slice(0, 220),
    description: cleanAssistantReply(
      `${subject}${colorText ? ` ${colorText}` : ""} Maison Max presente les details confirmes${details.length ? `: ${details.join("; ")}.` : "."} Cette presentation aide les clients a identifier clairement le bon produit.`
    ).slice(0, 900)
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
      const content = await callOpenRouter({
        messages: buildShopMessages(body.payload || {}),
        maxTokens: 150,
        temperature: 0.65,
        model: cleanText(process.env.OPENROUTER_CHAT_MODEL || DEFAULT_MODEL, 120)
      });
      return json(200, { message: cleanShopReply(content) }, headers);
    }

    if (body.action === "admin-product-copy") {
      const adminPayload = body.payload || {};
      const product = buildAdminProduct(adminPayload);
      const adminModel = cleanText(process.env.OPENROUTER_ADMIN_MODEL || DEFAULT_MODEL, 120);
      const content = await callOpenRouter({
        messages: buildAdminMessages(adminPayload, { product }),
        maxTokens: 300,
        temperature: 0.5,
        responseFormat: { type: "json_object" },
        model: adminModel
      });
      let suggestion = ensureAdminTitleSignals(parseSuggestion(content), product);
      let validationError = validateAdminSuggestion(suggestion, product);

      if (validationError) {
        const correctedContent = await callOpenRouter({
          messages: buildAdminMessages(adminPayload, {
            product,
            retryReason: validationError,
            previousSuggestion: suggestion
          }),
          maxTokens: 260,
          temperature: 0.2,
          responseFormat: { type: "json_object" },
          model: adminModel
        });
        suggestion = ensureAdminTitleSignals(parseSuggestion(correctedContent), product);
        validationError = validateAdminSuggestion(suggestion, product);
      }

      if (validationError) {
        suggestion = buildSafeAdminSuggestion(product);
      }

      if (hasAdminSuggestion(suggestion)) {
        return json(200, { suggestion }, headers);
      }

      return json(502, { error: "L'IA n'a pas renvoye de proposition exploitable. Reessayez avec plus de details." }, headers);
    }

    return json(400, { error: "Action IA inconnue." }, headers);
  } catch (error) {
    if (error.name === "AbortError") {
      return json(504, { error: "Le modele IA met trop de temps a repondre. Reessayez ou choisissez un autre modele OpenRouter." }, headers);
    }
    return json(error.statusCode || 500, { error: error.message || "Erreur IA inattendue." }, headers);
  }
};
