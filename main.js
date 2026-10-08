"use strict";

const root = document.documentElement;
const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".site-nav");
const mobileLayout = window.matchMedia("(max-width: 960px)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function closeMenu(restoreFocus = false) {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
  nav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  if (restoreFocus) menuButton.focus();
}
if (menuButton && nav) {
  root.classList.add("nav-ready");
  menuButton.addEventListener("click", () => {
    const opening = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(opening));
    menuButton.setAttribute(
      "aria-label",
      opening ? "Close navigation" : "Open navigation",
    );
    nav.classList.toggle("is-open", opening);
    document.body.classList.toggle("menu-open", opening);
  });
  nav
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", () => closeMenu()));
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menuButton.getAttribute("aria-expanded") === "true"
    )
      closeMenu(true);
  });
  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) closeMenu();
  });
  document.addEventListener("focusin", (event) => {
    if (!header.contains(event.target)) closeMenu();
  });
  mobileLayout.addEventListener("change", () => closeMenu());
}

const activeCounters = new Map();
const numberFormat = new Intl.NumberFormat("en-US");
function finalCount(element) {
  return (
    numberFormat.format(Number(element.dataset.count)) +
    (element.dataset.suffix || "")
  );
}
function finishCounters() {
  activeCounters.forEach((frame, element) => {
    cancelAnimationFrame(frame);
    element.textContent = finalCount(element);
  });
  activeCounters.clear();
}
function animateCount(element) {
  if (reducedMotion.matches) return;
  const target = Number(element.dataset.count);
  const suffix = element.dataset.suffix || "";
  let start;
  function update(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / 1300, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent =
      numberFormat.format(Math.floor(target * eased)) + suffix;
    if (progress < 1)
      activeCounters.set(element, requestAnimationFrame(update));
    else {
      element.textContent = finalCount(element);
      activeCounters.delete(element);
    }
  }
  activeCounters.set(element, requestAnimationFrame(update));
}
function updateMotion() {
  const off = reducedMotion.matches;
  root.classList.toggle("motion-off", off);
  if (off) finishCounters();
}
updateMotion();
reducedMotion.addEventListener("change", updateMotion);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) finishCounters();
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -20px 0px" },
  );
  document
    .querySelectorAll(".reveal")
    .forEach((element) => revealObserver.observe(element));
  root.classList.add("animations-ready");
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 },
  );
  document
    .querySelectorAll("[data-count]")
    .forEach((element) => countObserver.observe(element));
  const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (!visible) return;
      navLinks.forEach((link) => {
        if (link.hash === "#" + visible.target.id)
          link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-15% 0px -65% 0px", threshold: 0 },
  );
  document
    .querySelectorAll("main > section")
    .forEach((section) => sectionObserver.observe(section));
}
const updateHeader = () =>
  header.classList.toggle("is-scrolled", window.scrollY > 35);
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());
