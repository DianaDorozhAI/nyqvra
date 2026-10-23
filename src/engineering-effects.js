(() => {
  // The knight is intentionally static; only the brand marks animate.
  const canvases = [...document.querySelectorAll("[data-orbit-mark]")];
  const marks = canvases
    .map((canvas) => ({
      canvas,
      context: canvas.getContext("2d"),
      visible: true,
    }))
    .filter((mark) => mark.context);
  if (!marks.length) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0;
  let previous = 0;
  let phase = 0.4;
  let burstStart = -Infinity;
  let hoverUntil = 0;
  const samples = 180;
  const tau = Math.PI * 2;
  const accentStyle = getComputedStyle(document.documentElement);
  const markRgb =
    accentStyle.getPropertyValue("--mark-rgb").trim() || "198,154,245";
  const nodeRgb =
    accentStyle.getPropertyValue("--mark-node-rgb").trim() || "223,194,255";

  // A continuous three-dimensional trefoil, not a rotating bitmap.
  // Geometry is deterministic and never receives the generated password.
  function project(t, rotation, pulse, size) {
    const radial = 2 + 0.52 * Math.cos(3 * t);
    const x = (radial * Math.cos(2 * t)) / 2.52;
    const y = (radial * Math.sin(2 * t)) / 2.52;
    const z = 0.64 * Math.sin(3 * t);
    const yaw = rotation * 0.42;
    const a = x * Math.cos(yaw) + z * Math.sin(yaw);
    const b = z * Math.cos(yaw) - x * Math.sin(yaw);
    const tilt = 0.63;
    const py = y * Math.cos(tilt) - b * Math.sin(tilt);
    const depth = y * Math.sin(tilt) + b * Math.cos(tilt);
    const perspective = 1 + depth * 0.12;
    const radius = size * (0.35 + pulse * 0.018);
    return {
      x: size / 2 + a * radius * perspective,
      y: size / 2 + py * radius * perspective,
      z: depth,
    };
  }

  function paint(mark, time) {
    const { canvas, context } = mark;
    const size = canvas.width;
    const progress = Math.min(1, Math.max(0, (time - burstStart) / 580));
    const pulse = progress < 1 ? Math.sin(progress * Math.PI) : 0;
    context.clearRect(0, 0, size, size);
    const vertices = Array.from({ length: samples + 1 }, (_, i) =>
      project((i / samples) * tau, phase, pulse, size),
    );
    const segments = vertices
      .slice(0, -1)
      .map((point, i) => ({
        a: point,
        b: vertices[i + 1],
        z: (point.z + vertices[i + 1].z) / 2,
      }))
      .sort((a, b) => a.z - b.z);
    context.lineCap = "round";
    for (const segment of segments) {
      const depth = Math.max(0, Math.min(1, (segment.z + 1) / 2));
      context.strokeStyle =
        "rgba(" + markRgb + "," + (0.5 + depth * 0.48) + ")";
      context.lineWidth = size * (0.009 + depth * 0.005);
      context.beginPath();
      context.moveTo(segment.a.x, segment.a.y);
      context.lineTo(segment.b.x, segment.b.y);
      context.stroke();
    }
    // Small moving light nodes make the direction of the woven path readable.
    for (let i = 0; i < 6; i++) {
      const t = ((i / 6) * tau + phase * 0.42) % tau;
      const p = project(t, phase, pulse, size);
      const depth = Math.max(0, Math.min(1, (p.z + 1) / 2));
      context.fillStyle = "rgba(" + nodeRgb + "," + (0.7 + depth * 0.3) + ")";
      context.shadowColor = "rgba(" + markRgb + ",.65)";
      context.shadowBlur = size * 0.025;
      context.beginPath();
      context.arc(p.x, p.y, size * (0.014 + depth * 0.005), 0, tau);
      context.fill();
    }
    context.shadowBlur = 0;
  }

  function draw(time) {
    frame = 0;
    const elapsed = Math.min(50, previous ? time - previous : 0);
    if (elapsed < 30 && previous) {
      frame = requestAnimationFrame(draw);
      return;
    }
    previous = time;
    const generating = time - burstStart < 580;
    phase +=
      elapsed * (generating ? 0.0019 : time < hoverUntil ? 0.00065 : 0.00012);
    marks.filter((mark) => mark.visible).forEach((mark) => paint(mark, time));
    if (
      !reduced.matches &&
      !document.hidden &&
      marks.some((mark) => mark.visible)
    )
      frame = requestAnimationFrame(draw);
  }
  function synchronize() {
    cancelAnimationFrame(frame);
    frame = 0;
    previous = 0;
    marks.forEach((mark) => paint(mark, performance.now()));
    if (
      !reduced.matches &&
      !document.hidden &&
      marks.some((mark) => mark.visible)
    )
      frame = requestAnimationFrame(draw);
  }
  document.addEventListener("nyqvra:generated", () => {
    burstStart = performance.now();
    synchronize();
  });
  document.querySelectorAll(".brand,.brand-orbit").forEach((control) => {
    control.addEventListener("pointerenter", () => {
      hoverUntil = performance.now() + 1000;
    });
    control.addEventListener("focus", () => {
      hoverUntil = performance.now() + 1000;
    });
  });
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const mark = marks.find((item) => item.canvas === entry.target);
        if (mark) mark.visible = entry.isIntersecting;
      }
      synchronize();
    });
    marks.forEach((mark) => observer.observe(mark.canvas));
  }
  reduced.addEventListener("change", synchronize);
  document.addEventListener("visibilitychange", synchronize);
  synchronize();
})();
