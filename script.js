/* ==========================================================================
   1. THEME SWITCHER SYSTEM
   ========================================================================== */
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const rootElement = document.documentElement;

const safeStorage = {
  get: (k) => { try { return localStorage.getItem(k); } catch(e) { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch(e) {} }
};

function setTheme(theme) {
  rootElement.setAttribute('data-theme', theme);
  safeStorage.set('portfolio-theme', theme);
  if (theme === 'light') {
    themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
  } else {
    themeIcon.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
  }
}

const savedTheme = safeStorage.get('portfolio-theme') || 'dark';
setTheme(savedTheme);

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = rootElement.getAttribute('data-theme');
  setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

/* ==========================================================================
   2. MOBILE MENU DRAWER
   ========================================================================== */
const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
const mobileDrawer = document.getElementById('mobile-drawer');

mobileMenuBtn.addEventListener('click', () => {
  mobileDrawer.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileDrawer.classList.remove('open');
  });
});

/* ==========================================================================
   3. TYPEWRITER SUBTITLE EFFECT
   ========================================================================== */
const typewriterPhrases = [
  "Junior Programmer & Software Developer",
  "Backend Development & Node.js Specialist",
  "Python & TypeScript Problem Solver",
  "Computer Programmer Diploma | Lambton College"
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterEl = document.getElementById('typewriter-text');

function typeLoop() {
  const currentPhrase = typewriterPhrases[phraseIndex];
  if (isDeleting) {
    typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  let typingSpeed = isDeleting ? 30 : 60;

  if (!isDeleting && charIndex === currentPhrase.length) {
    typingSpeed = 1800; // Pause at end of phrase
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % typewriterPhrases.length;
    typingSpeed = 400; // Pause before typing next
  }

  setTimeout(typeLoop, typingSpeed);
}
typeLoop();

/* ==========================================================================
   4. HERO INTERACTIVE CANVAS CONSTELLATION
   ========================================================================== */
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];
const particleCount = 45;

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = canvas.parentElement.offsetHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = (Math.random() - 0.5) * 0.8;
    this.radius = Math.random() * 2 + 1.2;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = rootElement.getAttribute('data-theme') === 'dark' ? 'rgba(99, 102, 241, 0.6)' : 'rgba(99, 102, 241, 0.35)';
    ctx.fill();
  }
}

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

function animateCanvas() {
  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();

    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 130) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        const alpha = (1 - dist / 130) * 0.25;
        ctx.strokeStyle = rootElement.getAttribute('data-theme') === 'dark' ? `rgba(6, 182, 212, ${alpha})` : `rgba(99, 102, 241, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateCanvas);
}
animateCanvas();

/* ==========================================================================
   5. SKILLS MATRIX FILTERING & SEARCH
   ========================================================================== */
const skillTabBtns = document.querySelectorAll('.skill-tab-btn');
const skillCards = document.querySelectorAll('.skill-card');
const skillSearchInput = document.getElementById('skill-search');

function filterSkills() {
  const activeTab = document.querySelector('.skill-tab-btn.active').dataset.category;
  const query = skillSearchInput.value.toLowerCase().trim();

  skillCards.forEach(card => {
    const category = card.dataset.category;
    const nameText = card.dataset.name;
    const matchesCategory = activeTab === 'all' || category === activeTab;
    const matchesQuery = query === '' || nameText.includes(query) || card.textContent.toLowerCase().includes(query);

    if (matchesCategory && matchesQuery) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

skillTabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    skillTabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterSkills();
  });
});

skillSearchInput.addEventListener('input', filterSkills);

/* ==========================================================================
   6. PROJECTS FILTERING
   ========================================================================== */
const projectFilterBtns = document.querySelectorAll('.project-filter-btn');
const projectCards = document.querySelectorAll('.project-card');

projectFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    projectFilterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      if (filter === 'all' || card.dataset.projectType === filter) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

/* ==========================================================================
   7. CASE STUDY MODAL DEEP DIVES (JULIAN CASILIMAS BELTRAN)
   ========================================================================== */
const projectData = {
  smartagri: {
    category: "Academic Platform & NPM Package",
    title: "Smart Agriculture Automation Platform",
    metrics: [
      { val: "NPM Package", label: "Published on Registry" },
      { val: "TypeScript", label: "Strict Typing & Node.js" },
      { val: "Automated", label: "Disease & Irrigation Logic" }
    ],
    overview: "An academic smart agriculture automation platform engineered in TypeScript and Node.js. It models environmental sensor data, automates irrigation timing, coordinates multi-point drone surveying, and features algorithmic plant disease detection.",
    highlights: [
      "Engineered backend business logic for automated irrigation scheduling based on soil and moisture thresholds.",
      "Constructed drone coordination route dispatch algorithms and telemetry tracking.",
      "Implemented automated plant disease-detection functions and structured data transformations.",
      "Packaged the entire library as a clean, reusable NPM module (@julianlambton/smart-agriculture)."
    ],
    arch: "Sensor Inputs / Drones <--> TypeScript Business Logic <--> Data Validation Layer <--> Automated Irrigation Actuators <--> NPM Package API.",
    codeFilename: "agriculture_engine.ts",
    codeSnippet: `<pre><code><span class="syn-keyword">export interface</span> <span class="syn-type">FieldSensorReading</span> {
  zoneId: <span class="syn-type">string</span>;
  soilMoisturePct: <span class="syn-type">number</span>;
  ambientTempC: <span class="syn-type">number</span>;
  leafAnomalyDetected: <span class="syn-type">boolean</span>;
}

<span class="syn-keyword">export class</span> <span class="syn-type">IrrigationDispatcher</span> {
  <span class="syn-keyword">public</span> <span class="syn-func">evaluateZone</span>(reading: <span class="syn-type">FieldSensorReading</span>): <span class="syn-type">ActionPlan</span> {
    <span class="syn-keyword">if</span> (reading.soilMoisturePct &lt; 35.0) {
      <span class="syn-keyword">return</span> { triggerIrrigation: <span class="syn-keyword">true</span>, durationSec: 600, alert: <span class="syn-string">"Optimal watering sequence"</span> };
    }
    <span class="syn-keyword">return</span> { triggerIrrigation: <span class="syn-keyword">false</span>, durationSec: 0, alert: <span class="syn-string">"Moisture adequate"</span> };
  }
}</code></pre>`
  },
  py100days: {
    category: "Self-Directed Engineering & Algorithms",
    title: "Python Backend Logic & 100 Days of Code",
    metrics: [
      { val: "100 Days", label: "Intensive Practice" },
      { val: "OOP", label: "Object-Oriented Design" },
      { val: "Python 3", label: "Data Structures & APIs" }
    ],
    overview: "A continuous, hands-on self-directed initiative focused on developing practical programming logic, algorithmic problem-solving, modular backend architectures, and API integrations in Python.",
    highlights: [
      "Built dozens of functional programs applying Object-Oriented Programming (OOP) principles.",
      "Executed unit testing and systematic debugging to refine solution efficiency and eliminate edge-case bugs.",
      "Processed structured data files (JSON, CSV, SQL database tables) using Python data structures.",
      "Applied recursive problem-solving, data parsing, and clean documentation best practices."
    ],
    arch: "User CLI / Test Harness <--> Modular Python Controllers <--> Algorithmic Logic <--> Data Storage & Validation.",
    codeFilename: "data_processor.py",
    codeSnippet: `<pre><code><span class="syn-keyword">class</span> <span class="syn-type">DataProcessor</span>:
    <span class="syn-keyword">def</span> <span class="syn-func">__init__</span>(self, records: <span class="syn-type">list</span>):
        self.records = records

    <span class="syn-keyword">def</span> <span class="syn-func">filter_valid_transactions</span>(self) -&gt; <span class="syn-type">list</span>:
        <span class="syn-keyword">return</span> [
            item <span class="syn-keyword">for</span> item <span class="syn-keyword">in</span> self.records 
            <span class="syn-keyword">if</span> item.get(<span class="syn-string">"status"</span>) == <span class="syn-string">"confirmed"</span> <span class="syn-keyword">and</span> item.get(<span class="syn-string">"amount"</span>, 0) &gt; 0
        ]</code></pre>`
  },
  techsupport: {
    category: "Enterprise Systems & Technical Support",
    title: "Bilingual Technical & Client Support (Best Buy / FedEx)",
    metrics: [
      { val: "60+", label: "Inquiries Solved Daily" },
      { val: "Bilingual", label: "English & Spanish" },
      { val: "100%", label: "Resolution & SLA Focus" }
    ],
    overview: "Delivered bilingual customer and technical support for international enterprise campaigns (Best Buy USA and FedEx Ground USA) at Sitel S.A., diagnosing software, logistics, and user-facing issues under strict SLA standards.",
    highlights: [
      "Diagnosed and resolved ~60 technical and order inquiries per day through analytical troubleshooting.",
      "Translated complex technical requirements and error logs into clear, actionable explanations for end-users.",
      "Adapted quickly to rapid campaign changes, internal software portals, and high-pressure team workflows.",
      "Demonstrated exemplary attention to detail, active listening, and systematic ticket documentation."
    ],
    arch: "Customer Inbound Query <--> System Diagnostic & Telemetry <--> Troubleshooting Workflow <--> Issue Resolution & Documentation.",
    codeFilename: "support_workflow.md",
    codeSnippet: `<pre><code><span class="syn-comment"># Daily Technical Resolution Pipeline</span>
1. Root cause identification across enterprise order portals.
2. Structured troubleshooting across multi-tier delivery databases.
3. Bilingual client communication (English / Spanish) with clear guidance.
4. Comprehensive ticket logging, SLA tracking, and resolution closure.</code></pre>`
  }
};

const modal = document.getElementById('case-study-modal');
const modalCategory = document.getElementById('modal-category');
const modalTitle = document.getElementById('modal-title');
const modalMetrics = document.getElementById('modal-metrics');
const modalOverviewText = document.getElementById('modal-overview-text');
const modalHighlightsList = document.getElementById('modal-highlights-list');
const modalArchText = document.getElementById('modal-arch-text');
const modalArchDiagram = document.getElementById('modal-arch-diagram');
const modalCodeFilename = document.getElementById('modal-code-filename');
const modalCodeBody = document.getElementById('modal-code-body');

function openCaseStudy(projectId) {
  const data = projectData[projectId];
  if (!data) return;

  modalCategory.textContent = data.category;
  modalTitle.textContent = data.title;
  modalOverviewText.textContent = data.overview;
  modalArchText.textContent = "Architectural flow and core subsystem decomposition:";
  modalArchDiagram.innerHTML = `<span style="color:#06b6d4;">[DATA FLOW ARCHITECTURE]</span><br><br>${data.arch}`;
  modalCodeFilename.textContent = data.codeFilename;
  modalCodeBody.innerHTML = data.codeSnippet;

  modalMetrics.innerHTML = data.metrics.map(m => `
    <div class="modal-metric-card">
      <div class="modal-metric-value">${m.val}</div>
      <div class="modal-metric-label">${m.label}</div>
    </div>
  `).join('');

  modalHighlightsList.innerHTML = data.highlights.map(h => `<li>${h}</li>`).join('');

  switchModalTab('overview');

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function closeModalOnBackdrop(e) {
  if (e.target === modal) {
    closeModal();
  }
}

function switchModalTab(tabId) {
  document.querySelectorAll('.modal-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.modal-tab-content').forEach(content => content.classList.remove('active'));

  const targetTab = document.getElementById(`tab-${tabId}`);
  if (targetTab) targetTab.classList.add('active');

  const activeBtn = Array.from(document.querySelectorAll('.modal-tab-btn')).find(b => b.textContent.toLowerCase().includes(tabId));
  if (activeBtn) activeBtn.classList.add('active');
}

/* ==========================================================================
   8. INTERACTIVE DEV MODE TERMINAL ENGINE (JULIAN CASILIMAS BELTRAN)
   ========================================================================== */
const terminalScreen = document.getElementById('terminal-screen');
const termInput = document.getElementById('term-input');

const termCommands = {
  help: () => `
<span style="color:#06b6d4; font-weight:700;">AVAILABLE COMMANDS:</span>
  <span style="color:#818cf8;">about</span>        - Summary of background, education & goals
  <span style="color:#818cf8;">skills</span>       - List core technical stack & competencies
  <span style="color:#818cf8;">projects</span>     - Display featured software projects & NPM packages
  <span style="color:#818cf8;">education</span>    - View diploma & college details
  <span style="color:#818cf8;">experience</span>   - View work & technical support history
  <span style="color:#818cf8;">contact</span>      - Show phone, email, and location
  <span style="color:#818cf8;">cat bio.txt</span>  - Read personal engineering statement
  <span style="color:#818cf8;">whoami</span>       - Inspect visitor session
  <span style="color:#818cf8;">sudo hire</span>    - Connect with Julian for interview scheduling
  <span style="color:#818cf8;">theme</span> [dark|light] - Switch site theme dynamically
  <span style="color:#818cf8;">clear</span>        - Clear terminal history
`,
  about: () => `
Julian Casilimas Beltran &bull; Junior Programmer & Software Developer based in Toronto, ON.
Graduate of Lambton College's Computer Programmer Diploma (2023 - 2025).
Strong foundation in backend programming, Python, TypeScript, Node.js, Java, and SQL databases.
`,
  skills: () => `
<span style="color:#10b981;">Languages:</span>   Python, Java, JavaScript, TypeScript, HTML5, CSS3
<span style="color:#06b6d4;">Backend:</span>     Node.js, Backend Logic, REST / Basic APIs, OOP
<span style="color:#f59e0b;">Databases:</span>   SQL, Relational Concepts, Data Processing
<span style="color:#818cf8;">Practices:</span>   Git, GitHub, NPM, Debugging, Testing, Documentation
`,
  projects: () => `
1. <span style="color:#6366f1; font-weight:700;">Smart Agriculture Platform</span> - Academic project published on NPM (@julianlambton/smart-agriculture) [TypeScript, Node.js]
2. <span style="color:#6366f1; font-weight:700;">100 Days of Code</span>         - Daily Python programming modules, algorithms & data processing
3. <span style="color:#6366f1; font-weight:700;">Technical Support Systems</span> - Resolved ~60 inquiries/day for Best Buy & FedEx campaigns
`,
  education: () => `
Lambton College &bull; Toronto, ON, Canada
Computer Programmer Diploma (May 2023 &ndash; August 2025)
Core Focus: Software Development, Object-Oriented Programming, Database Systems & Web Technologies.
`,
  experience: () => `
&bull; May 2024 - Present: Facility Maintenance (Part-Time) | Toronto, ON
&bull; May 2026 - Present: 100 Days of Code (Self-Directed Python & Backend Logic)
&bull; Sep 2022 - May 2023: Bilingual Customer & Technical Support @ Sitel S.A. (Best Buy / FedEx)
`,
  contact: () => `
Name:      Julian Casilimas Beltran
Location:  Toronto, ON, Canada
Phone:     437-445-6610
Email:     julianbeca1230@gmail.com
GitHub:    Available upon request / in navigation
Status:    Actively interviewing for Junior Developer & Backend roles!
`,
  "cat bio.txt": () => `
"Analytical problem solver committed to continuous learning and building practical software development skills. I love breaking down complex business logic into clean, testable code, whether building TypeScript backend modules or exploring algorithms in Python."
`,
  whoami: () => `
visitor@toronto-recruiter-console (Status: Reviewing Julian's Portfolio)
`,
  "sudo hire": () => `
<span style="color:#10b981; font-weight:700;">[EXCELLENT CHOICE!]</span> Preparing direct contact with Julian:
1. Phone: 437-445-6610
2. Email: julianbeca1230@gmail.com
3. Status: Ready to add value to your engineering team immediately!
`
};

function handleTerminalSubmit(e) {
  e.preventDefault();
  const rawCmd = termInput.value.trim();
  if (!rawCmd) return;

  termInput.value = '';
  executeCommand(rawCmd);
}

function executeQuickCmd(cmd) {
  executeCommand(cmd);
  termInput.focus();
}

function executeCommand(cmd) {
  const lower = cmd.toLowerCase().trim();

  const promptLine = document.createElement('div');
  promptLine.className = 'term-line';
  promptLine.innerHTML = `<span class="term-prompt">julian@portfolio:~$</span> <span class="term-cmd">${escapeHtml(cmd)}</span>`;
  terminalScreen.appendChild(promptLine);

  if (lower === 'clear') {
    terminalScreen.innerHTML = '';
    return;
  }

  const outLine = document.createElement('div');
  outLine.className = 'term-line term-out';

  if (lower.startsWith('theme')) {
    const parts = lower.split(' ');
    if (parts[1] === 'light' || parts[1] === 'dark') {
      setTheme(parts[1]);
      outLine.innerHTML = `<span style="color:#10b981;">Theme switched to ${parts[1]} mode.</span>`;
    } else {
      outLine.innerHTML = `Usage: theme [dark|light]`;
    }
  } else if (termCommands[lower]) {
    outLine.innerHTML = termCommands[lower]();
  } else {
    outLine.innerHTML = `<span style="color:#ef4444;">command not found: ${escapeHtml(cmd)}</span>. Type '<span style="color:#06b6d4;">help</span>' to see available commands.`;
  }

  terminalScreen.appendChild(outLine);
  terminalScreen.scrollTop = terminalScreen.scrollHeight;
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ==========================================================================
   9. CONTACT FORM VALIDATION & TOAST ALERT
   ========================================================================== */
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

function showToast(msg) {
  toastMessage.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

function handleContactSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('form-name').value.trim();
  const email = document.getElementById('form-email').value.trim();
  const subject = document.getElementById('form-subject').value;
  const message = document.getElementById('form-message').value.trim();

  if (!name || !email || !message) {
    showToast("Please complete all required fields.");
    return;
  }

  showToast(`Thank you ${name}! Connecting you with Julian Casilimas Beltran...`);
  
  const mailtoUrl = `mailto:julianbeca1230@gmail.com?subject=${encodeURIComponent(subject + " from " + name)}&body=${encodeURIComponent(message + "\n\nFrom: " + name + " (" + email + ")")}`;
  setTimeout(() => {
    window.location.href = mailtoUrl;
  }, 1000);

  document.getElementById('contact-form').reset();
}

function triggerResumeDownload() {
  showToast("Julian_Casilimas_Beltran_Resume.pdf prepared for download!");
}
