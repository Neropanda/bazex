/* ============================================================================
   BAZEX — CONTENT FILE  (edit this file to change the website)
   ----------------------------------------------------------------------------
   Everything you can change without touching the code is here:
   - SITE.config    → name, logo, contact, WhatsApp number, shipping, coupons, image sizes
   - SITE.ui        → interface texts (French / English)
   - SITE.home      → home page texts, images and buttons
   - SITE.categories→ shop filters and the three category tiles
   - SITE.products  → your products (name, price, images, description, stock…)

   Text that exists in two languages is written { fr: "...", en: "..." }.
   Images are file paths, e.g. "img/bag-leila.jpg". Put your own pictures in /img.
   ============================================================================ */
window.SITE = {

  /* ------------------------------------------------------------------ SETTINGS */
  config: {
    name: "Bazex",
    tagline: { fr: "Trend store", en: "Trend store" },

    // Logo: path to a PNG / JPG / SVG file. Leave "" to show the name + tagline as text.
    logo: "img/logo.svg",
    logoHeight: 44,            // logo height in pixels (header)

    defaultLang: "fr",         // "fr" or "en"

    // Contact details (footer + contact page)
    phone: "+212 6 00 00 00 00",
    email: "contact@bazex.ma",
    city: { fr: "Casablanca, Maroc", en: "Casablanca, Morocco" },
    footerText: {
      fr: "BAZEX Trend Store — une sélection de sacs et essentiels lifestyle pour femme. Le détail qui change tout.",
      en: "BAZEX Trend Store — a selection of women's bags and lifestyle essentials. The detail that changes everything."
    },
    instagram: "",             // full links, leave "" to hide
    facebook: "",
    tiktok: "",

    // Orders are sent to this WhatsApp number (digits only, with country code, no + or spaces)
    whatsapp: "212600000000",

    // Optional: a form service URL (for example from formspree.io) to receive contact messages,
    // newsletter sign-ups and orders by e-mail. If empty, forms open the visitor's mail app instead.
    formEndpoint: "",

    // Money
    currency: { fr: "DH", en: "MAD" },
    shipping: 35,              // delivery fee
    freeShippingFrom: 300,     // free delivery above this amount (0 = never free)
    coupons: { BAZEX15: 0.15 },// code → discount (0.15 = 15 %)

    // Announcement bar at the very top (leave a message "" to hide it)
    announcement: [
      { fr: "Livraison partout au Maroc", en: "Delivery all over Morocco" },
      { fr: "Paiement à la livraison", en: "Cash on delivery" },
      { fr: "Mode · Lifestyle · Plus encore", en: "Fashion · Lifestyle · More" }
    ],

    // Picture sizes and layout (change these numbers to resize pictures)
    images: {
      cardRatio: "4 / 5",        // shape of product pictures in lists: "1 / 1", "3 / 4", "4 / 5"…
      columns: 4,                // products per row on desktop (2, 3 or 4)
      heroHeight: "520px",       // height of the big picture on the home page
      productRatio: "4 / 5",     // shape of the main picture on a product page
      tileHeight: "260px"        // height of each category tile row on the home page
    }
  },

  /* ------------------------------------------------------------------ INTERFACE TEXTS */
  ui: {
    fr: {
      skip: "Aller au contenu", menu: "Menu", close: "Fermer", home: "Accueil", collections: "Collections",
      contact: "Contact", search: "Rechercher", search_ph: "Rechercher un sac…", wishlist: "Favoris",
      cart: "Panier", language: "Changer de langue", view_all: "Voir tout", explore: "Explorer",
      wishlist_title: "Mes favoris", wishlist_empty: "Vous n'avez pas encore de favoris.", remove: "Retirer",
      add_to_cart: "Ajouter au panier", added: "Ajouté au panier", sold_out: "Épuisé", in_stock: "En stock",
      only_left: "Plus que {n} en stock", quantity: "Quantité", color: "Couleur", description: "Description",
      related: "Vous aimerez aussi", wishlist_add: "Ajouter aux favoris", wishlist_del: "Retirer des favoris",
      perk_delivery: "Livraison partout au Maroc — 24 à 72 h", perk_cod: "Paiement à la livraison",
      perk_exchange: "Échange sous 48 h", decrease: "Diminuer", increase: "Augmenter",
      count_one: "{n} produit", count_other: "{n} produits",
      shop_title: "Toutes les collections", shop_eyebrow: "Boutique",
      f_all: "Tout", f_new: "Nouveautés", f_sale: "Promotions",
      sort: "Trier", sort_default: "Pertinence", sort_asc: "Prix croissant", sort_desc: "Prix décroissant",
      results_for: "Résultats pour « {q} »", no_results: "Aucun produit trouvé.",
      not_found: "Produit introuvable", back_shop: "Retour à la boutique",
      cart_title: "Mon panier", cart_eyebrow: "Commande", cart_empty: "Votre panier est vide.",
      continue: "Continuer mes achats", subtotal: "Sous-total", shipping: "Livraison", free: "Offerte",
      discount: "Remise", total: "Total", coupon: "Code promo", coupon_apply: "Appliquer",
      coupon_ok: "Code appliqué", coupon_bad: "Code invalide", coupon_remove: "Retirer le code",
      summary: "Récapitulatif", checkout: "Commander", free_ship_left: "Plus que {amount} pour la livraison offerte",
      free_ship_ok: "Livraison offerte !", cod_note: "Paiement à la livraison disponible.",
      checkout_title: "Finaliser ma commande", checkout_eyebrow: "Paiement à la livraison",
      f_name: "Nom complet", f_phone: "Téléphone", f_city: "Ville", f_address: "Adresse de livraison",
      f_notes: "Note pour la commande (optionnel)", place_order: "Confirmer la commande",
      order_sent_title: "Merci pour votre commande !", order_sent_text: "Votre commande {id} est prête. Elle est envoyée sur WhatsApp pour confirmation. Vous payez à la réception.",
      order_open_wa: "Ouvrir WhatsApp", order_again: "Retour à l'accueil",
      required: "Merci de remplir ce champ", phone_bad: "Numéro de téléphone invalide",
      wa_hello: "Bonjour, je souhaite passer commande :", wa_customer: "Client", wa_total: "Total",
      contact_title: "Nous contacter", contact_eyebrow: "Écrivez-nous", contact_intro: "Une question sur une commande ou un produit ? Nous répondons rapidement.",
      f_email: "Adresse e-mail", f_subject: "Sujet", f_message: "Message", send: "Envoyer",
      sent_ok: "Message envoyé, merci !", mail_opened: "Votre application mail va s'ouvrir.",
      nl_eyebrow: "Newsletter", nl_title: "Rejoignez le cercle BAZEX",
      nl_text: "Nouveautés et offres privées, directement dans votre boîte mail.",
      nl_ph: "Votre adresse e-mail", nl_btn: "S'inscrire", nl_ok: "Merci, vous êtes inscrite !",
      footer_shop: "Boutique", footer_info: "Informations", footer_contact: "Contact",
      footer_cod: "Paiement à la livraison", rights: "Tous droits réservés", footer_tag: "Fashion • Lifestyle • Trends",
      error: "Une erreur est survenue. Réessayez."
    },
    en: {
      skip: "Skip to content", menu: "Menu", close: "Close", home: "Home", collections: "Collections",
      contact: "Contact", search: "Search", search_ph: "Search a bag…", wishlist: "Wishlist",
      cart: "Cart", language: "Change language", view_all: "View all", explore: "Explore",
      wishlist_title: "My wishlist", wishlist_empty: "You have no favourites yet.", remove: "Remove",
      add_to_cart: "Add to cart", added: "Added to cart", sold_out: "Sold out", in_stock: "In stock",
      only_left: "Only {n} left", quantity: "Quantity", color: "Colour", description: "Description",
      related: "You may also like", wishlist_add: "Add to wishlist", wishlist_del: "Remove from wishlist",
      perk_delivery: "Delivery all over Morocco — 24 to 72 h", perk_cod: "Cash on delivery",
      perk_exchange: "Exchange within 48 h", decrease: "Decrease", increase: "Increase",
      count_one: "{n} product", count_other: "{n} products",
      shop_title: "All collections", shop_eyebrow: "Shop",
      f_all: "All", f_new: "New in", f_sale: "Sale",
      sort: "Sort", sort_default: "Relevance", sort_asc: "Price: low to high", sort_desc: "Price: high to low",
      results_for: "Results for “{q}”", no_results: "No product found.",
      not_found: "Product not found", back_shop: "Back to the shop",
      cart_title: "My cart", cart_eyebrow: "Order", cart_empty: "Your cart is empty.",
      continue: "Continue shopping", subtotal: "Subtotal", shipping: "Delivery", free: "Free",
      discount: "Discount", total: "Total", coupon: "Promo code", coupon_apply: "Apply",
      coupon_ok: "Code applied", coupon_bad: "Invalid code", coupon_remove: "Remove code",
      summary: "Summary", checkout: "Checkout", free_ship_left: "Only {amount} left for free delivery",
      free_ship_ok: "Free delivery!", cod_note: "Cash on delivery available.",
      checkout_title: "Complete my order", checkout_eyebrow: "Cash on delivery",
      f_name: "Full name", f_phone: "Phone", f_city: "City", f_address: "Delivery address",
      f_notes: "Order note (optional)", place_order: "Confirm order",
      order_sent_title: "Thank you for your order!", order_sent_text: "Your order {id} is ready. It is sent on WhatsApp for confirmation. You pay on delivery.",
      order_open_wa: "Open WhatsApp", order_again: "Back to home",
      required: "Please fill in this field", phone_bad: "Invalid phone number",
      wa_hello: "Hello, I would like to place an order:", wa_customer: "Customer", wa_total: "Total",
      contact_title: "Contact us", contact_eyebrow: "Write to us", contact_intro: "A question about an order or a product? We reply quickly.",
      f_email: "E-mail address", f_subject: "Subject", f_message: "Message", send: "Send",
      sent_ok: "Message sent, thank you!", mail_opened: "Your mail app will open.",
      nl_eyebrow: "Newsletter", nl_title: "Join the BAZEX circle",
      nl_text: "New arrivals and private offers, straight to your inbox.",
      nl_ph: "Your e-mail address", nl_btn: "Subscribe", nl_ok: "Thank you, you are subscribed!",
      footer_shop: "Shop", footer_info: "Information", footer_contact: "Contact",
      footer_cod: "Cash on delivery", rights: "All rights reserved", footer_tag: "Fashion • Lifestyle • Trends",
      error: "Something went wrong. Please try again."
    }
  },

  /* ------------------------------------------------------------------ HOME PAGE */
  home: {
    hero: {
      pill: { fr: "Bienvenue chez Bazex", en: "Welcome to Bazex" },
      title: { fr: "Découvrez BAZEX", en: "Discover BAZEX" },
      subtitle: { fr: "L'élégance du détail", en: "Elegance in the details" },
      text: {
        fr: "Sacs et essentiels tendance pour une vie plus stylée. Des pièces choisies pour leur matière, leur ligne et leur allure.",
        en: "Trend bags and essentials for a more stylish life. Pieces chosen for their material, their line and their allure."
      },
      button1: { label: { fr: "Explorer la boutique", en: "Explore the shop" }, href: "shop.html" },
      button2: { label: { fr: "Voir les promotions", en: "See the sale" }, href: "shop.html?cat=sale" },
      image: "img/bag-leila.jpg",
      image2: "img/bag-yasmine.jpg",
      tag: { label: { fr: "Nouveautés", en: "New in" }, href: "shop.html?cat=new" },
      stats: [
        { value: "24–72h", label: { fr: "Livraison Maroc", en: "Delivery Morocco" } },
        { value: "+2 500", label: { fr: "Clientes satisfaites", en: "Happy customers" } },
        { value: "COD", label: { fr: "À la livraison", en: "Cash on delivery" } }
      ]
    },

    trust: [
      { icon: "truck", title: { fr: "Livraison partout au Maroc", en: "Delivery all over Morocco" }, text: { fr: "Expédition sous 24–72h", en: "Shipped within 24–72h" } },
      { icon: "cash", title: { fr: "Paiement à la livraison", en: "Cash on delivery" }, text: { fr: "Payez à réception", en: "Pay when you receive" } },
      { icon: "swap", title: { fr: "Échange sous 48h", en: "Exchange within 48h" }, text: { fr: "Sans complication", en: "No hassle" } },
      { icon: "gem", title: { fr: "Pièces sélectionnées", en: "Selected pieces" }, text: { fr: "Qualité vérifiée", en: "Quality checked" } }
    ],

    categories: {
      eyebrow: { fr: "Explorer", en: "Explore" },
      title: { fr: "Acheter par catégorie", en: "Shop by category" },
      // each tile: label, small label, picture, link — add or remove tiles freely (3 looks best)
      tiles: [
        { label: { fr: "Sacs pour femmes", en: "Women's bags" }, small: { fr: "Collection", en: "Collection" }, image: "img/bag-nour.jpg", href: "shop.html" },
        { label: { fr: "Nouveautés", en: "New in" }, small: { fr: "Tendance", en: "Trending" }, image: "img/bag-leila.jpg", href: "shop.html?cat=new" },
        { label: { fr: "Promotions", en: "Sale" }, small: { fr: "Offres", en: "Offers" }, image: "img/bag-yasmine.jpg", href: "shop.html?cat=sale" }
      ]
    },

    featured: {
      eyebrow: { fr: "Sélection", en: "Selection" },
      title: { fr: "Nos incontournables", en: "Our must-haves" },
      button: { fr: "Voir tout", en: "View all" },
      href: "shop.html",
      // ids of the products to show, in order (ids come from SITE.products below). Empty [] = first 4 products.
      productIds: ["leila", "yasmine", "amira", "nour"]
    },

    offer: {
      eyebrow: { fr: "Offre du moment", en: "Offer of the moment" },
      title: { fr: "Jusqu'à -70% sur une sélection", en: "Up to 70% off selected pieces" },
      text: { fr: "Livraison partout au Maroc, paiement à la livraison. Code BAZEX15 : -15% supplémentaires.", en: "Delivery all over Morocco, cash on delivery. Code BAZEX15: extra 15% off." },
      code: "BAZEX15",
      button: { fr: "J'en profite", en: "Shop the offer" },
      href: "shop.html?cat=sale"
    },

    story: {
      eyebrow: { fr: "Notre philosophie", en: "Our philosophy" },
      title: { fr: "Le détail qui change tout", en: "The detail that changes everything" },
      text: {
        fr: "Chaque pièce est choisie pour sa matière, sa ligne et sa façon de s'adapter à votre quotidien.",
        en: "Each piece is chosen for its material, its line and how it fits into your everyday life."
      },
      image1: "img/bag-amira.jpg",
      image2: "img/bag-nour.jpg",
      points: [
        { fr: "Matières soigneusement sélectionnées", en: "Carefully selected materials" },
        { fr: "Finitions et détails dorés", en: "Gold finishes and details" },
        { fr: "Livraison et paiement à la livraison au Maroc", en: "Delivery and cash on delivery in Morocco" }
      ],
      button: { fr: "Découvrir la boutique", en: "Discover the shop" },
      href: "shop.html"
    }
  },

  /* ------------------------------------------------------------------ SHOP FILTERS
     rule: "all" = every product · "new" = products marked new:true · "sale" = products with an old price */
  categories: [
    { id: "all", rule: "all", label: { fr: "Tout", en: "All" } },
    { id: "new", rule: "new", label: { fr: "Nouveautés", en: "New in" } },
    { id: "sale", rule: "sale", label: { fr: "Promotions", en: "Sale" } }
  ],

  /* ------------------------------------------------------------------ PRODUCTS
     id        → short unique word used in the link (product.html?id=leila)
     price     → current price      compare → old crossed-out price (or null)
     stock     → quantity available (0 = sold out)   new → true shows it in "Nouveautés"
     images    → one or several pictures (first one is the main picture)
     colors    → optional list; if there are 2 or more, the customer can choose */
  products: [
    {
      id: "leila", price: 449, compare: null, stock: 12, new: true,
      name: { fr: "Sac à Main Leïla", en: "Leïla Handbag" },
      desc: {
        fr: "Silhouette trapèze, rabat structuré et fermoir doré. Le sac à main qui accompagne vos journées du bureau au dîner.",
        en: "Trapeze silhouette, structured flap and gold clasp. The handbag that carries you from the office to dinner."
      },
      images: ["img/bag-leila.jpg"],
      colors: [{ fr: "Chocolat", en: "Chocolate" }]
    },
    {
      id: "yasmine", price: 120, compare: 399, stock: 4, new: false,
      name: { fr: "Sac Boucle Yasmine", en: "Yasmine Buckle Bag" },
      desc: {
        fr: "Cuir lisse bordeaux, grande boucle laiton et anse fine. Une pièce affirmée, à porter main ou bras.",
        en: "Smooth burgundy leather, large brass buckle and slim handle. A bold piece to carry by hand or on the arm."
      },
      images: ["img/bag-yasmine.jpg"],
      colors: [{ fr: "Bordeaux", en: "Burgundy" }]
    },
    {
      id: "amira", price: 105, compare: 349, stock: 6, new: false,
      name: { fr: "Sac Baguette Amira", en: "Amira Baguette Bag" },
      desc: {
        fr: "Format baguette à porter sous l'épaule, sangle ajustable et fermoir ovale doré. L'allure des années 2000, revisitée.",
        en: "Baguette shape worn under the arm, adjustable strap and oval gold clasp. The 2000s look, reinvented."
      },
      images: ["img/bag-amira.jpg"],
      colors: [{ fr: "Camel", en: "Camel" }]
    },
    {
      id: "nour", price: 429, compare: null, stock: 9, new: true,
      name: { fr: "Sac Hobo Nour", en: "Nour Hobo Bag" },
      desc: {
        fr: "Cuir grainé souple, forme hobo enveloppante et languette à fermoir. Spacieux, léger, intemporel.",
        en: "Soft grained leather, wrap-around hobo shape and clasp tab. Roomy, light, timeless."
      },
      images: ["img/bag-nour.jpg"],
      colors: [{ fr: "Cognac", en: "Cognac" }]
    }
  ]
};
