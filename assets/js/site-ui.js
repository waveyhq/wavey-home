(function () {
  "use strict";

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

  (function setUpDrawer() {
    var toggle = document.querySelector(".nav-toggle");
    var drawer = document.getElementById("site-nav-drawer");
    var overlay = document.querySelector(".nav-overlay");
    if (!toggle || !drawer || !overlay) return;

    var mobileViewport = window.matchMedia("(max-width: 850px)");

    function setDrawerOpen(open, returnFocus) {
      var shouldOpen = Boolean(open && mobileViewport.matches);
      toggle.classList.toggle("is-open", shouldOpen);
      drawer.classList.toggle("is-open", shouldOpen);
      overlay.classList.toggle("is-open", shouldOpen);
      document.body.classList.toggle("nav-open", shouldOpen);
      toggle.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
      toggle.setAttribute(
        "aria-label",
        shouldOpen ? "Close menu" : "Open menu",
      );
      drawer.setAttribute("aria-hidden", shouldOpen ? "false" : "true");

      if (shouldOpen) {
        drawer.removeAttribute("inert");
        overlay.removeAttribute("hidden");
        startStatusPolling();
        var firstLink = drawer.querySelector("a");
        if (firstLink) {
          window.requestAnimationFrame(function () {
            firstLink.focus();
          });
        }
      } else {
        overlay.setAttribute("hidden", "");
        if (returnFocus !== false && mobileViewport.matches) {
          toggle.focus();
        } else if (drawer.contains(document.activeElement)) {
          var brand = document.querySelector(".site-brand");
          if (brand) brand.focus();
        }
        drawer.setAttribute("inert", "");
      }
    }

    toggle.addEventListener("click", function () {
      setDrawerOpen(!drawer.classList.contains("is-open"));
    });

    overlay.addEventListener("click", function () {
      setDrawerOpen(false);
    });

    drawer.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setDrawerOpen(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (!drawer.classList.contains("is-open")) return;

      if (event.key === "Escape") {
        setDrawerOpen(false);
        return;
      }

      if (event.key === "Tab") {
        var focusable = drawer.querySelectorAll("a, button");
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    function syncViewport() {
      if (!mobileViewport.matches || !drawer.classList.contains("is-open")) {
        setDrawerOpen(false, false);
      }
    }

    if (mobileViewport.addEventListener) {
      mobileViewport.addEventListener("change", syncViewport);
    } else {
      mobileViewport.addListener(syncViewport);
    }
    syncViewport();
  })();
})();
