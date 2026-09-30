// public/js/layout.js
// -----------------------------------------------------------------------
// Shared site chrome for every storefront page, in the Beauty Charms
// style: header with centred menu (transparent over the home-page video,
// solid cream once you scroll), slide-in menu drawer on phones, drop-down
// search panel, dark newsletter band, beige footer, "Shop & Shine!"
// pop-up and a floating WhatsApp button. Edit it here once and every
// page updates.
//
// How pages use it:
//   <body>
//     <div id="sfHeader"></div>              <- data-transparent="true" = header floats over the hero (home page)
//     <script src="/js/site-config.js"></script>
//     <script src="/js/layout.js"></script>   <- renders the header right away
//     ... page content ...
//     <div id="sfFooter"></div>               <- data-newsletter="off" hides the newsletter band
//
// Contact details, social links, live categories, pop-up text and the
// Tawk.to chat id all come from config/storefront.js (via site-config.js).
// -----------------------------------------------------------------------

var SF_SITE = window.SF_SITE || { email: '', phone: '', social: {}, categories: [] };

// ---- Inline SVG icons (thin line icons like Beauty Charms) -------------
var SF_ICONS = {
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20.5 20.5l-4-4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.3-4 4.4-6 8-6s6.7 2 8 6"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10.1A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/>',
  bag: '<path d="M5.5 8h13l-1 12.5h-11z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
  down: '<path d="M6 9l6 6 6-6"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  left: '<path d="M15 5l-7 7 7 7"/>',
  right: '<path d="M9 5l7 7-7 7"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  phone: '<path d="M7 4h3l1.5 4-2 1.3a10 10 0 0 0 5.2 5.2l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 5 6.2 2 2 0 0 1 7 4z"/>',
  mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="M4 7l8 6 8-6"/>',
  pin: '<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  truck: '<path d="M3 6.5h11v9H3zM14 9.5h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  play: '<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>',
  pause: '<path d="M6.5 5h3.5v14H6.5zM14 5h3.5v14H14z" fill="currentColor" stroke="none"/>',
  instagram: '<rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><circle cx="16.8" cy="7.2" r=".6" fill="currentColor"/>',
  facebook: '<path d="M14 8.5h2.5V5H14a3.5 3.5 0 0 0-3.5 3.5V11H8v3.5h2.5V21H14v-6.5h2.5L17 11h-3V9a.5.5 0 0 1 .5-.5z"/>',
  tiktok: '<path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5M14 4c.5 2.6 2.3 4.2 5 4.4"/>',
  pinterest: '<circle cx="12" cy="12" r="8.5"/><path d="M10.5 20l1.8-7.5M11 13.5c.5 1.2 1.6 1.8 2.8 1.6 2-.3 3.2-2.4 3-4.7-.3-2.6-2.8-4.2-5.5-3.8-2.8.4-4.6 2.8-4.1 5.3"/>',
  youtube: '<rect x="3" y="6" width="18" height="12" rx="4"/><path d="M10.5 9.5v5l4.2-2.5z" fill="currentColor"/>',
  whatsapp: '<path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.3-1.1A8.5 8.5 0 1 0 12 3.5z"/><path d="M9 8.5c.2-.5.5-.5.8-.5h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.1-.2.3 0 .5.4.7 1 1.4 1.7 1.9.3.2.6.3.8.4.2.1.3 0 .5-.1l.6-.7c.2-.2.3-.2.5-.1l1.6.8c.2.1.3.2.3.4 0 .5-.2 1.2-.8 1.5-.6.3-1.3.4-2.6-.1-1.6-.6-3-1.9-3.9-3.3-.6-1-.9-1.9-.6-2.9z" fill="currentColor" stroke="none"/>',
};

function sfIcon(name, size) {
  var s = size || 20;
  return '<svg class="sf-ico" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (SF_ICONS[name] || '') + '</svg>';
}

/** Categories customers can currently see (others are hidden until launch). */
function sfLiveCategories() {
  return (SF_SITE.categories || []).filter(function (c) { return c.live; });
}

/** Free-shipping amount in Rupees, e.g. "Rs. 14,000" (formatted by the server). */
function sfFreeShippingText() {
  return (SF_SITE.formatted && SF_SITE.formatted.freeShippingThreshold) || '';
}

function sfTel() {
  return String(SF_SITE.phone || '').replace(/\s+/g, '');
}

/** WhatsApp number: config whatsapp, else the phone number (digits only). */
function sfWhatsAppNumber() {
  return String(SF_SITE.whatsapp || SF_SITE.phone || '').replace(/[^\d]/g, '');
}

function sfLogoHTML(extraClass) {
  return (
    '<a class="sf-logo ' + (extraClass || '') + '" href="/" aria-label="Sisfora — back to home">' +
      '<span class="sf-logo-mark"><img src="/images/brand/sisfora-mark-gold.webp" alt="" width="200" height="240"></span>' +
      '<span class="sf-logo-text"><span class="sf-logo-word">Sisfora</span><span class="sf-logo-sub">Cosmetics</span></span>' +
    '</a>'
  );
}

/** Menu drawer — slides in from the left on phones and tablets. */
function sfSideMenuHTML() {
  function link(href, label) {
    return '<li><a class="sf-side-link" href="' + href + '"><span class="sf-side-text">' + label + '</span>' + sfIcon('right', 16) + '</a></li>';
  }
  var categoryLinks = sfLiveCategories().map(function (c) {
    return '<li><a class="sf-side-link sf-side-sublink" href="/categories/' + c.slug + '"><span class="sf-side-text">' + c.name + '</span><span class="sf-side-tag">Shop</span></a></li>';
  }).join('');

  return (
    '<aside class="sf-sidebar" id="sfSidebar" aria-label="Main menu">' +
      '<div class="sf-sidebar-head">' +
        sfLogoHTML('sf-logo--side') +
        '<button type="button" class="sf-sidebar-close" id="sfSidebarClose" aria-label="Close menu">' + sfIcon('close', 20) + '</button>' +
      '</div>' +
      '<nav class="sf-side-nav" aria-label="Site">' +
        '<ul class="list-unstyled mb-0">' +
          link('/', 'Home') +
          link('/best-sellers', 'Best Sellers') +
          link('/shop', 'Our Collections') +
          link('/new-arrivals', 'New Arrivals') +
          link('/offers', 'Offers') +
          link('/faq', 'FAQ') +
          (categoryLinks ? '<li class="sf-side-label">Shop by Category</li>' + categoryLinks : '') +
          '<li class="sf-side-minor"><a href="/about">About</a><a href="/blog">Blog</a><a href="/contact">Contact</a><a href="/shipping">Delivery</a><a href="/wishlist">Wishlist</a><a href="/profile">My Account</a></li>' +
        '</ul>' +
      '</nav>' +
      '<div class="sf-sidebar-foot">' +
        '<a href="tel:' + sfTel() + '">' + sfIcon('phone', 16) + '<span>' + SF_SITE.phone + '</span></a>' +
        '<a href="mailto:' + SF_SITE.email + '">' + sfIcon('mail', 16) + '<span>' + SF_SITE.email + '</span></a>' +
        sfSocialIconsHTML('sf-side-social') +
      '</div>' +
    '</aside>' +
    '<div class="sf-sidebar-overlay" id="sfSidebarOverlay"></div>'
  );
}

/** Header: menu button (phones), logo, centred menu (desktop), icons. */
function sfNavbarHTML(transparent) {
  var catLinks = sfLiveCategories().map(function (c) {
    return '<li><a href="/categories/' + c.slug + '">' + c.name + '</a></li>';
  }).join('');
  function navLink(href, label) {
    return '<li class="sf-nav-item"><a href="' + href + '" class="sf-nav-link">' + label + '</a></li>';
  }
  return (
    '<header class="sf-header' + (transparent ? ' is-transparent' : '') + '" id="sfNavbar">' +
      '<div class="sf-header-inner">' +
        '<div class="sf-header-left">' +
          '<button type="button" class="sf-icon-btn sf-menu-btn" id="sfMenuBtn" aria-label="Open menu" aria-controls="sfSidebar" aria-expanded="false">' + sfIcon('menu', 24) + '</button>' +
          '<span class="d-none d-lg-inline-flex">' + sfLogoHTML('sf-logo--header') + '</span>' +
        '</div>' +
        '<nav class="sf-nav" aria-label="Primary">' +
          '<span class="d-lg-none">' + sfLogoHTML('sf-logo--header') + '</span>' +
          '<ul class="sf-nav-list d-none d-lg-flex">' +
            navLink('/', 'Home') +
            navLink('/best-sellers', 'Best Seller') +
            '<li class="sf-nav-item"><a href="/shop" class="sf-nav-link">Our Collections ' + sfIcon('down', 14) + '</a>' +
              '<ul class="sf-mega">' +
                '<li><a href="/shop">Shop All</a></li>' + catLinks +
                '<li><a href="/categories">All Categories</a></li>' +
              '</ul>' +
            '</li>' +
            navLink('/new-arrivals', 'New Arrivals') +
            navLink('/offers', 'Offers') +
            navLink('/faq', 'FAQ') +
          '</ul>' +
        '</nav>' +
        '<div class="sf-header-icons">' +
          '<button type="button" class="sf-icon-btn sf-search-toggle" id="sfSearchToggle" aria-label="Search" aria-controls="sfSearchPanel" aria-expanded="false">' + sfIcon('search', 21) + '</button>' +
          '<div class="dropdown d-inline-flex">' +
            '<a href="/profile" class="sf-icon-btn" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Account">' + sfIcon('user', 21) + '</a>' +
            '<ul class="dropdown-menu dropdown-menu-end sf-dropdown">' +
              '<li><a class="dropdown-item" href="/profile">My Account</a></li>' +
              '<li><a class="dropdown-item" href="/profile?tab=orders">Order History</a></li>' +
              '<li><a class="dropdown-item" href="/wishlist">Wishlist</a></li>' +
              '<li><hr class="dropdown-divider"></li>' +
              '<li><a class="dropdown-item" href="/login">Sign in / Register</a></li>' +
              '<li><a class="dropdown-item" href="#" id="logoutBtn">Sign out</a></li>' +
            '</ul>' +
          '</div>' +
          '<a href="/wishlist" class="sf-icon-btn sf-hide-xs" aria-label="Wishlist">' + sfIcon('heart', 21) +
            '<span class="badge-count" id="wishlistCount" data-count="wishlist">0</span></a>' +
          '<a href="/cart" class="sf-icon-btn js-open-cart" aria-label="Cart">' + sfIcon('bag', 21) +
            '<span class="badge-count" id="cartCount" data-count="cart">0</span></a>' +
        '</div>' +
      '</div>' +
      '<div class="sf-search-panel" id="sfSearchPanel">' +
        '<form action="/search" method="GET" class="sf-search-pill" id="sfSearchPill" role="search">' +
          sfIcon('search', 18) +
          '<input type="search" name="q" placeholder="Search serums, cleansers, moisturisers…" autocomplete="off" aria-label="Search products" />' +
          '<kbd class="sf-search-kbd d-none d-md-inline" aria-hidden="true">Esc</kbd>' +
          '<button type="submit" class="sf-search-submit" aria-label="Search">' + sfIcon('arrow', 18) + '</button>' +
        '</form>' +
      '</div>' +
    '</header>'
  );
}

function sfNewsletterHTML() {
  return (
    '<section class="sf-newsletter" aria-labelledby="sfNewsletterTitle">' +
      '<div class="container">' +
        '<div class="sf-newsletter-card sf-reveal">' +
          '<h2 class="sf-newsletter-title" id="sfNewsletterTitle">Newsletter</h2>' +
          '<p class="sf-newsletter-sub">' + (SF_SITE.newsletterIncentive || 'Subscribe to receive our latest offers, discounts, and beauty tips.') + '</p>' +
          '<form class="sf-newsletter-form" id="newsletterForm">' +
            '<label class="visually-hidden" for="sfNewsletterEmail">Email address</label>' +
            '<input type="email" id="sfNewsletterEmail" required placeholder="Your email address" autocomplete="email" />' +
            '<button type="submit">Subscribe</button>' +
          '</form>' +
          '<p class="sf-newsletter-note">By subscribing you agree to our <a href="/privacy-policy">privacy policy</a>. Unsubscribe any time.</p>' +
        '</div>' +
      '</div>' +
    '</section>'
  );
}

function sfSocialIconsHTML(extraClass) {
  var icons = [
    { key: 'instagram', label: 'Instagram' },
    { key: 'facebook', label: 'Facebook' },
    { key: 'youtube', label: 'YouTube' },
    { key: 'tiktok', label: 'TikTok' },
    { key: 'pinterest', label: 'Pinterest' },
  ];
  var social = SF_SITE.social || {};
  // Icons only appear once a real link is set in config/storefront.js
  var html = icons
    .filter(function (i) { return social[i.key]; })
    .map(function (i) {
      return '<a href="' + social[i.key] + '" class="social-icon" target="_blank" rel="noopener" aria-label="Sisfora on ' + i.label + '">' + sfIcon(i.key, 18) + '</a>';
    })
    .join('');
  var wa = sfWhatsAppNumber();
  if (wa) html += '<a href="https://wa.me/' + wa + '" class="social-icon" target="_blank" rel="noopener" aria-label="Chat with Sisfora on WhatsApp">' + sfIcon('whatsapp', 18) + '</a>';
  return html ? '<div class="sf-social ' + (extraClass || '') + '">' + html + '</div>' : '';
}

function sfFooterHTML() {
  var cats = sfLiveCategories().map(function (c) {
    return '<li><a href="/categories/' + c.slug + '">' + c.name + '</a></li>';
  }).join('');
  var wa = sfWhatsAppNumber();
  return (
    '<footer class="sf-footer">' +
      '<div class="container">' +
        '<div class="sf-footer-cols">' +
          '<div class="sf-reveal">' +
            '<h6>Our Mission</h6>' +
            '<p class="sf-footer-brand-name">Sisfora Cosmetics</p>' +
            '<p>Premium skincare crafted with care, bringing luxury and confidence to your everyday routine.</p>' +
            sfSocialIconsHTML() +
          '</div>' +
          '<div class="sf-reveal" style="--d:1">' +
            '<h6>Quick Links</h6><ul>' +
              '<li><a href="/about">About Us</a></li>' +
              '<li><a href="/terms">Terms &amp; Conditions</a></li>' +
              '<li><a href="/shipping">Shipping &amp; Delivery</a></li>' +
              '<li><a href="/faq#returns">Returns &amp; Refunds</a></li>' +
              '<li><a href="/privacy-policy">Privacy Policy</a></li>' +
              '<li><a href="/contact">Contact Us</a></li>' +
              '<li><a href="/blog">Blog</a></li>' +
            '</ul>' +
          '</div>' +
          '<div class="sf-reveal sf-footer-contact" style="--d:2">' +
            '<h6>Contact Us</h6><ul>' +
              '<li>' + sfIcon('phone', 16) + '<a href="tel:' + sfTel() + '">' + SF_SITE.phone + '</a></li>' +
              (wa ? '<li>' + sfIcon('whatsapp', 16) + '<a href="https://wa.me/' + wa + '" target="_blank" rel="noopener">WhatsApp: +' + wa + '</a></li>' : '') +
              '<li>' + sfIcon('mail', 16) + '<a href="mailto:' + SF_SITE.email + '">' + SF_SITE.email + '</a></li>' +
              (SF_SITE.address ? '<li>' + sfIcon('pin', 16) + '<span>' + SF_SITE.address + '</span></li>' : '') +
            '</ul>' +
          '</div>' +
          '<div class="sf-reveal" style="--d:3">' +
            '<h6>Customer Support</h6><ul>' +
              '<li><a href="/shop">All Products</a></li>' + cats +
              '<li><a href="/best-sellers">Best Sellers</a></li>' +
              '<li><a href="/new-arrivals">New Arrivals</a></li>' +
              '<li><a href="/offers">Offers</a></li>' +
              '<li><a href="/profile?tab=orders">Track My Order</a></li>' +
              '<li><a href="/faq">FAQs</a></li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="sf-footer-bottom">' +
          '<span>&copy; ' + new Date().getFullYear() + ' Sisfora Cosmetics. All rights reserved.</span>' +
          '<span class="sf-footer-pay"><span>Cash on Delivery</span><span>Visa</span><span>Mastercard</span></span>' +
        '</div>' +
      '</div>' +
    '</footer>' +
    '<div id="sfToast" class="toast-sf" role="status" aria-live="polite"></div>' +
    '<button type="button" class="sf-back-to-top" id="sfBackToTop" aria-label="Back to top">' + sfIcon('up', 20) + '</button>' +
    (wa ? '<a class="bc-wa" href="https://wa.me/' + wa + '" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">' + sfIcon('whatsapp', 30) + '</a>' : '')
  );
}

/** Highlight the menu link for the current page. */
function sfMarkActiveNav() {
  var path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('#sfSidebar .sf-side-link, #sfNavbar .sf-nav-link').forEach(function (link) {
    if (link.getAttribute('href') === path) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

/** Open / close the menu drawer (phones and tablets). */
function sfInitSideMenu() {
  var sidebar = document.getElementById('sfSidebar');
  var overlay = document.getElementById('sfSidebarOverlay');
  var menuBtn = document.getElementById('sfMenuBtn');
  if (!sidebar || !menuBtn) return;

  function setOpen(open) {
    sidebar.classList.toggle('open', open);
    overlay.classList.toggle('open', open);
    document.body.classList.toggle('sf-no-scroll', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) document.getElementById('sfSidebarClose').focus();
  }

  menuBtn.addEventListener('click', function () { setOpen(true); });
  overlay.addEventListener('click', function () { setOpen(false); });
  document.getElementById('sfSidebarClose').addEventListener('click', function () { setOpen(false); });
  sidebar.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) setOpen(false);
  });
}

/** Search icon drops the search panel down under the header. */
function sfInitSearchToggle() {
  var header = document.getElementById('sfNavbar');
  var toggle = document.getElementById('sfSearchToggle');
  var input = header && header.querySelector('#sfSearchPill input');
  if (!toggle || !input) return;
  function open() {
    header.classList.add('search-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.innerHTML = sfIcon('close', 21);
    setTimeout(function () { input.focus(); }, 80);
  }
  function close() {
    header.classList.remove('search-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = sfIcon('search', 21);
  }
  toggle.addEventListener('click', function () {
    if (header.classList.contains('search-open')) close(); else open();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && header.classList.contains('search-open')) close();
    // Desktop shortcut: press "/" to open search
    if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) {
      e.preventDefault();
      open();
    }
  });
  document.addEventListener('click', function (e) {
    // (the toggle swaps its icon on click, so the clicked svg may already be detached)
    if (!e.target.isConnected) return;
    if (header.classList.contains('search-open') && !header.contains(e.target)) close();
  });
}

// Header: rendered immediately (this script sits right after #sfHeader),
// so there is no flash of a page without a menu.
(function renderHeader() {
  var header = document.getElementById('sfHeader');
  if (!header) return;
  var transparent = header.dataset.transparent === 'true';
  header.outerHTML = sfSideMenuHTML() + sfNavbarHTML(transparent);
  sfMarkActiveNav();
  sfInitSideMenu();
  sfInitSearchToggle();
  // make sure the "scrolled" state is right even if the page loads half-way down
  var nav = document.getElementById('sfNavbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 12);
})();

/**
 * "Shop & Shine!" pop-up — shown once per visitor a few seconds after they
 * arrive (not on cart/checkout). Sign-ups go to Admin → Contact Messages.
 */
function sfInitPopup() {
  var promo = SF_SITE.promo;
  if (!promo || promo.popup === false) return;
  if (/^\/(checkout|order-confirmation|cart|login|register)/.test(window.location.pathname)) return;
  try {
    if (localStorage.getItem('sisfora_popup_seen') === '1') return;
  } catch (e) { /* storage unavailable — show it */ }

  setTimeout(function () {
    var wrap = document.createElement('div');
    wrap.className = 'bc-popup';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-labelledby', 'bcPopupTitle');
    wrap.innerHTML =
      '<div class="bc-popup-card">' +
        '<button type="button" class="bc-popup-close" aria-label="Close">' + sfIcon('close', 22) + '</button>' +
        '<div class="bc-popup-media"><video poster="/videos/hero-poster.jpg" autoplay muted loop playsinline><source src="/videos/hero.webm" type="video/webm"><source src="/videos/hero.mp4" type="video/mp4"></video></div>' +
        '<div class="bc-popup-body">' +
          '<h2 class="bc-popup-title" id="bcPopupTitle">' + (promo.popupTitle || 'Shop &amp; Shine!') + '</h2>' +
          '<p>' + (promo.popupText || 'Upgrade your beauty routine with Sisfora. Join our mailing list for special offers and beauty tips!') + '</p>' +
          '<form class="bc-popup-form">' +
            '<label class="visually-hidden" for="bcPopupEmail">Email</label>' +
            '<input type="email" id="bcPopupEmail" required placeholder="Email" autocomplete="email" />' +
            '<button type="submit" aria-label="Subscribe">' + sfIcon('right', 18) + '</button>' +
          '</form>' +
        '</div>' +
      '</div>';
    document.body.appendChild(wrap);
    requestAnimationFrame(function () { wrap.classList.add('show'); });

    function close() {
      wrap.classList.remove('show');
      try { localStorage.setItem('sisfora_popup_seen', '1'); } catch (e) { /* ignore */ }
      setTimeout(function () { wrap.remove(); }, 500);
    }
    wrap.querySelector('.bc-popup-close').addEventListener('click', close);
    wrap.addEventListener('click', function (e) { if (e.target === wrap) close(); });
    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onKey); }
    });
    wrap.querySelector('form').addEventListener('submit', async function (e) {
      e.preventDefault();
      var email = wrap.querySelector('input').value.trim();
      try {
        await sfFetch('/api/contact', {
          method: 'POST',
          body: { fullName: 'Newsletter subscriber', email: email, subject: 'Newsletter sign-up', message: 'Please add ' + email + ' to the Sisfora newsletter (pop-up).' },
        });
        if (typeof sfToast === 'function') sfToast('Thank you for subscribing!');
        close();
      } catch (err) {
        if (typeof sfToast === 'function') sfToast(err.message || 'Could not subscribe, please try again', 'error');
      }
    });
  }, 5000);
}

/** Tawk.to live chat — loads only when a property id is set in config/storefront.js. */
function sfInitChat() {
  var tawk = SF_SITE.tawk;
  if (!tawk || !tawk.propertyId) return;
  window.Tawk_API = window.Tawk_API || {};
  window.Tawk_LoadStart = new Date();
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://embed.tawk.to/' + tawk.propertyId + '/' + (tawk.widgetId || 'default');
  s.charset = 'UTF-8';
  s.setAttribute('crossorigin', '*');
  document.body.appendChild(s);
  document.body.classList.add('sf-has-chat'); // hides the WhatsApp bubble, lifts back-to-top
}

/** Contact details written in page content (Contact, Privacy, Terms) come from config too. */
function sfFillContactDetails() {
  document.querySelectorAll('.js-site-email').forEach(function (el) {
    el.textContent = SF_SITE.email;
    if (el.tagName === 'A') el.href = 'mailto:' + SF_SITE.email;
  });
  document.querySelectorAll('.js-site-phone').forEach(function (el) {
    el.textContent = SF_SITE.phone;
    if (el.tagName === 'A') el.href = 'tel:' + sfTel();
  });
  if (SF_SITE.formatted) {
    document.querySelectorAll('.js-free-threshold').forEach(function (el) { el.textContent = SF_SITE.formatted.freeShippingThreshold; });
    document.querySelectorAll('.js-flat-rate').forEach(function (el) { el.textContent = SF_SITE.formatted.shippingFlatRate; });
  }
}

/** Cart icons open the slide-out cart instead of leaving the page. */
function sfInitCartIcons() {
  document.addEventListener('click', function (e) {
    var link = e.target.closest('.js-open-cart');
    if (!link || typeof sfOpenCartDrawer !== 'function') return;
    if (window.location.pathname === '/cart' || window.location.pathname === '/checkout') return;
    e.preventDefault();
    sfOpenCartDrawer();
  });
}

document.addEventListener('DOMContentLoaded', function () {
  sfFillContactDetails();
  sfInitPopup();
  sfInitChat();
  sfInitCartIcons();
});

// Footer: rendered once the page has been parsed. Registered before the
// other scripts' DOMContentLoaded handlers, so #newsletterForm / #sfToast
// exist by the time main.js wires them up.
document.addEventListener('DOMContentLoaded', function renderFooter() {
  var footer = document.getElementById('sfFooter');
  if (!footer) return;
  var withNewsletter = footer.dataset.newsletter !== 'off';
  footer.outerHTML = (withNewsletter ? sfNewsletterHTML() : '') + sfFooterHTML();
});
