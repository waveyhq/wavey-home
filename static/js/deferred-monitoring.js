(function () {
  var current = document.currentScript;
  var env = (current && current.getAttribute('data-env')) || 'production';
  var release = current && current.getAttribute('data-release');

  function loadMonitoring() {
    window.sentryOnLoad = function () {
      var opts = {
        environment: env,
        tracesSampleRate: 1.0,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        enableLogs: true,
      };
      if (release) opts.release = 'wavey-home@' + release;
      Sentry.init(opts);
    };

    var sentry = document.createElement('script');
    sentry.src = 'https://js.sentry-cdn.com/df11951f77abb628b6abe51167c70557.min.js';
    sentry.crossOrigin = 'anonymous';
    document.head.appendChild(sentry);

    (function (h, o, u, n, d) {
      h = h[d] = h[d] || { q: [], onReady: function (c) { h.q.push(c); } };
      d = o.createElement(u);
      d.async = 1;
      d.src = n;
      d.crossOrigin = '';
      n = o.getElementsByTagName(u)[0];
      n.parentNode.insertBefore(d, n);
    })(window, document, 'script', 'https://www.datadoghq-browser-agent.com/us5/v7/datadog-rum.js', 'DD_RUM');

    window.DD_RUM.onReady(function () {
      var rum = {
        applicationId: '622d431d-6a46-4ebc-9980-10d193728150',
        clientToken: 'pub8afde6412d49bc86fb51b5285f2a5fe1',
        site: 'us5.datadoghq.com',
        service: 'wavey-home',
        env: env,
        sessionSampleRate: 100,
        sessionReplaySampleRate: 20,
        trackResources: true,
        trackUserInteractions: true,
        trackLongTasks: true,
      };
      if (release) rum.version = release;
      window.DD_RUM.init(rum);
    });
  }

  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadMonitoring, { timeout: 2000 });
  } else {
    window.addEventListener('load', loadMonitoring);
  }
})();
