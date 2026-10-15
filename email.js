"use strict";

// Native mailto links remain usable if this optional enhancement cannot run.
document.querySelectorAll("[data-copy-email]").forEach((button) => {
  const link = document.getElementById(button.dataset.copyEmail);
  const status = document.getElementById(button.getAttribute("aria-describedby"));
  if (!link || !status || !link.href.startsWith("mailto:")) return;

  const email = decodeURIComponent(new URL(link.href).pathname);
  button.addEventListener("click", async () => {
    button.disabled = true;
    status.textContent = "";
    try {
      await navigator.clipboard.writeText(email);
      status.textContent = `Copied ${email}. Paste it into your email service.`;
    } catch {
      status.textContent = `Copy unavailable. Select and copy this address: ${email}`;
    } finally {
      button.disabled = false;
    }
  });
  button.hidden = false;
});
