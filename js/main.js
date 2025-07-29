// Page Management - Define FIRST to ensure it's available for onclick handlers
function showPage(pageId) {
  console.log("Attempting to show page:", pageId); // Debug log

  // Hide all pages
  const allPages = document.querySelectorAll("[id$='-page']");
  allPages.forEach((page) => {
    page.classList.remove("active");
    page.classList.add("hidden");
    page.style.display = "none"; // Force hide
  });

  // Remove active class from all nav links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
  });

  // Show selected page
  const targetPage = document.getElementById(pageId + "-page");
  if (targetPage) {
    targetPage.classList.add("active");
    targetPage.classList.remove("hidden");
    targetPage.style.display = "block"; // Force show
    console.log("Successfully showed page:", pageId); // Debug log
  } else {
    console.error("Page not found:", pageId + "-page"); // Debug log
  }

  // Add active class to corresponding nav link
  const activeLink = document.querySelector(
    `[onclick*="showPage('${pageId}')"]`
  );
  if (activeLink) {
    activeLink.classList.add("active");
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Mobile Menu Functions
function toggleMobileMenu() {
  const navLinks = document.getElementById("nav-links");
  navLinks.classList.toggle("mobile-open");
}

function closeMobileMenu() {
  const navLinks = document.getElementById("nav-links");
  navLinks.classList.remove("mobile-open");
}

// Make functions globally available
window.showPage = showPage;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;

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

// Make functions globally available
window.showYear = showYear;

// Hobby Category Switching Function
function showHobbyCategory(category) {
  // Hide all hobby categories
  document.querySelectorAll(".hobby-category").forEach((content) => {
    content.classList.remove("active");
  });

  // Remove active class from all category tabs
  document.querySelectorAll(".category-tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  // Show selected category content
  const categoryContent = document.getElementById(`${category}-category`);
  if (categoryContent) {
    categoryContent.classList.add("active");
  }

  // Add active class to clicked tab
  event.target.classList.add("active");
}

// Make functions globally available
window.showHobbyCategory = showHobbyCategory;

// Fun Facts Card Rotation Function
function rotateFact(card) {
  card.classList.toggle("flipped");
}

// Make functions globally available
window.rotateFact = rotateFact;

// Theme Toggle Function
function toggleTheme() {
  const body = document.body;
  const button = document.querySelector(".theme-toggle");

  if (body.getAttribute("data-theme") === "light") {
    body.removeAttribute("data-theme");
    button.textContent = "🌙 Dark";
    localStorage.setItem("theme", "dark");
  } else {
    body.setAttribute("data-theme", "light");
    button.textContent = "☀ Light";
    localStorage.setItem("theme", "light");
  }
}

// Make functions globally available
window.toggleTheme = toggleTheme;

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
    // Reduce particle count on mobile for performance
    const particleCount =
      window.innerWidth < 768
        ? 30
        : Math.min(100, Math.floor(window.innerWidth / 10));

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
      // Mouse interaction (disabled on mobile for performance)
      if (window.innerWidth >= 768) {
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          particle.vx += dx * 0.00005;
          particle.vy += dy * 0.00005;
        }
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

    // Draw connections (simplified on mobile)
    const maxConnections = window.innerWidth < 768 ? 50 : 100;
    let connectionCount = 0;

    this.particles.forEach((particle, i) => {
      if (connectionCount >= maxConnections) return;

      for (
        let j = i + 1;
        j < this.particles.length && connectionCount < maxConnections;
        j++
      ) {
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
          connectionCount++;
        }
      }
    });

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize particle system
const canvas = document.getElementById("particle-canvas");
if (canvas) {
  new ParticleSystem(canvas);
}

// Load saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.body.setAttribute("data-theme", "light");
  const button = document.querySelector(".theme-toggle");
  if (button) button.textContent = "☀ Light";
} else if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: light)").matches
) {
  document.body.setAttribute("data-theme", "light");
  const button = document.querySelector(".theme-toggle");
  if (button) button.textContent = "☀ Light";
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

  if (!terminal || !terminalBody) return;

  terminal.style.display = "block";

  const commands = [
    "System initialization complete...",
    "Loading developer profile...",
    "> Skills: [C#, Java, Python, JavaScript, IoT, Machine Learning]",
    "> Status: Available for hire",
    "> Location: Pretoria, South Africa",
    "> Specialization: Full-Stack Development & IoT Solutions",
    "> Hobbies: Wall Art, Nature Photography, Gaming, Continuous Learning",
    "",
    "Fun fact: This terminal was activated by the Konami Code!",
    "Available commands: help, contact, projects, skills, about, education, hobbies",
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
  if (!terminalBody) return;

  const inputLine = document.createElement("div");
  inputLine.className = "terminal-line";
  inputLine.innerHTML =
    'shaun@portfolio:~$ <input type="text" class="terminal-input" id="terminal-input" autocomplete="off">';
  terminalBody.appendChild(inputLine);

  const input = document.getElementById("terminal-input");
  if (input) {
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
}

function processCommand(command) {
  switch (command) {
    case "help":
      return "Available commands:<br>• help - Show this help<br>• contact - Show contact information<br>• projects - List my projects<br>• skills - Show technical skills<br>• about - About me<br>• education - Academic journey<br>• hobbies - Personal interests & hobbies<br>• clear - Clear terminal<br>• home - Go to home page<br>• page [name] - Navigate to page";
    case "contact":
      return "Contact Information:<br>📧 debeershaun18@gmail.com<br>📱 +27 82 050 5674<br>💼 linkedin.com/in/shaundebeer<br>📍 Akasia, Pretoria, South Africa";
    case "projects":
      return "Featured Projects:<br>🔧 IoT Generator Monitoring System<br>⚡ MQ-2 Gas Sensor Alert Circuit<br>📊 C# Student Wellness Management System<br>🌐 Web-Based Login & Registration System<br>🎨 Wall Art & Custom Design Projects";
    case "skills":
      return "Technical Skills:<br>💻 Languages: C#, Java, Python, JavaScript<br>🗄️ Database: SQL & Database Management<br>🌐 Web: HTML, CSS, JavaScript, JSP/Servlets<br>📊 Project Management: Agile, Scrum<br>🔧 Tools: Git/GitHub, Visual Studio<br>🤖 IoT: MQTT, Sensor Integration, Arduino";
    case "about":
      return "About Shaun de Beer:<br>🎓 Bachelor of Computing student (Belgium Campus ITversity)<br>⭐ 72% Weighted Average - 268 credits achieved<br>🏆 24 Distinctions earned<br>🚀 Passionate about full-stack development and IoT<br>🎯 Goal: Drive digital transformation at forward-thinking companies";
    case "education":
      return "Academic Journey:<br>🎓 Bachelor of Computing - Belgium Campus ITversity<br>📈 72% Weighted Average<br>📚 268 Credits Achieved<br>🏆 24 Distinctions<br>🔬 Currently: Machine Learning & Advanced Development";
    case "hobbies":
      return "Hobbies & Interests:<br>🎨 Wall Art & Custom Designs (4+ years experience)<br>📸 Nature Photography & Cycling (50+ trails explored)<br>🎮 Gaming & Hardware Building (3 PC builds)<br>📚 Continuous Learning & Philosophy<br>🌟 Philosophy: Growth through challenge, passion drives excellence";
    case "home":
      showPage("home");
      return "Navigating to home page...";
    case "clear":
      const terminalBody = document.getElementById("terminal-body");
      if (terminalBody) {
        terminalBody.innerHTML = "";
        createTerminalInput();
      }
      return null;
    default:
      if (command.startsWith("page ")) {
        const pageName = command.split(" ")[1];
        if (
          [
            "home",
            "about",
            "education",
            "hobbies",
            "projects",
            "contact",
          ].includes(pageName)
        ) {
          showPage(pageName);
          return `Navigating to ${pageName} page...`;
        } else {
          return `Page '${pageName}' not found. Available pages: home, about, education, hobbies, projects, contact`;
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
    const terminal = document.getElementById("terminal");
    if (terminal) {
      terminal.style.display = "none";
    }
  }
});

// Close terminal when clicking outside
const terminal = document.getElementById("terminal");
if (terminal) {
  terminal.addEventListener("click", function (e) {
    if (e.target === this) {
      this.style.display = "none";
    }
  });
}

// Close mobile menu when clicking outside
document.addEventListener("click", function (e) {
  const navLinks = document.getElementById("nav-links");
  const menuToggle = document.querySelector(".mobile-menu-toggle");

  if (
    navLinks &&
    menuToggle &&
    !navLinks.contains(e.target) &&
    !menuToggle.contains(e.target) &&
    navLinks.classList.contains("mobile-open")
  ) {
    navLinks.classList.remove("mobile-open");
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

// Enhanced scroll effects for navbar
let lastScrollY = window.scrollY;
const nav = document.querySelector(".nav");

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;

  if (nav) {
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      nav.style.transform = "translateY(-100%)";
    } else {
      nav.style.transform = "translateY(0)";
    }
  }

  lastScrollY = currentScrollY;
});

// Add click effects to buttons
function addButtonEffects() {
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
}

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
  if (!element) return;

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

// Initialize when page loads - Simplified
window.addEventListener("load", () => {
  console.log("Page loaded, initializing..."); // Debug log

  // List all pages found
  const pages = document.querySelectorAll("[id$='-page']");
  console.log(
    "Found pages:",
    Array.from(pages).map((p) => p.id)
  );

  // Ensure home page is visible by default
  showPage("home");

  // Initialize other features
  const subtitle = document.querySelector(".hero .subtitle");
  if (subtitle) {
    const originalText = subtitle.textContent;
    typeWriter(subtitle, originalText, 80);
  }

  initializeEducationPage();
  initializeHobbiesPage();

  // Add button effects
  addButtonEffects();

  // Observe elements for scroll animations
  document
    .querySelectorAll(
      ".bento-card, .project-card, .contact-item, .timeline-item, .subject-card, .achievement-card, .education-header, .hobby-card, .philosophy-card, .goal-item, .main-hobby-card"
    )
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(el);
    });
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

// Hobbies page specific initialization
function initializeHobbiesPage() {
  // Add staggered animation to hobby cards
  document.querySelectorAll(".hobby-card").forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });

  // Initialize progress bars animation
  const progressBars = document.querySelectorAll(".progress-fill");
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const width = progressBar.style.width;
        progressBar.style.width = "0%";
        setTimeout(() => {
          progressBar.style.width = width;
        }, 200);
      }
    });
  });

  progressBars.forEach((bar) => {
    progressObserver.observe(bar);
  });

  // Add floating animation to visual elements
  document.querySelectorAll(".paint-blob, .sun, .clouds").forEach((element) => {
    element.style.animationDelay = `${Math.random() * 2}s`;
  });

  // Auto-flip fact cards periodically (optional) - disabled on mobile for performance
  if (window.innerWidth >= 768) {
    setInterval(() => {
      const factCards = document.querySelectorAll(".fact-card");
      const randomCard =
        factCards[Math.floor(Math.random() * factCards.length)];
      if (randomCard && Math.random() < 0.3) {
        randomCard.classList.add("flipped");
        setTimeout(() => {
          randomCard.classList.remove("flipped");
        }, 3000);
      }
    }, 8000);
  }
}

// Interactive hobby category switching with keyboard support
document.addEventListener("keydown", function (e) {
  // Only if hobbies page is active and not mobile
  const hobbiesPage = document.getElementById("hobbies-page");
  if (
    !hobbiesPage ||
    !hobbiesPage.classList.contains("active") ||
    window.innerWidth < 768
  )
    return;

  const categories = ["creative", "outdoor", "tech", "learning"];
  const currentActive = document.querySelector(".category-tab.active");
  const currentIndex = Array.from(
    document.querySelectorAll(".category-tab")
  ).indexOf(currentActive);

  if (e.key === "ArrowLeft" && currentIndex > 0) {
    showHobbyCategory(categories[currentIndex - 1]);
    document
      .querySelectorAll(".category-tab")
      [currentIndex - 1].classList.add("active");
  } else if (e.key === "ArrowRight" && currentIndex < categories.length - 1) {
    showHobbyCategory(categories[currentIndex + 1]);
    document
      .querySelectorAll(".category-tab")
      [currentIndex + 1].classList.add("active");
  }
});

// Performance optimization: Reduce effects on mobile
if (window.innerWidth < 768) {
  const canvas = document.getElementById("particle-canvas");
  if (canvas) {
    canvas.style.opacity = "0.3";
  }
}

// Handle window resize for responsive adjustments
window.addEventListener("resize", () => {
  // Close mobile menu on resize to desktop
  if (window.innerWidth >= 768) {
    const navLinks = document.getElementById("nav-links");
    if (navLinks) {
      navLinks.classList.remove("mobile-open");
    }
  }
});

// Console Easter egg
console.log(`
🚀 Welcome to Shaun's Mobile-Optimized Portfolio!

Hey there, fellow developer! 👋

This portfolio features:
• 📱 Mobile-first responsive design
• 🎯 Fixed page navigation system
• 🎨 Interactive hobbies section with 4 categories
• 📚 Comprehensive education breakdown
• 🚀 Performance optimizations for mobile
• 🎮 Interactive terminal (Konami code!)
• 🌙 Dark/Light theme toggle

Mobile Features:
• Hamburger navigation menu
• Touch-friendly interactions
• Optimized particle system
• Responsive grids and layouts

Navigation Fixed:
• Projects page now properly hidden on load
• Contact page now properly hidden on load
• All pages use consistent .page-container system

Try the terminal commands:
• 'page hobbies' - Navigate to hobbies
• 'hobbies' - View hobbies summary
• 'help' - See all commands

Let's connect: debeershaun18@gmail.com
`);

// Add performance monitoring
if ("performance" in window) {
  window.addEventListener("load", () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType("navigation")[0];
      if (perfData && perfData.loadEventEnd - perfData.loadEventStart < 2000) {
        console.log(
          "⚡ Mobile-optimized portfolio loaded in under 2s - Performance goal achieved!"
        );
      }
    }, 0);
  });
}
