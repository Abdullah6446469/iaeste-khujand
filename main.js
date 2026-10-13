"use strict";

const mobileLayout = window.matchMedia("(max-width: 960px)");
const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".site-nav");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// Reveal every letter once, preserving whole words and one accessible heading.
const heroTitle = document.getElementById("hero-title");
if (heroTitle && !reducedMotion.matches) {
  let letterIndex = 0;
  heroTitle.querySelectorAll(".hero-line").forEach((line) => {
    const source = line.querySelector("em") || line;
    const content = document.createDocumentFragment();
    source.textContent.split(/(\s+)/).forEach((segment) => {
      if (!segment) return;
      if (/^\s+$/.test(segment)) {
        content.append(document.createTextNode(segment));
        return;
      }
      const word = document.createElement("span");
      word.className = "hero-word";
      Array.from(segment).forEach((character) => {
        const letter = document.createElement("span");
        letter.className = "hero-letter";
        letter.textContent = character;
        letter.style.setProperty("--letter-delay", `${letterIndex++ * 13}ms`);
        word.append(letter);
      });
      content.append(word);
    });
    source.replaceChildren(content);
  });
}

function closeMenu(restoreFocus = false) {
  if (!menuButton || !nav) return;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
  nav.classList.remove("is-open");
  if (restoreFocus) menuButton.focus();
}

if (menuButton && nav) {
  document.documentElement.classList.add("nav-ready");
  menuButton.hidden = false;
  menuButton.addEventListener("click", () => {
    const opening = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(opening));
    menuButton.setAttribute(
      "aria-label",
      opening ? "Close navigation" : "Open navigation",
    );
    nav.classList.toggle("is-open", opening);
  });
  nav
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", () => closeMenu()));
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menuButton.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu(true);
    }
  });
  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) closeMenu();
  });
  document.addEventListener("focusin", (event) => {
    if (!header.contains(event.target)) closeMenu();
  });
  mobileLayout.addEventListener("change", () => closeMenu());
}

// Enhance the two readable programme sections with standard keyboard-operated tabs.
const tabList = document.querySelector(".programme-tabs");
if (tabList) {
  const tabs = [...tabList.querySelectorAll('[role="tab"]')];
  const panels = tabs.map((tab) =>
    document.getElementById(tab.getAttribute("aria-controls")),
  );
  function selectTab(index, focus = false) {
    tabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === index;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[tabIndex].hidden = !selected;
      panels[tabIndex].tabIndex = selected ? 0 : -1;
    });
    if (focus) tabs[index].focus();
    updateTabIndicator();
  }
  function updateTabIndicator() {
    const selected = tabs.find((tab) => tab.getAttribute("aria-selected") === "true");
    if (!selected) return;
    tabList.style.setProperty("--tab-left", `${selected.offsetLeft}px`);
    tabList.style.setProperty("--tab-width", `${selected.offsetWidth}px`);
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(index));
    tab.addEventListener("keydown", (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft")
        next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        selectTab(next, true);
      }
    });
  });
  selectTab(0);
  tabList.hidden = false;
  updateTabIndicator();
  if ("ResizeObserver" in window) {
    new ResizeObserver(updateTabIndicator).observe(tabList);
  } else {
    window.addEventListener("resize", updateTabIndicator);
  }
}

// Native dialog supplies modal semantics, focus containment and Escape handling.
const dialog = document.getElementById("gallery-dialog");
const photos = [...document.querySelectorAll(".gallery-item")];
if (dialog && typeof dialog.showModal === "function") {
  const image = document.getElementById("lightbox-image");
  const caption = document.getElementById("lightbox-caption");
  let current = 0;
  let opener;
  let request = 0;
  async function showPhoto(index) {
    current = (index + photos.length) % photos.length;
    const selected = current;
    const token = ++request;
    const photo = photos[selected];
    caption.textContent = "Loading photo…";
    image.setAttribute("aria-busy", "true");
    try {
      const replacement = new Image();
      replacement.src = photo.href;
      await replacement.decode();
      if (token !== request || !dialog.open) return;
      image.src = photo.href;
      image.alt = photo.querySelector("img").alt;
      image.width = replacement.naturalWidth;
      image.height = replacement.naturalHeight;
      caption.textContent =
        String(selected + 1).padStart(2, "0") +
        " / " +
        String(photos.length).padStart(2, "0") +
        " — " +
        photo.dataset.caption;
    } catch {
      if (token === request)
        caption.textContent =
          "This photo could not be loaded. Try another photo.";
    } finally {
      if (token === request) image.removeAttribute("aria-busy");
    }
  }
  photos.forEach((photo, index) => {
    photo.setAttribute("aria-haspopup", "dialog");
    photo.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
        return;
      event.preventDefault();
      opener = photo;
      image.removeAttribute("src");
      image.alt = "";
      dialog.showModal();
      document.body.classList.add("modal-open");
      showPhoto(index);
      dialog.querySelector(".lightbox-close").focus();
    });
  });
  dialog
    .querySelector(".lightbox-close")
    .addEventListener("click", () => dialog.close());
  dialog
    .querySelector(".lightbox-prev")
    .addEventListener("click", () => showPhoto(current - 1));
  dialog
    .querySelector(".lightbox-next")
    .addEventListener("click", () => showPhoto(current + 1));
  dialog.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "Tab") {
      const controls = [...dialog.querySelectorAll("button")];
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      showPhoto(current + (event.key === "ArrowRight" ? 1 : -1));
    }
  });
  dialog.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom)
    )
      dialog.close();
  });
  dialog.addEventListener("close", () => {
    ++request;
    document.body.classList.remove("modal-open");
    if (opener) opener.focus({ preventScroll: true });
  });
}

// The photo sequence works with touch, native scrolling, buttons and arrow keys.
const galleryRail = document.querySelector(".gallery-grid");
const galleryNavigation = document.querySelector(".gallery-navigation");
if (galleryRail && galleryNavigation) {
  const previous = galleryNavigation.querySelector(".gallery-prev");
  const next = galleryNavigation.querySelector(".gallery-next");
  const counter = galleryNavigation.querySelector(".gallery-counter");
  const items = [...galleryRail.querySelectorAll(".gallery-item")];
  let activeIndex = 0;
  let galleryQueued = false;

  function galleryPositions() {
    const left = galleryRail.getBoundingClientRect().left;
    return items.map((item) => item.getBoundingClientRect().left - left + galleryRail.scrollLeft - 4);
  }
  function refreshGallery() {
    galleryQueued = false;
    const maxScroll = galleryRail.scrollWidth - galleryRail.clientWidth;
    const position = galleryRail.scrollLeft;
    const offsets = galleryPositions();
    activeIndex = offsets.reduce((best, offset, index) =>
      Math.abs(offset - position) < Math.abs(offsets[best] - position) ? index : best, 0);
    if (maxScroll > 1 && position >= maxScroll - 2) activeIndex = items.length - 1;
    previous.disabled = position <= 2;
    next.disabled = position >= maxScroll - 2;
    counter.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
  }
  function moveGallery(direction) {
    const destination = Math.max(0, Math.min(items.length - 1, activeIndex + direction));
    galleryRail.scrollTo({
      left: Math.max(0, galleryPositions()[destination]),
      behavior: reducedMotion.matches ? "instant" : "smooth",
    });
  }
  previous.addEventListener("click", () => moveGallery(-1));
  next.addEventListener("click", () => moveGallery(1));
  galleryRail.addEventListener("scroll", () => {
    if (galleryQueued) return;
    galleryQueued = true;
    requestAnimationFrame(refreshGallery);
  }, { passive: true });
  galleryRail.addEventListener("keydown", (event) => {
    if (event.target !== galleryRail || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      moveGallery(event.key === "ArrowRight" ? 1 : -1);
    }
  });
  if ("ResizeObserver" in window) new ResizeObserver(refreshGallery).observe(galleryRail);
  else window.addEventListener("resize", refreshGallery);
  galleryNavigation.hidden = false;
  refreshGallery();
}

// A native scrolling strip keeps logos clickable and works with touch and keyboards.
(() => {
  const section = document.querySelector(".partners-section");
  const viewport = section?.querySelector(".partners-viewport");
  const track = section?.querySelector(".partners-track");
  const group = track?.querySelector(".partner-grid");
  if (!viewport || !group) return;

  let copy;
  let frame = 0;
  let lastTime = 0;
  let position = 0;
  let loopWidth = 0;
  let hovered = false;
  let focused = false;
  let interacting = false;
  let pointerHeld = false;
  let interactionTimer = 0;
  let onScreen = !("IntersectionObserver" in window);
  section.style.setProperty("--partner-count", group.children.length);

  function canMove() {
    return !reducedMotion.matches && !interacting && !hovered && !focused && onScreen && !document.hidden && loopWidth > 0;
  }
  function advance(time) {
    frame = 0;
    if (!canMove()) { lastTime = 0; return; }
    if (lastTime) {
      position = (position + Math.min(64, time - lastTime) * .028) % loopWidth;
      viewport.scrollLeft = position;
    }
    lastTime = time;
    frame = requestAnimationFrame(advance);
  }
  function sync() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    if (canMove()) frame = requestAnimationFrame(advance);
  }
  function measure() {
    loopWidth = group.getBoundingClientRect().width;
    position = loopWidth ? viewport.scrollLeft % loopWidth : 0;
    sync();
  }
  function setMotion() {
    const animate = !reducedMotion.matches;
    if (animate && !copy) {
      copy = group.cloneNode(true);
      copy.classList.add("partner-copy");
      copy.setAttribute("aria-hidden", "true");
      copy.removeAttribute("aria-label");
      copy.querySelectorAll("a").forEach(link => { link.tabIndex = -1; });
      // The repeated visual sequence remains pointer-clickable but adds no keyboard stops.
      track.append(copy);
    }
    section.classList.toggle("is-scrolling", animate);
    clearTimeout(interactionTimer);
    interacting = false;
    pointerHeld = false;
    viewport.scrollLeft = 0;
    position = 0;
    measure();
  }

  viewport.addEventListener("pointerenter", event => {
    if (event.pointerType !== "mouse") return;
    hovered = true;
    position = viewport.scrollLeft;
    sync();
  });
  viewport.addEventListener("pointerleave", () => { hovered = false; sync(); });
  viewport.addEventListener("focusin", event => {
    focused = true;
    sync();
    if (reducedMotion.matches) return;
    const item = event.target.closest("li");
    if (item) {
      const bounds = item.getBoundingClientRect();
      const view = viewport.getBoundingClientRect();
      viewport.scrollLeft += bounds.left - view.left - (viewport.clientWidth - bounds.width) / 2;
      position = viewport.scrollLeft;
    }
  });
  viewport.addEventListener("focusout", event => {
    if (viewport.contains(event.relatedTarget)) return;
    focused = false;
    position = loopWidth ? viewport.scrollLeft % loopWidth : 0;
    sync();
  });
  // Let a swipe settle, then resume automatically without a playback control.
  function resumeAfterInteraction() {
    clearTimeout(interactionTimer);
    interactionTimer = setTimeout(() => {
      interacting = false;
      position = loopWidth ? viewport.scrollLeft % loopWidth : 0;
      sync();
    }, 1200);
  }
  viewport.addEventListener("pointerdown", () => {
    interacting = true;
    pointerHeld = true;
    clearTimeout(interactionTimer);
    sync();
  }, { passive: true });
  function releasePointer() {
    if (!interacting) return;
    pointerHeld = false;
    resumeAfterInteraction();
  }
  window.addEventListener("pointerup", releasePointer, { passive: true });
  window.addEventListener("pointercancel", releasePointer, { passive: true });
  viewport.addEventListener("wheel", event => {
    if (Math.abs(event.deltaX) > 1 || event.shiftKey) {
      interacting = true;
      sync();
      resumeAfterInteraction();
    }
  }, { passive: true });
  viewport.addEventListener("scroll", () => {
    if (!frame) position = viewport.scrollLeft;
    if (interacting && !pointerHeld) resumeAfterInteraction();
  }, { passive: true });
  document.addEventListener("visibilitychange", sync);
  reducedMotion.addEventListener("change", setMotion);
  if ("ResizeObserver" in window) new ResizeObserver(measure).observe(viewport);
  else window.addEventListener("resize", measure);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(entries => {
      onScreen = entries[0].isIntersecting;
      sync();
    }, { threshold: 0 }).observe(viewport);
  }
  setMotion();
})();

const navLinks = nav ? [...nav.querySelectorAll('a[href^="#"]')] : [];
const navSections = navLinks
  .map((link) => document.querySelector(link.hash))
  .filter(Boolean);
let scrollQueued = false;
function updateScroll() {
  scrollQueued = false;
  if (header) {
    header.classList.toggle("is-scrolled", window.scrollY > 16);
  }
  let active;
  for (const section of navSections) {
    const bounds = section.getBoundingClientRect();
    if (bounds.top <= 160 && bounds.bottom > 160) active = section.id;
  }
  navLinks.forEach((link) => {
    if (link.hash === "#" + active)
      link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}
function queueScroll() {
  if (scrollQueued) return;
  scrollQueued = true;
  window.requestAnimationFrame(updateScroll);
}
window.addEventListener("scroll", queueScroll, { passive: true });
window.addEventListener("resize", queueScroll);
updateScroll();

// Reveal each composition once; keep individual items staggered within their group.
if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const revealGroups = [
    ".about-grid > div", ".impact-intro", ".impact-stat", ".benefit-card", ".section-heading",
    ".programme-panel", ".process-grid > li", ".timeline-block", ".documents-intro",
    ".documents-header", ".city-scene", ".city-points", ".gallery-grid", ".news-card",
    ".partners-heading", ".faq-grid > div", ".contact-grid > div",
  ];
  const elements = [...document.querySelectorAll(revealGroups.join(","))];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0, rootMargin: "0px 0px -32px 0px" });

  elements.forEach((element) => {
    element.classList.add("reveal");
    if (element.matches(".impact-stat, .benefit-card, .process-grid > li, .gallery-item, .news-card")) {
      const siblings = [...element.parentElement.children];
      element.style.setProperty("--reveal-delay", `${(siblings.indexOf(element) % 4) * 70}ms`);
    }
    observer.observe(element);
  });
  document.documentElement.classList.add("motion-ready");

  // Keyboard focus must never land on an invisible control.
  document.addEventListener("focusin", (event) => {
    const parent = event.target.closest(".reveal");
    if (parent) {
      parent.classList.add("is-visible");
      observer.unobserve(parent);
    }
  });
  reducedMotion.addEventListener("change", (event) => {
    if (!event.matches) return;
    document.documentElement.classList.remove("motion-ready");
    observer.disconnect();
  });
}

const year = document.getElementById("year");
if (year)
  year.textContent = new Intl.DateTimeFormat("en", {
    year: "numeric",
    timeZone: "Asia/Tashkent",
  }).format(new Date());

// Buttons fill from the point where the pointer enters or leaves, so the hover feels directional.
document.querySelectorAll(".button").forEach((button) => {
  const setOrigin = (event) => {
    const box = button.getBoundingClientRect();
    button.style.setProperty("--pointer-x", `${event.clientX - box.left}px`);
    button.style.setProperty("--pointer-y", `${event.clientY - box.top}px`);
  };
  button.addEventListener("pointerenter", setOrigin);
  button.addEventListener("pointerleave", setOrigin);
});
