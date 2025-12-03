// auth_state.js

// Simple helpers for auth state using localStorage
const AUTH_STORAGE_KEY = "authData"; // { token, role, username }

export function getAuthData() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse auth data", e);
    return null;
  }
}

export function setAuthData(data) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
}

export function clearAuthData() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

// UI / navbar handling

function updateNavbar() {
  const auth = getAuthData();
  const loginBtn = document.getElementById("nav-login-btn");
  const logoutBtn = document.getElementById("nav-logout-btn");
  const profileIcon = document.getElementById("nav-profile-icon");
  const adminLink = document.getElementById("nav-admin-link");

  if (!loginBtn || !logoutBtn) return; // not on this page

  if (auth && auth.token) {
    loginBtn.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
    profileIcon?.classList.remove("hidden");

    if (auth.role === "admin" && adminLink) {
      adminLink.classList.remove("hidden");
    } else {
      adminLink?.classList.add("hidden");
    }
  } else {
    loginBtn.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
    profileIcon?.classList.add("hidden");
    adminLink?.classList.add("hidden");
  }
}

function wireNavbarEvents() {
  const loginBtn = document.getElementById("nav-login-btn");
  const logoutBtn = document.getElementById("nav-logout-btn");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      window.location.href = "/pages/login.html";
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearAuthData();
      window.location.href = "/pages/index.html";
    });
  }

  const searchInput = document.getElementById("nav-search-input");
  const searchBtn = document.getElementById("nav-search-btn");

  if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", () => {
      const term = searchInput.value.trim();
      const event = new CustomEvent("globalSearch", { detail: { term } });
      window.dispatchEvent(event);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateNavbar();
  wireNavbarEvents();
});
