const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const configPath = path.join(root, "js", "config.js");

const defaultConfig = {
  STORE_NAME: "Maison Max",
  SITE_URL: "https://maison-max.com",
  SUPABASE_URL: "",
  SUPABASE_ANON_KEY: "",
  WHATSAPP_NUMBER: "221774957211",
  DEFAULT_CITY: "Dakar",
  CURRENCY: "FCFA",
  DELIVERY_ZONES: [
    "Afrique de l'Ouest",
    "Afrique centrale",
    "Afrique de l'Est",
    "Afrique australe",
    "Autre pays africain",
    "Dakar",
    "Pikine",
    "Guédiawaye",
    "Rufisque",
    "Thiès",
    "Mbour",
    "Saint-Louis",
    "Touba",
    "Kaolack",
    "Ziguinchor"
  ],
  PRODUCT_IMAGE_BUCKET: "product-images"
};

const readCurrentConfig = () => {
  if (!fs.existsSync(configPath)) return {};

  try {
    const code = fs.readFileSync(configPath, "utf8");
    const context = { window: {} };
    vm.createContext(context);
    vm.runInContext(code, context, { timeout: 1000 });
    return context.window.MAISON_MAX_CONFIG || {};
  } catch (error) {
    console.warn("Impossible de lire js/config.js, utilisation des valeurs par defaut.");
    return {};
  }
};

const splitList = (value, fallback) => {
  if (!value) return fallback;
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const current = { ...defaultConfig, ...readCurrentConfig() };
const env = process.env;

const config = {
  STORE_NAME: env.STORE_NAME || current.STORE_NAME,
  SITE_URL: env.SITE_URL || env.URL || current.SITE_URL,
  SUPABASE_URL: env.SUPABASE_URL || current.SUPABASE_URL,
  SUPABASE_ANON_KEY: env.SUPABASE_ANON_KEY || current.SUPABASE_ANON_KEY,
  WHATSAPP_NUMBER: env.WHATSAPP_NUMBER || current.WHATSAPP_NUMBER,
  DEFAULT_CITY: env.DEFAULT_CITY || current.DEFAULT_CITY,
  CURRENCY: env.CURRENCY || current.CURRENCY,
  DELIVERY_ZONES: splitList(env.DELIVERY_ZONES, current.DELIVERY_ZONES),
  PRODUCT_IMAGE_BUCKET: env.PRODUCT_IMAGE_BUCKET || current.PRODUCT_IMAGE_BUCKET
};

fs.writeFileSync(
  configPath,
  `window.MAISON_MAX_CONFIG = ${JSON.stringify(config, null, 2)};\n`,
  "utf8"
);

if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
  console.warn("SUPABASE_URL ou SUPABASE_ANON_KEY manquant: les produits Supabase ne s'afficheront pas.");
} else {
  console.log("Configuration publique generee pour Netlify.");
}
