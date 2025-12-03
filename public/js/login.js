// public/JS/login.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");
  const errorBox = document.getElementById("login-error");
  const createAccountBtn = document.getElementById("create-account-btn");
  const resetPasswordBtn = document.getElementById("reset-password-btn");

  // NEW: mode toggle elements
  const modeUserBtn = document.getElementById("mode-user");
  const modeAdminBtn = document.getElementById("mode-admin");
  const submitBtn = document.getElementById("login-submit-btn");

  let loginMode = "user"; // "user" | "admin"

  function setMode(mode) {
    loginMode = mode;
    errorBox.textContent = "";

    if (modeUserBtn && modeAdminBtn) {
      modeUserBtn.classList.toggle("active", mode === "user");
      modeAdminBtn.classList.toggle("active", mode === "admin");
    }

    if (submitBtn) {
      submitBtn.textContent = mode === "admin" ? "Sign In as Admin" : "Sign In";
    }
  }

  modeUserBtn?.addEventListener("click", () => setMode("user"));
  modeAdminBtn?.addEventListener("click", () => setMode("admin"));

  // default
  setMode("user");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorBox.textContent = "";

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      errorBox.textContent = "Please enter both email and password.";
      return;
    }

    // IMPORTANT:
    // - user login endpoint: /api/auth/login
    // - admin login endpoint: /api/admin/login
    const endpoint = loginMode === "admin" ? "/api/admin/login" : "/api/auth/login";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        errorBox.textContent = data.message || "Login failed. Please try again.";
        return;
      }

      // success redirects
      window.location.href = loginMode === "admin"
        ? "/pages/admin.html"
        : "/pages/index.html";

    } catch (err) {
      console.error(err);
      errorBox.textContent = "Network error. Please try again.";
    }
  });

  createAccountBtn?.addEventListener("click", () => {
    window.location.href = "/pages/register.html";
  });

  resetPasswordBtn?.addEventListener("click", () => {
    alert("For this assignment, you can document reset-password behaviour in the report.");
  });
});
