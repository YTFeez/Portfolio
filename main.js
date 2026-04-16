(function () {
  const C = window.PRISM_CONFIG || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  function scrollPageTop() {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }
  scrollPageTop();
  requestAnimationFrame(scrollPageTop);
  window.addEventListener("pageshow", (ev) => {
    document.body.classList.remove("prism-page-exit");
    if (ev.persisted) scrollPageTop();
  });

  function escapeHtml(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function setText(sel, text) {
    $$(sel).forEach((el) => {
      if (text != null && text !== "") el.textContent = text;
    });
  }

  const pageKey = document.body.getAttribute("data-prism-page") || "index";
  const pageTitles = {
    index: "Création de sites web",
    expertise: "Expertise & offre",
    demarche: "Démarche",
    projets: "Réalisations",
    contact: "Contact",
  };
  const pageSubtitle = pageTitles[pageKey] || pageTitles.index;
  document.title = (C.brandName || "Prism") + " — " + pageSubtitle;

  function hsla(h, s, l, a) {
    return "hsla(" + h + " " + s + "% " + l + "% / " + a + ")";
  }

  function buildAdvancedDaThemes(count) {
    const styleModes = ["editorial", "neo", "soft", "contrast", "minimal", "brutal"];
    const layoutModes = ["split", "stack", "wide", "compact", "flow"];
    const panelModes = ["glass", "flat", "frame", "soft", "sharp"];
    const typoModes = ["normal", "mono", "display"];
    const out = [];
    for (let i = 0; i < count; i += 1) {
      const hue = ((i + 9) * 41) % 360;
      const advIndex = i;
      out.push({
        id: "da-" + (i + 1),
        label: "DA " + String(i + 1),
        swatchA: hsla(hue, 82, 58, 0.95),
        swatchB: hsla((hue + 58) % 360, 84, 63, 0.95),
        baseHue: hue,
        profile: {
          style: styleModes[advIndex % styleModes.length],
          layout: layoutModes[Math.floor(advIndex / styleModes.length) % layoutModes.length],
          panel: panelModes[Math.floor(advIndex / (styleModes.length * layoutModes.length)) % panelModes.length],
          typo: typoModes[advIndex % typoModes.length],
        },
      });
    }
    return out;
  }

  function buildColorThemesForDa(daTheme, count) {
    const out = [];
    const base = daTheme?.baseHue ?? 220;
    for (let i = 0; i < count; i += 1) {
      const hue = (base + i * 17) % 360;
      const accentHue = (hue + 24) % 360;
      const warmHue = (hue + 48) % 360;
      out.push({
        id: "color-" + (i + 1),
        label: "Couleur " + String(i + 1),
        swatchA: hsla(hue, 86, 58, 0.96),
        swatchB: hsla((hue + 54) % 360, 90, 64, 0.96),
        vars: {
          "--page-bg-base": hsla((hue + 220) % 360, 32, 8, 1),
          "--page-mesh-a": hsla(hue, 84, 56, 0.2),
          "--page-mesh-b": hsla((hue + 62) % 360, 76, 56, 0.14),
          "--page-mesh-c": hsla((hue + 128) % 360, 72, 58, 0.08),
          "--blob-a-1": hsla(hue, 85, 60, 0.34),
          "--blob-a-2": hsla((hue + 20) % 360, 82, 56, 0.12),
          "--blob-b-1": hsla((hue + 68) % 360, 78, 60, 0.26),
          "--blob-b-2": hsla((hue + 84) % 360, 75, 56, 0.1),
          "--blob-c-1": hsla((hue + 138) % 360, 76, 58, 0.2),
          "--blob-c-2": hsla((hue + 160) % 360, 72, 56, 0.1),
          "--accent": hsla(accentHue, 80, 66, 1),
          "--accent-hover": hsla(accentHue, 88, 74, 1),
          "--accent-soft": hsla(accentHue, 82, 64, 0.16),
          "--gold": hsla(warmHue, 88, 62, 1),
          "--gold-soft": hsla(warmHue, 88, 62, 0.16),
        },
      });
    }
    return out;
  }

  function applyDaTheme(daTheme, colorTheme) {
    if (!daTheme || !colorTheme || !colorTheme.vars) return;
    const body = document.body;
    Object.entries(colorTheme.vars).forEach(([k, v]) => body.style.setProperty(k, v));
    body.setAttribute("data-da-theme", daTheme.id + "-" + colorTheme.id);
    const profile = daTheme.profile || {};
    body.setAttribute("data-da-style", profile.style || "default");
    body.setAttribute("data-da-layout", profile.layout || "default");
    body.setAttribute("data-da-panel", profile.panel || "default");
    body.setAttribute("data-da-typo", profile.typo || "default");
    try {
      localStorage.setItem(
        "prism-da-state",
        JSON.stringify({ daId: daTheme.id, colorId: colorTheme.id })
      );
    } catch {}
  }

  function initSelectedDaTheme() {
    const advancedThemes = buildAdvancedDaThemes(30);
    let savedState = null;
    try {
      const raw = localStorage.getItem("prism-da-state");
      if (raw) savedState = JSON.parse(raw);
    } catch {}

    function buildColorTintsForDa(daTheme) {
      const base = daTheme?.baseHue ?? 220;
      const vibrant = [
        { key: "rose", h: 328, s: 78, l: 62 },
        { key: "fuchsia", h: 312, s: 76, l: 58 },
        { key: "violet", h: 272, s: 72, l: 60 },
        { key: "indigo", h: 246, s: 70, l: 60 },
        { key: "cobalt", h: 222, s: 72, l: 60 },
        { key: "turquoise", h: 184, s: 70, l: 56 },
        { key: "emeraude", h: 156, s: 62, l: 52 },
        { key: "citron", h: 78, s: 74, l: 58 },
        { key: "orange", h: 26, s: 80, l: 58 },
        { key: "corail", h: 10, s: 78, l: 60 },
      ];
      return vibrant.map((e, i) => {
        const hue = (e.h + (base % 18)) % 360;
        const accentHue = (hue + 18) % 360;
        return {
          id: "color-" + (i + 1),
          label: e.key,
          swatchA: hsla(hue, Math.min(92, e.s + 6), Math.min(92, e.l + 12), 0.97),
          swatchB: hsla(hue, Math.min(94, e.s + 12), Math.max(34, e.l - 12), 0.97),
          vars: {
            "--page-bg-base": hsla((hue + 214) % 360, 16, 8, 1),
            "--page-mesh-a": hsla(hue, Math.max(62, e.s), Math.min(80, e.l + 4), 0.24),
            "--page-mesh-b": hsla((hue + 26) % 360, Math.max(56, e.s - 6), Math.min(76, e.l), 0.16),
            "--page-mesh-c": hsla((hue + 54) % 360, Math.max(50, e.s - 10), Math.min(72, e.l - 4), 0.11),
            "--blob-a-1": hsla(hue, Math.max(70, e.s + 6), Math.min(80, e.l + 2), 0.34),
            "--blob-a-2": hsla((hue + 18) % 360, Math.max(56, e.s - 4), Math.min(74, e.l - 4), 0.14),
            "--blob-b-1": hsla((hue + 36) % 360, Math.max(62, e.s), Math.min(76, e.l), 0.26),
            "--blob-b-2": hsla((hue + 56) % 360, Math.max(52, e.s - 8), Math.min(72, e.l - 8), 0.12),
            "--blob-c-1": hsla((hue + 70) % 360, Math.max(58, e.s - 2), Math.min(76, e.l), 0.2),
            "--blob-c-2": hsla((hue + 90) % 360, Math.max(50, e.s - 10), Math.min(70, e.l - 10), 0.1),
            "--accent": hsla(accentHue, Math.max(74, e.s + 8), Math.min(82, e.l + 8), 1),
            "--accent-hover": hsla(accentHue, Math.max(82, e.s + 14), Math.min(88, e.l + 14), 1),
            "--accent-soft": hsla(accentHue, Math.max(68, e.s + 6), Math.min(80, e.l + 2), 0.2),
            "--gold": hsla((accentHue + 18) % 360, Math.max(66, e.s + 2), Math.min(84, e.l + 6), 1),
            "--gold-soft": hsla((accentHue + 18) % 360, Math.max(66, e.s + 2), Math.min(84, e.l + 6), 0.2),
          },
        };
      });
    }

    function buildBwTintsForDa(daTheme) {
      const levels = [
        { key: "noir", l: 4 },
        { key: "anthracite", l: 9 },
        { key: "graphite", l: 14 },
        { key: "ardoise", l: 20 },
        { key: "gris", l: 30 },
        { key: "argent", l: 42 },
        { key: "perle", l: 58 },
        { key: "blanc", l: 78 },
      ];
      return levels.map((n, i) => {
        const gray = Math.min(96, n.l + 26);
        return {
          id: "bw-" + (i + 1),
          label: n.key,
          swatchA: hsla(0, 0, Math.min(98, gray + 8), 0.96),
          swatchB: hsla(0, 0, gray, 0.96),
          vars: {
            "--page-bg-base": hsla(0, 0, Math.max(2, n.l - 2), 1),
            "--page-mesh-a": hsla(0, 0, Math.min(90, n.l + 34), 0.14),
            "--page-mesh-b": hsla(0, 0, Math.min(86, n.l + 26), 0.1),
            "--page-mesh-c": hsla(0, 0, Math.min(82, n.l + 20), 0.07),
            "--blob-a-1": hsla(0, 0, Math.min(92, n.l + 40), 0.18),
            "--blob-a-2": hsla(0, 0, Math.min(88, n.l + 30), 0.1),
            "--blob-b-1": hsla(0, 0, Math.min(88, n.l + 34), 0.14),
            "--blob-b-2": hsla(0, 0, Math.min(84, n.l + 24), 0.08),
            "--blob-c-1": hsla(0, 0, Math.min(86, n.l + 30), 0.12),
            "--blob-c-2": hsla(0, 0, Math.min(82, n.l + 22), 0.08),
            "--accent": hsla(0, 0, Math.min(96, n.l + 52), 1),
            "--accent-hover": hsla(0, 0, Math.min(100, n.l + 60), 1),
            "--accent-soft": hsla(0, 0, Math.min(94, n.l + 48), 0.16),
            "--gold": hsla(0, 0, Math.min(98, n.l + 56), 1),
            "--gold-soft": hsla(0, 0, Math.min(98, n.l + 56), 0.16),
          },
        };
      });
    }

    const existing = $(".da-picker");
    if (existing) existing.remove();

    // Fallback sobre proche de ton screenshot.
    const fallbackDaId = "da-24";
    const fallbackColorId = "color-1";
    let currentDa = advancedThemes.find((t) => t.id === savedState?.daId) || advancedThemes.find((t) => t.id === fallbackDaId) || advancedThemes[0];
    let colorThemes = buildColorTintsForDa(currentDa);
    let bwThemes = buildBwTintsForDa(currentDa);
    let toneThemes = [...colorThemes, ...bwThemes];
    let currentToneId = typeof savedState?.colorId === "string" ? savedState.colorId : fallbackColorId;

    function applyCurrentTone() {
      const tone = toneThemes.find((t) => t.id === currentToneId) || toneThemes[0];
      currentToneId = tone.id;
      applyDaTheme(currentDa, tone);
    }
    // UI des cercles supprimée: on garde uniquement la teinte sélectionnée.
    applyCurrentTone();
  }
  initSelectedDaTheme();

  const meta = $('meta[name="description"]');
  if (meta && C.metaDescription && pageKey === "index") {
    meta.setAttribute("content", C.metaDescription);
  }

  $$("[data-nav-page]").forEach((a) => {
    if (a.getAttribute("data-nav-page") === pageKey) {
      a.classList.add("nav__link--current");
      a.setAttribute("aria-current", "page");
    }
  });

  setText("[data-bind=brandName]", C.brandName || "Prism");

  setText("[data-bind=heroKicker]", C.heroKicker);
  setText("[data-bind=heroTitle]", C.heroTitle);
  setText("[data-bind=heroTitleAccent]", C.heroTitleAccent);
  setText("[data-bind=heroSubtitle]", C.heroSubtitle);

  setText("[data-bind=statProjectsValue]", C.statProjectsValue);
  setText("[data-bind=statProjectsLabel]", C.statProjectsLabel);
  setText("[data-bind=statClientsValue]", C.statClientsValue);
  setText("[data-bind=statClientsLabel]", C.statClientsLabel);
  setText("[data-bind=statDelayValue]", C.statDelayValue);
  setText("[data-bind=statDelayLabel]", C.statDelayLabel);

  const statsRow = $("[data-stats-row]");
  if (statsRow) {
    const vals = [C.statProjectsValue, C.statClientsValue, C.statDelayValue];
    const allEmpty = vals.every((v) => !v || v === "" || v === "—");
    if (allEmpty) statsRow.setAttribute("hidden", "");
    else statsRow.removeAttribute("hidden");
  }

  const pillarsRoot = $("[data-pillars]");
  if (pillarsRoot && Array.isArray(C.pillars)) {
    pillarsRoot.innerHTML = "";
    const pillarGlass = [
      "pillar-card prism-glass-panel prism-glass-panel--indigo",
      "pillar-card prism-glass-panel prism-glass-panel--violet",
      "pillar-card prism-glass-panel prism-glass-panel--cyan",
    ];
    C.pillars.forEach((p, i) => {
      const li = document.createElement("li");
      li.className = pillarGlass[i % pillarGlass.length];
      li.innerHTML =
        '<span class="pillar-num">' +
        String(i + 1).padStart(2, "0") +
        "</span>" +
        "<h3>" +
        escapeHtml(p.title) +
        "</h3>" +
        "<p>" +
        escapeHtml(p.text) +
        "</p>";
      pillarsRoot.appendChild(li);
    });
  }

  const processRoot = $("[data-process]");
  if (processRoot && Array.isArray(C.processSteps)) {
    processRoot.innerHTML = "";
    C.processSteps.forEach((step, i) => {
      const li = document.createElement("li");
      li.className = "process-step";
      li.innerHTML =
        '<span class="process-index" aria-hidden="true">' +
        (i + 1) +
        "</span>" +
        "<div><h3>" +
        escapeHtml(step.title) +
        "</h3><p>" +
        escapeHtml(step.text) +
        "</p></div>";
      processRoot.appendChild(li);
    });
  }

  const servicesRoot = $("[data-services]");
  if (servicesRoot && Array.isArray(C.services)) {
    servicesRoot.innerHTML = "";
    C.services.forEach((s) => {
      const li = document.createElement("li");
      li.className = "service-row";
      li.innerHTML = "<h3>" + escapeHtml(s.title) + "</h3><p>" + escapeHtml(s.text) + "</p>";
      servicesRoot.appendChild(li);
    });
  }

  const projetsRoot = $("[data-projects]");
  if (projetsRoot && Array.isArray(C.projects)) {
    projetsRoot.innerHTML = "";
    if (C.projects.length === 0) {
      const empty = document.createElement("div");
      empty.className = "projets-empty prism-glass-panel prism-glass-panel--slate";
      const p = document.createElement("p");
      p.textContent =
        (typeof C.projectsEmptyMessage === "string" && C.projectsEmptyMessage.trim()) ||
        "Les références seront affichées ici au fil des projets livrés.";
      empty.appendChild(p);
      projetsRoot.appendChild(empty);
    } else {
      const projetGlass = [
        "projet-card prism-glass-panel prism-glass-panel--violet",
        "projet-card prism-glass-panel prism-glass-panel--teal",
        "projet-card prism-glass-panel prism-glass-panel--cyan",
      ];
      C.projects.forEach((proj, i) => {
        const article = document.createElement("article");
        article.className = projetGlass[i % projetGlass.length];
        const thumb = document.createElement("div");
        thumb.className = "projet-thumb";
        if (proj.image) {
          thumb.style.backgroundImage = "url('" + String(proj.image).replace(/'/g, "\\'") + "')";
          thumb.style.backgroundSize = "cover";
          thumb.style.backgroundPosition = "center";
        } else {
          thumb.classList.add("projet-thumb--grad", "projet-thumb--" + ((i % 3) + 1));
        }
        const body = document.createElement("div");
        body.className = "projet-body";
        const tag = document.createElement("span");
        tag.className = "projet-tag";
        tag.textContent = proj.tag || "";
        const h3 = document.createElement("h3");
        const a = document.createElement("a");
        a.href = proj.url || "#";
        if (proj.url && proj.url !== "#") {
          a.target = "_blank";
          a.rel = "noopener noreferrer";
        }
        a.textContent = proj.title || "Projet";
        h3.appendChild(a);
        body.appendChild(tag);
        body.appendChild(h3);
        article.appendChild(thumb);
        article.appendChild(body);
        projetsRoot.appendChild(article);
      });
    }
  }

  const testSection = $("#temoignage");
  if (testSection) {
    if (C.testimonialQuote) {
      testSection.removeAttribute("hidden");
      setText("[data-bind=testimonialQuote]", C.testimonialQuote);
      setText("[data-bind=testimonialAuthor]", C.testimonialAuthor);
      setText("[data-bind=testimonialRole]", C.testimonialRole);
    } else {
      testSection.setAttribute("hidden", "");
    }
  }

  setText("[data-bind=contactLead]", C.contactLead);
  setText("[data-bind=contactResponseTime]", C.contactResponseTime);

  const email = (C.email || "").trim();
  $$("[data-bind=emailLink]").forEach((mailA) => {
    if (email) {
      mailA.href = "mailto:" + email;
      if (!mailA.classList.contains("contact-mailto")) {
        mailA.textContent = email;
      }
    } else {
      mailA.closest("[data-hide-if-empty]")?.setAttribute("hidden", "");
    }
  });

  const tel = (C.phone || "").trim();
  const telA = $("[data-bind=phoneLink]");
  if (telA) {
    if (tel) {
      telA.href = "tel:" + tel.replace(/\s/g, "");
      telA.textContent = tel;
    } else {
      telA.closest("[data-hide-if-empty]")?.setAttribute("hidden", "");
    }
  }

  const addr = (C.addressLine || "").trim();
  const addrEl = $("[data-bind=addressLine]");
  if (addrEl) {
    if (addr) addrEl.textContent = addr;
    else addrEl.closest("[data-hide-if-empty]")?.setAttribute("hidden", "");
  }

  const inLi = $("[data-bind=linkedinLink]");
  if (inLi) {
    if (C.linkedinUrl) {
      inLi.href = C.linkedinUrl;
    } else {
      inLi.setAttribute("hidden", "");
    }
  }
  const ig = $("[data-bind=instagramLink]");
  if (ig) {
    if (C.instagramUrl) {
      ig.href = C.instagramUrl;
    } else {
      ig.setAttribute("hidden", "");
    }
  }

  const contactSocial = $(".contact-social");
  if (contactSocial) {
    const visibleSocial = $$(".contact-social__a", contactSocial).filter((a) => !a.hasAttribute("hidden"));
    if (visibleSocial.length === 0) {
      contactSocial.setAttribute("hidden", "");
    }
  }

  const footNote = $("[data-bind=footerNote]");
  const footWrap = footNote?.closest("[data-hide-if-empty]");
  if (footNote && C.footerNote && C.footerNote.trim()) {
    footNote.textContent = C.footerNote;
    footWrap?.removeAttribute("hidden");
  } else {
    footWrap?.setAttribute("hidden", "");
  }

  const y = $("#year");
  if (y) y.textContent = String(new Date().getFullYear());

  const navToggle = $("[data-nav-toggle]");
  const navPanel = $("#nav-panel");
  if (navToggle && navPanel) {
    function setNavOpen(open) {
      navToggle.setAttribute("aria-expanded", String(open));
      navPanel.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
    }
    navToggle.addEventListener("click", () => {
      const open = navToggle.getAttribute("aria-expanded") !== "true";
      setNavOpen(open);
    });
    navPanel.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => setNavOpen(false));
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navPanel.classList.contains("is-open")) {
        setNavOpen(false);
      }
    });
  }

  const revealSel =
    "main .section, main .page-head, main .hero, main .contact-layout";
  const motionOk = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
  if (motionOk && "IntersectionObserver" in window) {
    const revealEls = $$(revealSel);
    revealEls.forEach((el, i) => {
      el.classList.add("reveal");
      el.style.setProperty("--reveal-delay", Math.min(i * 45, 240) + "ms");
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((ent) => {
          if (ent.isIntersecting) {
            ent.target.classList.add("is-visible");
            io.unobserve(ent.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* Transition entre pages (MPA) : sortie courte puis navigation */
  const motionNavOk = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
  if (motionNavOk) {
    const EXIT_MS = 340;
    function isInternalHtmlNav(a) {
      if (!a || a.tagName !== "A") return false;
      if (a.hasAttribute("data-no-page-transition")) return false;
      if (a.target === "_blank" || a.hasAttribute("download")) return false;
      const href = (a.getAttribute("href") || "").trim();
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return false;
      if (href.startsWith("javascript:")) return false;
      let dest;
      try {
        dest = new URL(href, location.href);
      } catch {
        return false;
      }
      if (location.protocol !== "file:" && dest.origin !== location.origin) return false;
      if (!/\.html($|[?#])/i.test(dest.pathname)) return false;
      try {
        const here = new URL(location.href);
        if (dest.pathname === here.pathname && dest.search === here.search) return false;
      } catch {
        return false;
      }
      return true;
    }
    document.addEventListener(
      "click",
      (e) => {
        const a = e.target.closest("a");
        if (!isInternalHtmlNav(a)) return;
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        const go = () => {
          location.href = a.href;
        };
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            document.body.classList.add("prism-page-exit");
            window.setTimeout(go, EXIT_MS);
          });
        });
      },
      false
    );
  }
})();
