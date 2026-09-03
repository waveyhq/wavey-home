/*
 * Wavey docs conversion and interaction events.
 *
 * PostHog autocapture covers generic clicks, copy/paste, scroll depth, heatmaps,
 * web vitals, and session replay. OpenPanel covers screen views, outgoing links,
 * data-track attributes, hash changes, and session replay automatically.
 *
 * This file adds named events to both PostHog and OpenPanel so funnels and
 * reports stay queryable without parsing autocapture payloads.
 */
(function () {
  var hasPosthog = window.posthog && typeof window.posthog.capture === 'function';
  var hasOpenpanel = window.op && typeof window.op === 'function';
  if (!hasPosthog && !hasOpenpanel) return;

  var pageSection = document.body.getAttribute('data-page-section') || '';
  var recent = {};
  var scrollMarks = {};
  var pageStartedAt = Date.now();
  var searchQueryTimer = 0;

  function baseProps() {
    var props = {
      page: window.location.pathname,
      page_url: window.location.href,
      page_title: document.title,
      referrer: document.referrer || ''
    };
    if (pageSection) props.page_section = pageSection;
    try {
      props.theme = document.documentElement.getAttribute('data-theme') || 'unknown';
    } catch (error) {
      props.theme = 'unknown';
    }
    return props;
  }

  function track(event, props) {
    props = props || {};
    var payload = {};
    var keyParts = [event];
    Object.keys(baseProps()).forEach(function (name) {
      payload[name] = baseProps()[name];
    });
    Object.keys(props).forEach(function (name) {
      payload[name] = props[name];
      if (name === 'href' || name === 'query' || name === 'destination') {
        keyParts.push(String(props[name]));
      }
    });

    var key = keyParts.join('|');
    var now = Date.now();
    if (recent[key] && now - recent[key] < 700) return;
    recent[key] = now;

    if (hasPosthog) window.posthog.capture(event, payload);
    if (hasOpenpanel) window.op('track', event, payload);
  }

  function textOf(el) {
    var text = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
    return text.length > 80 ? text.slice(0, 77) + '...' : text;
  }

  function locationOf(el) {
    if (el.closest('.nav-popover')) return 'mobile_nav';
    if (el.closest('.nav-bottom-bar')) return 'mobile_nav';
    if (el.closest('.terminal-nav')) return 'navbar';
    if (el.closest('footer.footer')) return 'footer';
    if (el.closest('.footer-ask-ai')) return 'ask_ai_footer';
    if (el.closest('.landing-about')) return 'hero';
    if (el.closest('.landing-section')) return 'landing_section';
    if (el.closest('.posts-list')) return 'list';
    if (el.closest('.post-body')) return 'content';
    if (el.closest('#site-search')) return 'search';
    return 'page';
  }

  function destinationFor(url) {
    var host = url.hostname.replace(/^www\./, '');
    if (host === 'github.com') return 'github';
    if (host === 'gitlab.com') return 'gitlab';
    if (host === 'discord.gg' || host === 'discord.com') return 'discord';
    if (host === 'console.waveyhq.dev') return 'console';
    if (host === 'status.waveyhq.dev') return 'status_page';
    if (host === 'arxiv.org' || host.indexOf('diva-portal.org') !== -1) return 'research_paper';
    if (host.indexOf('wikipedia.org') !== -1) return 'wikipedia';
    if (host === 'x.com' || host === 'twitter.com') return 'twitter';
    if (host === 'youtube.com' || host === 'youtu.be') return 'youtube';
    if (host === 'chatgpt.com') return 'chatgpt';
    if (host === 'claude.ai') return 'claude';
    if (host === 'www.google.com') return 'gemini';
    if (host === 'www.perplexity.ai') return 'perplexity';
    if (host === 'grok.com') return 'grok';
    if (host === 'www.netlify.com') return 'netlify';
    return host;
  }

  function namedEvent(url, destination) {
    var path = url.pathname.toLowerCase();
    if (destination === 'github' && path.indexOf('/waveyhq') === 0) return 'github_clicked';
    if (destination === 'gitlab' && path.indexOf('/waveyhq') === 0) return 'gitlab_clicked';
    if (destination === 'discord') return 'discord_clicked';
    if (destination === 'console') return 'console_clicked';
    if (destination === 'research_paper') return 'paper_clicked';
    if (destination === 'chatgpt' || destination === 'claude' || destination === 'gemini' || destination === 'perplexity' || destination === 'grok') {
      return 'ask_ai_clicked';
    }
    return null;
  }

  function readTheme() {
    return document.documentElement.getAttribute('data-theme') || 'unknown';
  }

  function searchResultCount() {
    var list = document.getElementById('site-search-list');
    if (!list) return 0;
    return list.querySelectorAll('.cmdk__item').length;
  }

  if (hasOpenpanel) {
    window.op('setGlobalProperties', Object.assign({
      page_section: pageSection,
      page_path: window.location.pathname
    }, baseProps()));
  }

  document.addEventListener('click', function (e) {
    var link = e.target && e.target.closest && e.target.closest('a[href]');
    if (!link) return;

    var href = link.getAttribute('href') || '';

    if (href.indexOf('mailto:') === 0) {
      track('mailto_clicked', {
        href: href,
        link_text: textOf(link),
        location: locationOf(link)
      });
      return;
    }

    var url;
    try { url = new URL(link.href, window.location.href); } catch (err) { return; }
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

    if (url.hostname === window.location.hostname) {
      if (link.closest('.status-link')) {
        track('status_link_clicked', {
          href: url.href,
          location: locationOf(link)
        });
      } else if (link.closest('#main-content, .posts-list, .terminal-nav, footer.footer')) {
        track('internal_link_clicked', {
          href: url.pathname,
          link_text: textOf(link),
          location: locationOf(link)
        });
      }
      return;
    }

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

  document.querySelectorAll('.theme-toggle').forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      window.setTimeout(function () {
        track('theme_toggled', {
          theme: readTheme(),
          location: locationOf(toggle)
        });
      }, 0);
    });
  });

  document.querySelectorAll('[data-slot="command-menu-trigger"]').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      track('search_opened', { source: 'click', location: locationOf(trigger) });
    });
  });

  document.addEventListener('keydown', function (event) {
    var isModifier = event.metaKey || event.ctrlKey;
    if (isModifier && event.key.toLowerCase() === 'k') {
      track('search_opened', { source: 'keyboard_shortcut', shortcut: 'mod+k' });
      return;
    }
    if (event.key === '/' && !document.body.classList.contains('search-open')) {
      var target = event.target;
      var tag = target && target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (target && target.isContentEditable)) {
        return;
      }
      track('search_opened', { source: 'keyboard_shortcut', shortcut: '/' });
    }
  });

  var searchInput = document.getElementById('site-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      window.clearTimeout(searchQueryTimer);
      searchQueryTimer = window.setTimeout(function () {
        var query = (searchInput.value || '').trim();
        if (!query) return;
        track('search_query', {
          query: query,
          query_length: query.length,
          results_count: searchResultCount(),
          has_results: searchResultCount() > 0
        });
      }, 500);
    });
  }

  var searchList = document.getElementById('site-search-list');
  if (searchList) {
    searchList.addEventListener('click', function (event) {
      var item = event.target && event.target.closest('.cmdk__item');
      if (!item) return;
      track('search_result_selected', {
        item_kind: item.dataset.kind || 'page',
        item_url: item.dataset.url || '',
        item_action: item.dataset.action || '',
        item_title: textOf(item),
        opens_new_tab: item.dataset.newTab === 'true',
        query: searchInput ? (searchInput.value || '').trim() : '',
        results_count: searchResultCount()
      });
    });
  }

  var navToggle = document.querySelector('.nav-bottom-toggle');
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      window.setTimeout(function () {
        track('mobile_nav_toggled', { open: document.body.classList.contains('nav-open') });
      }, 0);
    });
  }

  var feedbackForm = document.querySelector('form[name="feedback"]');
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', function () {
      track('feedback_form_submitted', {
        form_name: 'feedback',
        page_path: window.location.pathname
      });
    });
  }

  var mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.addEventListener('copy', function () {
      var selection = window.getSelection ? String(window.getSelection()) : '';
      track('content_copied', {
        selection_length: selection.length,
        location: 'main_content'
      });
    });
  }

  var scrollThresholds = [25, 50, 75, 90, 100];
  function trackScrollDepth() {
    var doc = document.documentElement;
    var scrollTop = window.pageYOffset || doc.scrollTop || 0;
    var viewport = window.innerHeight || doc.clientHeight || 0;
    var height = Math.max(doc.scrollHeight, document.body.scrollHeight, 1);
    var depth = Math.min(100, Math.round(((scrollTop + viewport) / height) * 100));

    scrollThresholds.forEach(function (threshold) {
      if (depth >= threshold && !scrollMarks[threshold]) {
        scrollMarks[threshold] = true;
        track('scroll_depth', { depth_percent: threshold });
      }
    });
  }

  window.addEventListener('scroll', trackScrollDepth, { passive: true });
  trackScrollDepth();

  function trackEngagement(reason) {
    var seconds = Math.round((Date.now() - pageStartedAt) / 1000);
    if (seconds < 3) return;
    track('page_engagement', {
      engaged_seconds: seconds,
      reason: reason
    });
  }

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      trackEngagement('visibility_hidden');
    }
  });

  window.addEventListener('pagehide', function () {
    trackEngagement('pagehide');
  });

  var searchRoot = document.getElementById('site-search');
  if (searchRoot && 'MutationObserver' in window) {
    var searchObserver = new MutationObserver(function () {
      var open = searchRoot.classList.contains('is-open');
      if (!open && searchRoot.dataset.wasOpen === 'true') {
        track('search_closed', {
          query: searchInput ? (searchInput.value || '').trim() : '',
          results_count: searchResultCount()
        });
      }
      searchRoot.dataset.wasOpen = open ? 'true' : 'false';
    });
    searchObserver.observe(searchRoot, { attributes: true, attributeFilter: ['class'] });
  }
})();
