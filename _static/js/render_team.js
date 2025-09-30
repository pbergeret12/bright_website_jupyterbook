// _static/render_team.js
// Rend dynamiquement toutes les sections (TEAM_DATA) + Alumni (si présent)

(function () {
  const STYLE = `  
  .section {
    margin-bottom: 2rem;
  }

  .section h2 {
    margin: 1.2rem 0 0.4rem;
  }

  .section-subtitle {
    margin: 0.2rem 0 1rem;
    color: var(--pst-color-text-muted);
    font-weight: normal;
    font-size: 0.95rem;
  }

  .cards {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  .card {
    width: 220px;
    min-height: 420px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 1px solid var(--pst-color-border);
    border-radius: 12px;
    padding: 1rem;
    background-color: var(--pst-color-surface);
    box-shadow: 2px 2px 6px rgba(0,0,0,0.08);
    text-align: center;
    font-size: 14px;
    color: var(--pst-color-text-base);
  }

  .card .profile-pic {
    width: 180px;
    height: 180px;
    object-fit: cover;
    border-radius: 10px;
    margin: 0 auto 0.5rem auto;
  }

  .card small {
    color: var(--pst-color-text-muted);
    font-size: 12px;
  }

  .card a {
    display: inline-block;
  }

  .logo-img {
    width: 30px !important;
    height: 30px !important;
    vertical-align: middle;
    margin-right: 4px;
    object-fit: contain;
    border-radius: 0;
  }

  .btn-bio {
    border: 1px solid var(--pst-color-border);
    background: var(--pst-color-surface);
    color: var(--pst-color-text-base);
    padding: 0.4rem 0.6rem;
    border-radius: 8px;
    cursor: pointer;
  }

  .btn-bio:hover {
    background: var(--pst-color-on-surface);
  }

  .modal {
    display: none;
    position: fixed;
    z-index: 999;
    padding: 2rem;
    background: rgba(0,0,0,0.5);
    inset: 0;
  }

  .modal-content {
    background: var(--pst-color-surface);
    color: var(--pst-color-text-base);
    padding: 1rem;
    border-radius: 8px;
    max-width: 600px;
    margin: 5% auto;
    border: 1px solid var(--pst-color-border);
  }

  .modal-content h3 {
    margin-top: 0;
  }

  .modal-close {
    float: right;
    font-weight: bold;
    cursor: pointer;
    background: none;
    border: none;
    font-size: 1rem;
  }

  .card .social-links {
    display: flex;
    gap: 8px;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
  }

  .card .social-links a {
    display: inline-flex;
    align-items: center;
    margin: 0;
    padding: 0;
    text-decoration: none;
  }

  .card .social-links img.icon-social {
    width: 24px;
    height: 24px;
    object-fit: contain;
    display: block;
  }
  `
  const imgBase = "_static/images/";
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const slug = (s) => String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

  function injectStyle() { 
    if (document.getElementById("team-style")) 
      return; const style = document.createElement("style"); 
    style.id = "team-style"; 
    style.textContent = STYLE; 
    document.head.appendChild(style); 
  }

  // --- social icons (filenames live under _static/images/) ---
  const socialIcons = {
    LinkedIn: "linkedin.png",   // use your LinkedIn SVG/PNG filename here
    GitHub: "github.svg",
    Scholar: "Google_Scholar_logo.png",
    // add more platform => filename pairs as needed
  };

  function renderLinks(links = {}, linksLayout = "inline") {
    const entries = Object.entries(links || {});
    if (entries.length === 0) return "";

    const anchors = entries.map(([platform, url]) => {
      if (!url) return "";
      const iconFile = socialIcons[platform];
      const iconHtml = iconFile
        ? `<img src="${imgBase}${esc(iconFile)}" alt="${esc(platform)}" class="logo-img">`
        : "🔗";
      return `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${iconHtml}</a>`;
    }).filter(Boolean);

    if (anchors.length === 0) return "";
    if (linksLayout === "list") return anchors.join("<br/>");

    // Wrap them in a flex container
    return `<div class="social-links">${anchors.join("")}</div>`;
  }

  function personCard(person, { modalId, linksLayout = "inline" } = {}) {
    const program = person.program ? `<small>${esc(person.program)}</small><br/>` : "";
    const university = person.university ? `<small>${esc(person.university)}</small><br/>` : "";
    const dates = person.dates ? `<small>${esc(person.dates)}</small><br/><br/>` : "";
    const imagePath = `${imgBase}${esc(person.image)}`;
    const linksHTML = renderLinks(person.links || {}, linksLayout);
    const bioBtn = person.bio ? `<button class="btn-bio" data-modal-open="${modalId}">📘 Bio</button>` : "";

    return `
      <div class="card">
        <img src="${imagePath}" alt="${esc(person.name)} class="profile-pic"/>
        <strong>${esc(person.name)}</strong><br/>
        <em>${esc(person.title || "")}</em><br/>
        ${program}${university}
        ${dates}
        ${linksHTML}${person.bio ? "<br/>" : ""}
        ${bioBtn}
      </div>
    `;
  }

  function modal(person, modalId) {
    if (!person.bio) return "";
    return `
      <div id="${modalId}" class="modal" aria-hidden="true">
        <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="${modalId}-title">
          <button class="modal-close" data-modal-close="${modalId}" aria-label="Close">✖</button>
          <h3 id="${modalId}-title">${esc(person.name)}</h3>
          <p>${esc(person.bio)}</p>
        </div>
      </div>
    `;
  }

  function renderSection(section, mount) {
    const title = section.title || section.section || "Section";
    const subtitle = section.subtitle ? `<div class="section-subtitle">${esc(section.subtitle)}</div>` : "";
    const linksLayout = section.linksLayout || "inline";

    let html = `<div class="section"><h2>${esc(title)}</h2>${subtitle}<div class="cards">`;
    const modals = [];

    (section.people || section.members || []).forEach((p, i) => {
      const id = `bio-${slug(p.name)}-${i}`;
      html += personCard(p, { modalId: id, linksLayout });
      const m = modal(p, id);
      if (m) modals.push(m);
    });

    html += `</div>${modals.join("")}</div>`;
    mount.insertAdjacentHTML("beforeend", html);
  }

  function wireModals(scope = document) {
    $$("[data-modal-open]", scope).forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-modal-open");
        const m = document.getElementById(id);
        if (m) m.style.display = "block";
      });
    });
    $$("[data-modal-close]", scope).forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = btn.getAttribute("data-modal-close");
        const m = document.getElementById(id);
        if (m) m.style.display = "none";
        e.stopPropagation();
      });
    });
    $$(".modal", scope).forEach((m) => {
      m.addEventListener("click", () => { m.style.display = "none"; });
      m.querySelector(".modal-content")?.addEventListener("click", (e) => e.stopPropagation());
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Empêche un double rendu si le script est inclus 2x
    if (window.__TEAM_RENDERED__) return;
    window.__TEAM_RENDERED__ = true;

    injectStyle();

    const root = document.getElementById("team-root");
    if (!root) return;

    root.innerHTML = "";

    // Sections depuis TEAM_DATA
    if (Array.isArray(window.TEAM_DATA)) {
      window.TEAM_DATA.forEach((group) => {
        renderSection({ title: group.section, people: group.members, linksLayout: "inline" }, root);
      });
    }

    // Alumni (si présent)
    if (Array.isArray(window.ALUMNI) && window.ALUMNI.length > 0) {
      const alumniTitle = typeof window.ALUMNI_TITLE === "string" ? window.ALUMNI_TITLE : "Alumni";
      const alumniSubtitle = typeof window.ALUMNI_SUBTITLE === "string" ? window.ALUMNI_SUBTITLE : "Former Interns";
      renderSection({ title: alumniTitle, subtitle: alumniSubtitle, people: window.ALUMNI, linksLayout: "inline" }, root);
    }

    wireModals(root);
  });
})();