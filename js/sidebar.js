/*
 * Retro Sidebar - drop-in navigation bar
 * Usage: add this one line to every page, just before </body>:
 *   <script src="sidebar.js"></script>
 * (The CSS is built in, no separate stylesheet needed.)
 *
 * To customize, edit the CONFIG below, or define window.SidebarConfig
 * before loading this script.
 */
(function () {
  var CONFIG = {
    siteName: "My Cool Homepage",
    logo: "../images/vincisoft.jpg",                 // URL of a logo image. Leave "" for a text logo.
    logoText: "MyCoolSite",   // Text logo (used if no image)
    tagline: "Welcome to vinci social",
    links: [
      { text: "Home",     href: "index.html" },
      { text: "chat", href: "about.html" },
      { text: "Photos",   href: "photos.html" },
      { text: "Links",    href: "links.html", isNew: true },
      { text: "Guestbook",href: "guestbook.html" },
      { text: "Contact",  href: "contact.html" }
    ],
    showCounter: true,        // fake visitor counter
    counterStart: 1337,
    footerText: "Best viewed in Netscape Navigator at 800x600"
  };

  // Let the page override any setting
  var user = window.SidebarConfig || {};
  for (var key in user) { if (user.hasOwnProperty(key)) CONFIG[key] = user[key]; }

  var CSS = `
/* Retro Sidebar - 90s / 2000s look */

/* Only reserves space for the sidebar; does not style the rest of the page */
body.rs-has-sidebar {
  padding-left: 200px;
}

.rs-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 180px;
  box-sizing: border-box;
  padding: 8px;
  overflow-y: auto;
  background: #c0c0c0;
  border-right: 3px ridge #ffffff;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 12px;
  text-align: center;
  color: #000;
  z-index: 1000;
}

/* Logo */
.rs-logo {
  background: #000080;
  border: 3px outset #ffffff;
  padding: 10px 4px;
  margin-bottom: 6px;
}
.rs-logo img { max-width: 100%; display: block; margin: 0 auto; }
.rs-logo-text {
  font-family: "Comic Sans MS", "Comic Sans", cursive;
  font-size: 20px;
  font-weight: bold;
  color: #ffff00;
  text-shadow: 2px 2px #ff0000;
}

.rs-tagline {
  font-style: italic;
  color: #000080;
  margin: 6px 0;
}

.rs-hr {
  border: 0;
  border-top: 2px groove #ffffff;
  margin: 8px 0;
}

/* Links as chunky 3D buttons */
.rs-nav { list-style: none; margin: 0; padding: 0; }
.rs-nav li { margin: 4px 0; }
.rs-nav a {
  display: block;
  padding: 4px 6px;
  background: #c0c0c0;
  border: 2px outset #ffffff;
  color: #0000ee;
  font-weight: bold;
  text-decoration: underline;
}
.rs-nav a:visited { color: #551a8b; }
.rs-nav a:hover {
  color: #ff0000;
  background: #d8d8d8;
}
.rs-nav a:active { border-style: inset; }
.rs-nav a.rs-current {
  border-style: inset;
  background: #ffffcc;
  color: #000;
  text-decoration: none;
}

/* Blinking NEW! tag */
.rs-new {
  display: inline-block;
  margin-top: 2px;
  color: #ff0000;
  font-size: 10px;
  font-weight: bold;
  animation: rs-blink 1s steps(2, start) infinite;
}
@keyframes rs-blink { to { visibility: hidden; } }

/* Visitor counter */
.rs-counter { margin: 6px 0; }
.rs-counter-label { font-size: 10px; margin-bottom: 2px; }
.rs-counter-digits {
  display: inline-block;
  background: #000;
  color: #00ff00;
  font-family: "Courier New", Courier, monospace;
  font-size: 16px;
  letter-spacing: 2px;
  padding: 2px 6px;
  border: 2px inset #808080;
}

.rs-footer {
  margin-top: 10px;
  font-size: 9px;
  color: #404040;
}

/* Menu button is hidden on desktop */
.rs-toggle { display: none; }

/* Small screens: sidebar becomes a collapsible menu */
@media (max-width: 700px) {
  body.rs-has-sidebar { padding-left: 0; padding-top: 50px; }
  .rs-toggle {
    display: block;
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 1001;
    padding: 8px;
    background: #c0c0c0;
    border: 3px outset #ffffff;
    color: #000;
    font-family: Verdana, sans-serif;
    font-weight: bold;
  }
  .rs-sidebar {
    top: 40px;
    width: 100%;
    border-right: 0;
    border-bottom: 3px ridge #ffffff;
    bottom: auto;
    max-height: calc(100vh - 40px);
    display: none;
  }
  .rs-sidebar.rs-open { display: block; }
}
`;

  function addStyles() {
    if (document.getElementById("rs-styles")) return;
    var style = document.createElement("style");
    style.id = "rs-styles";
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function el(tag, className, text) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (text) e.textContent = text;
    return e;
  }

  function build() {
    addStyles();
    var bar = el("div", "rs-sidebar");
    bar.id = "rs-sidebar";

    // Logo
    var logoBox = el("div", "rs-logo");
    if (CONFIG.logo) {
      var img = el("img");
      img.src = CONFIG.logo;
      img.alt = CONFIG.siteName;
      logoBox.appendChild(img);
    } else {
      logoBox.appendChild(el("span", "rs-logo-text", CONFIG.logoText));
    }
    bar.appendChild(logoBox);
    bar.appendChild(el("div", "rs-tagline", CONFIG.tagline));
    bar.appendChild(el("hr", "rs-hr"));

    // Links
    var nav = el("ul", "rs-nav");
    var here = location.pathname.split("/").pop() || "index.html";
    CONFIG.links.forEach(function (l) {
      var li = el("li");
      var a = el("a", "", l.text);
      a.href = l.href;
      if (l.href.split("/").pop() === here) a.className = "rs-current";
      li.appendChild(a);
      if (l.isNew) li.appendChild(el("span", "rs-new", "NEW!"));
      nav.appendChild(li);
    });
    bar.appendChild(nav);
    bar.appendChild(el("hr", "rs-hr"));

    // Counter
    if (CONFIG.showCounter) {
      var counter = el("div", "rs-counter");
      counter.appendChild(el("div", "rs-counter-label", "You are visitor #"));
      var n = String(CONFIG.counterStart + Math.floor(Math.random() * 50)).padStart(6, "0");
      counter.appendChild(el("div", "rs-counter-digits", n));
      bar.appendChild(counter);
    }

    bar.appendChild(el("div", "rs-footer", CONFIG.footerText));

    // Mobile toggle button
    var toggle = el("button", "rs-toggle", "\u2630 Menu");
    toggle.type = "button";
    toggle.onclick = function () { bar.classList.toggle("rs-open"); };

    document.body.insertBefore(bar, document.body.firstChild);
    document.body.insertBefore(toggle, document.body.firstChild);
    document.body.classList.add("rs-has-sidebar");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
