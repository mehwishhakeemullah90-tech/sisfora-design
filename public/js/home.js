// public/js/home.js
// -----------------------------------------------------------------------
// Home page only: product grids, hero video play/pause, the "Watch & Shop"
// video cards (play when on screen, product + Add to Cart on each card),
// and the Instagram link.
// -----------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Product grids ----------------------------------------------------
  var bestGrid = document.getElementById('homeBestSellersGrid');
  if (bestGrid) sfLoadTaggedProducts(bestGrid, 'bestseller', { limit: 8 });
  var naGrid = document.getElementById('homeNewArrivalsGrid');
  if (naGrid) sfLoadTaggedProducts(naGrid, 'newarrival', { limit: 8 });

  // ---- Hero video: pause/play button + pause both videos when off screen ----
  var heroVideo = document.getElementById('heroVideo');
  var heroToggle = document.getElementById('heroVideoToggle');
  var heroBg = document.querySelector('.bc-hero-bg');
  function setToggleIcon() {
    if (!heroToggle || !heroVideo) return;
    var paused = heroVideo.paused;
    heroToggle.innerHTML = sfIcon(paused ? 'play' : 'pause', 18);
    heroToggle.setAttribute('aria-label', paused ? 'Play video' : 'Pause video');
  }
  if (heroVideo && heroToggle) {
    heroToggle.addEventListener('click', function () {
      if (heroVideo.paused) { heroVideo.play(); if (heroBg) heroBg.play(); heroVideo.dataset.userPaused = ''; }
      else { heroVideo.pause(); if (heroBg) heroBg.pause(); heroVideo.dataset.userPaused = '1'; }
    });
    heroVideo.addEventListener('play', setToggleIcon);
    heroVideo.addEventListener('pause', setToggleIcon);
    setToggleIcon();
  }
  if (reduceMotion) {
    [heroVideo, heroBg].forEach(function (v) { if (v) { v.removeAttribute('autoplay'); v.pause(); } });
    setToggleIcon();
  }
  // keep the two hero videos in step so the blurred backdrop matches the frame
  if (heroVideo && heroBg) {
    heroVideo.addEventListener('seeked', function () { heroBg.currentTime = heroVideo.currentTime; });
    heroVideo.addEventListener('playing', function () {
      if (Math.abs(heroBg.currentTime - heroVideo.currentTime) > 0.3) heroBg.currentTime = heroVideo.currentTime;
    });
  }

  // ---- Watch & Shop video cards -----------------------------------------
  var cards = [].slice.call(document.querySelectorAll('.bc-vid-card'));
  cards.forEach(function (card) {
    var video = card.querySelector('video');
    var start = Number(card.dataset.start || 0);
    video.addEventListener('loadedmetadata', function () {
      try { video.currentTime = Math.min(start, (video.duration || 1) - 0.5); } catch (e) { /* ignore */ }
    }, { once: true });
    video.addEventListener('play', function () { card.classList.add('is-playing'); });
    video.addEventListener('pause', function () { card.classList.remove('is-playing'); });
    video.addEventListener('click', function () {
      card.dataset.userPaused = video.paused ? '' : '1';
      if (video.paused) video.play(); else video.pause();
    });
  });

  // play the cards that are on screen, pause the rest (saves data on phones)
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var card = en.target;
        var v = card.querySelector('video');
        if (en.isIntersecting && en.intersectionRatio > 0.55) {
          if (!card.dataset.userPaused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        } else {
          v.pause();
        }
      });
    }, { threshold: [0, 0.55, 1] });
    cards.forEach(function (c) { io.observe(c); });
  }

  // product name, price and Add to Cart on each card
  (async function fillVideoProducts() {
    if (!cards.length) return;
    var products = [];
    try {
      var data = await sfFetch('/api/products?tag=featured&limit=' + cards.length);
      products = data.products || [];
      if (products.length < cards.length) {
        var more = await sfFetch('/api/products?tag=bestseller&limit=' + cards.length);
        (more.products || []).forEach(function (p) {
          if (products.length < cards.length && !products.some(function (x) { return x._id === p._id; })) products.push(p);
        });
      }
    } catch (e) { /* cards still play without product info */ }
    cards.forEach(function (card, i) {
      var p = products[i % (products.length || 1)];
      var info = card.querySelector('.bc-vid-info');
      if (!p) { info.remove(); return; }
      var price = p.discountPrice && p.discountPrice > 0 ? p.discountPrice : p.price;
      var img = p.thumbnail || (p.images && p.images[0]) || '';
      info.innerHTML =
        '<a class="bc-vid-name" href="/product/' + p.slug + '">' + sfEscape(p.name) + '</a>' +
        '<div class="bc-vid-price">' + sfCurrency(price) + '</div>' +
        (p.stock > 0
          ? '<button type="button" class="bc-vid-add js-add-to-cart" data-id="' + p._id + '" data-name="' + sfEscape(p.name) + '" data-slug="' + p.slug + '" data-image="' + img + '" data-price="' + price + '" data-stock="' + p.stock + '">Add to Cart</button>'
          : '<button type="button" class="bc-vid-add" disabled>Sold Out</button>');
    });
  })();

  // arrows scroll the video row one card at a time
  var track = document.getElementById('homeVideoTrack');
  document.querySelectorAll('[data-vids-dir]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!track || !track.firstElementChild) return;
      var step = track.firstElementChild.getBoundingClientRect().width + 22;
      track.scrollBy({ left: step * Number(btn.dataset.vidsDir), behavior: 'smooth' });
    });
  });

  // ---- Instagram: link to the real profile once set in config/storefront.js ----
  var insta = window.SF_SITE && SF_SITE.social && SF_SITE.social.instagram;
  if (insta) {
    document.querySelectorAll('.js-insta-link').forEach(function (a) {
      a.href = insta;
      a.target = '_blank';
      a.rel = 'noopener';
    });
  }
});
