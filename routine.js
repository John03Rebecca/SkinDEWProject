let allProducts = [];
let byCategory = {};
let currentStep = 1;

// user’s routine
const routine = {
  cleanser: null,
  treatment: null,
  moisturizer: null,
  sunscreen: null,
};

document.addEventListener("DOMContentLoaded", () => {
  checkAuthStatus();
  fetchCatalogForRoutine();
  wireRoutineButtons();
  loadSavedRoutine();
});

async function fetchCatalogForRoutine() {
  try {
    const res = await fetch("/api/catalog");
    if (!res.ok) throw new Error("Failed to fetch catalog");
    const data = await res.json();

    // if your /api/catalog returns { items: [...] }, adjust:
    const items = Array.isArray(data) ? data : data.items;

    allProducts = items || [];
    groupByRoutineCategory();
    renderCurrentStep();
    updateSummary();
  } catch (err) {
    console.error(err);
    document.getElementById("routine-products").innerHTML =
      "<p>Could not load products.</p>";
  }
}

function groupByRoutineCategory() {
  byCategory = {
    cleanser: allProducts.filter((p) => p.category === "Cleanser"),
    treatment: allProducts.filter(
      (p) => p.category === "Serum" || p.category === "Treatment"
    ),
    moisturizer: allProducts.filter((p) => p.category === "Moisturizer"),
    sunscreen: allProducts.filter((p) => p.category === "Sunscreen"),
  };
}

function wireRoutineButtons() {
  document
    .getElementById("save-routine-btn")
    .addEventListener("click", () => {
      localStorage.setItem("skinDewRoutine", JSON.stringify(routine));
      alert("Routine saved in this browser.");
    });

  document
    .getElementById("add-routine-cart-btn")
    .addEventListener("click", addRoutineToCart);

  // step click (optional: make them clickable)
  document.querySelectorAll(".routine-steps .step").forEach((stepEl) => {
    stepEl.addEventListener("click", () => {
      currentStep = Number(stepEl.dataset.step);
      renderCurrentStep();
    });
  });
}

function loadSavedRoutine() {
  const stored = localStorage.getItem("skinDewRoutine");
  if (!stored) return;
  try {
    const parsed = JSON.parse(stored);
    Object.assign(routine, parsed);
    updateSummary();
  } catch (e) {
    console.warn("Failed to parse stored routine");
  }
}

function renderCurrentStep() {
  const container = document.getElementById("routine-products");
  container.innerHTML = "";

  let key, title;
  if (currentStep === 1) {
    key = "cleanser";
    title = "Choose a Cleanser";
  } else if (currentStep === 2) {
    key = "treatment";
    title = "Choose a Treatment / Serum";
  } else if (currentStep === 3) {
    key = "moisturizer";
    title = "Choose a Moisturizer";
  } else {
    key = "sunscreen";
    title = "Choose a Sunscreen";
  }

  document.getElementById("routine-step-title").textContent = title;
  highlightCurrentStep();

  const products = byCategory[key] || [];
  if (!products.length) {
    container.innerHTML = "<p>No products available for this step.</p>";
    return;
  }

  products.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";
    const isSelected =
      routine[key] && Number(routine[key].id) === Number(p.id);

    card.innerHTML = `
      <a class="product-click" href="/pages/product.html?id=${p.id}">
        <div class="product-image-wrapper">
          <img src="${p.image_url}" alt="${p.name}">
        </div>
      </a>
      <div class="product-name">${p.name}</div>
      <div class="product-brand">${p.brand}</div>
      <div class="product-footer">
        <div class="product-price">$${Number(p.price).toFixed(2)}</div>
        <button class="add-btn select-btn" data-id="${p.id}">
          ${isSelected ? "Selected" : "Select"}
        </button>
      </div>
    `;

    container.appendChild(card);
  });

  // hook up select buttons
  container.querySelectorAll(".select-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const prod = byCategory[key].find((p) => Number(p.id) === id);
      routine[key] = prod || null;
      localStorage.setItem("skinDewRoutine", JSON.stringify(routine));
      renderCurrentStep(); // refresh button labels
      updateSummary();
    });
  });
}

function highlightCurrentStep() {
  document.querySelectorAll(".routine-steps .step").forEach((el) => {
    el.classList.toggle(
      "active",
      Number(el.dataset.step) === currentStep
    );
  });
}

function updateSummary() {
  const box = document.getElementById("routine-summary-list");
  box.innerHTML = "";

  const entries = [
    ["Cleanser", routine.cleanser],
    ["Treatment", routine.treatment],
    ["Moisturizer", routine.moisturizer],
    ["Sunscreen", routine.sunscreen],
  ];

  entries.forEach(([label, item]) => {
    const row = document.createElement("div");
    row.className = "routine-summary-row";
    if (item) {
      row.innerHTML = `<strong>${label}:</strong> ${item.name} – $${Number(
        item.price
      ).toFixed(2)}`;
    } else {
      row.innerHTML = `<strong>${label}:</strong> Not selected`;
    }
    box.appendChild(row);
  });
}

async function addRoutineToCart() {
  const selections = Object.values(routine).filter(Boolean);
  if (!selections.length) {
    alert("Please select at least one product for your routine.");
    return;
  }

  try {
    for (const item of selections) {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: Number(item.id), quantity: 1 }),
      });

      if (res.status === 401) {
        alert("Please log in to add your routine to the cart.");
        return;
      }
      if (!res.ok) {
        alert("Failed to add an item to cart.");
        return;
      }
    }
    window.location.href = "/pages/cart.html";
  } catch (err) {
    console.error(err);
    alert("Error adding routine to cart.");
  }
}

// re-use your auth nav logic if you want:
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
