(function () {
  function initKatex() {
    if (typeof renderMathInElement !== "function") {
      return;
    }

    renderMathInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "\\[", right: "\\]", display: true },
        { left: "\\(", right: "\\)", display: false },
        { left: "$", right: "$", display: false },
      ],
      ignoredTags: [
        "script",
        "noscript",
        "style",
        "textarea",
        "pre",
        "code",
        "option",
      ],
      throwOnError: false,
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initKatex);
  } else {
    initKatex();
  }
})();
