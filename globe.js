"use strict";

(() => {
  const stage = document.querySelector(".world-stage");
  const canvas = stage?.querySelector("canvas");
  const context = canvas?.getContext("2d", { alpha: true });
  if (!context) return;

  const globeLayout = window.matchMedia("(min-width: 768px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const originLabel = stage.querySelector(".world-origin");
  const TAU = Math.PI * 2;
  const RAD = Math.PI / 180;
  const radius = 275;
  const center = { x: 400, y: 343 };
  const INTRO = 2800; // ms
  const TAIL = 18; // trail segments
  const CYCLE = 1.3; // Normalized phases: 1 for travel, 0.3 for the arrival pause.
  const RETURN_DELAY = 9000; // idle time before return (ms)
  const FOLLOW_DIRECT = 210; // steering time constant (ms)
  const FOLLOW_RETURN = 420; // return time constant (ms)
  const MIN_LAT = -55;
  const MAX_LAT = 45;
  // Light direction: upper left, towards the viewer.
  const light = [-.45, .55, .7];
  let data;
  let dots;
  let bands;
  let frame = 0;
  let lastFrame = 0;
  let elapsed = 0;
  let swayStart = 0;
  let idleSince = 0;
  let renderCost = 0; // smoothed draw time (ms)
  let smoothRate = true; // allow 60 fps at rest
  let follow = FOLLOW_DIRECT;
  let ready = false;
  let loading = false;
  let inView = true;
  let longitude = 0;
  let latitude = 0;
  let targetLongitude = 0;
  let targetLatitude = 0;
  let dragging = null;
  let labelFont = "600 11px sans-serif";
  let originBox = null;
  let originSize = { w: 0, h: 0 };
  const labels = [];
  let yawSin, yawCos, pitchSin, pitchCos;

  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
  const easeOut = value => 1 - (1 - clamp(value)) ** 3;
  const lerp = (a, b, t) => a + (b - a) * t;

  function vector(lon, lat) {
    return [Math.cos(lat * RAD) * Math.sin(lon * RAD), Math.sin(lat * RAD), Math.cos(lat * RAD) * Math.cos(lon * RAD)];
  }
  const origin = vector(69.622, 40.283);
  // Illustrative geographic routes.
  const destinations = [
    ["London", -.12, 51.5], ["Berlin", 13.4, 52.52], ["Istanbul", 28.98, 41], ["Tokyo", 139.69, 35.68],
    ["Singapore", 103.82, 1.35], ["Sydney", 151.21, -33.87], ["New York", -74, 40.71], ["São Paulo", -46.63, -23.55],
    ["Cairo", 31.24, 30.04], ["New Delhi", 77.21, 28.61], ["Cape Town", 18.42, -33.92], ["Vancouver", -123.12, 49.28],
  ];
  const routes = destinations.map(([name, ...coordinates], index) => {
    const destination = vector(...coordinates);
    const angle = Math.acos(Math.max(-1, Math.min(1, origin.reduce((sum, n, i) => sum + n * destination[i], 0))));
    const sinAngle = Math.sin(angle);
    const points = Array.from({ length: 81 }, (_, i) => {
      const t = i / 80;
      const height = 1 + Math.sin(Math.PI * t) * (.12 + angle * .08);
      return origin.map((n, axis) => height * (Math.sin((1 - t) * angle) * n + Math.sin(t * angle) * destination[axis]) / sinAngle);
    });
    return { points, destination, name, index, phase: index * .173, speed: .075 + index % 3 * .012 };
  });
  const grid = [];
  for (let lat = -60; lat <= 60; lat += 30) {
    grid.push({ equator: lat === 0, points: Array.from({ length: 121 }, (_, i) => vector(i * 3, lat)) });
  }
  for (let lon = 0; lon < 180; lon += 30) {
    grid.push({ equator: false, points: Array.from({ length: 121 }, (_, i) => {
      const angle = i * 3 * RAD;
      return [Math.cos(angle) * Math.sin(lon * RAD), Math.sin(angle), Math.cos(angle) * Math.cos(lon * RAD)];
    }) });
  }

  // Cache gradients; they do not depend on the canvas transform.
  function radial(x, y, inner, outer, stops) {
    const gradient = context.createRadialGradient(x, y, inner, x, y, outer);
    stops.forEach(([offset, color]) => gradient.addColorStop(offset, color));
    return gradient;
  }
  const paint = {
    shadow: radial(0, 0, 0, 230, [[0, "rgba(32,84,100,.15)"], [1, "rgba(32,84,100,0)"]]),
    halo: radial(center.x, center.y, radius - 8, radius + 64, [[0, "rgba(32,84,100,.22)"], [.3, "rgba(52,112,128,.09)"], [1, "rgba(32,84,100,0)"]]),
    sphere: radial(305, 230, 15, 300, [[0, "#347080"], [.55, "#205464"], [1, "#153d49"]]),
    limb: radial(center.x, center.y, 0, radius, [[0, "rgba(8,32,40,0)"], [.6, "rgba(8,32,40,0)"], [1, "rgba(8,32,40,.46)"]]),
    glint: radial(315, 228, 0, 240, [[0, "rgba(255,255,255,.17)"], [.5, "rgba(255,255,255,.05)"], [1, "rgba(255,255,255,0)"]]),
    rim: radial(center.x, center.y, radius - 24, radius + 9, [[0, "rgba(160,214,226,0)"], [.72, "rgba(160,214,226,.2)"], [1, "rgba(160,214,226,0)"]]),
    shade: radial(center.x - 110, center.y - 100, 150, 470, [[0, "rgba(8,32,40,0)"], [1, "rgba(8,32,40,.3)"]]),
  };
  const crescentStart = 192 * RAD;
  const crescentEnd = 292 * RAD;
  const crescentFrom = [center.x + Math.cos(crescentStart) * radius, center.y + Math.sin(crescentStart) * radius];
  const crescentTo = [center.x + Math.cos(crescentEnd) * radius, center.y + Math.sin(crescentEnd) * radius];
  paint.crescent = context.createLinearGradient(...crescentFrom, ...crescentTo);
  [[0, "rgba(214,240,246,0)"], [.45, "rgba(214,240,246,.5)"], [1, "rgba(214,240,246,0)"]].forEach(([offset, color]) => paint.crescent.addColorStop(offset, color));

  function project(v) {
    const x = v[0] * yawCos - v[2] * yawSin;
    const z = v[0] * yawSin + v[2] * yawCos;
    const y = v[1] * pitchCos - z * pitchSin;
    return { x: center.x + x * radius, y: center.y - y * radius, z: v[1] * pitchSin + z * pitchCos };
  }
  function outside(point) {
    return (point.x - center.x) ** 2 + (point.y - center.y) ** 2 > radius ** 2;
  }
  function visible(point) {
    return point.z >= 0 || outside(point);
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

  // Resettable sway avoids jumps when returning home.
  function swayLongitude() { return Math.sin((elapsed - swayStart) / 21000) * 24; }
  function swayLatitude() { return Math.sin((elapsed - swayStart) / 27000) * 3; }

  function drawGlobe(intro) {
    context.save();
    context.translate(400, 666);
    context.scale(1, .14);
    circle(0, 0, 230, paint.shadow);
    context.restore();
    circle(center.x, center.y, radius + 64, paint.halo);
    circle(center.x, center.y, radius + 17, null, "#20546412", .8);
    circle(center.x, center.y, radius, paint.sphere, "#20546440", .8);
    circle(center.x, center.y, radius, paint.limb);
    circle(center.x, center.y, radius, paint.shade);
    circle(center.x, center.y, radius, paint.glint);
    context.beginPath();
    context.arc(center.x, center.y, radius - .6, crescentStart, crescentEnd);
    context.strokeStyle = paint.crescent;
    context.lineWidth = 1.4;
    context.stroke();

    for (const meridian of grid) {
      line(meridian.points.map(project), meridian.equator ? "#edf3f221" : "#edf3f215", meridian.equator ? .8 : .65);
    }

    // Batch dots by lighting band and reuse typed arrays per frame.
    const dotCount = data.dots.length;
    for (let i = 0; i < dotCount; i++) {
      const v = data.dots[i];
      const rx = v[0] * yawCos - v[2] * yawSin;
      const rz = v[0] * yawSin + v[2] * yawCos;
      const z = v[1] * pitchSin + rz * pitchCos;
      const x = center.x + rx * radius;
      const y = center.y - (v[1] * pitchCos - rz * pitchSin) * radius;
      dots[i * 3] = x; dots[i * 3 + 1] = y; dots[i * 3 + 2] = z;
      if (z <= .01) { bands[i] = 255; continue; }
      const lit = clamp(((x - center.x) * light[0] + (center.y - y) * light[1]) / radius + z * light[2]);
      bands[i] = Math.min(7, Math.floor(clamp(z * .5 + lit * .55) * 8));
    }
    for (let band = 0; band < 8; band++) {
      context.beginPath();
      for (let i = 0; i < bands.length; i++) {
        if (bands[i] !== band) continue;
        const z = dots[i * 3 + 2];
        const size = 1.05 + z * .38;
        context.moveTo(dots[i * 3] + size, dots[i * 3 + 1]);
        context.arc(dots[i * 3], dots[i * 3 + 1], size, 0, TAU);
      }
      context.fillStyle = `rgba(237,243,242,${.26 + band * .066})`;
      context.fill();
    }

    drawCountry(intro);
    circle(center.x, center.y, radius + 9, paint.rim);
  }

  function drawCountry(intro) {
    const country = data.tajikistan.map(project);
    const depth = Math.min(...country.map(point => point.z));
    if (depth <= 0) return;
    const presence = smooth(depth / .14);
    const breath = .5 + .5 * Math.sin(elapsed / 1500);
    const emphasis = smooth((intro - .35) / .4);
    context.beginPath();
    country.forEach((point, i) => i ? context.lineTo(point.x, point.y) : context.moveTo(point.x, point.y));
    context.closePath();
    context.lineJoin = "round";
    context.globalAlpha = presence;
    context.strokeStyle = `rgba(255,255,255,${.07 + .06 * breath})`;
    context.lineWidth = 7;
    context.stroke();
    context.strokeStyle = `rgba(255,255,255,${.14 + .1 * breath})`;
    context.lineWidth = 3.2;
    context.stroke();
    context.fillStyle = `rgba(255,255,255,${lerp(.4, .46 + .14 * breath, emphasis)})`;
    context.fill();
    context.strokeStyle = "#ffffffd9";
    context.lineWidth = .8;
    context.stroke();
    context.globalAlpha = 1;
  }

  function drawRoute(route, intro) {
    const reveal = easeOut((intro - .3) / .55 - route.index * .035);
    if (reveal <= 0) return;
    const points = route.points.map(project);
    const drawn = points.slice(0, Math.max(2, Math.round(reveal * 80) + 1));
    line(drawn, "#edf3f28c", 1.05, p => visible(p) && !outside(p));
    line(drawn, "#20546465", 1.05, p => visible(p) && outside(p));

    const settled = reveal >= 1;
    const arrival = (elapsed / 1000 * route.speed + route.phase) % CYCLE;
    const flying = settled && arrival < 1;
    const afterglow = settled && !flying ? (arrival - 1) / (CYCLE - 1) : 0;
    const active = !settled ? 0 : flying ? smooth(arrival / .08) : 1 - smooth(afterglow * 1.4);
    const warmth = !settled ? 0 : flying ? smooth((arrival - .94) / .06) : 1 - smooth((afterglow - .6) / .4);

    let head = null;
    let i = 79;
    if (flying) {
      const eased = arrival * .55 + (.5 - .5 * Math.cos(Math.PI * arrival)) * .45;
      const position = eased * 80;
      i = Math.min(79, Math.floor(position));
      const fraction = position - i;
      const a = route.points[i];
      const b = route.points[i + 1];
      head = project(a.map((v, axis) => v + (b[axis] - v) * fraction));
    }
    if (active > .01) {
      const travelled = flying ? points.slice(0, i + 1) : drawn.slice();
      if (head) travelled.push(head);
      line(travelled, `rgba(255,255,255,${.5 * active})`, 1.5, p => visible(p) && !outside(p));
    }

    const destination = project(route.destination);
    if (destination.z > .03 && settled) {
      if (warmth > .01) circle(destination.x, destination.y, 7 + 4 * warmth, `rgba(237,243,242,${.16 * warmth})`);
      circle(destination.x, destination.y, 5, null, "#edf3f250", .8);
      circle(destination.x, destination.y, 2 + .9 * warmth, "#edf3f2");
      if (arrival >= 1) {
        circle(destination.x, destination.y, 5 + easeOut(afterglow) * 15, null, `rgba(237,243,242,${.7 * (1 - afterglow) ** 1.5})`, 1.1);
      }
      const alpha = warmth * smooth((destination.z - .1) / .22);
      if (alpha > .01) labels.push({ x: destination.x, y: destination.y, name: route.name, alpha });
    } else if (destination.z > .03 && reveal > .85) {
      circle(destination.x, destination.y, 2, "#edf3f2");
    }
    if (!head || !visible(head)) return;

    const fade = Math.min(1, arrival / .06, (1 - arrival) / .06);
    const trail = [head];
    for (let k = 0; k <= TAIL && i - k >= 0; k++) trail.push(points[i - k]);
    context.lineCap = "round";
    for (let s = 0; s < trail.length - 1; s++) {
      const from = trail[s];
      const to = trail[s + 1];
      if (!visible(from) || !visible(to)) continue;
      const strength = (1 - s / TAIL) ** 1.6;
      context.globalAlpha = Math.max(0, strength) * fade * .95;
      context.beginPath();
      context.moveTo(from.x, from.y);
      context.lineTo(to.x, to.y);
      context.strokeStyle = outside(from) ? "#205464" : "#ffffff";
      context.lineWidth = 1 + 1.4 * strength;
      context.stroke();
    }
    context.globalAlpha = fade;
    const color = outside(head) ? "32,84,100" : "255,255,255";
    circle(head.x, head.y, 7.5, `rgba(${color},.1)`);
    circle(head.x, head.y, 4.6, `rgba(${color},.22)`);
    circle(head.x, head.y, 2.6, `rgb(${color})`);
    context.globalAlpha = 1;
  }

  // Avoid overlapping the origin and previously placed labels.
  function drawLabels() {
    if (!labels.length) return;
    labels.sort((a, b) => b.alpha - a.alpha);
    context.font = labelFont;
    context.textBaseline = "middle";
    context.textAlign = "left";
    if ("letterSpacing" in context) context.letterSpacing = "1px";
    const placed = originBox ? [originBox] : [];
    const height = 22;
    for (const label of labels) {
      const text = label.name.toUpperCase();
      const width = Math.ceil(context.measureText(text).width) + 18;
      const flip = label.x + 10 + width > 792;
      const left = flip ? label.x - 10 - width : label.x + 10;
      const box = { left: left - 4, right: left + width + 4, top: label.y - height / 2 - 4, bottom: label.y + height / 2 + 4 };
      if (placed.some(other => box.left < other.right && box.right > other.left && box.top < other.bottom && box.bottom > other.top)) continue;
      placed.push(box);
      context.globalAlpha = label.alpha;
      context.beginPath();
      if (context.roundRect) context.roundRect(left, label.y - height / 2, width, height, 3);
      else context.rect(left, label.y - height / 2, width, height);
      context.fillStyle = "rgba(237,244,243,.95)";
      context.fill();
      context.strokeStyle = "rgba(32,84,100,.14)";
      context.lineWidth = 1;
      context.stroke();
      context.fillStyle = "#153d49";
      context.fillText(text, left + 9, label.y + .5);
    }
    if ("letterSpacing" in context) context.letterSpacing = "0px";
    context.globalAlpha = 1;
    labels.length = 0;
  }

  function drawOrigin(intro) {
    const point = project(origin);
    const present = smooth((intro - .4) / .3);
    if (point.z > .05 && present > 0) {
      context.globalAlpha = present;
      for (const offset of [0, .5]) {
        const pulse = ((elapsed / 2800) + offset) % 1;
        circle(point.x, point.y, 9 + easeOut(pulse) * 18, null, `rgba(255,255,255,${.5 * (1 - pulse) ** 1.4})`, 1.2);
      }
      circle(point.x, point.y, 10, "#ffffff18", "#ffffff99", 1);
      circle(point.x, point.y, 4, "#ffffff");
      context.globalAlpha = 1;
    }
    const labelShown = point.z > .05 && present >= 1;
    const flip = point.x > 520;
    originLabel.style.left = `${point.x / 8}%`;
    originLabel.style.top = `${point.y / 7.2}%`;
    originLabel.classList.toggle("is-hidden", !labelShown);
    originLabel.classList.toggle("label-left", flip);
    // Convert DOM label bounds to canvas coordinates for collision checks.
    originBox = labelShown && originSize.w
      ? { left: flip ? point.x - originSize.w - 4 : point.x - 4, right: flip ? point.x + 4 : point.x + originSize.w + 4, top: point.y - originSize.h / 2 - 4, bottom: point.y + originSize.h / 2 + 4 }
      : null;
  }

  function render() {
    if (!ready || !globeLayout.matches) return;
    const intro = reducedMotion.matches ? 1 : Math.min(1, elapsed / INTRO);
    const settle = easeOut(intro);
    const yaw = (44 + longitude + swayLongitude() - (1 - settle) * 70) * RAD;
    const pitch = (20 + latitude + swayLatitude() - (1 - settle) * 8) * RAD;
    yawSin = Math.sin(yaw); yawCos = Math.cos(yaw);
    pitchSin = Math.sin(pitch); pitchCos = Math.cos(pitch);
    context.clearRect(0, 0, 800, 720);
    context.lineCap = "round";
    drawGlobe(intro);
    routes.forEach(route => drawRoute(route, intro));
    drawOrigin(intro);
    drawLabels();
  }

  function settling() {
    return Math.abs(targetLongitude - longitude) > .02 || Math.abs(targetLatitude - latitude) > .02;
  }
  // Preserve the current rotation before resetting the sway clock.
  function goHome() {
    longitude = ((longitude + swayLongitude() + 180) % 360 + 360) % 360 - 180;
    latitude = clamp(latitude + swayLatitude(), MIN_LAT, MAX_LAT);
    swayStart = elapsed;
    targetLongitude = 0;
    targetLatitude = 0;
    follow = FOLLOW_RETURN;
  }
  function explored() {
    return Math.abs(targetLongitude) > .5 || Math.abs(targetLatitude) > .5;
  }
  function update(dt) {
    if (dragging || !dt) return;
    if (explored() && !settling() && elapsed - idleSince > RETURN_DELAY) goHome();
    const k = 1 - Math.exp(-dt / follow);
    longitude += (targetLongitude - longitude) * k;
    latitude += (targetLatitude - latitude) * k;
    if (!settling()) { longitude = targetLongitude; latitude = targetLatitude; }
  }
  function shouldAnimate() { return ready && globeLayout.matches && inView && !document.hidden; }
  function tick(time) {
    frame = 0;
    if (!shouldAnimate()) { lastFrame = 0; return; }
    // Hysteresis prevents repeated switching between 30 and 60 fps.
    const active = dragging || settling() || (!reducedMotion.matches && elapsed < INTRO);
    if (renderCost > 6) smoothRate = false;
    else if (renderCost < 4) smoothRate = true;
    const interval = active || smoothRate ? 1000 / 60 - 3 : 1000 / 30 - 4;
    if (!lastFrame || time - lastFrame >= interval) {
      const dt = lastFrame ? Math.min(80, time - lastFrame) : 0;
      elapsed += dt;
      lastFrame = time;
      update(dt);
      const started = performance.now();
      render();
      renderCost = renderCost ? renderCost * .9 + (performance.now() - started) * .1 : performance.now() - started;
    }
    frame = requestAnimationFrame(tick);
  }
  function syncAnimation() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0; lastFrame = 0;
    if (shouldAnimate()) frame = requestAnimationFrame(tick);
  }
  function measureLabels() {
    const bounds = stage.getBoundingClientRect();
    const heading = originLabel.querySelector("strong");
    if (!bounds.width || !heading) return;
    const unit = 800 / bounds.width;
    originSize = { w: originLabel.offsetWidth * unit, h: originLabel.offsetHeight * unit };
    labelFont = `600 11px ${getComputedStyle(heading).fontFamily}`;
  }
  function resize() {
    if (!globeLayout.matches) return;
    const bounds = stage.getBoundingClientRect();
    if (!bounds.width) return;
    const scale = Math.min(window.devicePixelRatio || 1, 2) * bounds.width / 800;
    canvas.width = Math.round(800 * scale);
    canvas.height = Math.round(720 * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);
    measureLabels();
    render();
  }
  function reset() {
    goHome();
    syncAnimation();
  }
  function nudge(lon, lat) {
    targetLongitude += lon;
    targetLatitude = clamp(targetLatitude + lat, MIN_LAT, MAX_LAT);
    follow = FOLLOW_DIRECT;
    idleSince = elapsed;
    syncAnimation();
  }

  document.addEventListener("visibilitychange", syncAnimation);
  stage.addEventListener("pointerdown", event => {
    if (event.button !== 0 || !ready) return;
    targetLongitude = longitude; targetLatitude = latitude;
    follow = FOLLOW_DIRECT;
    dragging = { x: event.clientX, y: event.clientY, longitude, latitude, id: event.pointerId, time: event.timeStamp, velocityLon: 0, velocityLat: 0, moved: 0 };
    stage.setPointerCapture(event.pointerId);
    stage.classList.add("is-dragging");
  });
  stage.addEventListener("pointermove", event => {
    if (!dragging || event.pointerId !== dragging.id) return;
    const sensitivity = 170 / stage.clientWidth;
    const nextLon = dragging.longitude - (event.clientX - dragging.x) * sensitivity;
    const nextLat = clamp(dragging.latitude + (event.clientY - dragging.y) * sensitivity * .6, MIN_LAT, MAX_LAT);
    const dt = event.timeStamp - dragging.time;
    if (dt > 0) {
      // Release velocity is measured in degrees per second.
      dragging.velocityLon = lerp(dragging.velocityLon, (nextLon - longitude) / dt * 1000, .35);
      dragging.velocityLat = lerp(dragging.velocityLat, (nextLat - latitude) / dt * 1000, .35);
    }
    dragging.time = event.timeStamp;
    dragging.moved = event.timeStamp;
    longitude = targetLongitude = nextLon;
    latitude = targetLatitude = nextLat;
  });
  function endDrag(event) {
    if (dragging && event && event.type === "pointerup" && event.timeStamp - dragging.moved < 90) {
      // Apply release momentum only after recent pointer movement.
      targetLongitude = longitude + dragging.velocityLon * .21;
      targetLatitude = clamp(latitude + dragging.velocityLat * .21, MIN_LAT, MAX_LAT);
    }
    dragging = null;
    idleSince = elapsed;
    stage.classList.remove("is-dragging");
    syncAnimation();
  }
  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);
  stage.addEventListener("lostpointercapture", () => { if (dragging) endDrag(); });
  stage.addEventListener("keydown", event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") reset();
    if (event.key === "ArrowLeft") nudge(-12, 0);
    if (event.key === "ArrowRight") nudge(12, 0);
    if (event.key === "ArrowUp") nudge(0, 8);
    if (event.key === "ArrowDown") nudge(0, -8);
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
      bands = new Uint8Array(data.dots.length);
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
      if (document.fonts) document.fonts.ready.then(measureLabels);
      syncAnimation();
    })
    .catch(() => {
      // Preserve the static SVG if canvas data cannot load.
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
