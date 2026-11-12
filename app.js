/* BAZEX — site script
   Builds every page from js/content.js. You normally do NOT need to edit this file. */
(function () {
  'use strict';

  var S = window.SITE, C = S.config;
  var doc = document;
  var PAGE = (doc.body.getAttribute('data-page') || 'home');

  /* ------------------------------------------------------------ helpers */
  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  };
  function params() {
    var o = {}; try { new URLSearchParams(location.search).forEach(function (v, k) { o[k] = v; }); } catch (e) { /* ignore */ }
    return o;
  }

  /* ------------------------------------------------------------ language */
  var lang = (function () {
    var q = params().lang;
    if (q === 'fr' || q === 'en') { store.set('bzx_lang', q); return q; }
    var saved = store.get('bzx_lang', null);
    return (saved === 'fr' || saved === 'en') ? saved : (C.defaultLang === 'en' ? 'en' : 'fr');
  })();
  function L(v) {
    if (v == null) return '';
    if (typeof v === 'string' || typeof v === 'number') return v;
    return v[lang] || v.fr || v.en || '';
  }
  function t(key, vars) {
    var s = (S.ui[lang] && S.ui[lang][key]) || (S.ui.fr && S.ui.fr[key]) || key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  }
  function money(n) {
    var num = Math.round(n).toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US');
    return lang === 'fr' ? num + ' ' + L(C.currency) : L(C.currency) + ' ' + num;
  }
  function countLabel(n) { return t(n === 1 ? 'count_one' : 'count_other', { n: n }); }

  /* ------------------------------------------------------------ icons (inline SVG) */
  var ICONS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    heart: '<path d="M12 20s-7-4.4-9-9.2C1.6 7.4 3.8 4 7 4c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.2 0 5.4 3.4 4 6.8C19 15.6 12 20 12 20Z"/>',
    cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.7 12.4a1.5 1.5 0 0 0 1.5 1.1h8.6a1.5 1.5 0 0 0 1.5-1.1L21 7H6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.6 2.6 3.9 5.6 3.9 9s-1.3 6.4-3.9 9c-2.6-2.6-3.9-5.6-3.9-9S9.4 5.6 12 3Z"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    'arrow-ur': '<path d="M7 17 17 7M8 7h9v9"/>',
    truck: '<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    cash: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
    swap: '<path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/>',
    gem: '<path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    insta: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
    facebook: '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8Z"/>',
    tiktok: '<path d="M14 3v11a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.4 2.4 2 4 4.5 4.2"/>',
    whatsapp: '<path d="M3 21l1.6-4.6A8.5 8.5 0 1 1 8 19.6L3 21Z"/><path d="M9 9c0 3 3 6 6 6l1-1.5-2-1-1 .7c-1-.5-2-1.5-2.5-2.5l.7-1-1-2L9 9Z"/>'
  };
  function icon(name, size) {
    size = size || 18;
    return '<svg class="icon" viewBox="0 0 24 24" width="' + size + '" height="' + size + '" aria-hidden="true" focusable="false">' + (ICONS[name] || '') + '</svg>';
  }

  /* ------------------------------------------------------------ products */
  var PRODUCTS = S.products;
  function byId(id) { for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i]; return null; }
  function onSale(p) { return p.compare && p.compare > p.price; }
  function off(p) { return onSale(p) ? Math.round((1 - p.price / p.compare) * 100) : 0; }
  function pUrl(p) { return 'product.html?id=' + encodeURIComponent(p.id); }
  function colorName(p, i) { var c = p.colors && p.colors[i || 0]; return c ? L(c) : ''; }
  function priceHtml(p) {
    return onSale(p)
      ? '<div class="price"><span class="sale">' + money(p.price) + '</span><s>' + money(p.compare) + '</s></div>'
      : '<div class="price"><span>' + money(p.price) + '</span></div>';
  }

  /* ------------------------------------------------------------ cart / wishlist / coupon */
  var cart = store.get('bzx_cart', []); if (!Array.isArray(cart)) cart = [];
  var wish = store.get('bzx_wish', []); if (!Array.isArray(wish)) wish = [];
  var coupon = store.get('bzx_coupon', ''); if (typeof coupon !== 'string') coupon = '';
  function saveCart() { store.set('bzx_cart', cart); }
  function cartCount() { return cart.reduce(function (n, i) { return n + i.qty; }, 0); }
  function lineKey(i) { return i.id + '|' + (i.color || 0); }
  function cartLines() {
    var out = [];
    cart.forEach(function (i) { var p = byId(i.id); if (p) out.push({ item: i, p: p, key: lineKey(i), total: p.price * i.qty }); });
    return out;
  }
  function totals() {
    var sub = cartLines().reduce(function (s, l) { return s + l.total; }, 0);
    var rate = (coupon && C.coupons && C.coupons[coupon]) || 0;
    var disc = Math.round(sub * rate);
    var after = sub - disc;
    var free = C.freeShippingFrom > 0 && after >= C.freeShippingFrom;
    var ship = (sub === 0 || free) ? 0 : (C.shipping || 0);
    return { sub: sub, rate: rate, disc: disc, ship: ship, free: free && sub > 0, total: after + ship };
  }
  function addToCart(id, qty, color) {
    var p = byId(id); if (!p || p.stock <= 0) return false;
    var k = id + '|' + (color || 0), found = null;
    cart.forEach(function (i) { if (lineKey(i) === k) found = i; });
    if (found) found.qty = Math.min(p.stock, found.qty + qty);
    else cart.push({ id: id, qty: Math.min(p.stock, qty), color: color || 0 });
    saveCart(); return true;
  }
  function setQty(key, qty) {
    cart.forEach(function (i) {
      if (lineKey(i) === key) { var p = byId(i.id); i.qty = Math.max(0, Math.min(p ? p.stock : 99, qty)); }
    });
    cart = cart.filter(function (i) { return i.qty > 0; });
    saveCart();
  }
  function toggleWish(id) {
    var i = wish.indexOf(id);
    if (i >= 0) wish.splice(i, 1); else wish.push(id);
    store.set('bzx_wish', wish);
  }

  /* ------------------------------------------------------------ toast */
  var toastTimer;
  function toast(msg, href, label) {
    var el = $('#toast'); if (!el) return;
    el.innerHTML = esc(msg) + (href ? ' &nbsp;<a href="' + esc(href) + '">' + esc(label) + '</a>' : '');
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 3200);
  }

  /* ------------------------------------------------------------ shared pieces */
  function card(p) {
    var inW = wish.indexOf(p.id) >= 0;
    return '<article class="card"><div class="media"><a href="' + pUrl(p) + '" tabindex="-1" aria-hidden="true">' +
      '<img loading="lazy" src="' + esc(p.images[0]) + '" alt="' + esc(L(p.name)) + '"></a>' +
      (onSale(p) ? '<span class="badge-red">-' + off(p) + '%</span>' : '') +
      (p.stock <= 0 ? '<div class="chips"><span class="chip">' + t('sold_out') + '</span></div>' : '') +
      '<button type="button" class="wish' + (inW ? ' on' : '') + '" data-action="wish" data-id="' + esc(p.id) + '" aria-pressed="' + inW + '" aria-label="' + t('wishlist_add') + '">' + icon('heart', 15) + '</button>' +
      '</div><div class="info"><a href="' + pUrl(p) + '"><h3>' + esc(L(p.name)) + '</h3></a>' + priceHtml(p) + '</div></article>';
  }
  function head(eyebrow, title, rightHtml) {
    return '<div class="sec-head"><div>' + (eyebrow ? '<div class="eyebrow">' + esc(L(eyebrow)) + '</div>' : '') +
      '<h2>' + esc(L(title)) + '</h2></div>' + (rightHtml || '') + '</div>';
  }
  function crumbs(items) {
    return '<div class="crumbs"><div class="bzx-container">' + items.map(function (i) {
      return i.href ? '<a href="' + i.href + '">' + esc(i.label) + '</a>' : esc(i.label);
    }).join('<span>/</span>') + '</div></div>';
  }
  function listHead(eyebrow, title, right) {
    return '<div class="list-head"><div><div class="eyebrow">' + esc(eyebrow) + '</div><h1>' + esc(title) + '</h1></div>' + (right || '') + '</div>';
  }
  function logoHtml() {
    if (C.logo) return '<img class="logo-img" src="' + esc(C.logo) + '" alt="' + esc(C.name) + '" style="height:' + (C.logoHeight || 44) + 'px">';
    return '<span class="word"><span class="name">' + esc(C.name) + '</span>' +
      (L(C.tagline) ? '<span class="sub"><i></i>' + esc(L(C.tagline)) + '<i></i></span>' : '') + '</span>';
  }

  /* ------------------------------------------------------------ header / footer */
  var NAV = [
    { page: 'home', href: 'index.html', key: 'home' },
    { page: 'shop', href: 'shop.html', key: 'collections' },
    { page: 'contact', href: 'contact.html', key: 'contact' }
  ];
  function renderHeader() {
    var ann = (C.announcement || []).filter(function (m) { return L(m); });
    var other = lang === 'fr' ? 'EN' : 'FR';
    var h = '';
    if (ann.length) {
      h += '<div class="topbar"><div class="bzx-container"><span class="topbar-icon">' + icon('truck', 15) + '</span><div class="msg">' +
        ann.map(function (m, i) { return (i ? '<span' + (i > 1 ? ' class="hide-sm"' : '') + '>|</span>' : '') + (i > 1 ? '<span class="hide-sm" style="opacity:1;margin:0">' + esc(L(m)) + '</span>' : esc(L(m))); }).join('') +
        '</div><span></span></div></div>';
    }
    h += '<header class="header"><div class="bzx-container"><div class="header-left">' +
      '<button type="button" class="burger" data-open="menu" aria-label="' + t('menu') + '">' + icon('menu', 22) + '</button>' +
      '<nav class="nav" aria-label="Navigation">' + NAV.map(function (n) {
        return '<a href="' + n.href + '"' + (n.page === PAGE || (n.page === 'shop' && PAGE === 'product') ? ' class="active" aria-current="page"' : '') + '>' + t(n.key) + '</a>';
      }).join('') + '</nav></div>' +
      '<a class="logo" href="index.html" aria-label="' + esc(C.name) + '">' + logoHtml() + '</a>' +
      '<div class="actions">' +
      '<button type="button" class="lang-btn" data-action="lang" aria-label="' + t('language') + '">' + icon('globe', 20) + '<span>' + other + '</span></button>' +
      '<button type="button" data-open="search" aria-label="' + t('search') + '">' + icon('search', 20) + '</button>' +
      '<button type="button" class="hide-xs" data-open="wishlist" aria-label="' + t('wishlist') + '">' + icon('heart', 20) +
      '<span class="badge-count" id="wish-count"' + (wish.length ? '' : ' hidden') + '>' + wish.length + '</span></button>' +
      '<a href="cart.html" aria-label="' + t('cart') + '">' + icon('cart', 20) +
      '<span class="badge-count" id="cart-count"' + (cartCount() ? '' : ' hidden') + '>' + cartCount() + '</span></a>' +
      '</div></div></header>' +

      '<div class="drawer-bg" data-close></div>' +
      '<aside class="drawer left" id="drawer-menu" aria-hidden="true"><div class="drawer-head"><h3>' + t('menu') + '</h3><button type="button" data-close aria-label="' + t('close') + '">' + icon('x') + '</button></div>' +
      '<nav class="mnav">' + NAV.map(function (n) { return '<a href="' + n.href + '">' + t(n.key) + '</a>'; }).join('') +
      '<a href="cart.html">' + t('cart') + '</a>' +
      '<a href="#" data-action="lang">' + (lang === 'fr' ? 'English' : 'Français') + '</a></nav></aside>' +
      '<aside class="drawer right" id="drawer-wishlist" aria-hidden="true"><div class="drawer-head"><h3>' + t('wishlist_title') + '</h3><button type="button" data-close aria-label="' + t('close') + '">' + icon('x') + '</button></div>' +
      '<div class="cart-lines" id="wish-list"></div></aside>' +
      '<div class="search-ov" id="drawer-search" role="dialog" aria-label="' + t('search') + '" aria-hidden="true"><div class="bzx-container">' +
      '<form class="search-bar" action="shop.html" method="get" role="search">' + icon('search', 24) +
      '<input type="search" name="q" autocomplete="off" placeholder="' + esc(t('search_ph')) + '" aria-label="' + t('search') + '">' +
      '<button type="button" data-close aria-label="' + t('close') + '">' + icon('x', 24) + '</button></form></div></div>';
    $('#site-header').innerHTML = h;
  }
  function renderWishDrawer() {
    var box = $('#wish-list'); if (!box) return;
    var items = wish.map(byId).filter(Boolean);
    box.innerHTML = items.length ? items.map(function (p) {
      return '<div class="line"><a href="' + pUrl(p) + '"><img src="' + esc(p.images[0]) + '" alt="" loading="lazy"></a><div><a href="' + pUrl(p) + '"><h4>' + esc(L(p.name)) + '</h4></a>' +
        '<button type="button" class="rm" data-action="wish" data-id="' + esc(p.id) + '">' + t('remove') + '</button></div><div class="lp">' + money(p.price) + '</div></div>';
    }).join('') : '<p class="cart-empty">' + t('wishlist_empty') + '</p>';
  }
  function renderFooter() {
    var soc = [['instagram', 'insta', 'Instagram'], ['facebook', 'facebook', 'Facebook'], ['tiktok', 'tiktok', 'TikTok']].filter(function (s) { return C[s[0]]; })
      .map(function (s) { return '<a href="' + esc(C[s[0]]) + '" target="_blank" rel="noopener" aria-label="' + s[2] + '">' + icon(s[1], 18) + '</a>'; }).join('');
    $('#site-footer').innerHTML = '<footer class="footer"><div class="bzx-container"><div class="cols">' +
      '<div><a class="logo" href="index.html"><span class="word"><span class="name">' + esc(C.name) + '</span>' +
      (L(C.tagline) ? '<span class="sub"><i></i>' + esc(L(C.tagline)) + '<i></i></span>' : '') + '</span></a>' +
      '<p>' + esc(lang === 'fr' ? (C.footerText && C.footerText.fr) || '' : (C.footerText && C.footerText.en) || '') + '</p><div class="socials">' + soc + '</div></div>' +
      '<div><h4>' + t('footer_shop') + '</h4><ul><li><a href="index.html">' + t('home') + '</a></li><li><a href="shop.html">' + t('collections') + '</a></li>' +
      '<li><a href="shop.html?cat=new">' + t('f_new') + '</a></li><li><a href="shop.html?cat=sale">' + t('f_sale') + '</a></li></ul></div>' +
      '<div><h4>' + t('footer_info') + '</h4><ul><li><a href="cart.html">' + t('cart') + '</a></li><li><a href="contact.html">' + t('contact') + '</a></li></ul></div>' +
      '<div><h4>' + t('footer_contact') + '</h4><ul>' +
      (C.phone ? '<li><a href="tel:' + esc(String(C.phone).replace(/\s/g, '')) + '">' + esc(C.phone) + '</a></li>' : '') +
      (C.email ? '<li><a href="mailto:' + esc(C.email) + '">' + esc(C.email) + '</a></li>' : '') +
      (L(C.city) ? '<li>' + esc(L(C.city)) + '</li>' : '') + '<li>' + t('footer_cod') + '</li></ul></div></div>' +
      '<div class="bottom"><span>© ' + new Date().getFullYear() + ' ' + esc(C.name) + ' — ' + t('rights') + '</span><span>' + t('footer_tag') + '</span></div></div></footer>';
  }

  /* ------------------------------------------------------------ newsletter / forms */
  function newsletter() {
    var n = S.ui[lang];
    return '<section class="sec news"><div class="bzx-container"><div class="eyebrow">' + n.nl_eyebrow + '</div><h2>' + n.nl_title + '</h2><p>' + n.nl_text + '</p>' +
      '<form data-form="newsletter" novalidate><input type="email" name="email" required placeholder="' + esc(n.nl_ph) + '" aria-label="' + esc(n.nl_ph) + '">' +
      '<button type="submit" class="btn btn-dark">' + n.nl_btn + '</button></form><small class="form-msg" role="status"></small></div></section>';
  }
  function sendForm(kind, data) {
    if (C.formEndpoint) {
      return fetch(C.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(Object.assign({ _kind: kind }, data)) })
        .then(function (r) { if (!r.ok) throw new Error('bad'); return 'sent'; });
    }
    var subject = kind === 'contact' ? (data.subject || 'Contact') : 'Newsletter';
    var body = kind === 'contact' ? (data.message + '\n\n' + data.email) : data.email;
    location.href = 'mailto:' + C.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    return Promise.resolve('mail');
  }

  /* ------------------------------------------------------------ PAGES */
  function pageHome() {
    var H = S.home, hero = H.hero, h = '';
    h += '<section class="hero"><div class="bzx-container"><div>' +
      (L(hero.pill) ? '<span class="pill">✦ ' + esc(L(hero.pill)) + ' ✦</span>' : '') +
      '<h1>' + esc(L(hero.title)) + (L(hero.subtitle) ? '<em>' + esc(L(hero.subtitle)) + '</em>' : '') + '</h1>' +
      (L(hero.text) ? '<p class="lead">' + esc(L(hero.text)) + '</p>' : '') +
      '<div class="ctas">' +
      (hero.button1 ? '<a class="btn btn-dark" href="' + esc(hero.button1.href) + '">' + esc(L(hero.button1.label)) + ' ' + icon('arrow', 13) + '</a>' : '') +
      (hero.button2 ? '<a class="btn btn-ghost" href="' + esc(hero.button2.href) + '">' + esc(L(hero.button2.label)) + '</a>' : '') + '</div>' +
      ((hero.stats && hero.stats.length) ? '<div class="stats">' + hero.stats.map(function (s) { return '<div><b>' + esc(s.value) + '</b><small>' + esc(L(s.label)) + '</small></div>'; }).join('') + '</div>' : '') +
      '</div><div class="hero-art"><div class="arch"><img src="' + esc(hero.image) + '" alt="' + esc(L(hero.title)) + '"></div>' +
      (hero.image2 ? '<div class="mini"><img src="' + esc(hero.image2) + '" alt=""></div>' : '') +
      (hero.tag ? '<a class="tag" href="' + esc(hero.tag.href) + '">' + esc(L(hero.tag.label)) + ' ' + icon('arrow-ur', 13) + '</a>' : '') +
      '</div></div></section>';

    h += '<section class="trust"><div class="bzx-container">' + H.trust.map(function (i) {
      return '<div class="item">' + icon(i.icon, 22) + '<div><b>' + esc(L(i.title)) + '</b><small>' + esc(L(i.text)) + '</small></div></div>';
    }).join('') + '</div></section>';

    var cats = H.categories;
    h += '<section class="sec"><div class="bzx-container">' +
      head(cats.eyebrow, cats.title, '<a class="link-arrow" href="shop.html">' + t('view_all') + ' ' + icon('arrow', 13) + '</a>') +
      '<div class="cats">' + cats.tiles.map(function (c) {
        return '<a class="cat" href="' + esc(c.href) + '"><img loading="lazy" src="' + esc(c.image) + '" alt="' + esc(L(c.label)) + '"><span class="lbl"><span><small>' + esc(L(c.small)) + '</small><h3>' + esc(L(c.label)) + '</h3></span>' + icon('arrow-ur', 18) + '</span></a>';
      }).join('') + '</div></div></section>';

    var f = H.featured, list = (f.productIds && f.productIds.length ? f.productIds.map(byId).filter(Boolean) : PRODUCTS.slice(0, 4));
    h += '<section class="sec bg-sand"><div class="bzx-container">' +
      head(f.eyebrow, f.title, '<a class="link-arrow" href="' + esc(f.href || 'shop.html') + '">' + esc(L(f.button) || t('view_all')) + ' ' + icon('arrow', 13) + '</a>') +
      '<div class="grid">' + list.map(card).join('') + '</div></div></section>';

    var o = H.offer;
    h += '<section class="sec"><div class="bzx-container"><div class="offer">' +
      '<div class="eyebrow">' + esc(L(o.eyebrow)) + '</div><h3>' + esc(L(o.title)) + '</h3><p>' + esc(L(o.text)) + '</p>' +
      (o.code ? '<span class="code">' + esc(o.code) + '</span>' : '') +
      (L(o.button) ? '<a class="btn" href="' + esc(o.href) + '">' + esc(L(o.button)) + '</a>' : '') + '</div></div></section>';

    var s = H.story;
    h += '<section class="sec bg-sand"><div class="bzx-container"><div class="philo"><div class="pics"><div><img loading="lazy" src="' + esc(s.image1) + '" alt=""></div><div><img loading="lazy" src="' + esc(s.image2) + '" alt=""></div></div><div>' +
      '<div class="eyebrow">' + esc(L(s.eyebrow)) + '</div><h2>' + esc(L(s.title)) + '</h2><p>' + esc(L(s.text)) + '</p>' +
      '<ul>' + s.points.map(function (p) { return '<li>' + icon('check', 16) + esc(L(p)) + '</li>'; }).join('') + '</ul>' +
      '<a class="btn btn-dark" href="' + esc(s.href) + '">' + esc(L(s.button)) + '</a></div></div></div></section>';

    return { title: '', html: h + newsletter() };
  }

  function pageShop() {
    var q = params(), catId = q.cat || 'all', term = (q.q || '').trim(), sort = q.sort || '';
    var cat = null; S.categories.forEach(function (c) { if (c.id === catId) cat = c; });
    if (!cat) { cat = S.categories[0]; catId = cat.id; }
    var list = PRODUCTS.filter(function (p) {
      if (cat.rule === 'new' && !p.new) return false;
      if (cat.rule === 'sale' && !onSale(p)) return false;
      if (term) {
        var hay = (L(p.name) + ' ' + L(p.desc) + ' ' + p.name.fr + ' ' + p.name.en).toLowerCase();
        return term.toLowerCase().split(/\s+/).every(function (w) { return hay.indexOf(w) >= 0; });
      }
      return true;
    });
    if (sort === 'asc') list.sort(function (a, b) { return a.price - b.price; });
    if (sort === 'desc') list.sort(function (a, b) { return b.price - a.price; });
    function href(c, srt) {
      var p = []; if (c && c !== 'all') p.push('cat=' + c); if (term) p.push('q=' + encodeURIComponent(term)); if (srt) p.push('sort=' + srt);
      return 'shop.html' + (p.length ? '?' + p.join('&') : '');
    }
    var title = term ? t('results_for', { q: term }) : L(cat.label);
    var h = crumbs([{ label: t('home'), href: 'index.html' }, { label: t('collections'), href: catId === 'all' && !term ? '' : 'shop.html' }].concat(catId === 'all' && !term ? [] : [{ label: title }]));
    h += '<div class="bzx-container">' + listHead(t('shop_eyebrow'), term ? title : (catId === 'all' ? t('shop_title') : title),
      '<div class="head-tools"><span class="count">' + countLabel(list.length) + '</span>' +
      '<select class="select" id="sort" aria-label="' + t('sort') + '">' +
      '<option value="">' + t('sort_default') + '</option><option value="asc"' + (sort === 'asc' ? ' selected' : '') + '>' + t('sort_asc') + '</option><option value="desc"' + (sort === 'desc' ? ' selected' : '') + '>' + t('sort_desc') + '</option></select></div>');
    h += '<nav class="subcats" aria-label="Filtres">' + S.categories.map(function (c) {
      return '<a class="sw' + (c.id === catId ? ' on' : '') + '" href="' + href(c.id, sort) + '">' + esc(L(c.label)) + '</a>';
    }).join('') + '</nav>';
    h += list.length ? '<div class="grid">' + list.map(card).join('') + '</div>' : '<p class="empty">' + t('no_results') + '</p>';
    h += '</div>';
    return { title: title, html: h, after: function () { var s = $('#sort'); if (s) s.addEventListener('change', function () { location.href = href(catId, s.value); }); } };
  }

  function pageProduct() {
    var p = byId(params().id);
    if (!p) {
      return { title: t('not_found'), html: crumbs([{ label: t('home'), href: 'index.html' }, { label: t('not_found') }]) +
        '<div class="bzx-container"><div class="empty"><p>' + t('not_found') + '</p><p><a class="btn btn-dark" href="shop.html">' + t('back_shop') + '</a></p></div></div>' };
    }
    var inW = wish.indexOf(p.id) >= 0;
    var colors = p.colors || [];
    var h = crumbs([{ label: t('home'), href: 'index.html' }, { label: t('collections'), href: 'shop.html' }, { label: L(p.name) }]);
    h += '<div class="bzx-container"><div class="pdp" data-product="' + esc(p.id) + '"><div class="gallery"><div class="main-img">' +
      (onSale(p) ? '<span class="badge-red big">-' + off(p) + '%</span>' : '') +
      '<img id="pdp-main" src="' + esc(p.images[0]) + '" alt="' + esc(L(p.name)) + '"></div>' +
      (p.images.length > 1 ? '<div class="thumbs">' + p.images.map(function (src, i) {
        return '<button type="button" class="' + (i === 0 ? 'on' : '') + '" data-action="thumb" data-src="' + esc(src) + '" aria-label="' + esc(L(p.name)) + ' ' + (i + 1) + '"><img loading="lazy" src="' + esc(src) + '" alt=""></button>';
      }).join('') + '</div>' : '') + '</div>' +
      '<div class="details"><h1>' + esc(L(p.name)) + '</h1>' + priceHtml(p) +
      (p.stock > 0 ? '<div class="stock">' + (p.stock <= 5 ? t('only_left', { n: p.stock }) : t('in_stock')) + '</div>' : '<div class="stock out">' + t('sold_out') + '</div>') +
      '<div class="desc rte"><p>' + esc(L(p.desc)) + '</p></div><div class="buy">' +
      (colors.length > 1 ? '<div class="opt"><span class="opt-label">' + t('color') + '</span><div class="swatches" id="swatches">' + colors.map(function (c, i) {
        return '<button type="button" class="sw' + (i === 0 ? ' on' : '') + '" data-action="color" data-i="' + i + '">' + esc(L(c)) + '</button>';
      }).join('') + '</div></div>' : '') +
      '<div class="opt"><span class="opt-label">' + t('quantity') + '</span><div class="qty"><button type="button" data-action="step" data-d="-1" aria-label="' + t('decrease') + '">−</button>' +
      '<input type="number" id="pdp-qty" value="1" min="1" max="' + p.stock + '" inputmode="numeric" aria-label="' + t('quantity') + '"><button type="button" data-action="step" data-d="1" aria-label="' + t('increase') + '">+</button></div></div>' +
      '<button type="button" class="btn btn-dark btn-block" data-action="add" data-id="' + esc(p.id) + '"' + (p.stock <= 0 ? ' disabled' : '') + '>' + (p.stock > 0 ? t('add_to_cart') : t('sold_out')) + '</button>' +
      '<button type="button" class="btn btn-ghost btn-block' + (inW ? ' on' : '') + '" data-action="wish" data-id="' + esc(p.id) + '" aria-pressed="' + inW + '">' + icon('heart', 15) + ' ' + (inW ? t('wishlist_del') : t('wishlist_add')) + '</button></div>' +
      '<div class="perks"><div>' + icon('truck', 18) + t('perk_delivery') + '</div><div>' + icon('cash', 18) + t('perk_cod') + '</div><div>' + icon('swap', 18) + t('perk_exchange') + '</div></div></div></div>';
    var rel = PRODUCTS.filter(function (x) { return x.id !== p.id; }).slice(0, 4);
    if (rel.length) h += '<section class="related"><div class="sec-head"><div><h2>' + t('related') + '</h2></div></div><div class="grid">' + rel.map(card).join('') + '</div></section>';
    h += '</div>';
    return { title: L(p.name), html: h };
  }

  function summaryHtml(tt, withCheckout) {
    return '<aside class="summary"><h3>' + t('summary') + '</h3>' +
      '<div class="row"><span>' + t('subtotal') + '</span><span>' + money(tt.sub) + '</span></div>' +
      (tt.disc ? '<div class="row"><span>' + t('discount') + ' (' + esc(coupon) + ')</span><span>− ' + money(tt.disc) + '</span></div>' : '') +
      '<div class="row"><span>' + t('shipping') + '</span><span>' + (tt.ship ? money(tt.ship) : t('free')) + '</span></div>' +
      '<div class="row total"><span>' + t('total') + '</span><span>' + money(tt.total) + '</span></div>' +
      '<p class="note">' + t('cod_note') + '</p>' +
      (withCheckout ? '<form class="coupon" data-form="coupon"><input class="field" type="text" name="code" placeholder="' + esc(t('coupon')) + '" aria-label="' + esc(t('coupon')) + '"><button type="submit" class="btn btn-ghost">' + t('coupon_apply') + '</button></form>' +
        '<small class="form-msg" role="status"></small>' +
        (coupon ? '<button type="button" class="link-arrow coupon-remove" data-action="coupon-remove">' + t('coupon_remove') + '</button>' : '') +
        '<a class="btn btn-dark btn-block" href="checkout.html">' + t('checkout') + '</a>' : '') + '</aside>';
  }

  function pageCart() {
    var lines = cartLines(), tt = totals();
    var h = '<div class="bzx-container">' + listHead(t('cart_eyebrow'), t('cart_title'));
    if (!lines.length) {
      h += '<div class="empty"><p>' + t('cart_empty') + '</p><p><a class="btn btn-dark" href="shop.html">' + t('continue') + '</a></p></div></div>';
      return { title: t('cart_title'), html: h };
    }
    var ship = '';
    if (C.freeShippingFrom > 0) {
      var after = tt.sub - tt.disc, left = C.freeShippingFrom - after, pct = Math.min(100, Math.round(after * 100 / C.freeShippingFrom));
      ship = '<div class="ship"><p class="note">' + (left > 0 ? t('free_ship_left', { amount: money(left) }) : t('free_ship_ok')) + '</p><div class="ship-bar"><i style="width:' + pct + '%"></i></div></div>';
    }
    h += '<div class="cartpage"><div>' + ship + lines.map(function (l) {
      var cn = colorName(l.p, l.item.color);
      return '<div class="line"><a href="' + pUrl(l.p) + '"><img src="' + esc(l.p.images[0]) + '" alt="' + esc(L(l.p.name)) + '" loading="lazy"></a><div>' +
        '<a href="' + pUrl(l.p) + '"><h4>' + esc(L(l.p.name)) + '</h4></a>' + (cn && l.p.colors.length > 1 ? '<div class="meta">' + esc(cn) + '</div>' : '') +
        '<div class="qty"><button type="button" data-action="line-step" data-key="' + esc(l.key) + '" data-d="-1" aria-label="' + t('decrease') + '">−</button><input type="number" value="' + l.item.qty + '" min="1" max="' + l.p.stock + '" data-key="' + esc(l.key) + '" data-action="line-set" aria-label="' + t('quantity') + '">' +
        '<button type="button" data-action="line-step" data-key="' + esc(l.key) + '" data-d="1" aria-label="' + t('increase') + '">+</button></div>' +
        '<button type="button" class="rm" data-action="line-remove" data-key="' + esc(l.key) + '">' + t('remove') + '</button></div><div class="lp">' + money(l.total) + '</div></div>';
    }).join('') + '<div class="cart-actions"><a class="link-arrow" href="shop.html">' + t('continue') + '</a></div></div>' + summaryHtml(tt, true) + '</div></div>';
    return { title: t('cart_title'), html: h };
  }

  var lastOrder = null;
  function pageCheckout() {
    var lines = cartLines(), tt = totals();
    if (lastOrder) {
      var o = lastOrder;
      return { title: t('order_sent_title'), html: '<div class="bzx-container"><div class="empty done">' + icon('check', 34) + '<h1>' + t('order_sent_title') + '</h1><p>' + t('order_sent_text', { id: o.id }) + '</p>' +
        '<p><a class="btn btn-dark" href="' + esc(o.url) + '" target="_blank" rel="noopener">' + icon('whatsapp', 16) + ' ' + t('order_open_wa') + '</a> <a class="btn btn-ghost" href="index.html">' + t('order_again') + '</a></p></div></div>' };
    }
    if (!lines.length) {
      return { title: t('checkout_title'), html: '<div class="bzx-container">' + listHead(t('checkout_eyebrow'), t('checkout_title')) + '<div class="empty"><p>' + t('cart_empty') + '</p><p><a class="btn btn-dark" href="shop.html">' + t('continue') + '</a></p></div></div>' };
    }
    function fld(id, label, type, extra) {
      return '<div><label for="co-' + id + '">' + label + '</label>' + (type === 'textarea'
        ? '<textarea class="field" id="co-' + id + '" name="' + id + '" rows="3"></textarea>'
        : '<input class="field" id="co-' + id + '" name="' + id + '" type="' + type + '" ' + (extra || '') + '>') + '<small class="err" hidden></small></div>';
    }
    var h = '<div class="bzx-container">' + listHead(t('checkout_eyebrow'), t('checkout_title')) +
      '<div class="cartpage"><form class="form-grid" data-form="order" novalidate>' +
      fld('name', t('f_name'), 'text', 'required autocomplete="name"') + fld('phone', t('f_phone'), 'tel', 'required autocomplete="tel" inputmode="tel"') +
      fld('city', t('f_city'), 'text', 'required autocomplete="address-level2"') + fld('address', t('f_address'), 'textarea') + fld('notes', t('f_notes'), 'textarea') +
      '<button type="submit" class="btn btn-dark">' + icon('whatsapp', 16) + ' ' + t('place_order') + '</button><small class="form-msg" role="status"></small></form>' +
      '<aside class="summary"><h3>' + t('summary') + '</h3>' + lines.map(function (l) {
        return '<div class="row"><span>' + esc(L(l.p.name)) + ' × ' + l.item.qty + '</span><span>' + money(l.total) + '</span></div>';
      }).join('') +
      '<div class="row"><span>' + t('subtotal') + '</span><span>' + money(tt.sub) + '</span></div>' +
      (tt.disc ? '<div class="row"><span>' + t('discount') + '</span><span>− ' + money(tt.disc) + '</span></div>' : '') +
      '<div class="row"><span>' + t('shipping') + '</span><span>' + (tt.ship ? money(tt.ship) : t('free')) + '</span></div>' +
      '<div class="row total"><span>' + t('total') + '</span><span>' + money(tt.total) + '</span></div><p class="note">' + t('cod_note') + '</p></aside></div></div>';
    return { title: t('checkout_title'), html: h };
  }

  function pageContact() {
    var h = crumbs([{ label: t('home'), href: 'index.html' }, { label: t('contact') }]) +
      '<div class="bzx-container page-wrap">' + listHead(t('contact_eyebrow'), t('contact_title')) +
      '<div class="contact-grid"><div><p class="lead-text">' + t('contact_intro') + '</p><ul class="contact-list">' +
      (C.phone ? '<li>' + icon('whatsapp', 18) + '<a href="tel:' + esc(String(C.phone).replace(/\s/g, '')) + '">' + esc(C.phone) + '</a></li>' : '') +
      (C.email ? '<li>' + icon('arrow-ur', 18) + '<a href="mailto:' + esc(C.email) + '">' + esc(C.email) + '</a></li>' : '') +
      (L(C.city) ? '<li>' + icon('truck', 18) + esc(L(C.city)) + '</li>' : '') + '</ul></div>' +
      '<form class="form-grid contact-form" data-form="contact" novalidate>' +
      '<div><label for="c-email">' + t('f_email') + '</label><input class="field" id="c-email" name="email" type="email" required><small class="err" hidden></small></div>' +
      '<div><label for="c-subject">' + t('f_subject') + '</label><input class="field" id="c-subject" name="subject" type="text"></div>' +
      '<div><label for="c-message">' + t('f_message') + '</label><textarea class="field" id="c-message" name="message" rows="6" required></textarea><small class="err" hidden></small></div>' +
      '<button type="submit" class="btn btn-dark">' + t('send') + '</button><small class="form-msg" role="status"></small></form></div></div>';
    return { title: t('contact_title'), html: h };
  }

  var PAGES = { home: pageHome, shop: pageShop, product: pageProduct, cart: pageCart, checkout: pageCheckout, contact: pageContact };

  /* ------------------------------------------------------------ render everything */
  function applyImageSettings() {
    var im = C.images || {}, r = doc.documentElement.style;
    if (im.cardRatio) r.setProperty('--card-ratio', im.cardRatio);
    if (im.productRatio) r.setProperty('--product-ratio', im.productRatio);
    if (im.columns) r.setProperty('--cols', im.columns);
    if (im.heroHeight) r.setProperty('--hero-h', im.heroHeight);
    if (im.tileHeight) r.setProperty('--tile-h', im.tileHeight);
  }
  function updateBadges() {
    var c = $('#cart-count'), w = $('#wish-count');
    if (c) { c.textContent = cartCount(); c.hidden = cartCount() === 0; }
    if (w) { w.textContent = wish.length; w.hidden = wish.length === 0; }
  }
  function renderMain() {
    var page = (PAGES[PAGE] || pageHome)();
    $('#main').innerHTML = page.html;
    var base = C.name + (L(C.tagline) ? ' — ' + L(C.tagline) : '');
    doc.title = page.title ? page.title + ' — ' + C.name : base;
    if (page.after) page.after();
  }
  function renderAll() {
    doc.documentElement.lang = lang;
    renderHeader(); renderWishDrawer(); renderMain(); renderFooter();
    var skip = $('.skip-link'); if (skip) skip.textContent = t('skip');
  }
  function refreshMainKeepScroll() { var y = window.scrollY; renderMain(); window.scrollTo(0, y); }

  /* ------------------------------------------------------------ drawers */
  var openEl = null;
  function openPanel(name) {
    var el = $('#drawer-' + name); if (!el) return;
    closePanel(); if (name === 'wishlist') renderWishDrawer();
    el.classList.add('open'); el.setAttribute('aria-hidden', 'false');
    var bg = $('.drawer-bg'); if (bg) bg.classList.add('open');
    openEl = el; var inp = $('input[type="search"]', el); if (inp) setTimeout(function () { inp.focus(); }, 50);
  }
  function closePanel() {
    if (!openEl) return;
    openEl.classList.remove('open'); openEl.setAttribute('aria-hidden', 'true');
    var bg = $('.drawer-bg'); if (bg) bg.classList.remove('open'); openEl = null;
  }

  /* ------------------------------------------------------------ events */
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePanel(); });
  doc.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-open],[data-close],[data-action]') : null;
    if (!el) return;
    if (el.hasAttribute('data-open')) { e.preventDefault(); openPanel(el.getAttribute('data-open')); return; }
    if (el.hasAttribute('data-close')) { e.preventDefault(); closePanel(); return; }
    var a = el.getAttribute('data-action'), id = el.getAttribute('data-id'), key = el.getAttribute('data-key');
    if (a === 'lang') { e.preventDefault(); lang = lang === 'fr' ? 'en' : 'fr'; store.set('bzx_lang', lang); closePanel(); renderAll(); return; }
    if (a === 'wish') {
      e.preventDefault(); toggleWish(id); updateBadges(); renderWishDrawer();
      $$('[data-action="wish"][data-id="' + id + '"]').forEach(function (b) {
        var on = wish.indexOf(id) >= 0; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
        if (b.classList.contains('btn')) b.innerHTML = icon('heart', 15) + ' ' + (on ? t('wishlist_del') : t('wishlist_add'));
      });
      return;
    }
    if (a === 'thumb') { var m = $('#pdp-main'); if (m) m.src = el.getAttribute('data-src'); $$('.thumbs button').forEach(function (b) { b.classList.toggle('on', b === el); }); return; }
    if (a === 'color') { $$('#swatches .sw').forEach(function (b) { b.classList.toggle('on', b === el); }); return; }
    if (a === 'step') {
      var inp = $('#pdp-qty'), max = parseInt(inp.max, 10) || 99;
      inp.value = Math.max(1, Math.min(max, (parseInt(inp.value, 10) || 1) + parseInt(el.getAttribute('data-d'), 10))); return;
    }
    if (a === 'add') {
      var q = parseInt(($('#pdp-qty') || {}).value, 10) || 1, sel = $('#swatches .sw.on'), color = sel ? parseInt(sel.getAttribute('data-i'), 10) : 0;
      if (addToCart(id, q, color)) { updateBadges(); toast(t('added'), 'cart.html', t('cart')); }
      return;
    }
    if (a === 'line-step') {
      var cur = 0; cart.forEach(function (i) { if (lineKey(i) === key) cur = i.qty; });
      setQty(key, cur + parseInt(el.getAttribute('data-d'), 10)); updateBadges(); refreshMainKeepScroll(); return;
    }
    if (a === 'line-remove') { setQty(key, 0); updateBadges(); refreshMainKeepScroll(); return; }
    if (a === 'coupon-remove') { coupon = ''; store.set('bzx_coupon', ''); refreshMainKeepScroll(); return; }
  });
  doc.addEventListener('change', function (e) {
    var el = e.target;
    if (el.getAttribute && el.getAttribute('data-action') === 'line-set') {
      setQty(el.getAttribute('data-key'), parseInt(el.value, 10) || 1); updateBadges(); refreshMainKeepScroll();
    }
  });

  function fieldError(form, name, msg) {
    var inp = form.elements[name]; if (!inp) return;
    var err = inp.parentNode.querySelector('.err');
    if (err) { err.textContent = msg || ''; err.hidden = !msg; }
    inp.classList.toggle('bad', !!msg);
  }
  function validPhone(v) { return /^[+0-9][0-9 ().-]{7,}$/.test(v.trim()); }
  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }

  doc.addEventListener('submit', function (e) {
    var form = e.target, kind = form.getAttribute && form.getAttribute('data-form');
    if (!kind) return;
    e.preventDefault();
    var msg = form.parentNode.querySelector('.form-msg') || form.querySelector('.form-msg');
    function say(s, bad) { if (msg) { msg.textContent = s; msg.className = 'form-msg' + (bad ? ' bad' : ' ok'); } }

    if (kind === 'coupon') {
      var code = (form.elements.code.value || '').trim().toUpperCase();
      if (code && C.coupons && C.coupons[code]) { coupon = code; store.set('bzx_coupon', code); refreshMainKeepScroll(); }
      else say(t('coupon_bad'), true);
      return;
    }
    if (kind === 'newsletter') {
      if (!validEmail(form.elements.email.value)) { say(t('required'), true); return; }
      sendForm('newsletter', { email: form.elements.email.value.trim() }).then(function (r) { say(r === 'sent' ? t('nl_ok') : t('mail_opened')); form.reset(); }, function () { say(t('error'), true); });
      return;
    }
    if (kind === 'contact') {
      var ok = true;
      if (!validEmail(form.elements.email.value)) { fieldError(form, 'email', t('required')); ok = false; } else fieldError(form, 'email');
      if (!form.elements.message.value.trim()) { fieldError(form, 'message', t('required')); ok = false; } else fieldError(form, 'message');
      if (!ok) return;
      sendForm('contact', { email: form.elements.email.value.trim(), subject: form.elements.subject.value.trim(), message: form.elements.message.value.trim() })
        .then(function (r) { say(r === 'sent' ? t('sent_ok') : t('mail_opened')); if (r === 'sent') form.reset(); }, function () { say(t('error'), true); });
      return;
    }
    if (kind === 'order') {
      var good = true, f = form.elements;
      ['name', 'city', 'address'].forEach(function (n) { if (!f[n].value.trim()) { fieldError(form, n, t('required')); good = false; } else fieldError(form, n); });
      if (!validPhone(f.phone.value)) { fieldError(form, 'phone', f.phone.value.trim() ? t('phone_bad') : t('required')); good = false; } else fieldError(form, 'phone');
      if (!good) return;
      var lines = cartLines(), tt = totals(), id = 'BZX-' + Date.now().toString(36).toUpperCase().slice(-6);
      var text = t('wa_hello') + ' (' + id + ')\n\n' + lines.map(function (l) {
        var cn = colorName(l.p, l.item.color);
        return '• ' + L(l.p.name) + (cn && l.p.colors.length > 1 ? ' (' + cn + ')' : '') + ' × ' + l.item.qty + ' — ' + money(l.total);
      }).join('\n') + '\n\n' + t('subtotal') + ': ' + money(tt.sub) +
        (tt.disc ? '\n' + t('discount') + ': −' + money(tt.disc) : '') + '\n' + t('shipping') + ': ' + (tt.ship ? money(tt.ship) : t('free')) +
        '\n' + t('wa_total') + ': ' + money(tt.total) + '\n\n' + t('wa_customer') + ': ' + f.name.value.trim() + '\n' + t('f_phone') + ': ' + f.phone.value.trim() +
        '\n' + t('f_city') + ': ' + f.city.value.trim() + '\n' + t('f_address') + ': ' + f.address.value.trim() + (f.notes.value.trim() ? '\n' + f.notes.value.trim() : '');
      var url = 'https://wa.me/' + String(C.whatsapp).replace(/\D/g, '') + '?text=' + encodeURIComponent(text);
      var orders = store.get('bzx_orders', []); orders.push({ id: id, at: new Date().toISOString(), total: tt.total, text: text }); store.set('bzx_orders', orders.slice(-20));
      if (C.formEndpoint) sendForm('order', { id: id, order: text, total: tt.total }).catch(function () { /* WhatsApp is the main channel */ });
      window.open(url, '_blank');
      lastOrder = { id: id, url: url };
      cart = []; saveCart(); coupon = ''; store.set('bzx_coupon', '');
      updateBadges(); renderMain(); window.scrollTo(0, 0);
    }
  });

  /* ------------------------------------------------------------ go */
  applyImageSettings();
  renderAll();
})();
