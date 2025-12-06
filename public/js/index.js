// public/js/index.js

// ============================================================
// ACCESSIBILITY & SUSTAINABILITY TAG HELPERS
// ============================================================

// Optional per-product overrides: update IDs if you feel like it
// but everything works even if you leave this empty.
const PRODUCT_TAGS = {
  // Example:
  // 1: {
  //   accessibility: ["fragrance-free", "for sensitive skin"],
  //   sustainability: ["recyclable packaging"]
  // }
};

function getAccessibilityTags(product) {
  const tags = [];
  const override = PRODUCT_TAGS[product.id];

  if (override && Array.isArray(override.accessibility)) {
    tags.push(...override.accessibility);
  }

  const text = `${product.name || ""} ${product.description || ""}`.toLowerCase();

  // fragrance-free / fragrance free
  if (text.includes("fragrance-free") || text.includes("fragrance free")) {
    if (!tags.includes("fragrance-free")) tags.push("fragrance-free");
  }

  // sensitive skin
  if (text.includes("sensitive")) {
    if (!tags.includes("for sensitive skin")) tags.push("for sensitive skin");
  }

  // gentle
  if (text.includes("gentle")) {
    if (!tags.includes("gentle formula")) tags.push("gentle formula");
  }

  // eczema
  if (text.includes("eczema")) {
    if (!tags.includes("eczema-friendly")) tags.push("eczema-friendly");
  }

  // inclusive / all tones
  if (
    text.includes("inclusive") ||
    text.includes("all skin tones") ||
    text.includes("all tones")
  ) {
    if (!tags.includes("inclusive shades")) tags.push("inclusive shades");
  }

  return tags;
}


function getSustainabilityTags(product) {
  const tags = [];
  const override = PRODUCT_TAGS[product.id];

  if (override && Array.isArray(override.sustainability)) {
    tags.push(...override.sustainability);
  }

  const name = (product.name || "").toLowerCase();
  const brand = (product.brand || "").toLowerCase();
  const desc = (product.description || "").toLowerCase();

  if (desc.includes("recyclable") || name.includes("recyclable")) {
    if (!tags.includes("recyclable packaging")) tags.push("recyclable packaging");
  }

  if (name.includes("refill") || desc.includes("refill")) {
    if (!tags.includes("refillable")) tags.push("refillable");
  }

  // Generic "minimal packaging" tag for a few common brands
  if (brand.includes("ordinary") || brand.includes("cerave") || brand.includes("paula")) {
    if (!tags.includes("minimal packaging")) tags.push("minimal packaging");
  }

  return tags;
}

// ============================================================
// GLOBAL STATE
// ============================================================

let allProducts = [];
let filteredProducts = [];
let currentTabCategory = "";

// ============================================================
// FETCH PRODUCTS
// ============================================================

async function fetchProducts() {
  try {
    const res = await fetch("/api/catalog");
    if (!res.ok) throw new Error("Failed to fetch catalog");

    const data = await res.json();

    // If your backend returns { items: [...] }, switch to:
    // allProducts = data.items;
    allProducts = data;
    filteredProducts = [...allProducts];

    buildDynamicFilters();
    buildCategoryTabs();
    applyFiltersAndSort();
  } catch (err) {
    console.error(err);
    document.getElementById("product-grid").innerHTML =
      "<p>Failed to load products. Please refresh the page.</p>";
  }
}

// ============================================================
// BUILD FILTER DROPDOWNS
// ============================================================

function buildDynamicFilters() {
  const brandSelect = document.getElementById("filter-brand");
  const categorySelect = document.getElementById("filter-category");

  const brands = [...new Set(allProducts.map((p) => p.brand))].sort();
  const categories = [...new Set(allProducts.map((p) => p.category))].sort();

  brands.forEach((b) => {
    const opt = document.createElement("option");
    opt.value = b;
    opt.textContent = b;
    brandSelect.appendChild(opt);
  });

  categories.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    categorySelect.appendChild(opt);
  });
}

// ============================================================
// CATEGORY TAB BUTTONS
// ============================================================

function buildCategoryTabs() {
  const container = document.getElementById("category-tabs");
  container.innerHTML = "";

  const allTab = document.createElement("button");
  allTab.className = "category-tab active";
  allTab.textContent = "All";
  allTab.dataset.category = "";
  container.appendChild(allTab);

  const categories = [...new Set(allProducts.map((p) => p.category))].sort();

  categories.forEach((c) => {
    const btn = document.createElement("button");
    btn.className = "category-tab";
    btn.textContent = c;
    btn.dataset.category = c;
    container.appendChild(btn);
  });

  container.addEventListener("click", (e) => {
    const btn = e.target.closest(".category-tab");
    if (!btn) return;

    container
      .querySelectorAll(".category-tab")
      .forEach((t) => t.classList.remove("active"));
    btn.classList.add("active");

    currentTabCategory = btn.dataset.category;
    document.getElementById("filter-category").value = "";

    applyFiltersAndSort();
  });
}

// ============================================================
// FILTER + SORT + SEARCH
// ============================================================

function applyFiltersAndSort() {
  const brand = document.getElementById("filter-brand").value;
  const categoryDropdown = document.getElementById("filter-category").value;
  const sortValue = document.getElementById("sort-by").value;
  const search = document
    .getElementById("search-input")
    .value.toLowerCase()
    .trim();

  const fragranceFreeOnly =
    document.getElementById("filter-fragrance-free")?.checked || false;
  const sustainableOnly =
    document.getElementById("filter-sustainable")?.checked || false;

  const category = categoryDropdown || currentTabCategory;

  filteredProducts = allProducts.filter((p) => {
    let ok = true;

    if (category && p.category !== category) ok = false;
    if (brand && p.brand !== brand) ok = false;

    if (search) {
      const combined = `${p.name} ${p.brand} ${p.category} ${p.description}`.toLowerCase();
      if (!combined.includes(search)) ok = false;
    }

    const accessTags = getAccessibilityTags(p);
    const susTags = getSustainabilityTags(p);

    if (fragranceFreeOnly && !accessTags.includes("fragrance-free")) ok = false;
    if (sustainableOnly && susTags.length === 0) ok = false;

    return ok;
  });

  // Sorting
  if (sortValue === "price-asc")
    filteredProducts.sort((a, b) => a.price - b.price);
  if (sortValue === "price-desc")
    filteredProducts.sort((a, b) => b.price - a.price);
  if (sortValue === "name-asc")
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  if (sortValue === "name-desc")
    filteredProducts.sort((a, b) => b.name.localeCompare(a.name));

  updateResultsCount();
  renderProducts();
}

// ============================================================
// RESULTS COUNT
// ============================================================

function updateResultsCount() {
  const el = document.getElementById("results-count");
  el.textContent = `${filteredProducts.length} results`;
}

// ============================================================
// RENDER PRODUCT CARDS
// ============================================================

function renderProducts() {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";

  filteredProducts.forEach((p) => {
    const accessTags = getAccessibilityTags(p);
    const susTags = getSustainabilityTags(p);
    const allTags = [...accessTags, ...susTags];

    const tagHtml = allTags.length
      ? `<div class="product-tags">
           ${allTags.map((t) => `<span class="tag-pill">${t}</span>`).join("")}
         </div>`
      : "";

    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <a class="product-click" href="/pages/product.html?id=${p.id}">
        <div class="product-image-wrapper">
          <img src="${p.image_url}" alt="${p.name}">
        </div>
      </a>

      <a class="product-click" href="/pages/product.html?id=${p.id}">
        <div class="product-name">${p.name}</div>
      </a>

      <div class="product-brand">${p.brand}</div>

      ${tagHtml}

      <div class="product-footer">
        <div class="product-price">$${Number(p.price).toFixed(2)}</div>
        <button class="add-btn" data-id="${p.id}">Add to Cart</button>
      </div>
    `;

    grid.appendChild(card);
  });

  attachAddToCartHandlers();
}

// ============================================================
// ADD TO CART (NO POPUP → DIRECT TO CART PAGE)
// ============================================================

function attachAddToCartHandlers() {
  document.querySelectorAll(".add-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const numericId = btn.getAttribute("data-id");

      try {
        const res = await fetch("/api/cart/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId: Number(numericId), quantity: 1 }),
        });

        if (res.status === 401) {
          // allow browsing + cart without login
          alert(
            "Please log in to add items to your cart."
          );
          return;
        }

        if (!res.ok) {
          alert("Failed to add to cart.");
          return;
        }

        // SUCCESS → redirect to cart
        window.location.href = "/pages/cart.html";
      } catch (err) {
        console.error(err);
        alert("Error adding to cart.");
      }
    });
  });
}

// ============================================================
// AUTH NAV LOGIC
// ============================================================

async function checkAuthStatus() {
  try {
    const res = await fetch("/api/auth/session");
    const data = await res.json();

    const loginBtn = document.getElementById("login-btn");
    const profileBtn = document.getElementById("profile-btn");

    if (data.loggedIn) {
      loginBtn.style.display = "none";
      profileBtn.style.display = "inline-flex";
    } else {
      loginBtn.style.display = "inline-flex";
      profileBtn.style.display = "none";
    }
  } catch (err) {
    console.error("Session check failed", err);
  }
}

// ============================================================
// NAVIGATION EVENTS
// ============================================================

function wireEvents() {
  document
    .getElementById("filter-brand")
    .addEventListener("change", applyFiltersAndSort);
  document
    .getElementById("filter-category")
    .addEventListener("change", applyFiltersAndSort);
  document
    .getElementById("sort-by")
    .addEventListener("change", applyFiltersAndSort);

  const ff = document.getElementById("filter-fragrance-free");
  if (ff) ff.addEventListener("change", applyFiltersAndSort);

  const sus = document.getElementById("filter-sustainable");
  if (sus) sus.addEventListener("change", applyFiltersAndSort);

  // search behavior
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    // Live search as user types
    searchInput.addEventListener("input", () => {
      applyFiltersAndSort();
    });

    // Handle pressing Enter so the page doesn't reload
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        applyFiltersAndSort();
      }
    });
  }

  const heroBtn = document.getElementById("hero-shop-btn");
  if (heroBtn) {
    heroBtn.addEventListener("click", () => {
      document
        .querySelector(".product-grid-section")
        .scrollIntoView({ behavior: "smooth" });
    });
  }

  const loginBtn = document.getElementById("login-btn");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      window.location.href = "/pages/login.html";
    });
  }

  const profileBtn = document.getElementById("profile-btn");
  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      window.location.href = "/pages/profile.html";
    });
  }
}

// ============================================================
// INIT
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  wireEvents();
  checkAuthStatus();
  fetchProducts();
});
