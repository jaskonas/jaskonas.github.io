/* Signal arrow navigation — progressive enhancement over real <a> links.
   Optionally drives a Tufte-style margin note: a list with
   data-margin="<id>" updates that element with the active row's
   data-title / data-meta / data-abstract, aligned opposite the row. */
(function () {
  "use strict";

  var lists = Array.prototype.slice.call(document.querySelectorAll(".arrow-list"));
  if (!lists.length) return;

  // Engaged on first hover or focus — NOT at load, so arrow keys don't
  // hijack native page scroll before the user touches a list.
  var activeList = null;

  function clear(list) {
    if (!list || !list._items) return;
    list._items.forEach(function (el) { el.classList.remove("is-active"); });
    list._idx = -1;
  }

  function activate(list, i, scroll) {
    if (activeList && activeList !== list) clear(activeList);
    activeList = list;
    list._move(i, scroll);
  }

  function focusActive() {
    if (!activeList) return;
    var i = activeList._idx;
    if (i >= 0) {
      var a = activeList._items[i].querySelector("a");
      if (a) a.focus();
    }
  }

  // ---- margin note ----
  function placeNote(list) {
    if (!list._margin || list._shown < 0) return;
    var li = list._items[list._shown];
    list._margin.style.top =
      (li.getBoundingClientRect().top - list.getBoundingClientRect().top) + "px";
  }

  function showNote(list, idx) {
    var m = list._margin;
    if (!m) return;
    var li = list._items[idx];
    while (m.firstChild) m.removeChild(m.firstChild);
    function add(cls, text) {
      if (!text) return;
      var el = document.createElement("p");
      el.className = cls;
      el.textContent = text;
      m.appendChild(el);
    }
    add("note-meta", li.getAttribute("data-meta"));
    add("note-title", li.getAttribute("data-title"));
    add("note-abstract", li.getAttribute("data-abstract"));
    list._shown = idx;
    m.classList.add("is-shown");
    placeNote(list);
  }

  function setup(list) {
    var items = Array.prototype.slice.call(list.children).filter(function (el) {
      return el.tagName === "LI";
    });
    if (!items.length) return;
    list._items = items;
    list._idx = -1;
    list._shown = -1;
    var marginId = list.getAttribute("data-margin");
    list._margin = marginId ? document.getElementById(marginId) : null;

    list._move = function (n, scroll) {
      if (n < 0) n = items.length - 1;
      if (n >= items.length) n = 0;
      for (var i = 0; i < items.length; i++) {
        if (i === n) items[i].classList.add("is-active");
        else items[i].classList.remove("is-active");
      }
      list._idx = n;
      if (list._margin) showNote(list, n);
      if (scroll && items[n]) items[n].scrollIntoView({ block: "nearest" });
    };

    items.forEach(function (li, i) {
      li.addEventListener("mouseenter", function () { activate(list, i, false); });
      var a = li.querySelector("a");
      if (a) {
        // Keyboard users tabbing in engage the list too.
        a.addEventListener("focus", function () { activate(list, i, false); });
      }
    });

    // Default state: preview the most-recent item's abstract in the margin,
    // without engaging keyboard nav or highlighting a row.
    if (list._margin && items.length) showNote(list, 0);
  }

  lists.forEach(setup);

  function repositionAll() {
    lists.forEach(function (list) { if (list._margin) placeNote(list); });
  }
  window.addEventListener("load", repositionAll);
  window.addEventListener("resize", repositionAll);

  document.addEventListener("keydown", function (e) {
    if (!activeList || !activeList._items) return;
    var k = e.key;
    if (k === "ArrowDown" || k === "j") {
      e.preventDefault();
      activeList._move(activeList._idx + 1, true);
      focusActive();
    } else if (k === "ArrowUp" || k === "k") {
      e.preventDefault();
      activeList._move(activeList._idx - 1, true);
      focusActive();
    } else if (k === "Enter") {
      // If a link is already focused, let the browser follow it natively.
      if (document.activeElement && document.activeElement.tagName === "A") return;
      var i = activeList._idx;
      if (i >= 0) {
        var a = activeList._items[i].querySelector("a");
        if (a) { e.preventDefault(); a.click(); }
      }
    }
  });
})();
