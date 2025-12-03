// public/JS/register.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");
  const firstNameInput = document.getElementById("reg-first-name");
  const lastNameInput = document.getElementById("reg-last-name");
  const emailInput = document.getElementById("reg-email");
  const emailConfirmInput = document.getElementById("reg-email-confirm");
  const passwordInput = document.getElementById("reg-password");
  const passwordConfirmInput = document.getElementById("reg-password-confirm");
  const errorBox = document.getElementById("register-error");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorBox.textContent = "";

    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = emailInput.value.trim();
    const emailConfirm = emailConfirmInput.value.trim();
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;

    if (!firstName || !lastName || !email || !emailConfirm || !password || !passwordConfirm) {
      errorBox.textContent = "Please fill in all required fields.";
      return;
    }

    if (email !== emailConfirm) {
      errorBox.textContent = "Email and Confirm Email do not match.";
      return;
    }

    if (password !== passwordConfirm) {
      errorBox.textContent = "Password and Confirm Password do not match.";
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        errorBox.textContent = data.message || "Registration failed. Please try again.";
        return;
      }

      // success → send user back to login
      window.location.href = "/pages/login.html";
    } catch (err) {
      console.error(err);
      errorBox.textContent = "Network error. Please try again.";
    }
  });
});
