document.addEventListener("DOMContentLoaded", () => {
  loadProduct();
});

function getId() {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function loadProduct() {
  const container = document.getElementById("product-container");
  const id = getId();

  if (!id) {
    container.innerHTML = `<p class="muted">Invalid product link.</p>`;
    return;
  }

  try {
    const res = await fetch(`/api/catalog/${id}`);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      container.innerHTML = `<p class="muted">${escapeHtml(data.message || "Product not found.")}</p>`;
      return;
    }

    renderProduct(data);
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p class="muted">Failed to load product.</p>`;
  }
}

function renderProduct(p) {
  const container = document.getElementById("product-container");

  // IMPORTANT: your column might be quantity/inventory/stock
  // Try quantity first, then fallback
  const stock =
    Number(p.quantity ?? p.inventory ?? p.stock ?? 0);

  const inStock = stock > 0;

  container.innerHTML = `
    <div class="product-grid">
      <div class="product-media">
        <img class="product-img" src="${escapeAttr(p.image_url)}" alt="${escapeAttr(p.name)}" />
      </div>

      <div class="product-info">
        <a href="/pages/index.html" class="muted">← Back to shop</a>

        <h1 class="product-title">${escapeHtml(p.name)}</h1>

        <div class="product-meta">
          <span class="pill">${escapeHtml(p.brand || "")}</span>
          <span class="pill">${escapeHtml(p.category || "")}</span>
        </div>

        <div class="product-price">$${Number(p.price || 0).toFixed(2)}</div>

        <div class="product-stock ${inStock ? "stock-ok" : "stock-bad"}">
          ${inStock ? `In stock: <b>${stock}</b>` : `<b>Out of stock</b>`}
        </div>

        <p class="product-desc">${escapeHtml(p.description || "")}</p>

        <div class="product-actions">
          <label class="qty-label">
            Qty
            <input id="qty-input" class="qty-input" type="number" min="1" value="1" ${inStock ? "" : "disabled"} />
          </label>

          <button id="add-btn" class="hero-btn" ${inStock ? "" : "disabled"}>Add to Cart</button>
          <span id="msg" class="muted"></span>
        </div>
      </div>
    </div>
  `;

  document.getElementById("add-btn")?.addEventListener("click", () => addToCart(p.id, stock));
}

async function addToCart(itemId, stock) {
  const msg = document.getElementById("msg");
  msg.textContent = "";

  const qty = Number(document.getElementById("qty-input")?.value || 1);

  if (!Number.isInteger(qty) || qty <= 0) {
    msg.textContent = "Enter a valid quantity.";
    return;
  }

  if (qty > stock) {
    msg.textContent = `Only ${stock} left in stock.`;
    return;
  }

  try {
    const res = await fetch("/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: Number(itemId), quantity: qty })
    });

    if (res.status === 401) {
      alert("Please log in to add items to your cart.");
      window.location.href = "/pages/login.html";
      return;
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      msg.textContent = data.message || "Failed to add to cart.";
      return;
    }

    msg.textContent = "Added to cart ✅";
    // optional: redirect
    // window.location.href = "/pages/cart.html";
  } catch (err) {
    console.error(err);
    msg.textContent = "Network error.";
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(str) {
  return escapeHtml(str).replaceAll("`", "&#096;");
}
