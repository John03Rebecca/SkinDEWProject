document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
  setupSidebar();
  setupLogout();
  setupEditHandlers(); // one-time delegation
  setupAdminDashboardButton(); 
});

/* LOAD PROFILE DATA */
async function loadProfile() {
  try {
    const res = await fetch("/api/profile");
    if (res.status === 401) {
      window.location.href = "/pages/login.html";
      return;
    }

    if (!res.ok) {
      alert("Failed to load profile.");
      return;
    }

    const data = await res.json();

    // GREETING
    const greetEl = document.getElementById("profile-greeting");
    if (greetEl) greetEl.textContent = `Hello, ${data.firstName}`;

    // PROFILE INFO
    const nameEl = document.getElementById("user-fullname");
    if (nameEl) nameEl.textContent = `${data.firstName} ${data.lastName}`;

    const emailEl = document.getElementById("user-email");
    if (emailEl) emailEl.textContent = data.email;

    // ADDRESS
    renderAddress(data.address);

    // ORDERS
    renderOrders(data.orders);
    loadPaymentMethod();

  } catch (err) {
    console.error(err);
    alert("Something went wrong loading your profile.");
  }
}

/* Address UI */
function renderAddress(address) {
  const addressBox = document.getElementById("address-section");
  if (!addressBox) return;

  if (!address) {
    addressBox.innerHTML = `
      <button class="edit-btn" data-edit="address">+ Add new address</button>
    `;
  } else {
    addressBox.innerHTML = `
      <div class="profile-info-row">
        <div>
          <div class="label">Address</div>
          <div class="value">
            ${escapeHtml(address.street)}, ${escapeHtml(address.province)}, ${escapeHtml(address.country)}<br>
            ${escapeHtml(address.zip)} • ${escapeHtml(address.phone || "")}
          </div>
        </div>
        <button class="edit-btn" data-edit="address">Edit</button>
      </div>
    `;
  }
}

/* Orders UI */
function renderOrders(orders) {
  const orderBox = document.getElementById("order-history");
  if (!orderBox) return;

  if (!orders || orders.length === 0) {
    orderBox.innerHTML = `<p class="muted">No orders yet.</p>`;
    return;
  }

  orderBox.innerHTML = orders
    .map((o) => {
      const total = o.total_amount != null ? Number(o.total_amount).toFixed(2) : "0.00";
      const dateStr = o.created_at ? new Date(o.created_at).toLocaleString() : "";
      return `
        <div class="order-item" style="padding:12px;border:1px solid #ddd;border-radius:10px;margin-bottom:10px;">
          <div><b>Order #${escapeHtml(String(o.id))}</b></div>
          <div>Total: $${escapeHtml(String(total))}</div>
          <div>Status: ${escapeHtml(String(o.status || "unknown"))}</div>
          <div>Date: ${escapeHtml(dateStr)}</div>
        </div>
      `;
    })
    .join("");
}

/* ✅ ONE click handler for all edit buttons (no reattach needed) */
function setupEditHandlers() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".edit-btn");
    if (!btn) return;
    if (btn.classList.contains("disabled")) return;

    const type = btn.dataset.edit;

    if (type === "name") editName();
    if (type === "password") editPassword();
    if (type === "address") editAddress();
    if (type === "payment") editPayment();

  });
}

/* EDIT NAME */
async function editName() {
  const first = prompt("Enter new first name:");
  const last = prompt("Enter new last name:");
  if (!first || !last) return;

  const res = await fetch("/api/profile/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName: first, lastName: last }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    alert(err.message || "Failed to update name.");
    return;
  }

  loadProfile();
}

/* EDIT PASSWORD */
async function editPassword() {
  const newPass = prompt("Enter new password:");
  if (!newPass) return;

  const res = await fetch("/api/profile/password", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: newPass }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    alert(err.message || "Failed to update password.");
    return;
  }

  alert("Password updated!");
}

/* EDIT ADDRESS */
async function editAddress() {
  const street = prompt("Street:");
  const province = prompt("Province:");
  const country = prompt("Country:");
  const zip = prompt("Postal Code:");
  const phone = prompt("Phone:");

  if (!street || !province || !country || !zip) return;

  const res = await fetch("/api/profile/address", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ street, province, country, zip, phone }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    alert(err.message || "Failed to update address.");
    return;
  }

  loadProfile();
}

/* SIDEBAR NAVIGATION */
function setupSidebar() {
  const links = document.querySelectorAll(".sidebar-link");
  if (!links.length) return;

  links.forEach((btn) => {
    btn.addEventListener("click", () => {
      links.forEach((l) => l.classList.remove("active"));
      btn.classList.add("active");

      const section = btn.dataset.section;

      const settingsPanel = document.getElementById("panel-settings");
      const ordersPanel = document.getElementById("panel-orders");

      if (settingsPanel) settingsPanel.classList.toggle("hidden", section !== "settings");
      if (ordersPanel) ordersPanel.classList.toggle("hidden", section !== "orders");
    });
  });
}

/* LOGOUT */
function setupLogout() {
  const logoutBtn = document.getElementById("logout-btn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/pages/login.html";
  });
}

/* Basic HTML escaping for any DB/user strings */
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
async function loadPaymentMethod() {
  const box = document.getElementById("payment-section");
  if (!box) return;

  try {
    const res = await fetch("/api/profile/payment");
    if (res.status === 401) {
      window.location.href = "/pages/login.html";
      return;
    }

    const data = await res.json().catch(() => ({}));
    const p = data.payment;

    if (!p) {
      box.innerHTML = `<button class="edit-btn" data-edit="payment">+ Add payment method</button>`;
      return;
    }

    box.innerHTML = `
      <div class="profile-info-row">
        <div>
          <div class="label">Card</div>
          <div class="value">
            ${escapeHtml(p.brand)} •••• ${escapeHtml(p.last4)}<br>
            Exp: ${escapeHtml(String(p.exp_month).padStart(2, "0"))}/${escapeHtml(String(p.exp_year))}<br>
            <span class="muted">${escapeHtml(p.cardholder_name)}</span>
          </div>
        </div>
        <button class="edit-btn" data-edit="payment">Edit</button>
      </div>
    `;
  } catch (err) {
    console.error(err);
    box.innerHTML = `<p class="muted">Unable to load payment method.</p>`;
  }
}

async function editPayment() {
  const cardholderName = prompt("Cardholder name:");
  const brand = prompt("Brand (Visa / MasterCard / Amex):");
  const last4 = prompt("Last 4 digits:");
  const expMonth = prompt("Expiry month (1-12):");
  const expYear = prompt("Expiry year (YYYY):");

  if (!cardholderName || !brand || !last4 || !expMonth || !expYear) return;

  const res = await fetch("/api/profile/payment", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cardholderName, brand, last4, expMonth, expYear })
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    alert(data.message || "Failed to update payment method.");
    return;
  }

  loadPaymentMethod();
}

async function setupAdminDashboardButton() {
  const btn = document.getElementById("admin-dashboard-btn");
  if (!btn) return;

  try {
    const res = await fetch("/api/admin/session");
    const data = await res.json().catch(() => ({}));

    console.log("admin session:", data); // TEMP: verify

    if (data.isAdmin) {
      btn.style.display = "inline-flex";
      btn.addEventListener("click", () => {
        window.location.href = "/pages/admin.html";
      });
    } else {
      btn.style.display = "none";
    }
  } catch (err) {
    console.error("Admin session check failed:", err);
    btn.style.display = "none";
  }
}
