(function () {
  const DEFAULT_EMAIL = "fanzini.aronne.pro@gmail.com";
  const C = window.PRISM_CONFIG || {};
  const email = (typeof C.email === "string" && C.email.trim()) || DEFAULT_EMAIL;

  const form = document.querySelector(".contact-form");
  if (form) {
    form.action = "https://formsubmit.co/" + encodeURIComponent(email.trim());
    form.method = "post";
  }

  const nextInput = document.getElementById("contact-form-next");
  if (nextInput) {
    try {
      nextInput.value = new URL("contact.html?envoye=1", window.location.href).href;
    } catch {
      nextInput.value = "";
    }
  }

  if (new URLSearchParams(window.location.search).get("envoye") === "1") {
    const banner = document.getElementById("form-success");
    if (banner) {
      banner.hidden = false;
      banner.focus();
    }
    try {
      window.history.replaceState({}, "", "contact.html");
    } catch {
      /* file:// */
    }
  }
})();
