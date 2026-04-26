const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navDropdown = document.querySelector(".nav-dropdown");
const dropdownToggle = document.querySelector(".dropdown-toggle");
const contactForm = document.querySelector("#contactForm");
const formMessage = document.querySelector("#formMessage");
const loginForm = document.querySelector("#loginForm");
const loginMessage = document.querySelector("#loginMessage");
const joinButton = document.querySelector("#joinButton");
const joinMessage = document.querySelector("#joinMessage");
const documentsSection = document.querySelector("#documents");
const documentBoard = document.querySelector("#documentBoard");
const logoutButton = document.querySelector("#logoutButton");
const backToTop = document.querySelector(".back-to-top");

const allowedUsers = {
  // Add more allowed login emails here.
  // Format: "student@bmsit.in": "12345678",
  "25ug1byai034@bmsit.in": "12345678",
};

const eventDocuments = [
  // Add more events/documents here. Put PDF files in this same folder and link them below.
  {
    eventName: "AI Sprint Workshop",
    eventDate: "2026-05-18",
    documents: [
      { title: "Workshop Overview", file: "ai-sprint-workshop.pdf" },
      { title: "Schedule", file: "ai-sprint-schedule.pdf" },
      { title: "Resource Pack", file: "ai-sprint-resources.pdf" },
    ],
  },
];

const renderDocuments = () => {
  if (!documentBoard) return;

  documentBoard.innerHTML = eventDocuments.map((event) => `
    <article class="document-card">
      <time>${new Date(event.eventDate).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}</time>
      <h3>${event.eventName}</h3>
      <div class="pdf-list">
        ${event.documents.map((document) => `
          <a class="pdf-link" href="${document.file}" target="_blank" rel="noopener">${document.title}</a>
        `).join("")}
      </div>
    </article>
  `).join("");
};

const setLoggedInState = (loginId) => {
  if (!documentsSection) return;

  documentsSection.classList.toggle("locked", !loginId);
  if (loginMessage && loginId) {
    loginMessage.textContent = `Logged in as ${loginId}.`;
  }
  if (loginId) renderDocuments();
};

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    navDropdown?.classList.remove("open");
    dropdownToggle?.setAttribute("aria-expanded", "false");
  });
});

if (dropdownToggle && navDropdown) {
  dropdownToggle.addEventListener("click", () => {
    const isOpen = navDropdown.classList.toggle("open");
    dropdownToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(contactForm).entries());
    const savedMessages = JSON.parse(localStorage.getItem("epochMessages") || "[]");
    savedMessages.push({ ...data, submittedAt: new Date().toISOString() });
    localStorage.setItem("epochMessages", JSON.stringify(savedMessages));
    contactForm.reset();
    formMessage.textContent = "Thank you. Your message has been submitted.";
  });
}

if (joinButton && joinMessage) {
  joinButton.addEventListener("click", () => {
    joinMessage.textContent = "Requirements closed. Requirements will open soon.";
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(loginForm).entries());
    const loginId = data.loginId.trim().toLowerCase();
    const password = data.password;
    const savedPasswords = JSON.parse(localStorage.getItem("epochPasswords") || "{}");
    const validPassword = savedPasswords[loginId] || allowedUsers[loginId];

    if (!allowedUsers[loginId] || password !== validPassword) {
      loginMessage.textContent = "Access denied. Use an approved email and password.";
      return;
    }

    localStorage.setItem("epochLogin", loginId);
    loginForm.reset();
    setLoggedInState(loginId);
    if (documentsSection) {
      documentsSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "login.html#documents";
    }
  });
}

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("epochLogin");
    setLoggedInState(null);
    if (loginMessage) loginMessage.textContent = "Logged out.";
  });
}

if (backToTop) {
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("show", window.scrollY > 500);
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

setLoggedInState(localStorage.getItem("epochLogin"));
