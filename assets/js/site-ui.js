(function () {
  "use strict";

  if (/Mac|iPhone|iPad|iPod/.test(navigator.userAgent || navigator.platform || "")) {
    document.documentElement.classList.add("os-macos");
  }

  var thisScript = document.currentScript;
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register((thisScript && thisScript.dataset.sw) || "/sw.js")
      .catch(function () {});
  }

  function readStoredTheme() {
    try {
      var stored = localStorage.getItem("theme");
      return stored === "dark" || stored === "light" ? stored : null;
    } catch (error) {
      return null;
    }
  }

  function getTheme() {
    return (
      readStoredTheme() ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
    );
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    var themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.setAttribute("content", theme === "dark" ? "#000000" : "#ffffff");
    }
  }

  applyTheme(getTheme());

  document.querySelectorAll(".theme-toggle").forEach(function (toggle) {
    toggle.addEventListener("click", function () {
      var nextTheme = getTheme() === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("theme", nextTheme);
      } catch (error) {
        // The selected theme still applies when storage is unavailable.
      }
      applyTheme(nextTheme);
    });
  });

  var startStatusPolling = function () {};

  (function setUpStatus() {
    var links = document.querySelectorAll(".status-link[data-status-api]");
    if (!links.length) return;

    var api = links[0].dataset.statusApi;
    var timer = 0;
    var started = false;
    var requestPending = false;
    var dotClass = {
      operational: "status-dot--operational",
      degraded: "status-dot--degraded",
      down: "status-dot--down",
      maintenance: "status-dot--maintenance",
    };
    var labelClass = {
      operational: "status-label--operational",
      degraded: "status-label--degraded",
      down: "status-label--down",
      maintenance: "status-label--maintenance",
    };
    var copy = {
      operational: "Operational",
      degraded: "Degraded",
      down: "Service Disruption",
      maintenance: "Under Maintenance",
      unknown: "Uptime",
    };

    function render(status) {
      links.forEach(function (link) {
        var dot = link.querySelector(".status-dot");
        var label = link.querySelector(".status-label");
        if (!dot || !label) return;

        dot.className =
          "status-dot " + (dotClass[status] || "status-dot--unknown");
        label.className =
          "status-label " + (labelClass[status] || "status-label--unknown");
        label.textContent = copy[status] || copy.unknown;
        link.setAttribute(
          "aria-label",
          "Service status: " + (copy[status] || copy.unknown),
        );
      });
    }

    function getStatus(items) {
      if (!items.length) return "unknown";
      if (
        items.every(function (item) {
          return item.attributes.status === "operational";
        })
      ) {
        return "operational";
      }
      if (
        items.some(function (item) {
          return (
            item.attributes.status === "downtime" ||
            item.attributes.status === "major_outage"
          );
        })
      ) {
        return "down";
      }
      if (
        items.some(function (item) {
          return (
            item.attributes.status === "under_maintenance" ||
            item.attributes.status === "maintenance"
          );
        })
      ) {
        return "maintenance";
      }
      return "degraded";
    }

    function schedule() {
      window.clearTimeout(timer);
      if (!started || document.hidden) return;
      timer = window.setTimeout(poll, 60000);
    }

    function finishRequest() {
      requestPending = false;
      schedule();
    }

    function poll() {
      if (!started || document.hidden || requestPending) return;
      requestPending = true;

      fetch(api, { headers: { Accept: "application/json" } })
        .then(function (response) {
          if (!response.ok) throw new Error("Status request failed");
          return response.json();
        })
        .then(function (data) {
          var items = (data.included || []).filter(function (item) {
            return (
              item.type === "status_page_resource" &&
              item.attributes &&
              item.attributes.status !== "not_monitored"
            );
          });
          render(getStatus(items));
        })
        .catch(function () {
          render("unknown");
        })
        .then(finishRequest, finishRequest);
    }

    startStatusPolling = function () {
      if (started) return;
      started = true;
      poll();
    };

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        window.clearTimeout(timer);
      } else if (started) {
        poll();
      }
    });

    var footerStatus = document.querySelector(".footer-status-link");
    if (!footerStatus) return;

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        if (
          entries.some(function (entry) {
            return entry.isIntersecting;
          })
        ) {
          observer.disconnect();
          startStatusPolling();
        }
      });
      observer.observe(footerStatus);
      return;
    }

    function startWhenVisible() {
      var bounds = footerStatus.getBoundingClientRect();
      if (bounds.top < window.innerHeight && bounds.bottom > 0) {
        window.removeEventListener("scroll", startWhenVisible);
        window.removeEventListener("resize", startWhenVisible);
        startStatusPolling();
      }
    }

    window.addEventListener("scroll", startWhenVisible, { passive: true });
    window.addEventListener("resize", startWhenVisible);
    startWhenVisible();
  })();

  (function setUpMobileNav() {
    var toggle = document.querySelector(".nav-bottom-toggle");
    var popover = document.getElementById("site-nav-popover");
    var overlay = document.querySelector(".nav-popover-overlay");
    if (!toggle || !popover || !overlay) return;

    var mobileViewport = window.matchMedia("(max-width: 850px)");

    function setNavOpen(open, returnFocus) {
      var shouldOpen = Boolean(open && mobileViewport.matches);
      toggle.classList.toggle("is-open", shouldOpen);
      popover.classList.toggle("is-open", shouldOpen);
      overlay.classList.toggle("is-open", shouldOpen);
      document.body.classList.toggle("nav-open", shouldOpen);
      toggle.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
      toggle.setAttribute(
        "aria-label",
        shouldOpen ? "Close menu" : "Open menu",
      );
      popover.setAttribute("aria-hidden", shouldOpen ? "false" : "true");

      if (shouldOpen) {
        document.dispatchEvent(new CustomEvent("wavey:close-search"));
        popover.removeAttribute("hidden");
        popover.removeAttribute("inert");
        overlay.removeAttribute("hidden");
      } else {
        popover.setAttribute("hidden", "");
        popover.setAttribute("inert", "");
        overlay.setAttribute("hidden", "");
        if (returnFocus !== false && mobileViewport.matches) {
          toggle.focus();
        }
      }
    }

    toggle.addEventListener("click", function () {
      setNavOpen(!popover.classList.contains("is-open"));
    });

    overlay.addEventListener("click", function () {
      setNavOpen(false);
    });

    popover.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setNavOpen(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (!popover.classList.contains("is-open")) return;
      if (event.key === "Escape") {
        setNavOpen(false);
      }
    });

    function syncViewport() {
      if (!mobileViewport.matches || !popover.classList.contains("is-open")) {
        setNavOpen(false, false);
      }
    }

    if (mobileViewport.addEventListener) {
      mobileViewport.addEventListener("change", syncViewport);
    } else {
      mobileViewport.addListener(syncViewport);
    }
    syncViewport();

    window.waveyCloseMobileNav = function () {
      setNavOpen(false, false);
    };
  })();

  (function setUpSiteSearch() {
    var searchRoot = document.getElementById("site-search");
    var searchInput = document.getElementById("site-search-input");
    var searchList = document.getElementById("site-search-list");
    var searchEmpty = document.getElementById("site-search-empty");
    var actionLabel = document.getElementById("site-search-action-label");
    var searchTriggers = document.querySelectorAll('[data-slot="command-menu-trigger"]');
    if (!searchRoot || !searchInput || !searchList || !searchEmpty) {
      return;
    }

    function isSearchTrigger(node) {
      if (!node || !node.closest) return false;
      return Boolean(node.closest('[data-slot="command-menu-trigger"]'));
    }

    function syncTriggerState(open) {
      searchTriggers.forEach(function (trigger) {
        trigger.setAttribute("aria-expanded", open ? "true" : "false");
      });
      searchInput.setAttribute("aria-expanded", open ? "true" : "false");
    }

    var groups = [];
    var rawSearch = window.__WAVEY_SEARCH__;
    if (typeof rawSearch === "string") {
      try {
        groups = JSON.parse(rawSearch).groups || [];
      } catch (error) {
        groups = [];
      }
    } else if (rawSearch && rawSearch.groups) {
      groups = rawSearch.groups;
    }

    var flatItems = [];
    var activeIndex = -1;
    var selectedKind = "page";
    var lastQuery = "";

    var ENTER_LABELS = {
      command: "Run command",
      page: "Go to page",
      link: "Open link",
    };

    var ICONS = {
      home:
        '<svg class="cmdk__item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"></path><path d="M5 10v10h14V10"></path></svg>',
      file:
        '<svg class="cmdk__item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path></svg>',
      news:
        '<svg class="cmdk__item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
      sun:
        '<svg class="cmdk__item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>',
      moon:
        '<svg class="cmdk__item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>',
      rss:
        '<svg class="cmdk__item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle></svg>',
    };

    function normalize(value) {
      return String(value || "")
        .toLowerCase()
        .trim();
    }

    function itemMatches(item, query) {
      if (!query) return true;
      var haystack = [
        item.title,
        item.description,
        item.url,
        item.action,
      ]
        .concat(item.keywords || [])
        .join(" ");
      return normalize(haystack).indexOf(query) !== -1;
    }

    function filterGroups(query) {
      return groups
        .map(function (group) {
          return {
            heading: group.heading,
            items: (group.items || []).filter(function (item) {
              return itemMatches(item, query);
            }),
          };
        })
        .filter(function (group) {
          return group.items.length > 0;
        });
    }

    function setActionLabel(kind) {
      selectedKind = kind || "page";
      if (actionLabel) {
        actionLabel.textContent =
          ENTER_LABELS[selectedKind] || ENTER_LABELS.page;
      }
    }

    function setActiveItem(index) {
      var buttons = searchList.querySelectorAll(".cmdk__item");
      activeIndex = index;
      buttons.forEach(function (button, buttonIndex) {
        var isActive = buttonIndex === activeIndex;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-selected", isActive ? "true" : "false");
        if (isActive) {
          setActionLabel(button.dataset.kind || "page");
          button.scrollIntoView({ block: "nearest" });
        }
      });
    }

    function rebuildFlatItems(filtered) {
      flatItems = [];
      filtered.forEach(function (group) {
        group.items.forEach(function (item) {
          flatItems.push(item);
        });
      });
    }

    function renderResults(query) {
      var filtered = filterGroups(query);
      rebuildFlatItems(filtered);
      searchList.innerHTML = "";
      activeIndex = -1;

      filtered.forEach(function (group) {
        var groupEl = document.createElement("div");
        groupEl.className = "cmdk__group";

        var headingEl = document.createElement("div");
        headingEl.className = "cmdk__group-heading";
        headingEl.textContent = group.heading;
        groupEl.appendChild(headingEl);

        group.items.forEach(function (item) {
          var button = document.createElement("button");
          button.type = "button";
          button.className = "cmdk__item";
          button.setAttribute("role", "option");
          button.dataset.kind = item.kind || "page";
          if (item.url) button.dataset.url = item.url;
          if (item.action) button.dataset.action = item.action;
          if (item.openInNewTab) button.dataset.newTab = "true";

          button.innerHTML =
            (ICONS[item.icon] || ICONS.file) +
            '<span class="cmdk__item-label"></span>';
          button.querySelector(".cmdk__item-label").textContent = item.title;

          if (item.description && group.heading === "Pages") {
            var meta = document.createElement("span");
            meta.className = "cmdk__item-meta";
            meta.textContent = item.description;
            button.appendChild(meta);
          }

          button.addEventListener("mouseenter", function () {
            var buttons = searchList.querySelectorAll(".cmdk__item");
            for (var i = 0; i < buttons.length; i++) {
              if (buttons[i] === button) {
                setActiveItem(i);
                break;
              }
            }
          });

          button.addEventListener("click", function () {
            runItem(item);
          });

          groupEl.appendChild(button);
        });

        searchList.appendChild(groupEl);
      });

      var hasResults = flatItems.length > 0;
      searchEmpty.hidden = hasResults || !query;
      searchList.hidden = !hasResults && Boolean(query);

      if (hasResults) {
        setActiveItem(0);
      } else {
        setActionLabel("page");
      }
    }

    function runTheme(theme) {
      try {
        localStorage.setItem("theme", theme);
      } catch (error) {
        // Theme still applies when storage is unavailable.
      }
      applyTheme(theme);
    }

    function runItem(item) {
      setSearchOpen(false, false);

      if (item.action === "theme-light") {
        runTheme("light");
        return;
      }
      if (item.action === "theme-dark") {
        runTheme("dark");
        return;
      }

      if (!item.url) return;

      if (item.openInNewTab || item.kind === "link") {
        window.open(item.url, "_blank", "noopener");
        return;
      }

      window.location.href = item.url;
    }

    function setSearchOpen(open, returnFocus) {
      var shouldOpen = Boolean(open);
      searchRoot.classList.toggle("is-open", shouldOpen);
      document.body.classList.toggle("search-open", shouldOpen);
      searchRoot.setAttribute("aria-hidden", shouldOpen ? "false" : "true");
      syncTriggerState(shouldOpen);

      if (shouldOpen) {
        if (window.waveyCloseMobileNav) {
          window.waveyCloseMobileNav();
        }
        searchTriggers.forEach(function (trigger) {
          trigger.blur();
        });
        searchRoot.removeAttribute("hidden");
        searchRoot.removeAttribute("inert");
        searchInput.value = "";
        lastQuery = "";
        renderResults("");
        window.requestAnimationFrame(function () {
          searchInput.focus();
        });
      } else {
        searchRoot.setAttribute("hidden", "");
        searchRoot.setAttribute("inert", "");
        searchInput.value = "";
        lastQuery = "";
        renderResults("");
      }
    }

    function toggleSearch() {
      setSearchOpen(!searchRoot.classList.contains("is-open"), false);
    }

    function handleInput() {
      var query = normalize(searchInput.value);
      if (query === lastQuery) return;
      lastQuery = query;
      renderResults(query);
    }

    function isTypingTarget(target) {
      if (!target) return false;
      var tag = target.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target.isContentEditable
      );
    }

    searchTriggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        setSearchOpen(true, false);
      });
    });

    searchInput.addEventListener("input", handleInput);

    searchInput.addEventListener("keydown", function (event) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (!flatItems.length) return;
        setActiveItem((activeIndex + 1) % flatItems.length);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (!flatItems.length) return;
        setActiveItem((activeIndex - 1 + flatItems.length) % flatItems.length);
      } else if (event.key === "Enter") {
        if (activeIndex >= 0 && flatItems[activeIndex]) {
          event.preventDefault();
          runItem(flatItems[activeIndex]);
        }
      } else if (event.key === "Escape") {
        event.preventDefault();
        setSearchOpen(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      var isModifier = event.metaKey || event.ctrlKey;
      if (isModifier && event.key.toLowerCase() === "k") {
        event.preventDefault();
        toggleSearch();
        return;
      }
      if (
        event.key === "/" &&
        !searchRoot.classList.contains("is-open") &&
        !isTypingTarget(event.target)
      ) {
        event.preventDefault();
        setSearchOpen(true, false);
      }
    });

    document.addEventListener("click", function (event) {
      if (!searchRoot.classList.contains("is-open")) return;
      var panel = searchRoot.querySelector(".cmdk__panel");
      if (
        panel &&
        !panel.contains(event.target) &&
        !isSearchTrigger(event.target)
      ) {
        setSearchOpen(false, false);
      }
    });

    document.addEventListener("wavey:close-search", function () {
      if (searchRoot.classList.contains("is-open")) {
        setSearchOpen(false, false);
      }
    });
  })();
})();
