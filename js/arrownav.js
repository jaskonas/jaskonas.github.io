/* Signal arrow navigation — progressive enhancement over real <a> links. */
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

  function setup(list) {
    var items = Array.prototype.slice.call(list.children).filter(function (el) {
      return el.tagName === "LI";
    });
    if (!items.length) return;
    list._items = items;
    list._idx = -1;

    list._move = function (n, scroll) {
      if (n < 0) n = items.length - 1;
      if (n >= items.length) n = 0;
      for (var i = 0; i < items.length; i++) {
        if (i === n) items[i].classList.add("is-active");
        else items[i].classList.remove("is-active");
      }
      list._idx = n;
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
  }

  lists.forEach(setup);

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
