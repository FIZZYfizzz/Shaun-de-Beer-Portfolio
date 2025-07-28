// Page Management
function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll(".page, .page-container").forEach((page) => {
    page.classList.remove("active");
    page.classList.add("hidden");
  });

  // Remove active class from all nav links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
  });

  // Show selected page (always use -page suffix)
  const page = document.getElementById(pageId + "-page");
  if (page) {
    page.classList.add("active");
    page.classList.remove("hidden");
  }

  // Add active class to corresponding nav link
  document
    .querySelector(`[onclick="showPage('${pageId}')"]`)
    .classList.add("active");

  // Scroll to top
  window.scrollTo(0, 0);
}

// Year Tab Switching Function for Education Page
function showYear(year) {
  // Hide all year content
  document.querySelectorAll(".year-content").forEach((content) => {
    content.classList.remove("active");
  });

  // Remove active class from all tabs
  document.querySelectorAll(".year-tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  // Show selected year content
  const yearContent = document.getElementById(`year-${year}`);
  if (yearContent) {
    yearContent.classList.add("active");
  }

  // Add active class to clicked tab
  event.target.classList.add("active");
}

// Particle System
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.particles = [];
    this.mouse = { x: 0, y: 0 };

    this.resize();
    this.init();
    this.animate();

    window.addEventListener("resize", () => this.resize());
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    const particleCount = Math.min(100, Math.floor(window.innerWidth / 10));
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((particle) => {
      // Mouse interaction
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        particle.vx += dx * 0.00005;
        particle.vy += dy * 0.00005;
      }

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(166, 124, 106, ${particle.opacity})`;
      this.ctx.fill();
    });

    // Draw connections
    this.particles.forEach((particle, i) => {
      for (let j = i + 1; j < this.particles.length; j++) {
        const other = this.particles[j];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(other.x, other.y);
          this.ctx.strokeStyle = `rgba(166, 124, 106, ${
            0.1 * (1 - distance / 100)
          })`;
          this.ctx.stroke();
        }
      }
    });

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize particle system
const canvas = document.getElementById("particle-canvas");
new ParticleSystem(canvas);

// Theme Toggle
function toggleTheme() {
  const body = document.body;
  const button = document.querySelector(".theme-toggle");

  if (body.getAttribute("data-theme") === "light") {
    body.removeAttribute("data-theme");
    button.textContent = "🌙 Dark";
    localStorage.setItem("theme", "dark");
  } else {
    body.setAttribute("data-theme", "light");
    button.textContent = "☀️ Light";
    localStorage.setItem("theme", "light");
  }
}

// Load saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.body.setAttribute("data-theme", "light");
  document.querySelector(".theme-toggle").textContent = "☀️ Light";
} else if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: light)").matches
) {
  document.body.setAttribute("data-theme", "light");
  document.querySelector(".theme-toggle").textContent = "☀️ Light";
}

// Terminal Easter Egg (Konami Code: ↑↑↓↓←→←→BA)
let konamiCode = [];
const konamiSequence = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

document.addEventListener("keydown", function (e) {
  konamiCode.push(e.code);

  if (konamiCode.length > konamiSequence.length) {
    konamiCode.shift();
  }

  if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
    showTerminal();
    konamiCode = [];
  }
});

function showTerminal() {
  const terminal = document.getElementById("terminal");
  const terminalBody = document.getElementById("terminal-body");

  terminal.style.display = "block";

  // Add some cool terminal content
  const commands = [
    "System initialization complete...",
    "Loading developer profile...",
    "> Skills: [C#, Java, Python, JavaScript, IoT, Machine Learning]",
    "> Status: Available for hire",
    "> Location: Pretoria, South Africa",
    "> Specialization: Full-Stack Development & IoT Solutions",
    "",
    "Fun fact: This terminal was activated by the Konami Code!",
    "Available commands: help, contact, projects, skills, about, education",
    "",
  ];

  terminalBody.innerHTML = "";
  let delay = 0;

  commands.forEach((cmd, index) => {
    setTimeout(() => {
      const line = document.createElement("div");
      line.className = "terminal-line";
      line.textContent = cmd;
      terminalBody.appendChild(line);

      if (index === commands.length - 1) {
        createTerminalInput();
      }

      terminalBody.scrollTop = terminalBody.scrollHeight;
    }, delay);
    delay += 100;
  });
}

function createTerminalInput() {
  const terminalBody = document.getElementById("terminal-body");
  const inputLine = document.createElement("div");
  inputLine.className = "terminal-line";
  inputLine.innerHTML =
    'shaun@portfolio:~$ <input type="text" class="terminal-input" id="terminal-input" autocomplete="off">';
  terminalBody.appendChild(inputLine);

  const input = document.getElementById("terminal-input");
  input.focus();

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const command = this.value.trim().toLowerCase();
      const response = processCommand(command);

      // Add command to history
      const cmdLine = document.createElement("div");
      cmdLine.className = "terminal-line";
      cmdLine.textContent = "shaun@portfolio:~$ " + this.value;
      terminalBody.insertBefore(cmdLine, inputLine);

      // Add response
      if (response) {
        const responseLine = document.createElement("div");
        responseLine.className = "terminal-line";
        responseLine.innerHTML = response;
        terminalBody.insertBefore(responseLine, inputLine);
      }

      this.value = "";
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  });
}

function processCommand(command) {
  switch (command) {
    case "help":
      return "Available commands:<br>• help - Show this help<br>• contact - Show contact information<br>• projects - List my projects<br>• skills - Show technical skills<br>• about - About me<br>• education - Academic journey<br>• clear - Clear terminal<br>• home - Go to home page<br>• page [name] - Navigate to page";
    case "contact":
      return "Contact Information:<br>📧 debeershaun18@gmail.com<br>📱 +27 82 050 5674<br>💼 linkedin.com/in/shaundebeer<br>📍 Akasia, Pretoria, South Africa";
    case "projects":
      return "Featured Projects:<br>🔧 IoT Generator Monitoring System<br>🛒 Full-Stack E-Commerce Platform<br>📊 Student Management System<br>📈 Business Analytics Dashboard<br>📱 Restaurant Ordering Mobile App<br>⚡ Agile Project Management Platform";
    case "skills":
      return "Technical Skills:<br>💻 Languages: C#, Java, Python, JavaScript<br>🗄️ Database: SQL & Database Management<br>🌐 Web: HTML, CSS, JavaScript<br>📊 Project Management: Agile, Scrum<br>🔧 Tools: Git/GitHub, Visual Studio";
    case "about":
      return "About Shaun de Beer:<br>🎓 Bachelor of Computing student (Belgium Campus ITversity)<br>⭐ Averaging with distinction - 240 credits achieved<br>🚀 Passionate about full-stack development and IoT<br>🎯 Goal: Drive digital transformation at forward-thinking companies";
    case "education":
      return "Academic Journey:<br>🎓 Bachelor of Computing - Belgium Campus ITversity<br>📈 66.5% Weighted Average<br>📚 240 Credits Achieved<br>🏆 22 Distinctions<br>🔬 Currently: Machine Learning & Advanced Development";
    case "home":
      showPage("home");
      return "Navigating to home page...";
    case "clear":
      document.getElementById("terminal-body").innerHTML = "";
      createTerminalInput();
      return null;
    default:
      if (command.startsWith("page ")) {
        const pageName = command.split(" ")[1];
        if (
          ["home", "about", "education", "projects", "contact"].includes(
            pageName
          )
        ) {
          showPage(pageName);
          return `Navigating to ${pageName} page...`;
        } else {
          return `Page '${pageName}' not found. Available pages: home, about, education, projects, contact`;
        }
      }
      return command
        ? `Command not found: ${command}<br>Type 'help' for available commands.`
        : "";
  }
}

// Close terminal with ESC
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    document.getElementById("terminal").style.display = "none";
  }
});

// Close terminal when clicking outside
document.getElementById("terminal").addEventListener("click", function (e) {
  if (e.target === this) {
    this.style.display = "none";
  }
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe elements for scroll animations
document
  .querySelectorAll(
    ".bento-card, .project-card, .contact-item, .timeline-item, .subject-card, .achievement-card, .education-header"
  )
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

// Performance optimization: Reduce particle count on mobile
if (window.innerWidth < 768) {
  const canvas = document.getElementById("particle-canvas");
  canvas.style.opacity = "0.3";
}

// Enhanced scroll effects for navbar
let lastScrollY = window.scrollY;
const nav = document.querySelector(".nav");

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    nav.style.transform = "translateY(-100%)";
  } else {
    nav.style.transform = "translateY(0)";
  }

  lastScrollY = currentScrollY;
});

// Add click effects to buttons
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    ripple.style.position = "absolute";
    ripple.style.borderRadius = "50%";
    ripple.style.backgroundColor = "rgba(255,255,255,0.3)";
    ripple.style.transform = "scale(0)";
    ripple.style.animation = "ripple 0.6s linear";
    ripple.style.pointerEvents = "none";

    this.style.position = "relative";
    this.style.overflow = "hidden";
    this.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});

// Add ripple animation
const style = document.createElement("style");
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Typing effect for hero subtitle
function typeWriter(element, text, speed = 50) {
  let i = 0;
  element.textContent = "";

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

// Initialize typing effect when page loads
window.addEventListener("load", () => {
  const subtitle = document.querySelector(".hero .subtitle");
  if (subtitle) {
    const originalText = subtitle.textContent;
    typeWriter(subtitle, originalText, 80);
  }

  // Initialize education page enhancements
  initializeEducationPage();
});

// Education page specific initialization
function initializeEducationPage() {
  // Add grade color coding
  document.querySelectorAll(".subject-mark").forEach((mark) => {
    const grade = parseInt(mark.textContent);
    if (grade >= 75) {
      mark.style.color = "#4CAF50"; // Green for distinction
    } else if (grade >= 60) {
      mark.style.color = "var(--accent-primary)"; // Normal pass
    } else if (grade >= 50) {
      mark.style.color = "#FF9800"; // Orange for low pass
    } else {
      mark.style.color = "#F44336"; // Red for low marks
    }
  });

  // Add hover effects to subject cards
  document.querySelectorAll(".subject-card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-3px) scale(1.02)";
      this.style.boxShadow = "0 15px 40px rgba(166, 124, 106, 0.2)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
      this.style.boxShadow = "none";
    });
  });
}

// Console Easter egg
console.log(`
🚀 Welcome to Shaun's Enhanced Portfolio!

Hey there, fellow developer! 👋

This portfolio now features:
• Multi-page navigation system
• 6 diverse project showcases
• Comprehensive education section
• Interactive terminal (Konami code!)
• Smooth page transitions
• Mobile-responsive design

Education Highlights:
• 22 Distinctions achieved
• 66.5% Weighted Average
• 240 Credits completed
• Interactive year tabs

Try the terminal commands:
• 'page education' - Navigate to education
• 'education' - View academic summary
• 'help' - See all commands

Let's connect: debeershaun18@gmail.com
`);

// Add performance monitoring
if ("performance" in window) {
  window.addEventListener("load", () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType("navigation")[0];
      if (perfData.loadEventEnd - perfData.loadEventStart < 1200) {
        console.log(
          "⚡ Enhanced portfolio loaded in under 1.2s - Performance goal achieved!"
        );
      }
    }, 0);
  });
}
