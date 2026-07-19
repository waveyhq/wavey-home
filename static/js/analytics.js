/*
 * Wavey conversion events on top of PostHog autocapture.
 *
 * PostHog already captures (do not reimplement):
 *   $pageview / $pageleave (+ scroll depth), $autocapture clicks,
 *   clipboard copy/paste, dead clicks, heatmaps, web vitals.
 *
 * This file only adds named outbound conversion events so funnels like
 * Landing → Docs → GitHub are queryable without parsing autocapture hrefs.
 */
(function () {
  if (!window.posthog || typeof window.posthog.capture !== 'function') return;

  var pageSection = document.body.getAttribute('data-page-section') || '';
  var recent = {};

  function track(event, props) {
    var key = event + '|' + (props.href || '');
    var now = Date.now();
    if (recent[key] && now - recent[key] < 700) return;
    recent[key] = now;

    var payload = { page: window.location.pathname, href: props.href, link_text: props.link_text, location: props.location, destination: props.destination };
    if (pageSection) payload.page_section = pageSection;
    window.posthog.capture(event, payload);
  }

  function textOf(el) {
    var text = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
    return text.length > 80 ? text.slice(0, 77) + '...' : text;
  }

  function locationOf(el) {
    if (el.closest('.nav-drawer')) return 'mobile_drawer';
    if (el.closest('.terminal-nav')) return 'navbar';
    if (el.closest('footer.footer')) return 'footer';
    if (el.closest('.landing-about')) return 'hero';
    if (el.closest('.landing-section')) return 'landing_section';
    if (el.closest('.posts-list')) return 'list';
    if (el.closest('.post-body')) return 'content';
    return 'page';
  }

  function destinationFor(url) {
    var host = url.hostname.replace(/^www\./, '');
    if (host === 'github.com') return 'github';
    if (host === 'gitlab.com') return 'gitlab';
    if (host === 'discord.gg' || host === 'discord.com') return 'discord';
    if (host === 'console.wavey.nopejs.me') return 'console';
    if (host === 'status.wavey.nopejs.me') return 'status_page';
    if (host === 'arxiv.org' || host.indexOf('diva-portal.org') !== -1) return 'research_paper';
    if (host.indexOf('wikipedia.org') !== -1) return 'wikipedia';
    if (host === 'x.com' || host === 'twitter.com') return 'twitter';
    if (host === 'youtube.com' || host === 'youtu.be') return 'youtube';
    return host;
  }

  // Named events only for destinations used in conversion funnels.
  function namedEvent(url, destination) {
    var path = url.pathname.toLowerCase();
    if (destination === 'github' && path.indexOf('/waveyhq') === 0) return 'github_clicked';
    if (destination === 'gitlab' && path.indexOf('/waveyhq') === 0) return 'gitlab_clicked';
    if (destination === 'discord') return 'discord_clicked';
    if (destination === 'console') return 'console_clicked';
    if (destination === 'research_paper') return 'paper_clicked';
    return null;
  }

  document.addEventListener('click', function (e) {
    var link = e.target && e.target.closest && e.target.closest('a[href]');
    if (!link) return;

    var href = link.getAttribute('href') || '';
    if (href.indexOf('mailto:') === 0) return; // autocapture covers mailto clicks

    var url;
    try { url = new URL(link.href, window.location.href); } catch (err) { return; }
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
    if (url.hostname === window.location.hostname) return; // internal → $pageview / $autocapture

    var destination = destinationFor(url);
    var props = {
      destination: destination,
      href: url.href,
      link_text: textOf(link),
      location: locationOf(link)
    };

    track('external_link_clicked', props);
    var named = namedEvent(url, destination);
    if (named) track(named, props);
  }, true);
})();
