(function () {
  "use strict";

  function ensureModelContext() {
    var existing = document.modelContext || navigator.modelContext;
    if (existing && typeof existing.registerTool === "function") {
      return existing;
    }

    var toolMap = Object.create(null);
    var polyfill = {
      registerTool: function (tool, options) {
        if (!tool || !tool.name || typeof tool.execute !== "function") {
          return Promise.reject(new TypeError("Invalid WebMCP tool definition"));
        }
        toolMap[tool.name] = tool;
        if (options && options.signal) {
          if (options.signal.aborted) {
            delete toolMap[tool.name];
            return Promise.resolve(undefined);
          }
          options.signal.addEventListener(
            "abort",
            function () {
              delete toolMap[tool.name];
            },
            { once: true },
          );
        }
        return Promise.resolve(undefined);
      },
      getTools: function () {
        return Promise.resolve(
          Object.keys(toolMap)
            .sort()
            .map(function (name) {
              var tool = toolMap[name];
              return {
                name: tool.name,
                description: tool.description,
                inputSchema: JSON.stringify(
                  tool.inputSchema || { type: "object", properties: {} },
                ),
              };
            }),
        );
      },
    };

    document.modelContext = polyfill;
    try {
      navigator.modelContext = polyfill;
    } catch (error) {
      // Some environments make navigator.modelContext read-only.
    }

    return polyfill;
  }

  function registerWaveyTools(modelContext, signal) {
    var statusApi = "https://status.wavey.nopejs.me/index.json";
    var siteOrigin = window.location.origin;
    var options = signal ? { signal: signal } : undefined;

    modelContext.registerTool(
      {
        name: "get-service-status",
        description:
          "Fetch the current Wavey platform operational status from the public status page API.",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false,
        },
        annotations: { readOnlyHint: true },
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
                content: [
                  {
                    type: "text",
                    text: JSON.stringify(
                      {
                        aggregate_state:
                          data.data && data.data.attributes
                            ? data.data.attributes.aggregate_state
                            : "unknown",
                        resources: items.map(function (item) {
                          return {
                            name:
                              item.attributes.public_name ||
                              item.attributes.name,
                            status: item.attributes.status,
                          };
                        }),
                      },
                      null,
                      2,
                    ),
                  },
                ],
              };
            });
        },
      },
      options,
    );

    modelContext.registerTool(
      {
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
        annotations: { readOnlyHint: true },
        execute: function (input) {
          var slug = String((input && input.slug) || "").replace(/^\/+/, "");
          if (!slug) {
            throw new Error("slug is required");
          }
          var url = siteOrigin + "/" + slug + "/";
          return Promise.resolve({
            content: [{ type: "text", text: url }],
          });
        },
      },
      options,
    );

    modelContext.registerTool(
      {
        name: "get-site-summary",
        description:
          "Return the Wavey llms.txt site summary for LLM and agent discovery.",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false,
        },
        annotations: { readOnlyHint: true },
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
              return {
                content: [{ type: "text", text: text }],
              };
            });
        },
      },
      options,
    );
  }

  var controller = new AbortController();
  var modelContext = ensureModelContext();
  registerWaveyTools(modelContext, controller.signal);

  window.addEventListener(
    "pagehide",
    function () {
      controller.abort();
    },
    { once: true },
  );
})();
