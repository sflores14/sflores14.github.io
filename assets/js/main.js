// Main interactions for sflores14.github.io
// - Dynamic canvas background (hero-canvas)
// - Sticky header anchor offsets
// - Email reveal without exposing address in HTML

(() => {
  const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setHeaderOffset() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const px = Math.round(header.getBoundingClientRect().height + 14);
    document.documentElement.style.setProperty("--header-offset", px + "px");
  }

  function initEmailReveal() {
    const revealButton = document.getElementById("reveal-email");
    const emailText = document.getElementById("email-text");
    const emailLink = document.getElementById("email-link");

    if (emailLink) {
      const user = "sflores4";
      const domain = "umd.edu";
      const addr = `${user}@${domain}`;
      emailLink.textContent = addr;
      emailLink.href = `mailto:${addr}`;
    }

    if (revealButton && emailText) {
      revealButton.addEventListener("click", () => {
        const hidden = emailText.hasAttribute("hidden");
        if (hidden) {
          emailText.removeAttribute("hidden");
          revealButton.textContent = "Hide email";
        } else {
          emailText.setAttribute("hidden", "");
          revealButton.textContent = "Click for email";
        }
      });
    }
  }

  function initCanvas() {
    const canvas = document.getElementById("hero-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const blobs = [
      { x: 0.05, y: 0.1, r: 260, dx: 0.00012, dy: 0.0001, hue: 350 },
      { x: 0.95, y: 0.2, r: 220, dx: -0.00012, dy: 0.00014, hue: 210 },
      { x: 0.1, y: 0.9, r: 280, dx: 0.0001, dy: -0.0001, hue: 28 },
      { x: 0.9, y: 0.85, r: 240, dx: -0.0001, dy: -0.00012, hue: 30 },
      { x: 0.5, y: 0.05, r: 220, dx: 0.00008, dy: 0.0001, hue: 200 },
    ];

    let mouseX = 0.5;
    let mouseY = 0.5;

    function resizeCanvas() {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    }

    function drawBlob(blob) {
      const x = blob.x * canvas.width;
      const y = blob.y * canvas.height;
      const radius = blob.r * window.devicePixelRatio;
      const gradient = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius);
      gradient.addColorStop(0, `hsla(${blob.hue}, 70%, 60%, 0.12)`);
      gradient.addColorStop(1, `hsla(${blob.hue}, 70%, 40%, 0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      blobs.forEach((blob) => {
        blob.x += blob.dx + (mouseX - 0.5) * 0.00006;
        blob.y += blob.dy + (mouseY - 0.5) * 0.00006;
        if (blob.x < 0.1 || blob.x > 0.9) blob.dx *= -1;
        if (blob.y < 0.1 || blob.y > 0.9) blob.dy *= -1;
        drawBlob(blob);
      });
      requestAnimationFrame(frame);
    }

    window.addEventListener("resize", resizeCanvas, { passive: true });
    window.addEventListener("mousemove", (event) => {
      mouseX = event.clientX / window.innerWidth;
      mouseY = event.clientY / window.innerHeight;
    }, { passive: true });

    resizeCanvas();

    // Respect reduced-motion: draw one frame only
    if (prefersReducedMotion) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      blobs.forEach(drawBlob);
      return;
    }

    frame();
  }

  window.addEventListener("load", () => {
    setHeaderOffset();
    initEmailReveal();
    initCanvas();
  });

  window.addEventListener("resize", setHeaderOffset, { passive: true });
})();
