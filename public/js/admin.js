document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  setupLogout();

  document.getElementById("sales-refresh")?.addEventListener("click", loadSales);

  document.getElementById("cust-refresh")?.addEventListener("click", loadCustomers);

  document.getElementById("inv-refresh")?.addEventListener("click", loadInventory);

  // inventory add (frontend UI)
  document.getElementById("inv-add-form")?.addEventListener("submit", addInventoryItem);

  loadSales();
});

/* ---------------- Tabs + Logout ---------------- */
function setupTabs() {
  const tabs = document.querySelectorAll(".admin-tab");
  const panels = {
    sales: document.getElementById("panel-sales"),
    customers: document.getElementById("panel-customers"),
    inventory: document.getElementById("panel-inventory"),
  };

  tabs.forEach((t) => {
    t.addEventListener("click", () => {
      tabs.forEach((x) => x.classList.remove("active"));
      t.classList.add("active");

      const key = t.dataset.tab;
      Object.entries(panels).forEach(([k, el]) =>
        el?.classList.toggle("hidden", k !== key)
      );

      if (key === "sales") loadSales();
      if (key === "customers") loadCustomers();
      if (key === "inventory") loadInventory();
    });
  });
}

function setupLogout() {
  document.getElementById("admin-logout")?.addEventListener("click", async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/pages/login.html";
  });
}

/* ---------------- SALES ----------------
Backend: GET /api/admin/sales?userId=&itemId=&from=&to=
We’ll render robustly by accepting multiple possible field names.
*/
async function loadSales() {
  const q = val("sales-q");
  const from = val("sales-from");
  const to = val("sales-to");

  // Your backend expects userId/itemId/from/to — not q.
  // We'll treat q as "best effort" and do client-side filtering.
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);

  const res = await fetch(`/api/admin/sales?${params.toString()}`);
  if (res.status === 401 || res.status === 403) return kickToLogin();

  const raw = await res.json().catch(() => []);
  const sales = Array.isArray(raw) ? raw : [];

  // client-side filter using q (matches order id/email/product name)
  const qNorm = (q || "").toLowerCase();
  const filtered = !qNorm
    ? sales
    : sales.filter((s) => {
        const hay = [
          pick(s, ["orderId", "order_id", "id"]),
          pick(s, ["email", "userEmail", "user_email"]),
          pick(s, ["product", "productName", "item_name", "name"]),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(qNorm);
      });

  const box = document.getElementById("sales-table");
  if (!box) return;

  if (filtered.length === 0) {
    box.innerHTML = `<div class="muted">No sales found.</div>`;
    return;
  }

  // Normalize records for display
  const rows = filtered.map((s) => {
    const orderId = pick(s, ["orderId", "order_id", "id"]) ?? "";
    const customer = pick(s, ["userEmail", "email", "user_email"]) ?? pick(s, ["userId", "user_id"]) ?? "";
    const createdAt = pick(s, ["createdAt", "created_at", "date", "order_date"]) ?? "";
    const total = Number(pick(s, ["totalAmount", "total_amount", "total", "amount"]) ?? 0);
    const status = pick(s, ["status", "payment_status"]) ?? "PAID";
    const itemName = pick(s, ["productName", "product", "item_name", "name"]) ?? "";
    const qty = pick(s, ["quantity", "qty"]) ?? "";

    return { orderId, customer, createdAt, total, status, itemName, qty };
  });

  // better “good sales history”: show order + customer + date + items + total + status
  box.innerHTML = `
    <div style="display:grid;grid-template-columns:120px 1fr 170px 1.4fr 120px 110px;gap:10px;font-weight:800;margin-bottom:10px;">
      <div>Order</div>
      <div>Customer</div>
      <div>Date</div>
      <div>Item(s)</div>
      <div>Total</div>
      <div>Status</div>
    </div>

    ${rows
      .map(
        (r) => `
      <div style="display:grid;grid-template-columns:120px 1fr 170px 1.4fr 120px 110px;gap:10px;padding:10px;border:1px solid #eee;border-radius:10px;margin-bottom:8px;">
        <div>#${escapeHtml(String(r.orderId || ""))}</div>
        <div>${escapeHtml(String(r.customer || ""))}</div>
        <div>${escapeHtml(formatDate(r.createdAt))}</div>
        <div>${escapeHtml(r.itemName)} ${r.qty ? ` (x${escapeHtml(String(r.qty))})` : ""}</div>
        <div>$${escapeHtml(r.total.toFixed(2))}</div>
        <div>${escapeHtml(String(r.status || ""))}</div>
      </div>
    `
      )
      .join("")}
  `;
}

/* ---------------- CUSTOMERS ----------------
You asked: show customers who purchased AND users who haven't.
Backend available:
- GET /api/admin/users
- GET /api/admin/sales

We’ll compute “purchased” from sales.
*/
async function loadCustomers() {
  const q = val("cust-q").toLowerCase();

  const [usersRes, salesRes] = await Promise.all([
    fetch("/api/admin/users"),
    fetch("/api/admin/sales"),
  ]);

  if ([usersRes.status, salesRes.status].some((s) => s === 401 || s === 403)) return kickToLogin();

  const usersRaw = await usersRes.json().catch(() => []);
  const salesRaw = await salesRes.json().catch(() => []);

  const users = Array.isArray(usersRaw) ? usersRaw : [];
  const sales = Array.isArray(salesRaw) ? salesRaw : [];

  // Build a set of purchaser userIds/emails from sales
  const purchaserIds = new Set();
  const purchaserEmails = new Set();

  for (const s of sales) {
    const uid = pick(s, ["userId", "user_id"]);
    const email = pick(s, ["email", "userEmail", "user_email"]);
    if (uid != null) purchaserIds.add(String(uid));
    if (email) purchaserEmails.add(String(email).toLowerCase());
  }

  // Normalize users (many DAOs return different fields)
  const normUsers = users.map((u) => ({
    id: String(pick(u, ["id", "userId", "user_id"]) ?? ""),
    email: String(pick(u, ["email", "userEmail"]) ?? ""),
    firstName: String(pick(u, ["first_name", "firstName"]) ?? ""),
    lastName: String(pick(u, ["last_name", "lastName"]) ?? ""),
    address_id: pick(u, ["address_id", "addressId"]),
  }));

  // Split into customers vs non-customers
  const customers = normUsers.filter((u) =>
    purchaserIds.has(u.id) || purchaserEmails.has(u.email.toLowerCase())
  );
  const nonCustomers = normUsers.filter((u) => !customers.includes(u));

  // Apply search filter to both lists
  const filterFn = (u) => {
    if (!q) return true;
    const hay = `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase();
    return hay.includes(q);
  };

  renderCustomerLists(customers.filter(filterFn), nonCustomers.filter(filterFn));
}

function renderCustomerLists(customers, nonCustomers) {
  const list = document.getElementById("cust-list");
  if (!list) return;

  const renderUser = (u) => `
    <div class="item" data-id="${escapeHtml(u.id)}">
      <div style="font-weight:800;">${escapeHtml(`${u.firstName} ${u.lastName}`.trim() || "(No name)")}</div>
      <div class="muted">${escapeHtml(u.email)}</div>
    </div>
  `;

  list.innerHTML = `
    <div style="font-weight:900;margin-bottom:8px;">Customers (purchased)</div>
    ${customers.length ? customers.map(renderUser).join("") : `<div class="muted">No customers found.</div>`}

    <div style="font-weight:900;margin:14px 0 8px;">Users (no purchases)</div>
    ${nonCustomers.length ? nonCustomers.map(renderUser).join("") : `<div class="muted">No non-customer users.</div>`}
  `;

  // When you click a user, we can load an editable form using your existing update route.
  list.querySelectorAll(".item").forEach((el) => {
    el.addEventListener("click", () => loadCustomerDetail(el.dataset.id));
  });

  clearCustomerDetail();
}

// Minimal detail loader using existing update route; you don’t currently have /api/admin/users/:id
// So we’ll use the users list again and show purchase history from /sales.
async function loadCustomerDetail(userId) {
  const [usersRes, salesRes] = await Promise.all([
    fetch("/api/admin/users"),
    fetch("/api/admin/sales"),
  ]);

  if ([usersRes.status, salesRes.status].some((s) => s === 401 || s === 403)) return kickToLogin();

  const users = (await usersRes.json().catch(() => [])) || [];
  const sales = (await salesRes.json().catch(() => [])) || [];

  const u = (Array.isArray(users) ? users : []).find((x) => String(pick(x, ["id", "userId", "user_id"])) === String(userId));
  if (!u) return;

  document.getElementById("cust-detail-empty")?.classList.add("hidden");
  document.getElementById("cust-form")?.classList.remove("hidden");

  setVal("cust-id", String(userId));
  setVal("cust-name", `${pick(u, ["first_name", "firstName"]) || ""} ${pick(u, ["last_name", "lastName"]) || ""}`.trim());
  setVal("cust-email", pick(u, ["email"]) || "");

  // you don’t currently return full address for admin/users, so leave fields editable but blank.
  // If you want, we can extend AdminDAO.getUsers to join the address.
  setVal("cust-street", "");
  setVal("cust-province", "");
  setVal("cust-country", "");
  setVal("cust-zip", "");
  setVal("cust-phone", "");
  setVal("cust-payment", "");

  // purchase history render from sales
  const mySales = (Array.isArray(sales) ? sales : []).filter((s) =>
    String(pick(s, ["userId", "user_id"]) ?? "") === String(userId)
  );

  const box = document.getElementById("cust-orders");
  if (!box) return;

  if (!mySales.length) {
    box.innerHTML = `<div class="muted">No purchases for this user.</div>`;
    return;
  }

  box.innerHTML = mySales.map((s) => {
    const orderId = pick(s, ["orderId", "order_id", "id"]) ?? "";
    const total = Number(pick(s, ["totalAmount", "total_amount", "total", "amount"]) ?? 0);
    const date = pick(s, ["createdAt", "created_at", "date", "order_date"]) ?? "";
    const status = pick(s, ["status", "payment_status"]) ?? "PAID";
    return `
      <div style="padding:10px;border:1px solid #eee;border-radius:10px;margin-top:8px;">
        <div><b>Order #${escapeHtml(String(orderId))}</b> • ${escapeHtml(formatDate(date))}</div>
        <div class="muted">Status: ${escapeHtml(String(status))}</div>
        <div>Total: $${escapeHtml(total.toFixed(2))}</div>
      </div>
    `;
  }).join("");
}

async function updateCustomer(e) {
  e.preventDefault();
  const userId = val("cust-id");
  if (!userId) return;

  // Your backend update expects: userId, firstName, lastName, street, province, country, zip, phone
  const fullName = val("cust-name").trim();
  const [firstName, ...rest] = fullName.split(" ");
  const lastName = rest.join(" ");

  const body = {
    userId,
    firstName: firstName || "",
    lastName: lastName || "",
    street: val("cust-street"),
    province: val("cust-province"),
    country: val("cust-country"),
    zip: val("cust-zip"),
    phone: val("cust-phone"),
  };

  const res = await fetch("/api/admin/users/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    alert(data.message || "Failed to update user");
    return;
  }

  alert("User updated!");
  loadCustomers();
}

function clearCustomerDetail() {
  document.getElementById("cust-detail-empty")?.classList.remove("hidden");
  document.getElementById("cust-form")?.classList.add("hidden");
  const orders = document.getElementById("cust-orders");
  if (orders) orders.innerHTML = "";
}

/* ---------------- INVENTORY ----------------
Backend:
- GET /api/admin/inventory
- POST /api/admin/inventory/update  { itemId, quantity }

We render and update with your exact route.
*/
async function loadInventory() {
  const q = val("inv-q").toLowerCase();

  const res = await fetch("/api/admin/inventory");
  if (res.status === 401 || res.status === 403) return kickToLogin();
  const raw = await res.json().catch(() => []);
  const products = Array.isArray(raw) ? raw : [];

  const filtered = !q
    ? products
    : products.filter((p) => {
        const hay = [
          pick(p, ["name", "product_name", "title"]),
          pick(p, ["brand"]),
          pick(p, ["category"]),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });

  const box = document.getElementById("inv-table");
  if (!box) return;

  if (!filtered.length) {
    box.innerHTML = `<div class="muted">No products found.</div>`;
    return;
  }

  box.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 120px 110px 180px 110px;gap:10px;font-weight:800;margin-bottom:10px;">
      <div>Product</div><div>Price</div><div>In Stock</div><div>Update Qty</div><div>Remove</div>
    </div>
    ${filtered.map((p) => {
      const id = pick(p, ["id", "itemId", "item_id"]);
      const name = pick(p, ["name", "product_name", "title"]) || "";
      const brand = pick(p, ["brand"]) || "";
      const price = Number(pick(p, ["price"]) || 0).toFixed(2);
      const qty = Number(pick(p, ["quantity", "qty", "in_stock"]) || 0);

      return `
        <div style="display:grid;grid-template-columns:1fr 120px 110px 180px 110px;gap:10px;padding:10px;border:1px solid #eee;border-radius:10px;margin-bottom:8px;">
          <div>
            <div style="font-weight:800;">${escapeHtml(String(name))}</div>
            <div class="muted">${escapeHtml(String(brand))}</div>
          </div>

          <div>$${escapeHtml(price)}</div>
          <div>${escapeHtml(String(qty))}</div>

          <div style="display:flex;gap:8px;">
            <input class="inv-qty" data-id="${escapeHtml(String(id))}" type="number" min="0" value="${escapeHtml(String(qty))}"
              style="padding:8px;border:1px solid #ddd;border-radius:10px;width:100px;">
            <button class="hero-btn inv-save" data-id="${escapeHtml(String(id))}" style="padding:8px 10px;">Save</button>
          </div>

          <button class="hero-btn inv-remove" data-id="${escapeHtml(String(id))}" style="padding:8px 10px;">Delete</button>
        </div>
      `;
    }).join("")}
  `;

  box.querySelectorAll(".inv-save").forEach((btn) => {
    btn.addEventListener("click", () => saveInventory(btn.dataset.id));
  });

  box.querySelectorAll(".inv-remove").forEach((btn) => {
    btn.addEventListener("click", () => removeInventoryItem(btn.dataset.id));
  });
}

async function saveInventory(itemId) {
  const input = document.querySelector(`.inv-qty[data-id="${CSS.escape(itemId)}"]`);
  const quantity = input ? Number(input.value) : NaN;

  if (!Number.isFinite(quantity) || quantity < 0) {
    alert("Quantity must be 0 or more.");
    return;
  }

  const res = await fetch("/api/admin/inventory/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemId, quantity }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    alert(data.message || "Inventory update failed");
    return;
  }

  alert("Inventory updated!");
  loadInventory();
}

/* ---- Add / Remove inventory ----
You asked to add/remove items. Your backend does NOT have endpoints for this yet.
Frontend will call:
- POST /api/admin/inventory/add
- POST /api/admin/inventory/delete
You can implement these quickly later.
*/
async function addInventoryItem(e) {
  e.preventDefault();

  const body = {
    name: val("inv-add-name"),
    brand: val("inv-add-brand"),
    price: Number(val("inv-add-price") || 0),
    quantity: Number(val("inv-add-qty") || 0),
    category: val("inv-add-category"),
  };

  const res = await fetch("/api/admin/inventory/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    alert(data.message || "Add item failed (backend endpoint missing)");
    return;
  }

  alert("Item added!");
  e.target.reset();
  loadInventory();
}

async function removeInventoryItem(itemId) {
  if (!confirm("Delete this product from inventory?")) return;

  const res = await fetch("/api/admin/inventory/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemId }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    alert(data.message || "Delete failed (backend endpoint missing)");
    return;
  }

  alert("Item deleted!");
  loadInventory();
}

/* ---------------- helpers ---------------- */
function pick(obj, keys) {
  for (const k of keys) if (obj && obj[k] != null) return obj[k];
  return null;
}
function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}
function setVal(id, v) {
  const el = document.getElementById(id);
  if (el) el.value = v;
}
function kickToLogin() {
  window.location.href = "/pages/login.html";
}
function formatDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? String(d) : dt.toLocaleString();
}
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
