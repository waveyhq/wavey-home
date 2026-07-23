(function () {
  "use strict";

  function getModelContext() {
    return document.modelContext || null;
  }

  function registerWaveyTools() {
    var modelContext = getModelContext();
    if (!modelContext || typeof modelContext.registerTool !== "function") {
      return;
    }

    var statusApi = "https://status.wavey.nopejs.me/index.json";
    var siteOrigin = window.location.origin;

    modelContext.registerTool({
      name: "get-service-status",
      description:
        "Fetch the current Wavey platform operational status from the public status page API.",
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      execute: function () {
        return fetch(statusApi, { headers: { Accept: "application/json" } })
          .then(function (response) {
            if (!response.ok) {
              throw new Error("Status request failed");
            }
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
            return {
              aggregate_state: data.data && data.data.attributes
                ? data.data.attributes.aggregate_state
                : "unknown",
              resources: items.map(function (item) {
                return {
                  name: item.attributes.public_name || item.attributes.name,
                  status: item.attributes.status,
                };
              }),
            };
          });
      },
    });

    modelContext.registerTool({
      name: "navigate-to-docs",
      description:
        "Return the canonical URL for a Wavey documentation page by slug (for example getting-started, faq, or use-cases/occupancy-detection).",
      inputSchema: {
        type: "object",
        properties: {
          slug: {
            type: "string",
            description:
              "Page path without leading slash, e.g. getting-started or posts/introduction-to-wifi-csi",
          },
        },
        required: ["slug"],
        additionalProperties: false,
      },
      execute: function (input) {
        var slug = String((input && input.slug) || "").replace(/^\/+/, "");
        if (!slug) {
          throw new Error("slug is required");
        }
        return Promise.resolve({
          url: siteOrigin + "/" + slug + "/",
        });
      },
    });

    modelContext.registerTool({
      name: "get-site-summary",
      description:
        "Return the Wavey llms.txt site summary for LLM and agent discovery.",
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      execute: function () {
        return fetch(siteOrigin + "/llms.txt", {
          headers: { Accept: "text/plain" },
        })
          .then(function (response) {
            if (!response.ok) {
              throw new Error("llms.txt request failed");
            }
            return response.text();
          })
          .then(function (text) {
            return { summary: text };
          });
      },
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", registerWaveyTools);
  } else {
    registerWaveyTools();
  }
})();
