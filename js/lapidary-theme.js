/* Lapidary light/dark toggle. The initial theme is set by an inline <head>
   script (from ?theme=, localStorage, or prefers-color-scheme) to avoid a
   flash; this only wires the button. The moon/sun icon is swapped by CSS
   off the [data-theme] attribute. */
(function () {
  "use strict";
  var root = document.documentElement;
  var btn = document.getElementById("theme-toggle");
  if (!btn) return;

  function isDark() { return root.getAttribute("data-theme") === "dark"; }
  btn.setAttribute("aria-pressed", isDark() ? "true" : "false");

  btn.addEventListener("click", function () {
    var next = isDark() ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    btn.setAttribute("aria-pressed", next === "dark" ? "true" : "false");
  });
})();
