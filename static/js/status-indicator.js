(function () {
  // TEMP: remove before deploy — cycles all status states every 3s for visual testing
  var STATUS_TEST_CYCLE = false;

  var links = document.querySelectorAll('.status-link[data-status-api]');
  if (!links.length) return;

  var API = links[0].dataset.statusApi;
  var dotClass = { operational: 'status-dot--operational', degraded: 'status-dot--degraded', down: 'status-dot--down', maintenance: 'status-dot--maintenance' };
  var labelClass = { operational: 'status-label--operational', degraded: 'status-label--degraded', down: 'status-label--down', maintenance: 'status-label--maintenance' };
  var copy = { operational: 'Operational', degraded: 'Degraded', down: 'Service Disruption', maintenance: 'Under Maintenance', unknown: 'Uptime' };

  function render(s) {
    links.forEach(function (link) {
      var dot = link.querySelector('.status-dot');
      var label = link.querySelector('.status-label');
      if (!dot || !label) return;
      dot.className = 'status-dot ' + (dotClass[s] || 'status-dot--unknown');
      label.className = 'status-label ' + (labelClass[s] || 'status-label--unknown');
      label.textContent = copy[s] || copy.unknown;
      link.setAttribute('aria-label', copy[s] || copy.unknown);
    });
  }

  if (STATUS_TEST_CYCLE) {
    var cases = ['operational', 'degraded', 'down', 'maintenance', 'unknown'];
    var i = 0;
    render(cases[0]);
    setInterval(function () {
      i = (i + 1) % cases.length;
      render(cases[i]);
    }, 3000);
    return;
  }

  function state(items) {
    if (!items.length) return 'unknown';
    if (items.every(function (i) { return i.attributes.status === 'operational'; })) return 'operational';
    if (items.some(function (i) { return i.attributes.status === 'downtime' || i.attributes.status === 'major_outage'; })) return 'down';
    if (items.some(function (i) { return i.attributes.status === 'under_maintenance' || i.attributes.status === 'maintenance'; })) return 'maintenance';
    return 'degraded';
  }

  function poll() {
    fetch(API)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var items = (data.included || []).filter(function (i) {
          return i.type === 'status_page_resource' && i.attributes.status !== 'not_monitored';
        });
        render(state(items));
      })
      .catch(function () { render('unknown'); });
  }

  poll();
  setInterval(poll, 60000);
})();
