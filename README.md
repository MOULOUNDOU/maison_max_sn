# Maison Max

Site e-commerce statique pour une boutique de vetements au Senegal. Le site utilise HTML, CSS, JavaScript vanilla, Supabase pour les produits et WhatsApp pour les commandes.

## Fichiers principaux

- `index.html` : page d'accueil, catalogue, filtres, panier et commande WhatsApp.
- `product.html` : page detail produit par slug.
- `admin.html` : espace vendeur discret avec connexion Supabase Auth.
- `css/style.css` : styles responsive avec variables CSS.
- `js/config.js` : configuration publique du site.
- `js/supabase.js` : client Supabase et operations produits/auth/storage.
- `js/app.js` : catalogue, filtres, modal produit et SEO produit.
- `js/cart.js` : panier localStorage et message WhatsApp.
- `js/admin.js` : CRUD admin, upload images et filtres.
- `database.sql` : schema complet Supabase, RLS et policies Storage.

## 1. Creer le projet Supabase

1. Allez sur <https://supabase.com>.
2. Creez un nouveau projet.
3. Notez l'URL du projet et la cle `anon public`.
4. Ne mettez jamais la cle `service_role` dans le frontend.

## 2. Executer le SQL

1. Ouvrez Supabase Dashboard.
2. Allez dans `SQL Editor`.
3. Copiez le contenu de `database.sql`.
4. Executez le script.

Le script cree :

- `products`
- `site_settings`
- `admin_profiles`
- les policies Row Level Security
- le bucket public `product-images`
- quelques produits exemples

## 3. Creer ou verifier le bucket Storage

Le SQL cree automatiquement le bucket :

```txt
product-images
```

Regles appliquees :

- lecture publique des images ;
- upload, modification et suppression reserves aux comptes presents dans `admin_profiles`.

Si vous le creez manuellement, gardez exactement le meme nom.

## 4. RLS et securite

Les visiteurs peuvent lire uniquement les produits avec :

```sql
is_available = true
```

Les admins connectes peuvent creer, modifier et supprimer les produits seulement si leur `auth.users.id` existe dans `admin_profiles`.

La cle `anon public` est normale cote frontend. La cle `service_role` doit rester uniquement dans Supabase ou dans un backend prive.

## 5. Configurer Supabase dans le site

Ouvrez `js/config.js` et remplacez :

```js
SUPABASE_URL: "",
SUPABASE_ANON_KEY: "",
```

par les valeurs de votre projet :

```js
SUPABASE_URL: "https://votre-projet.supabase.co",
SUPABASE_ANON_KEY: "votre-cle-anon-publique",
```

Si ces valeurs sont vides, le site affiche les produits de demonstration integres au code.

Pour Netlify, ne publiez pas vos valeurs locales. Ajoutez plutot ces variables dans
`Site configuration > Environment variables` :

```txt
SUPABASE_URL
SUPABASE_ANON_KEY
WHATSAPP_NUMBER
```

Au deploiement, Netlify execute `node scripts/generate-config.js` et genere
automatiquement `js/config.js` avec ces variables.

## 6. Creer le premier compte admin

1. Dans Supabase, allez dans `Authentication`.
2. Creez un utilisateur avec email et mot de passe.
3. Recuperer son email exact.
4. Dans `SQL Editor`, executez :

```sql
insert into public.admin_profiles (id, role)
select id, 'admin'
from auth.users
where email = 'vendeur@maisonmax.sn'
on conflict (id) do update set role = excluded.role;
```

Remplacez `vendeur@maisonmax.sn` par l'email du compte.

Ensuite ouvrez :

```txt
/admin.html
```

## 7. Changer le numero WhatsApp

Dans `js/config.js`, modifiez :

```js
WHATSAPP_NUMBER: "221774957211"
```

Format recommande : indicatif pays + numero, sans `+`, sans espace.

Autres numeros Maison Max :

```js
SECONDARY_PHONE: "221777036107"
THIRD_PHONE: "221768298420"
```

Le panier generera un message comme :

```txt
Bonjour, je souhaite commander sur Maison Max :

1. Robe elegante wax
   Taille : M
   Couleur : Rouge
   Quantite : 1
   Prix : 15 000 FCFA

Total : 15 000 FCFA

Nom :
Adresse de livraison :
Ville :
Informations complementaires :

Merci.
```

## 8. Deployer

### Netlify

1. Creez un site Netlify.
2. Glissez-deposez le dossier du projet ou connectez le depot Git.
3. Ajoutez les variables `SUPABASE_URL` et `SUPABASE_ANON_KEY` dans Netlify.
4. Le build command est deja configure dans `netlify.toml`.
5. Le dossier de publication est la racine du projet.

### Vercel

1. Importez le depot.
2. Framework : `Other`.
3. Build command : laissez vide.
4. Output directory : laissez vide ou mettez `.`.

### GitHub Pages

1. Poussez le projet sur GitHub.
2. Allez dans `Settings > Pages`.
3. Source : branche principale, dossier `/root`.
4. Mettez a jour `SITE_URL` dans `js/config.js`, `robots.txt` et `sitemap.xml`.

## 9. Images produits

Dans l'admin :

1. Connectez-vous a `/admin.html`.
2. Ajoutez un produit.
3. Selectionnez une ou plusieurs images.
4. Les images sont envoyees dans Supabase Storage, bucket `product-images`.
5. La premiere image devient l'image principale.

Vous pouvez aussi coller des URLs existantes dans le champ `Images existantes`, separees par des virgules.

## 10. SEO

Le projet inclut :

- title et meta description ;
- Open Graph ;
- Twitter Cards ;
- favicon SVG ;
- `robots.txt` ;
- `sitemap.xml` ;
- JSON-LD `Store` ;
- JSON-LD `Product` dynamique ;
- alt text sur les images ;
- lazy loading ;
- URLs produit via `product.html?slug=nom-du-produit`.

Pour des URLs totalement propres comme `/produits/robe-elegante-wax`, ajoutez une regle de rewrite cote hebergeur.

## 11. Notes de maintenance

- Gardez `js/config.js` hors des vraies cles sensibles. La cle anon Supabase peut etre publique, mais pas la cle `service_role`.
- Utilisez les champs `is_available`, `is_featured` et `is_promo` pour piloter l'affichage public.
- Les textes produits sont injectes avec `textContent` ou normalises avant affichage.
- Testez la commande WhatsApp apres changement du numero.
# maison_max
