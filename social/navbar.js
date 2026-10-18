/*!
 * navbar.js — top bar with a logo on each side and Home / Chat / Pages buttons.
 * Follows the site theme (standard / retro / v7mode) via <link id="theme-css">.
 *
 * Tell it which page you're on:
 *   <script src="navbar.js" data-page="pages"></script>
 * Valid names: home, chat, pages.
 */
(function () {
  "use strict";

  var scriptEl = document.currentScript;
  // Project root = parent folder of the folder containing navbar.js
  var ROOT = new URL("../", scriptEl.src).href;

  // ---------- CONFIG ----------
  var CONFIG = {
    leftLogo:  { src: "", text: "L", alt: "Left logo",  href: ROOT + "index.html" },
    rightLogo: { src: "", text: "R", alt: "Right logo", href: "#" },
    links: [
      { id: "home",  label: "Home",  href: ROOT + "index.html" },
      { id: "chat",  label: "Chat",  href: ROOT + "chat.html" },
      { id: "pages", label: "Pages", href: ROOT + "social/social.html" }
    ],
    active: "home",
    onNavigate: function (id, link) {
      // Return false to stop the default link behavior.
    }
  };

  // ---------- PAGE DETECTION ----------
  function detect() {
    if (window.NAVBAR_PAGE) return window.NAVBAR_PAGE;
    if (scriptEl && scriptEl.dataset.page) return scriptEl.dataset.page;
    var meta = document.querySelector('meta[name="navbar-page"]');
    if (meta && meta.content) return meta.content;
    if (document.body && document.body.dataset.page) return document.body.dataset.page;
    return CONFIG.active;
  }

  function setActive(container, id) {
    container.querySelectorAll(".nb-btn").forEach(function (b) {
      if (b.dataset.id === id) b.setAttribute("aria-current", "page");
      else b.removeAttribute("aria-current");
    });
  }

  // ---------- THEME DETECTION ----------
  function detectTheme() {
    var link = document.getElementById("theme-css");
    var href = link ? (link.getAttribute("href") || "").toLowerCase() : "";
    if (href.indexOf("v7mode") !== -1) return "v7";
    if (href.indexOf("retro") !== -1) return "retro";
    return "normal";
  }

  function watchTheme(wrap) {
    function apply() { wrap.dataset.nbTheme = detectTheme(); }
    apply();
    var link = document.getElementById("theme-css");
    if (link) {
      new MutationObserver(apply).observe(link, {
        attributes: true,
        attributeFilter: ["href"]
      });
    }
  }

  // ---------- STYLES ----------
  var css = `
  .nb-wrap {
    --nb-bg: rgba(255, 255, 255, 0.78);
    --nb-border: rgba(20, 24, 40, 0.09);
    --nb-text: #1c2033;
    --nb-muted: #6a7088;
    --nb-pill: #eef0f7;
    --nb-accent: #1c2033;
    --nb-accent-text: #ffffff;
    --nb-shadow: 0 8px 30px rgba(20, 24, 40, 0.08);
    --nb-radius: 999px;
    --nb-logo-radius: 50%;
    --nb-font: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    --nb-blur: saturate(180%) blur(16px);
  }
  .nb-wrap[data-nb-theme="retro"] {
    --nb-bg: #c0c0c0;
    --nb-border: #000;
    --nb-text: #000;
    --nb-muted: #303030;
    --nb-pill: #a8a8a8;
    --nb-accent: #000080;
    --nb-accent-text: #fff;
    --nb-shadow: inset 1px 1px #fff, inset -1px -1px #808080;
    --nb-radius: 0;
    --nb-logo-radius: 0;
    --nb-font: "Courier New", monospace;
    --nb-blur: none;
  }
  .nb-wrap[data-nb-theme="v7"] {
    --nb-bg: rgba(185, 209, 234, 0.55);
    --nb-border: rgba(255, 255, 255, 0.7);
    --nb-text: #0b1f3a;
    --nb-muted: #35506f;
    --nb-pill: rgba(255, 255, 255, 0.35);
    --nb-accent: #2b6cb0;
    --nb-accent-text: #fff;
    --nb-shadow: 0 6px 24px rgba(20, 60, 110, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.8);
    --nb-radius: 8px;
    --nb-logo-radius: 8px;
    --nb-font: "Segoe UI", Tahoma, sans-serif;
    --nb-blur: saturate(160%) blur(10px);
  }
  body { padding-top: 84px; }
  .nb-wrap {
    position: fixed; top: 12px; left: 0; right: 0; z-index: 9999;
    display: flex; justify-content: center; padding: 0 12px;
    pointer-events: none;
    font-family: var(--nb-font);
  }
  .nb {
    pointer-events: auto;
    width: 100%; max-width: 960px; height: 60px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 12px;
    background: var(--nb-bg);
    border: 1px solid var(--nb-border);
    border-radius: var(--nb-radius);
    box-shadow: var(--nb-shadow);
    -webkit-backdrop-filter: var(--nb-blur);
    backdrop-filter: var(--nb-blur);
  }
  .nb-logo {
    width: 40px; height: 40px; flex: none;
    display: grid; place-items: center;
    border-radius: var(--nb-logo-radius); overflow: hidden;
    background: transparent;
    color: var(--nb-text);
    font-weight: 700; font-size: 18px; text-decoration: none;
    transition: transform .2s ease;
  }
  .nb-logo:hover { transform: scale(1.08); }
  .nb-logo img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .nb-links {
    display: flex; gap: 4px; padding: 4px;
    background: var(--nb-pill); border-radius: var(--nb-radius);
  }
  .nb-btn {
    appearance: none; border: 0; cursor: pointer;
    padding: 8px 20px; border-radius: var(--nb-radius);
    font: inherit; font-size: 14px; font-weight: 500;
    color: var(--nb-muted); background: transparent;
    text-decoration: none; line-height: 1.2;
    transition: color .2s ease, background .2s ease, box-shadow .2s ease;
  }
  .nb-btn:hover { color: var(--nb-text); }
  .nb-btn[aria-current="page"] {
    background: var(--nb-accent); color: var(--nb-accent-text);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.18);
  }
  .nb-btn:focus-visible, .nb-logo:focus-visible {
    outline: 2px solid var(--nb-accent); outline-offset: 2px;
  }
  @media (max-width: 480px) {
    .nb { height: 54px; padding: 0 8px; }
    .nb-logo { width: 34px; height: 34px; font-size: 15px; }
    .nb-btn { padding: 7px 12px; font-size: 13px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .nb-logo, .nb-btn { transition: none; }
  }`;

  // ---------- BUILD ----------
  function logo(cfg, side) {
    var a = document.createElement("a");
    a.className = "nb-logo nb-logo-" + side;
    a.href = cfg.href || "#";
    a.setAttribute("aria-label", cfg.alt);
    if (cfg.src) {
      var img = document.createElement("img");
      img.src = cfg.src;
      img.alt = cfg.alt;
      a.appendChild(img);
    } else {
      a.textContent = cfg.text;
    }
    return a;
  }

  function init() {
    if (document.querySelector(".nb-wrap")) return;

    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    var wrap = document.createElement("div");
    wrap.className = "nb-wrap";
    var nav = document.createElement("nav");
    nav.className = "nb";
    nav.setAttribute("aria-label", "Main");

    var links = document.createElement("div");
    links.className = "nb-links";

    CONFIG.links.forEach(function (l) {
      var a = document.createElement("a");
      a.className = "nb-btn";
      a.href = l.href;
      a.textContent = l.label;
      a.dataset.id = l.id;
      a.addEventListener("click", function (e) {
        setActive(links, l.id);
        if (CONFIG.onNavigate(l.id, l) === false) e.preventDefault();
      });
      links.appendChild(a);
    });

    nav.appendChild(logo(CONFIG.leftLogo, "left"));
    nav.appendChild(links);
    nav.appendChild(logo(CONFIG.rightLogo, "right"));
    wrap.appendChild(nav);
    document.body.insertBefore(wrap, document.body.firstChild);

    watchTheme(wrap);
    setActive(links, detect());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();