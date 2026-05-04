(function () {
  "use strict";

  const config = window.MAISON_MAX_CONFIG || {};
  const isConfigured = Boolean(config.SUPABASE_URL && config.SUPABASE_ANON_KEY && window.supabase);
  const client = isConfigured
    ? window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY)
    : null;

  const publicSelect =
    "id,name,slug,short_description,description,price,old_price,category,subcategory,sizes,colors,images,main_image,is_available,is_featured,is_promo,created_at,updated_at";

  const listProducts = async (options = {}) => {
    if (!client) throw new Error("Supabase n'est pas encore configure.");

    let query = client
      .from("products")
      .select(publicSelect)
      .eq("is_available", true);

    if (options.category && options.category !== "all") {
      query = query.eq("category", options.category);
    }

    if (options.promo) query = query.eq("is_promo", true);
    if (options.featured) query = query.eq("is_featured", true);

    const sort = options.sort || "newest";
    if (sort === "price-asc") query = query.order("price", { ascending: true });
    else if (sort === "price-desc") query = query.order("price", { ascending: false });
    else query = query.order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(window.MMUtils.normalizeProduct);
  };

  const listProductsForAdmin = async () => {
    if (!client) throw new Error("Supabase n'est pas encore configure.");
    const { data, error } = await client
      .from("products")
      .select(publicSelect)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(window.MMUtils.normalizeProduct);
  };

  const getProductBySlug = async (slug) => {
    if (!client) throw new Error("Supabase n'est pas encore configure.");
    const { data, error } = await client
      .from("products")
      .select(publicSelect)
      .eq("slug", slug)
      .single();
    if (error) throw error;
    return window.MMUtils.normalizeProduct(data);
  };

  const createProduct = async (payload) => {
    const { data, error } = await client.from("products").insert(payload).select(publicSelect).single();
    if (error) throw error;
    return window.MMUtils.normalizeProduct(data);
  };

  const updateProduct = async (id, payload) => {
    const { data, error } = await client
      .from("products")
      .update(payload)
      .eq("id", id)
      .select(publicSelect)
      .single();
    if (error) throw error;
    return window.MMUtils.normalizeProduct(data);
  };

  const deleteProduct = async (id) => {
    const { error } = await client.from("products").delete().eq("id", id);
    if (error) throw error;
    return true;
  };

  const uploadImages = async (files, folder) => {
    if (!files || !files.length) return [];
    const bucket = config.PRODUCT_IMAGE_BUCKET || "product-images";
    const urls = [];

    for (const file of files) {
      const ext = file.name.split(".").pop() || "jpg";
      const cleanName = `${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;
      const path = `${window.MMUtils.slugify(folder || "image")}/${cleanName}`;
      const { error } = await client.storage.from(bucket).upload(path, file, {
        cacheControl: "3600",
        upsert: false
      });
      if (error) throw error;

      const { data } = client.storage.from(bucket).getPublicUrl(path);
      urls.push(data.publicUrl);
    }

    return urls;
  };

  const uploadProductImages = async (files, slug) => uploadImages(files, slug || "produit");

  const uploadCategoryImage = async (file, category) => {
    const urls = await uploadImages(file ? [file] : [], `categories/${category || "categorie"}`);
    return urls[0] || "";
  };

  const getSiteSetting = async (key) => {
    if (!client) throw new Error("Supabase n'est pas encore configure.");
    const { data, error } = await client
      .from("site_settings")
      .select("key,value")
      .eq("key", key)
      .maybeSingle();
    if (error) throw error;
    return data ? data.value : null;
  };

  const setSiteSetting = async (key, value) => {
    if (!client) throw new Error("Supabase n'est pas encore configure.");
    const { data, error } = await client
      .from("site_settings")
      .upsert({ key, value }, { onConflict: "key" })
      .select("key,value")
      .single();
    if (error) throw error;
    return data.value;
  };

  const removeProductImageByUrl = async (url) => {
    if (!url) return true;
    const bucket = config.PRODUCT_IMAGE_BUCKET || "product-images";
    const marker = `/storage/v1/object/public/${bucket}/`;
    const index = url.indexOf(marker);
    if (index === -1) return false;

    const path = decodeURIComponent(url.slice(index + marker.length));
    const { error } = await client.storage.from(bucket).remove([path]);
    if (error) throw error;
    return true;
  };

  const signInAdmin = async (email, password) => {
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await client.auth.signOut();
    if (error) throw error;
  };

  const getSession = async () => {
    if (!client) return null;
    const { data } = await client.auth.getSession();
    return data.session;
  };

  const getCurrentAdminProfile = async () => {
    const session = await getSession();
    if (!session) return null;
    const { data, error } = await client
      .from("admin_profiles")
      .select("id,role,created_at")
      .eq("id", session.user.id)
      .single();
    if (error) return null;
    return data;
  };

  window.MMSupabase = {
    client,
    isConfigured,
    listProducts,
    listProductsForAdmin,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImages,
    uploadCategoryImage,
    removeProductImageByUrl,
    getSiteSetting,
    setSiteSetting,
    signInAdmin,
    signOut,
    getSession,
    getCurrentAdminProfile
  };
})();
