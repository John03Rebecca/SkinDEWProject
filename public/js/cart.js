// public/JS/cart.js

// -------- NAV + AUTH --------

function wireNavEvents() {
  const loginBtn = document.getElementById("login-btn");
  const profileBtn = document.getElementById("profile-btn");
  const searchInput = document.getElementById("search-input");

  loginBtn?.addEventListener("click", () => {
    window.location.href = "/pages/login.html";
  });

  profileBtn?.addEventListener("click", () => {
    window.location.href = "/pages/profile.html";
  });

  searchInput?.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      window.location.href = "/pages/index.html";
    }
  });
}

async function checkAuthStatus() {
  try {
    const res = await fetch("/api/auth/session");
    const data = await res.json();

    const loginBtn = document.getElementById("login-btn");
    const profileBtn = document.getElementById("profile-btn");

    if (data.loggedIn) {
      if (loginBtn) loginBtn.style.display = "none";
      if (profileBtn) profileBtn.style.display = "inline-flex";
    } else {
      if (loginBtn) loginBtn.style.display = "inline-flex";
      if (profileBtn) profileBtn.style.display = "none";
    }
  } catch (err) {
    console.error("Session check failed", err);
  }
}

// -------- CART LOGIC --------
async function fetchCart() {
  try {
    const res = await fetch("/api/cart");

    // If for some reason backend returns 401 for guests, treat as empty cart
    if (res.status === 401) {
      renderCart([]);
      return;
    }

    if (!res.ok) throw new Error("Failed to load cart");

    const items = await res.json();
    renderCart(items);
  } catch (err) {
    console.error(err);
    alert("Could not load cart. Please try again.");
  }
}

function renderCart(items) {
  const container = document.getElementById("cart-items-container");
  const emptyBlock = document.getElementById("cart-empty");
  const countSpan = document.getElementById("cart-item-count");
  const subtotalEl = document.getElementById("summary-subtotal");
  const totalEl = document.getElementById("summary-total");

  if (!container) return;

  // item count
  const itemCount = items.reduce((sum, it) => sum + (it.quantity || 0), 0);
  if (countSpan) {
    countSpan.textContent = itemCount
      ? `(${itemCount} item${itemCount === 1 ? "" : "s"})`
      : "(0 items)";
  }

  if (!items.length) {
    container.innerHTML = "";
    emptyBlock?.classList.remove("hidden");
    if (subtotalEl) subtotalEl.textContent = "$0.00";
    if (totalEl) totalEl.textContent = "$0.00";
    return;
  }

  emptyBlock?.classList.add("hidden");
  container.innerHTML = "";

  let subtotal = 0;

  items.forEach((item) => {
    const quantity = Number(item.quantity) || 0;
    const priceEach = Number(item.price) || 0;
    const lineTotal = quantity * priceEach;
    subtotal += lineTotal;

    const imgSrc = item.image_url || "/images/placeholder.jpg";
    const itemId = item.itemId; // from DAO alias

    const card = document.createElement("div");
    card.className = "cart-item-card";

    card.innerHTML = `
      <div class="cart-item-image-wrapper">
        <img src="${imgSrc}" alt="${item.name}">
      </div>

      <div class="cart-item-main">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-brand">${item.brand || ""}</div>
        <div class="cart-item-price-each">$${priceEach.toFixed(2)} each</div>
        <button class="cart-remove-btn" data-itemid="${itemId}">Remove</button>
      </div>

      <div class="cart-item-meta">
        <div class="cart-qty-controls" data-itemid="${itemId}">
          <button class="cart-qty-btn cart-qty-minus">−</button>
          <div class="cart-qty-value">${quantity}</div>
          <button class="cart-qty-btn cart-qty-plus">+</button>
        </div>
        <div class="cart-item-total">$${lineTotal.toFixed(2)}</div>
      </div>
    `;

    container.appendChild(card);
  });

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;

  wireCartItemEvents();
}

function wireCartItemEvents() {
  // -------- REMOVE --------
  document.querySelectorAll(".cart-remove-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const itemId = btn.getAttribute("data-itemid");
      if (!itemId) return;

      try {
        await fetch(`/api/cart/remove/${itemId}`, { method: "DELETE" });
        await fetchCart();
      } catch (err) {
        console.error(err);
        alert("Failed to remove item.");
      }
    });
  });

  // -------- QUANTITY +/- --------
  document.querySelectorAll(".cart-qty-controls").forEach((wrapper) => {
    const itemId = wrapper.getAttribute("data-itemid");
    if (!itemId) return;

    const minusBtn = wrapper.querySelector(".cart-qty-minus");
    const plusBtn = wrapper.querySelector(".cart-qty-plus");
    const valueEl = wrapper.querySelector(".cart-qty-value");

    const updateQty = async (newQty) => {
      if (newQty <= 0) {
        try {
          await fetch(`/api/cart/remove/${itemId}`, { method: "DELETE" });
          await fetchCart();
        } catch (err) {
          console.error(err);
          alert("Failed to update cart.");
        }
        return;
      }

      try {
        await fetch("/api/cart/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId: Number(itemId), quantity: newQty }),
        });
        await fetchCart();
      } catch (err) {
        console.error(err);
        alert("Failed to update cart.");
      }
    };

    minusBtn?.addEventListener("click", () => {
      const current = Number(valueEl.textContent) || 0;
      updateQty(current - 1);
    });

    plusBtn?.addEventListener("click", () => {
      const current = Number(valueEl.textContent) || 0;
      updateQty(current + 1);
    });
  });
}

// -------- PAGE-LEVEL BUTTONS --------

function wirePageButtons() {
  const continueBtn = document.getElementById("continue-shopping-btn");
  const checkoutBtn = document.getElementById("checkout-btn");
  const emptyShopBtn = document.getElementById("cart-empty-shop");

  continueBtn?.addEventListener("click", () => {
    window.location.href = "/pages/index.html";
  });

  emptyShopBtn?.addEventListener("click", () => {
    window.location.href = "/pages/index.html";
  });

  // ✅ No login check here anymore – guests can go to checkout
  checkoutBtn?.addEventListener("click", () => {
    window.location.href = "/pages/checkout.html";
  });
}

// -------- INIT --------

document.addEventListener("DOMContentLoaded", () => {
  wireNavEvents();
  wirePageButtons();
  checkAuthStatus();
  fetchCart();
});
