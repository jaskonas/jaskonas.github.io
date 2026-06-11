/* Lapidary light/dark toggle. The initial theme is set by an inline <head>
   script (from localStorage or prefers-color-scheme) to avoid a flash; this
   only wires the toggle button and keeps its label in sync. */
(function () {
  "use strict";
  var root = document.documentElement;
  var btn = document.getElementById("theme-toggle");
  if (!btn) return;

  function current() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }
  function syncLabel() {
    // The button names the mode you'll switch TO.
    btn.textContent = current() === "dark" ? "Light" : "Dark";
    btn.setAttribute("aria-pressed", current() === "dark" ? "true" : "false");
  }
  syncLabel();

  btn.addEventListener("click", function () {
    var next = current() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    syncLabel();
  });
})();
