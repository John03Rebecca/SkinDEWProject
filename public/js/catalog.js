// catalog.js

// If you already have api.js with helpers, you can use those.
// Here, I'll use fetch directly. Adjust URLs to match your backend.

let allProducts = [];
let filteredProducts = [];

async function fetchProducts() {
  try {
    const res = await fetch("/catalog"); // <-- adjust to your route (e.g., /api/catalog)
    if (!res.ok) throw new Error("Failed to load catalog");
    const data = await res.json();
    // Expecting: [{itemID, name, description, category, brand, price, quantity, imageUrl}, ...]
    allProducts = data;
    filteredProducts = [...allProducts];
    populateBrandFilter();
    renderProducts();
  } catch (err) {
    console.error(err);
    const grid = document.getElementById("product-grid");
    if (grid) {
      grid.innerHTML = `<p>Failed to load products. Please try again later.</p>`;
    }
  }
}

function populateBrandFilter() {
  const brandSelect = document.getElementById("filter-brand");
  if (!brandSelect || !allProducts.length) return;

  const brands = Array.from(
    new Set(allProducts.map((p) => p.brand).filter(Boolean))
  ).sort();

  brands.forEach((b) => {
    const opt = document.createElement("option");
    opt.value = b;
    opt.textContent = b;
    brandSelect.appendChild(opt);
  });
}

function applyFiltersAndSort() {
  const categoryValue = document.getElementById("filter-category")?.value || "";
  const brandValue = document.getElementById("filter-brand")?.value || "";
  const sortValue = document.getElementById("sort-by")?.value || "";
  const searchInput = document.getElementById("nav-search-input");
  const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";

  filteredProducts = allProducts.filter((p) => {
    let ok = true;
    if (categoryValue && p.category !== categoryValue) ok = false;
    if (brandValue && p.brand !== brandValue) ok = false;

    if (searchTerm) {
      const text =
        `${p.name} ${p.brand} ${p.category} ${p.description}`.toLowerCase();
      if (!text.includes(searchTerm)) ok = false;
    }

    return ok;
  });

  if (sortValue === "price-asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortValue === "price-desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortValue === "name-asc") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortValue === "name-desc") {
    filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
  }

  renderProducts();
}

function renderProducts() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  if (!filteredProducts.length) {
    grid.innerHTML = `<p>No products found.</p>`;
    return;
  }

  grid.innerHTML = "";
  filteredProducts.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";

    const imageUrl = p.imageUrl || "/images/default_product.jpg";

    card.innerHTML = `
      <div class="product-image-wrapper">
        <img src="${imageUrl}" alt="${p.name}" />
      </div>
      <div class="product-info">
        <div class="product-brand">${p.brand || ""}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-meta">
          <span class="product-category">${p.category || ""}</span>
          <span class="product-price">$${Number(p.price).toFixed(2)}</span>
        </div>
      </div>
      <div class="product-actions">
        <a href="/pages/product.html?id=${encodeURIComponent(
          p.itemID
        )}" class="view-details">Details</a>
        <button class="add-to-cart" data-id="${p.itemID}">Add to Cart</button>
      </div>
    `;

    grid.appendChild(card);
  });

  wireAddToCartButtons();
}

function wireAddToCartButtons() {
  const buttons = document.querySelectorAll(".add-to-cart");
  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const itemID = btn.getAttribute("data-id");
      await addToCart(itemID);
    });
  });
}

async function addToCart(itemID) {
  try {
    const res = await fetch("/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemID, quantity: 1 }),
    });

    if (!res.ok) {
      alert("Failed to add item to cart.");
      return;
    }

    const data = await res.json();
    // Optionally: update cart count from response
    const countSpan = document.getElementById("nav-cart-count");
    if (countSpan && typeof data.cartItemCount === "number") {
      countSpan.textContent = data.cartItemCount;
    }

    alert("Item added to cart!");
  } catch (err) {
    console.error(err);
    alert("Could not add item to cart. Please try again.");
  }
}

function wireFilterEvents() {
  document.getElementById("filter-category")?.addEventListener("change", applyFiltersAndSort);
  document.getElementById("filter-brand")?.addEventListener("change", applyFiltersAndSort);
  document.getElementById("sort-by")?.addEventListener("change", applyFiltersAndSort);

  window.addEventListener("globalSearch", () => {
    applyFiltersAndSort();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
  wireFilterEvents();
});
