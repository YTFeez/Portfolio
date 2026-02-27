(function () {
  "use strict";

  const header = document.querySelector(".header");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const contactForm = document.querySelector(".contact-form");
  const skillsSection = document.querySelector(".section.skills");
  const scrollProgress = document.querySelector(".scroll-progress");
  const revealEls = document.querySelectorAll(".reveal");
  const statNumbers = document.querySelectorAll(".stat-number");
  const projectCards = document.querySelectorAll(".project-card[data-tilt]");

  // Barre de progression du scroll
  function updateScrollProgress() {
    if (!scrollProgress) return;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
    scrollProgress.style.width = pct + "%";
  }

  // Header au scroll
  function onScroll() {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
    updateScrollProgress();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  updateScrollProgress();

  // Reveal au scroll
  if (revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // Barres de compétences : remplir quand la section est visible
  if (skillsSection) {
    var skillsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.3, rootMargin: "0px 0px -50px 0px" }
    );
    skillsObserver.observe(skillsSection);
  }

  // Compteur animé (stats)
  function animateValue(el, end, duration) {
    var start = 0;
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var easeOut = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(start + (end - start) * easeOut);
      el.textContent = current;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (statNumbers.length) {
    var statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var count = parseInt(el.getAttribute("data-count"), 10);
          if (isNaN(count)) return;
          animateValue(el, count, 1500);
          statsObserver.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    statNumbers.forEach(function (el) {
      statsObserver.observe(el);
    });
  }

  // Effet 3D au survol des cartes (tilt qui suit la souris)
  projectCards.forEach(function (card) {
    var inner = card.querySelector(".project-card-inner");
    if (!inner) inner = card;
    card.addEventListener("mousemove", function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width;
      var y = (e.clientY - rect.top) / rect.height;
      var tiltX = (y - 0.5) * -10;
      var tiltY = (x - 0.5) * 10;
      card.style.transform = "translateY(-6px) scale(1.02)";
      inner.style.transform = "rotateX(" + tiltX + "deg) rotateY(" + tiltY + "deg) translateZ(8px)";
    });
    card.addEventListener("mouseleave", function () {
      card.style.transform = "";
      inner.style.transform = "";
    });
  });

  // Menu mobile
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      navToggle.classList.toggle("open");
      navLinks.classList.toggle("open");
      document.body.style.overflow = navLinks.classList.contains("open") ? "hidden" : "";
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.classList.remove("open");
        navLinks.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  // Animation des barres de compétences au scroll
  if (skillsSection) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.3, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(skillsSection);
  }

  // Formulaire de contact — envoi vers feezexe@gmail.com (Formspree)
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const btn = contactForm.querySelector('button[type="submit"]');
      const text = btn.textContent;
      const action = contactForm.getAttribute("action");

      if (!action || action.indexOf("METTRE_TON_FORM_ID") !== -1) {
        btn.textContent = "Configure Formspree (voir commentaire dans index.html)";
        btn.style.background = "#ef4444";
        setTimeout(function () {
          btn.textContent = text;
          btn.style.background = "";
        }, 4000);
        return;
      }

      btn.textContent = "Envoi...";
      btn.disabled = true;

      const formData = new FormData(contactForm);

      fetch(action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then(function () {
          btn.textContent = "Message envoyé !";
          btn.style.background = "#22c55e";
          contactForm.reset();
          setTimeout(function () {
            btn.textContent = text;
            btn.style.background = "";
            btn.disabled = false;
          }, 2500);
        })
        .catch(function () {
          // Fallback : envoi dans un nouvel onglet (marche même si fetch bloqué, ex. fichier local)
          const form = document.createElement("form");
          form.method = "POST";
          form.action = action;
          form.target = "_blank";
          form.style.display = "none";
          [].forEach.call(contactForm.querySelectorAll("input, textarea"), function (el) {
            if (el.name && el.name !== "_subject") {
              var copy = document.createElement("input");
              copy.name = el.name;
              copy.value = el.value;
              form.appendChild(copy);
            }
          });
          var sub = document.createElement("input");
          sub.name = "_subject";
          sub.value = "Message depuis ton portfolio";
          form.appendChild(sub);
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
          btn.textContent = "Message envoyé !";
          btn.style.background = "#22c55e";
          contactForm.reset();
          btn.disabled = false;
          setTimeout(function () {
            btn.textContent = text;
            btn.style.background = "";
          }, 2500);
        });
    });
  }
})();
