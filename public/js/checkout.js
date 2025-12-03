// ------------------
// Load cart into order summary
// ------------------
async function loadOrderSummary() {
  try {
    const res = await fetch("/api/cart");

    // Guests are allowed: if server ever returns 401, treat as empty cart
    if (res.status === 401) {
      const container = document.getElementById("summary-items");
      const subtotalEl = document.getElementById("summary-subtotal");
      const totalEl = document.getElementById("summary-total");

      if (container) {
        container.innerHTML = "<p>Your cart is empty.</p>";
      }
      if (subtotalEl) subtotalEl.textContent = "$0.00";
      if (totalEl) totalEl.textContent = "$0.00";
      return;
    }

    if (!res.ok) {
      throw new Error("Failed to load cart");
    }

    const items = await res.json();

    const container = document.getElementById("summary-items");
    const subtotalEl = document.getElementById("summary-subtotal");
    const totalEl = document.getElementById("summary-total");

    if (!container) return;

    container.innerHTML = "";

    if (!items.length) {
      container.innerHTML = "<p>Your cart is empty.</p>";
      subtotalEl.textContent = "$0.00";
      totalEl.textContent = "$0.00";
      return;
    }

    let subtotal = 0;

    items.forEach((item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 0;
      const lineTotal = price * qty;
      subtotal += lineTotal;

      const div = document.createElement("div");
      div.className = "summary-item";
      div.innerHTML = `
        <div class="summary-item-main">
          <div class="summary-item-name">${item.name}</div>
          <div class="summary-item-meta">Qty: ${qty}</div>
        </div>
        <div>$${lineTotal.toFixed(2)}</div>
      `;
      container.appendChild(div);
    });

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    totalEl.textContent = `$${subtotal.toFixed(2)}`; // shipping is free
  } catch (err) {
    console.error(err);
    alert("Could not load order summary.");
  }
}

// ------------------
// Checkout form submit
// ------------------
function wireCheckoutForm() {
  const form = document.getElementById("checkout-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect shipping fields
    const shipping = {
      firstName: document.getElementById("ship-firstName").value.trim(),
      lastName: document.getElementById("ship-lastName").value.trim(),
      address1: document.getElementById("ship-address1").value.trim(),
      address2: document.getElementById("ship-address2").value.trim(),
      city: document.getElementById("ship-city").value.trim(),
      province: document.getElementById("ship-province").value.trim(),
      country: document.getElementById("ship-country").value.trim(),
      postal: document.getElementById("ship-postal").value.trim(),
      phone: document.getElementById("ship-phone").value.trim(),
    };

    // Payment fields
    const payment = {
      nameOnCard: document.getElementById("pay-name").value.trim(),
      cardNumber: document.getElementById("pay-card").value.trim(),
      expiry: document.getElementById("pay-expiry").value.trim(),
      cvv: document.getElementById("pay-cvv").value.trim(),
    };

    // Basic validation
    if (
      !shipping.firstName ||
      !shipping.lastName ||
      !shipping.address1 ||
      !shipping.city ||
      !shipping.province ||
      !shipping.country ||
      !shipping.postal ||
      !shipping.phone ||
      !payment.nameOnCard ||
      !payment.cardNumber ||
      !payment.expiry ||
      !payment.cvv
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    // Map to what checkoutController expects
    const payload = {
      billingName: payment.nameOnCard,
      billingStreet: shipping.address1, // reuse shipping for billing
      billingProvince: shipping.province,
      billingCountry: shipping.country,
      billingZip: shipping.postal,

      shippingName: `${shipping.firstName} ${shipping.lastName}`,
      shippingStreet: shipping.address1,
      shippingProvince: shipping.province,
      shippingCountry: shipping.country,
      shippingZip: shipping.postal,

      cardNumber: payment.cardNumber,
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data.message || "Payment authorisation failed.");
        return;
      }

      alert("Order placed successfully! 🎉");
      window.location.href = "/pages/index.html";
    } catch (err) {
      console.error(err);
      alert("Something went wrong while placing your order.");
    }
  });
}

// ------------------
// Nav login/profile (same as other pages)
// ------------------
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
      const term = searchInput.value.trim();
      const url = term
        ? `/pages/index.html?search=${encodeURIComponent(term)}`
        : "/pages/index.html";
      window.location.href = url;
    }
  });
}

// ------------------
// Init
// ------------------
document.addEventListener("DOMContentLoaded", () => {
  wireNavEvents();
  checkAuthStatus();
  loadOrderSummary();
  wireCheckoutForm();
});
