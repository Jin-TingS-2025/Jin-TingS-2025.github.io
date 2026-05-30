// ===== Particle Background =====
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let particles = [];
const PARTICLE_COUNT = 60;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

class Particle {
  constructor() {
    this.reset();
    this.y = Math.random() * canvas.height;
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = -10;
    this.size = Math.random() * 1.8 + 0.4;
    this.speed = Math.random() * 0.35 + 0.15;
    this.opacity = Math.random() * 0.5 + 0.2;
  }
  update() {
    this.y += this.speed;
    if (this.y > canvas.height + 10) this.reset();
  }
  draw() {
    ctx.fillStyle = `rgba(57, 186, 230, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.strokeStyle = `rgba(57, 186, 230, ${0.06 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.4;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== Typewriter =====
const roles = [
  "C/C++ 开发工程师",
  "QT 应用开发者",
  "Linux 系统编程爱好者",
  "OpenCV 图像处理实践者",
];
let roleIdx = 0;
let charIdx = 0;
let isDeleting = false;
const typeEl = document.getElementById("typewriter");

function typeWriter() {
  const current = roles[roleIdx];
  if (isDeleting) {
    typeEl.textContent = current.substring(0, charIdx--);
  } else {
    typeEl.textContent = current.substring(0, charIdx++);
  }

  let speed = isDeleting ? 40 : 100;

  if (!isDeleting && charIdx === current.length) {
    speed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    roleIdx = (roleIdx + 1) % roles.length;
    speed = 400;
  }

  setTimeout(typeWriter, speed);
}
typeWriter();

// ===== Count-up Animation =====
function animateCount(el, target) {
  const duration = 1500;
  const start = parseInt(el.textContent) || 0;
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(start + (target - start) * eased);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        animateCount(el, target);
        countObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.6 }
);

document.querySelectorAll(".stat-num").forEach((el) => countObserver.observe(el));

// ===== Scroll Reveal =====
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(
  ".skill-category, .project-card, .contact-card"
).forEach((el) => {
  el.classList.add("fade-up");
  revealObserver.observe(el);
});

// ===== Nav Highlight =====
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

function updateActiveLink() {
  let current = "";
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 100) {
      current = section.getAttribute("id");
    }
  });
  navLinks.forEach((link) => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === `#${current}`
    );
  });
}
window.addEventListener("scroll", updateActiveLink, { passive: true });
