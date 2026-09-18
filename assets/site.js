(function () {
  "use strict";

  var inventory = Array.isArray(window.BOF_INVENTORY) ? window.BOF_INVENTORY : [];
  var instagramUrl = "https://www.instagram.com/ballsoffuryballpythons";
  var yearNodes = document.querySelectorAll("[data-current-year]");

  yearNodes.forEach(function (node) {
    node.textContent = new Date().getFullYear();
  });

  function mountSocialFeed() {
    var widgetId = String(window.BOF_SOCIAL_FEED_WIDGET_ID || "").trim();
    if (!/^[a-z0-9-]{8,}$/i.test(widgetId)) return;

    var socialGrid = document.querySelector(".social-grid");
    var feedCard = document.getElementById("social-feed-card");
    var feedMount = document.getElementById("social-feed-mount");
    if (!socialGrid || !feedCard || !feedMount) return;

    var widget = document.createElement("div");
    widget.className = "elfsight-app-" + widgetId;
    widget.setAttribute("data-elfsight-app-lazy", "");
    feedMount.appendChild(widget);

    feedCard.hidden = false;
    socialGrid.classList.add("has-live-social-feed");
    socialGrid.querySelectorAll(".social-card-instagram, .social-card-facebook").forEach(function (card) {
      card.hidden = true;
    });

    var platformScript = document.createElement("script");
    platformScript.src = "https://static.elfsight.com/platform/platform.js";
    platformScript.async = true;
    platformScript.dataset.elfsightPlatform = "true";
    document.head.appendChild(platformScript);
  }

  mountSocialFeed();

  var menuButton = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".primary-nav");
  if (menuButton && nav) {
    menuButton.addEventListener("click", function () {
      var isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      nav.classList.toggle("is-open", !isOpen);
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
        nav.classList.remove("is-open");
      });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
        nav.classList.remove("is-open");
      }
    });
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function morphList(product) {
    if (Array.isArray(product.morphs)) return product.morphs;
    if (typeof product.morphs === "string") {
      return product.morphs.split(/,|\/| x /i).map(function (morph) { return morph.trim(); }).filter(Boolean);
    }
    return [];
  }

  function formatPrice(price) {
    if (typeof price !== "number" || !Number.isFinite(price)) return "ASK FOR PRICE";
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(price);
  }

  function snakeCard(product) {
    var morphs = morphList(product);
    var status = String(product.status || "available").toLowerCase();
    var statusLabel = status === "hold" ? "ON HOLD" : status === "sold" ? "SOLD" : "AVAILABLE";
    var photo = product.photo ? '<img src="' + escapeHtml(product.photo) + '" alt="Photo of ' + escapeHtml(product.name) + '" loading="lazy">' :
      '<div class="photo-needed"><span>PHOTO COMING SOON</span></div>';
    var details = product.description ? '<p class="snake-description">' + escapeHtml(product.description) + "</p>" : "";
    var morphText = morphs.length ? morphs.join(" · ") : "Morph details pending";
    var askLabel = "Ask about " + String(product.name || "this snake") + " on Instagram";
    var price = product.priceLabel ? '<strong class="snake-price snake-price-label">' + escapeHtml(product.priceLabel) + "</strong>" :
      '<strong class="snake-price">' + formatPrice(product.price) + "</strong>";
    return '<article class="snake-card">' +
      '<div class="snake-photo">' + photo + '<span class="status-pill status-' + escapeHtml(status) + '"><i></i>' + statusLabel + "</span></div>" +
      '<div class="snake-card-body">' +
        '<div class="snake-title-row"><div><p class="eyebrow snake-label">BALL PYTHON</p><h3>' + escapeHtml(product.name || "Ball Python") + "</h3></div>" +
        '<span class="snake-sex">' + escapeHtml(product.sex || "—") + "</span></div>" +
        '<p class="snake-morphs">' + escapeHtml(morphText) + "</p>" + details +
        '<div class="snake-card-bottom">' + price +
        '<a class="button button-small button-outline" href="' + instagramUrl + '" target="_blank" rel="noopener noreferrer" aria-label="' + escapeHtml(askLabel) + '">ASK ABOUT IT <span aria-hidden="true">↗</span></a></div>' +
      "</div></article>";
  }

  function activeProducts() {
    return inventory.filter(function (product) {
      return String(product.status || "available").toLowerCase() === "available";
    });
  }

  var featuredGrid = document.getElementById("featured-grid");
  var featuredEmpty = document.getElementById("featured-empty");
  if (featuredGrid) {
    var featured = activeProducts().filter(function (product) { return product.featured !== false; }).slice(0, 4);
    if (featured.length) {
      featuredGrid.innerHTML = featured.map(snakeCard).join("");
      if (featuredEmpty) featuredEmpty.hidden = true;
    } else if (featuredEmpty) {
      featuredEmpty.hidden = false;
    }
  }

  var catalogGrid = document.getElementById("catalog-grid");
  if (catalogGrid) {
    var searchInput = document.getElementById("snake-search");
    var availabilitySelect = document.getElementById("availability-filter");
    var morphSelect = document.getElementById("morph-filter");
    var sexSelect = document.getElementById("sex-filter");
    var sortSelect = document.getElementById("sort-filter");
    var countText = document.getElementById("result-count");
    var emptyState = document.getElementById("catalog-empty");
    var clearButton = document.getElementById("clear-filters");

    var allMorphs = Array.from(new Set(inventory.reduce(function (all, product) {
      return all.concat(morphList(product));
    }, []))).sort(function (a, b) { return a.localeCompare(b); });
    allMorphs.forEach(function (morph) {
      var option = document.createElement("option");
      option.value = morph.toLowerCase();
      option.textContent = morph;
      morphSelect.appendChild(option);
    });

    var allSexes = Array.from(new Set(inventory.map(function (product) { return product.sex; }).filter(Boolean)))
      .sort(function (a, b) { return String(a).localeCompare(String(b)); });
    allSexes.forEach(function (sex) {
      var option = document.createElement("option");
      option.value = String(sex).toLowerCase();
      option.textContent = sex;
      sexSelect.appendChild(option);
    });

    function renderCatalog() {
      var query = searchInput.value.trim().toLowerCase();
      var statusFilter = availabilitySelect.value;
      var morphFilter = morphSelect.value;
      var sexFilter = sexSelect.value;
      var sortMode = sortSelect.value;
      var results = inventory.filter(function (product) {
        var status = String(product.status || "available").toLowerCase();
        var searchable = [product.name, product.sex, product.description].concat(morphList(product)).join(" ").toLowerCase();
        var statusMatches = statusFilter === "all" || status === statusFilter;
        var morphMatches = morphFilter === "all" || morphList(product).some(function (morph) { return morph.toLowerCase() === morphFilter; });
        var sexMatches = sexFilter === "all" || String(product.sex || "").toLowerCase() === sexFilter;
        return statusMatches && morphMatches && sexMatches && (!query || searchable.indexOf(query) !== -1);
      });

      if (sortMode === "price-asc") results.sort(function (a, b) { return (a.price || 0) - (b.price || 0); });
      if (sortMode === "price-desc") results.sort(function (a, b) { return (b.price || 0) - (a.price || 0); });
      if (sortMode === "name") results.sort(function (a, b) { return String(a.name || "").localeCompare(String(b.name || "")); });
      if (sortMode === "featured") results.sort(function (a, b) { return Number(Boolean(b.featured)) - Number(Boolean(a.featured)); });

      catalogGrid.innerHTML = results.map(snakeCard).join("");
      if (emptyState) emptyState.hidden = results.length > 0;
      if (countText) {
        countText.textContent = results.length === 1 ? "SHOWING 1 SNAKE" : "SHOWING " + results.length + " SNAKES";
      }
    }

    [searchInput, availabilitySelect, morphSelect, sexSelect, sortSelect].forEach(function (control) {
      control.addEventListener(control === searchInput ? "input" : "change", renderCatalog);
    });

    clearButton.addEventListener("click", function () {
      searchInput.value = "";
      availabilitySelect.value = "available";
      morphSelect.value = "all";
      sexSelect.value = "all";
      sortSelect.value = "featured";
      renderCatalog();
      searchInput.focus();
    });

    renderCatalog();
  }
})();
