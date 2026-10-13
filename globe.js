/* Geographic globe, rendered locally without a graphics library or remote runtime. */
"use strict";

(() => {
  const stage = document.querySelector(".world-stage");
  const canvas = stage?.querySelector("canvas");
  const context = canvas?.getContext("2d", { alpha: true });
  if (!context) return;

  const globeLayout = window.matchMedia("(min-width: 768px)");
  const originLabel = stage.querySelector(".world-origin");
  const TAU = Math.PI * 2;
  const RAD = Math.PI / 180;
  const radius = 275;
  const center = { x: 400, y: 343 };
  let data;
  let dots;
  let frame = 0;
  let lastFrame = 0;
  let elapsed = 0;
  let ready = false;
  let loading = false;
  let inView = true;
  let longitude = 0;
  let latitude = 0;
  let dragging = null;
  let yawSin, yawCos, pitchSin, pitchCos;

  function vector(lon, lat) {
    return [Math.cos(lat * RAD) * Math.sin(lon * RAD), Math.sin(lat * RAD), Math.cos(lat * RAD) * Math.cos(lon * RAD)];
  }
  const origin = vector(69.622, 40.283);
  // Illustrative connections; these are geographic destinations, not advertised vacancies.
  const destinations = [
    [-.12, 51.5], [13.4, 52.52], [28.98, 41], [139.69, 35.68],
    [103.82, 1.35], [151.21, -33.87], [-74, 40.71], [-46.63, -23.55],
    [31.24, 30.04], [77.21, 28.61], [18.42, -33.92], [-123.12, 49.28],
  ];
  const routes = destinations.map((coordinates, index) => {
    const destination = vector(...coordinates);
    const angle = Math.acos(Math.max(-1, Math.min(1, origin.reduce((sum, n, i) => sum + n * destination[i], 0))));
    const sinAngle = Math.sin(angle);
    const points = Array.from({ length: 81 }, (_, i) => {
      const t = i / 80;
      const height = 1 + Math.sin(Math.PI * t) * (.12 + angle * .08);
      return origin.map((n, axis) => height * (Math.sin((1 - t) * angle) * n + Math.sin(t * angle) * destination[axis]) / sinAngle);
    });
    return { points, destination, phase: index * .173, speed: .075 + index % 3 * .012 };
  });
  const grid = [];
  for (let lat = -60; lat <= 60; lat += 30) {
    grid.push(Array.from({ length: 121 }, (_, i) => vector(i * 3, lat)));
  }
  for (let lon = 0; lon < 180; lon += 30) {
    grid.push(Array.from({ length: 121 }, (_, i) => {
      const angle = i * 3 * RAD;
      return [Math.cos(angle) * Math.sin(lon * RAD), Math.sin(angle), Math.cos(angle) * Math.cos(lon * RAD)];
    }));
  }

  function project(v) {
    const x = v[0] * yawCos - v[2] * yawSin;
    const z = v[0] * yawSin + v[2] * yawCos;
    const y = v[1] * pitchCos - z * pitchSin;
    return { x: center.x + x * radius, y: center.y - y * radius, z: v[1] * pitchSin + z * pitchCos };
  }
  function visible(point) {
    return point.z >= 0 || (point.x - center.x) ** 2 + (point.y - center.y) ** 2 > radius ** 2;
  }
  function circle(x, y, r, fill, stroke, width = 1) {
    context.beginPath();
    context.arc(x, y, r, 0, TAU);
    if (fill) { context.fillStyle = fill; context.fill(); }
    if (stroke) { context.strokeStyle = stroke; context.lineWidth = width; context.stroke(); }
  }
  function line(points, color, width = 1, test = point => point.z > .015) {
    context.beginPath();
    let pen = false;
    for (const point of points) {
      const show = test(point);
      if (show) {
        if (pen) context.lineTo(point.x, point.y);
        else context.moveTo(point.x, point.y);
      }
      pen = show;
    }
    context.strokeStyle = color;
    context.lineWidth = width;
    context.stroke();
  }

  function render() {
    if (!ready || !globeLayout.matches) return;
    const yaw = (44 + longitude + Math.sin(elapsed / 21000) * 24) * RAD;
    const pitch = (20 + latitude + Math.sin(elapsed / 27000) * 3) * RAD;
    yawSin = Math.sin(yaw); yawCos = Math.cos(yaw);
    pitchSin = Math.sin(pitch); pitchCos = Math.cos(pitch);
    context.clearRect(0, 0, 800, 720);

    // A soft ground shadow and a fine outer rim give the globe depth without a card.
    context.save();
    context.translate(400, 666);
    context.scale(1, .14);
    const shadow = context.createRadialGradient(0, 0, 0, 0, 0, 230);
    shadow.addColorStop(0, "#20546421"); shadow.addColorStop(1, "#20546400");
    circle(0, 0, 230, shadow);
    context.restore();
    circle(center.x, center.y, radius + 17, null, "#20546412", .8);
    const sphere = context.createRadialGradient(305, 230, 15, 410, 360, 300);
    sphere.addColorStop(0, "#347080");
    sphere.addColorStop(.55, "#205464");
    sphere.addColorStop(1, "#153d49");
    circle(center.x, center.y, radius, sphere, "#20546440", .8);

    for (const meridian of grid) line(meridian.map(project), "#edf3f215", .65);

    // Batch all land dots into eight depth bands rather than thousands of draw calls.
    for (let i = 0; i < data.dots.length; i++) {
      const point = project(data.dots[i]);
      dots[i * 3] = point.x; dots[i * 3 + 1] = point.y; dots[i * 3 + 2] = point.z;
    }
    for (let band = 0; band < 8; band++) {
      context.beginPath();
      for (let i = 0; i < dots.length; i += 3) {
        const z = dots[i + 2];
        if (z <= .01 || Math.min(7, Math.floor(z * 8)) !== band) continue;
        const size = 1.05 + z * .38;
        context.moveTo(dots[i] + size, dots[i + 1]);
        context.arc(dots[i], dots[i + 1], size, 0, TAU);
      }
      context.fillStyle = `rgba(237,243,242,${.30 + band * .057})`;
      context.fill();
    }

    const country = data.tajikistan.map(project);
    if (country.every(point => point.z > 0)) {
      context.beginPath();
      country.forEach((point, i) => i ? context.lineTo(point.x, point.y) : context.moveTo(point.x, point.y));
      context.closePath();
      context.fillStyle = "#ffffff80";
      context.fill();
      context.strokeStyle = "#ffffffd9";
      context.lineWidth = .8;
      context.stroke();
    }

    context.lineCap = "round";
    routes.forEach(route => {
      const points = route.points.map(project);
      const outside = p => (p.x - center.x) ** 2 + (p.y - center.y) ** 2 > radius ** 2;
      line(points, "#edf3f28c", 1.05, p => visible(p) && !outside(p));
      line(points, "#20546465", 1.05, p => visible(p) && outside(p));
      const destination = project(route.destination);
      if (destination.z > .03) {
        circle(destination.x, destination.y, 5, null, "#edf3f250", .8);
        circle(destination.x, destination.y, 2, "#edf3f2");
      }
      const travel = (elapsed / 1000 * route.speed + route.phase) % 1;
      const position = travel * 80;
      const i = Math.min(79, Math.floor(position));
      const fraction = position - i;
      const particle = project(route.points[i].map((v, axis) => v + (route.points[i + 1][axis] - v) * fraction));
      if (visible(particle)) {
        const color = outside(particle) ? "#205464" : "#ffffff";
        line(points.slice(Math.max(0, i - 5), i + 1), color, 1.8, visible);
        circle(particle.x, particle.y, 2.7, color);
      }
    });

    const point = project(origin);
    if (point.z > .05) {
      const pulse = (elapsed / 2400) % 1;
      circle(point.x, point.y, 9 + pulse * 15, null, `rgba(255,255,255,${.5 * (1 - pulse)})`, 1.2);
      circle(point.x, point.y, 10, "#ffffff18", "#ffffff99", 1);
      circle(point.x, point.y, 4, "#ffffff");
    }
    originLabel.style.left = `${point.x / 8}%`;
    originLabel.style.top = `${point.y / 7.2}%`;
    originLabel.classList.toggle("is-hidden", point.z <= .05);
    originLabel.classList.toggle("label-left", point.x > 520);
  }

  function shouldAnimate() { return ready && globeLayout.matches && inView && !document.hidden; }
  function tick(time) {
    frame = 0;
    if (!shouldAnimate()) { lastFrame = 0; return; }
    if (!lastFrame || time - lastFrame >= 1000 / 30) {
      elapsed += lastFrame ? Math.min(80, time - lastFrame) : 0;
      lastFrame = time;
      render();
    }
    frame = requestAnimationFrame(tick);
  }
  function syncAnimation() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0; lastFrame = 0;
    if (shouldAnimate()) frame = requestAnimationFrame(tick);
  }
  function resize() {
    if (!globeLayout.matches) return;
    const bounds = stage.getBoundingClientRect();
    if (!bounds.width) return;
    const scale = Math.min(window.devicePixelRatio || 1, 2) * bounds.width / 800;
    canvas.width = Math.round(800 * scale);
    canvas.height = Math.round(720 * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);
    render();
  }
  function reset() { longitude = 0; latitude = 0; elapsed = 0; render(); }

  document.addEventListener("visibilitychange", syncAnimation);
  stage.addEventListener("pointerdown", event => {
    if (event.button !== 0 || !ready) return;
    dragging = { x: event.clientX, y: event.clientY, longitude, latitude, id: event.pointerId };
    stage.setPointerCapture(event.pointerId);
    stage.classList.add("is-dragging");
  });
  stage.addEventListener("pointermove", event => {
    if (!dragging || event.pointerId !== dragging.id) return;
    const sensitivity = 170 / stage.clientWidth;
    longitude = dragging.longitude - (event.clientX - dragging.x) * sensitivity;
    latitude = Math.max(-55, Math.min(45, dragging.latitude + (event.clientY - dragging.y) * sensitivity * .6));
    render();
  });
  function endDrag() { dragging = null; stage.classList.remove("is-dragging"); }
  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);
  stage.addEventListener("lostpointercapture", () => { if (dragging) endDrag(); });
  stage.addEventListener("keydown", event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") reset();
    if (event.key === "ArrowLeft") longitude -= 12;
    if (event.key === "ArrowRight") longitude += 12;
    if (event.key === "ArrowUp") latitude = Math.min(45, latitude + 8);
    if (event.key === "ArrowDown") latitude = Math.max(-55, latitude - 8);
    render();
  });

  function loadGlobe() {
    if (!globeLayout.matches || ready || loading) return;
    loading = true;
    fetch("assets/globe-land.json")
    .then(response => { if (!response.ok) throw new Error("Globe data unavailable"); return response.json(); })
    .then(atlas => {
      if (!Array.isArray(atlas.dots) || !Array.isArray(atlas.tajikistan)) throw new Error("Invalid globe data");
      data = atlas;
      dots = new Float32Array(data.dots.length * 3);
      ready = true;
      resize();
      stage.classList.add("is-ready");
      stage.tabIndex = 0;
      if ("ResizeObserver" in window) new ResizeObserver(resize).observe(stage);
      else window.addEventListener("resize", resize);
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(entries => {
          inView = entries[0].isIntersecting;
          syncAnimation();
        }, { threshold: 0 }).observe(stage);
      }
      syncAnimation();
    })
    .catch(() => {
      // Keep the geographic SVG and all content readable if Canvas or data loading fails.
      loading = false;
    });
  }
  globeLayout.addEventListener("change", () => {
    if (globeLayout.matches) {
      loadGlobe();
      if (ready) resize();
    } else if (dragging) {
      dragging = null;
      stage.classList.remove("is-dragging");
    }
    syncAnimation();
  });
  loadGlobe();
})();
