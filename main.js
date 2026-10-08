"use strict";

const root = document.documentElement;
const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".site-nav");
const mobileLayout = window.matchMedia("(max-width: 920px)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const motionButton = document.querySelector(".motion-toggle");
let motionPaused = false;
try {
  motionPaused = localStorage.getItem("iaeste-motion-paused") === "true";
} catch (_) {
  /* Storage is optional. */
}

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

// All paths remain readable when JavaScript is unavailable.
const tabs = [...document.querySelectorAll(".audience-tab")];
const panels = [...document.querySelectorAll(".audience-panel")];
const tabList = document.querySelector(".audience-tabs");
function selectTab(index, moveFocus = false) {
  tabs.forEach((tab, tabIndex) => {
    const active = tabIndex === index;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    panels[tabIndex].hidden = !active;
  });
  if (moveFocus) tabs[index].focus();
}
if (tabs.length && tabs.length === panels.length) {
  tabList.setAttribute("role", "tablist");
  tabs.forEach((tab, index) => {
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", tab.dataset.panel);
    panels[index].setAttribute("role", "tabpanel");
    panels[index].tabIndex = 0;
    tab.addEventListener("click", () => selectTab(index));
    tab.addEventListener("keydown", (event) => {
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft")
        next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      else return;
      event.preventDefault();
      selectTab(next, true);
    });
  });
  selectTab(0);
  root.classList.add("tabs-ready");
}

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
    { threshold: 0.08, rootMargin: "0px 0px -30px 0px" },
  );
  document
    .querySelectorAll(".reveal")
    .forEach((element) => revealObserver.observe(element));
  root.classList.add("animations-ready");
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
    { rootMargin: "-10% 0px -65% 0px", threshold: 0 },
  );
  document
    .querySelectorAll("main > section")
    .forEach((section) => sectionObserver.observe(section));
}

const parallaxImages = [...document.querySelectorAll(".parallax-image")];
let scrollPending = false;
function updateScroll() {
  scrollPending = false;
  const maxScroll = root.scrollHeight - window.innerHeight;
  root.style.setProperty(
    "--scroll-progress",
    maxScroll > 0 ? String(window.scrollY / maxScroll) : "0",
  );
  header.classList.toggle("is-scrolled", window.scrollY > 30);
  if (!reducedMotion.matches && !motionPaused) {
    parallaxImages.forEach((image) => {
      const rect = image.parentElement.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const progress =
          (window.innerHeight / 2 - (rect.top + rect.height / 2)) /
          window.innerHeight;
        image.style.setProperty(
          "--parallax",
          Math.max(-24, Math.min(24, progress * 38)) + "px",
        );
      }
    });
  }
}
window.addEventListener(
  "scroll",
  () => {
    if (!scrollPending) {
      scrollPending = true;
      requestAnimationFrame(updateScroll);
    }
  },
  { passive: true },
);
window.addEventListener("resize", updateScroll, { passive: true });
updateScroll();

// A small, decorative canvas globe; no WebGL or animation library is required.
const canvas = document.getElementById("world-canvas");
const context = canvas && canvas.getContext("2d");
let globeVisible = true;
let frameId = null;
let angle = -0.8;
let previousFrame = 0;
let globeSize = 660;
let pixelRatio = 1;
const radians = Math.PI / 180;
const landPolygons = [
  [
    [-168, 71],
    [-144, 70],
    [-125, 55],
    [-124, 41],
    [-110, 30],
    [-98, 19],
    [-83, 9],
    [-77, 8],
    [-86, 24],
    [-80, 31],
    [-66, 46],
    [-53, 51],
    [-62, 60],
    [-92, 73],
    [-130, 72],
  ],
  [
    [-81, 12],
    [-65, 10],
    [-49, 0],
    [-35, -6],
    [-43, -23],
    [-52, -34],
    [-68, -55],
    [-75, -45],
    [-71, -18],
    [-81, -4],
  ],
  [
    [-52, 60],
    [-43, 60],
    [-20, 76],
    [-29, 83],
    [-51, 82],
    [-63, 70],
  ],
  [
    [-11, 36],
    [-10, 44],
    [3, 51],
    [7, 58],
    [20, 71],
    [35, 70],
    [44, 58],
    [60, 55],
    [90, 73],
    [140, 69],
    [179, 66],
    [165, 54],
    [140, 48],
    [130, 34],
    [120, 23],
    [106, 9],
    [99, 1],
    [91, 22],
    [78, 8],
    [70, 24],
    [58, 23],
    [44, 12],
    [35, 31],
    [20, 35],
    [10, 37],
  ],
  [
    [-17, 35],
    [9, 37],
    [33, 31],
    [43, 12],
    [51, 11],
    [42, -12],
    [30, -35],
    [18, -35],
    [10, -20],
    [0, 5],
    [-16, 15],
  ],
  [
    [114, -22],
    [130, -12],
    [143, -12],
    [154, -25],
    [149, -39],
    [133, -35],
    [115, -34],
  ],
  [
    [47, -13],
    [51, -16],
    [47, -26],
    [43, -23],
  ],
  [
    [130, 32],
    [142, 45],
    [145, 43],
    [138, 34],
  ],
  [
    [166, -35],
    [178, -38],
    [174, -47],
    [167, -45],
  ],
];
function insidePolygon(lon, lat, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i];
    const b = polygon[j];
    if (
      a[1] > lat !== b[1] > lat &&
      lon < ((b[0] - a[0]) * (lat - a[1])) / (b[1] - a[1]) + a[0]
    )
      inside = !inside;
  }
  return inside;
}
const landPoints = [];
for (let lat = -55; lat <= 82; lat += 2.8) {
  const lonStep = 2.8 / Math.max(0.3, Math.cos(lat * radians));
  for (let lon = -180; lon < 180; lon += lonStep) {
    if (landPolygons.some((polygon) => insidePolygon(lon, lat, polygon)))
      landPoints.push([lat * radians, lon * radians]);
  }
}
function project(lat, lon, radius) {
  const longitude = lon + angle;
  const x = Math.cos(lat) * Math.sin(longitude);
  const y = -Math.sin(lat);
  const z = Math.cos(lat) * Math.cos(longitude);
  const tilt = 0.17;
  return {
    x: globeSize / 2 + x * radius,
    y: globeSize / 2 + (y * Math.cos(tilt) - z * Math.sin(tilt)) * radius,
    z: y * Math.sin(tilt) + z * Math.cos(tilt),
  };
}
function drawGlobe() {
  if (!context) return;
  context.clearRect(0, 0, globeSize, globeSize);
  const center = globeSize / 2;
  const radius = globeSize * 0.353;
  const glow = context.createRadialGradient(
    center,
    center,
    radius * 0.5,
    center,
    center,
    radius * 1.12,
  );
  glow.addColorStop(0, "rgba(16,72,131,0.06)");
  glow.addColorStop(0.84, "rgba(35,105,172,0.035)");
  glow.addColorStop(1, "rgba(35,105,172,0)");
  context.fillStyle = glow;
  context.beginPath();
  context.arc(center, center, radius * 1.12, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = "rgba(103,166,232,0.15)";
  context.lineWidth = 0.65;
  context.beginPath();
  context.arc(center, center, radius, 0, Math.PI * 2);
  context.stroke();
  function drawLine(points) {
    context.beginPath();
    let started = false;
    points.forEach((point) => {
      const p = project(point[0], point[1], radius);
      if (p.z > 0) {
        if (!started) context.moveTo(p.x, p.y);
        else context.lineTo(p.x, p.y);
        started = true;
      } else started = false;
    });
    context.stroke();
  }
  context.strokeStyle = "rgba(97,155,213,0.13)";
  context.lineWidth = 0.55;
  for (let lat = -60; lat <= 60; lat += 30) {
    const points = [];
    for (let lon = -180; lon <= 180; lon += 3)
      points.push([lat * radians, lon * radians]);
    drawLine(points);
  }
  for (let lon = -180; lon < 180; lon += 30) {
    const points = [];
    for (let lat = -90; lat <= 90; lat += 3)
      points.push([lat * radians, lon * radians]);
    drawLine(points);
  }
  landPoints.forEach((point) => {
    const p = project(point[0], point[1], radius);
    const alpha = p.z > 0 ? 0.32 + p.z * 0.48 : 0.045;
    context.fillStyle = "rgba(108,180,255," + alpha + ")";
    context.beginPath();
    context.arc(
      p.x,
      p.y,
      Math.max(0.7, globeSize / 440) * (p.z > 0 ? 1 : 0.8),
      0,
      Math.PI * 2,
    );
    context.fill();
  });
  context.save();
  context.translate(center, center);
  context.rotate(-0.48);
  context.strokeStyle = "rgba(119,181,243,0.22)";
  context.setLineDash([3, 7]);
  context.lineWidth = 0.7;
  context.beginPath();
  context.ellipse(0, 0, radius * 1.24, radius * 0.59, 0, 0, Math.PI * 2);
  context.stroke();
  context.setLineDash([]);
  const orbitAngle = angle * 1.3;
  const nodeX = Math.cos(orbitAngle) * radius * 1.24;
  const nodeY = Math.sin(orbitAngle) * radius * 0.59;
  context.fillStyle = "#bcf07a";
  context.beginPath();
  context.arc(nodeX, nodeY, globeSize / 165, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = "rgba(188,240,122,0.25)";
  context.beginPath();
  context.arc(nodeX, nodeY, globeSize / 80, 0, Math.PI * 2);
  context.stroke();
  context.restore();
}
function canAnimate() {
  return (
    context &&
    globeVisible &&
    !document.hidden &&
    !motionPaused &&
    !reducedMotion.matches
  );
}
function globeFrame(timestamp) {
  frameId = null;
  if (!canAnimate()) {
    previousFrame = 0;
    return;
  }
  if (!previousFrame || timestamp - previousFrame >= 32) {
    const elapsed = previousFrame ? Math.min(timestamp - previousFrame, 64) : 0;
    angle += elapsed * 0.000055;
    previousFrame = timestamp;
    drawGlobe();
  }
  frameId = requestAnimationFrame(globeFrame);
}
function syncGlobe() {
  if (!canAnimate()) {
    if (frameId !== null) cancelAnimationFrame(frameId);
    frameId = null;
    previousFrame = 0;
    drawGlobe();
  } else if (frameId === null) {
    previousFrame = 0;
    frameId = requestAnimationFrame(globeFrame);
  }
}
function resizeGlobe() {
  if (!context) return;
  globeSize = canvas.getBoundingClientRect().width || 660;
  pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(globeSize * pixelRatio);
  canvas.height = Math.round(globeSize * pixelRatio);
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  drawGlobe();
}
if (context) {
  resizeGlobe();
  if ("ResizeObserver" in window)
    new ResizeObserver(resizeGlobe).observe(canvas);
  else window.addEventListener("resize", resizeGlobe, { passive: true });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      globeVisible = entries[0].isIntersecting;
      syncGlobe();
    }).observe(canvas);
  }
  document.addEventListener("visibilitychange", syncGlobe);
}
function updateMotion() {
  const stopped = motionPaused || reducedMotion.matches;
  root.classList.toggle("motion-paused", stopped);
  motionButton.setAttribute("aria-pressed", String(motionPaused));
  motionButton.setAttribute(
    "aria-label",
    motionPaused ? "Resume animations" : "Pause animations",
  );
  motionButton.querySelector("span").textContent = motionPaused
    ? "Resume motion"
    : "Pause motion";
  motionButton
    .querySelector("use")
    .setAttribute("href", motionPaused ? "#play" : "#pause");
  if (stopped)
    parallaxImages.forEach((image) => image.style.removeProperty("--parallax"));
  syncGlobe();
}
root.classList.add("motion-ready");
motionButton.addEventListener("click", () => {
  motionPaused = !motionPaused;
  try {
    localStorage.setItem("iaeste-motion-paused", String(motionPaused));
  } catch (_) {
    /* Storage is optional. */
  }
  updateMotion();
});
reducedMotion.addEventListener("change", updateMotion);
updateMotion();
const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());
