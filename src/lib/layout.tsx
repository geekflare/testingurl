import type { FC, PropsWithChildren } from 'hono/jsx'
import { MANIFEST, SEARCH_INDEX } from './manifest'

const SEARCH_INDEX_JSON = JSON.stringify(SEARCH_INDEX)

const GeekflareLogo: FC<{ height: number }> = ({ height }) => (
  <picture>
    <source srcset="https://cdn.geekflare.com/general/logo-dark.svg" media="(prefers-color-scheme: dark)" />
    <img src="https://cdn.geekflare.com/general/logo.svg" alt="Geekflare" height={height} />
  </picture>
)

export const Layout: FC<PropsWithChildren<{ title: string; description?: string; head?: any }>> = ({
  title,
  description,
  head,
  children,
}) => {
  const year = new Date().getFullYear()
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title} · TestingURL.dev</title>
        {description && <meta name="description" content={description} />}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: STYLES }} />
        {head}
        <script dangerouslySetInnerHTML={{ __html: CODE_BLOCK_SCRIPT }} />
        <script id="search-index-data" type="application/json" dangerouslySetInnerHTML={{ __html: SEARCH_INDEX_JSON }} />
        <script dangerouslySetInnerHTML={{ __html: SEARCH_SCRIPT }} />
      </head>
      <body>
        <header class="site-header">
          <div class="header-inner">
            <div class="brand-row">
              <a href="/" class="brand">
                <span class="brand-mark">
                  TestingURL<span class="dot">.dev</span>
                </span>
              </a>
              <div class="header-actions">
                <div class="site-search">
                  <input
                    type="search"
                    id="site-search-input"
                    placeholder="Search pages…"
                    aria-label="Search pages by name or description"
                    autocomplete="off"
                  />
                  <div id="site-search-results" class="search-results" role="listbox" hidden></div>
                </div>
                <a href="https://geekflare.com" class="by-badge" rel="noopener noreferrer" target="_blank">
                  by <GeekflareLogo height={19} />
                </a>
              </div>
            </div>
            <nav class="site-nav">
              <a href="/">All pages</a>
              {MANIFEST.map((group) => (
                <a href={`/${group.key}`}>{group.label}</a>
              ))}
            </nav>
          </div>
        </header>
        <main class="site-main">{children}</main>
        <footer class="site-footer">
          <div class="footer-inner">
            <div class="footer-brand">
              <span class="footer-logo">
                TestingURL<span class="dot">.dev</span>
              </span>
              <p>A sandbox for scraping and HTTP-tooling.</p>
            </div>
            <nav class="footer-links">
              <a href="/">All test pages</a>
              <a href="https://geekflare.com" rel="noopener noreferrer" target="_blank">
                Geekflare
              </a>
            </nav>
          </div>
          <div class="footer-bottom">
            <p>
              &copy; {year} Geekflare &middot; Built with{' '}
              <span class="heart" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              </span>{' '}
              in London by{' '}
              <a href="https://geekflare.com" rel="noopener noreferrer" target="_blank">
                Geekflare
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}

// Delegated on `document` so it works for every CodeBlock on the page,
// including ones whose content is populated later by other scripts (the
// generator preview panels). It just reads whatever text is there when
// the button is clicked.
const CODE_BLOCK_SCRIPT = `
  function markCopied(btn) {
    btn.classList.add('copied');
    setTimeout(function () { btn.classList.remove('copied'); }, 1500);
  }
  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    return ok;
  }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.code-btn');
    if (!btn) return;
    var wrapper = btn.closest('.code-block');
    var codeEl = wrapper && wrapper.querySelector('pre code');
    if (!codeEl) return;
    var text = codeEl.textContent || '';
    var action = btn.getAttribute('data-action');
    if (action === 'copy') {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          markCopied(btn);
        }).catch(function () {
          if (legacyCopy(text)) markCopied(btn);
        });
      } else if (legacyCopy(text)) {
        markCopied(btn);
      }
    } else if (action === 'download') {
      var blob = new Blob([text], { type: 'text/plain' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = btn.getAttribute('data-filename') || 'data.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  });
`

// Reads the embedded search-index JSON once, then filters client-side on
// every keystroke. The index is small (one entry per test page), so no
// server round-trip is worth it.
const SEARCH_SCRIPT = `
  document.addEventListener('DOMContentLoaded', function () {
    var dataEl = document.getElementById('search-index-data');
    var input = document.getElementById('site-search-input');
    var results = document.getElementById('site-search-results');
    if (!dataEl || !input || !results) return;
    var index = [];
    try { index = JSON.parse(dataEl.textContent); } catch (e) {}

    function escapeHtml(s) {
      return s.replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }

    function render(items, query) {
      if (items.length === 0) {
        results.innerHTML = '<div class="search-empty">No pages match "' + escapeHtml(query) + '".</div>';
      } else {
        results.innerHTML = items.slice(0, 8).map(function (item) {
          return '<a href="' + item.path + '" role="option">' +
            '<span class="sr-title">' + escapeHtml(item.title) + ' <span class="badge">' + item.difficulty + '</span></span>' +
            '<span class="sr-desc">' + escapeHtml(item.description) + '</span>' +
          '</a>';
        }).join('');
      }
      results.hidden = false;
    }

    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      if (!q) { results.hidden = true; results.innerHTML = ''; return; }
      var matches = index.filter(function (item) {
        return item.title.toLowerCase().indexOf(q) !== -1 || item.description.toLowerCase().indexOf(q) !== -1;
      });
      render(matches, q);
    });

    input.addEventListener('focus', function () {
      if (input.value.trim()) render(index.filter(function (item) {
        var q = input.value.trim().toLowerCase();
        return item.title.toLowerCase().indexOf(q) !== -1 || item.description.toLowerCase().indexOf(q) !== -1;
      }), input.value.trim());
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { results.hidden = true; input.blur(); }
    });

    document.addEventListener('click', function (e) {
      if (e.target !== input && !results.contains(e.target)) results.hidden = true;
    });
  });
`

// For content meant to be embedded in an <iframe> (the frames/iframes test
// pages): no header/nav/footer, so it doesn't look like the whole site
// re-rendered inside a small embedded window.
export const BareLayout: FC<PropsWithChildren<{ title: string }>> = ({ title, children }) => (
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{title}</title>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
    </head>
    <body style="margin:0; padding:1.5rem; font-family:var(--font-sans); background:var(--bg); color:var(--fg);">
      {children}
    </body>
  </html>
)

const STYLES = `
  :root {
    color-scheme: light dark;
    --fg:#16181d; --bg:#fff; --surface:#fff; --muted:#63676f; --border:#e4e6ea;
    --accent:#2563eb; --accent-dark:#1d4ed8; --accent-soft:rgba(37,99,235,.1);
    --shadow: 0 1px 2px rgba(16,24,40,.04), 0 1px 3px rgba(16,24,40,.06);
    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  }
  @media (prefers-color-scheme: dark) {
    :root { --fg:#e7e9ec; --bg:#0b0d10; --surface:#14171b; --muted:#9aa0a8; --border:#262a30; --accent-soft:rgba(96,145,255,.14); --shadow: 0 1px 2px rgba(0,0,0,.3); }
  }
  * { box-sizing: border-box; }
  html { -webkit-text-size-adjust: 100%; }
  body { margin:0; font-family: var(--font-sans); color:var(--fg); background:var(--bg); line-height:1.6; -webkit-font-smoothing:antialiased; }
  h1, h2, h3 { font-weight:700; letter-spacing:-0.02em; }
  a { color:var(--accent); text-decoration:none; }
  a:hover { text-decoration:underline; }

  /* Header */
  .site-header { position:sticky; top:0; z-index:10; background:color-mix(in srgb, var(--bg) 88%, transparent); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); }
  .header-inner { max-width:960px; margin:0 auto; padding:1.15rem 2rem; }
  .brand-row { display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap; }
  .brand { display:inline-flex; }
  .brand-mark { font-size:1.35rem; font-weight:800; letter-spacing:-0.03em; color:var(--fg); }
  .brand-mark .dot, .footer-logo .dot { color:var(--accent); }
  .footer-logo { font-family: var(--font-mono); font-size:1rem; font-weight:600; letter-spacing:-0.01em; color:var(--fg); }
  .header-actions { display:flex; align-items:center; gap:.75rem; }
  .by-badge { display:inline-flex; align-items:center; gap:.5em; font-family: var(--font-mono); font-size:.72rem; text-transform:uppercase; letter-spacing:.06em; color:var(--muted); border:1px solid var(--border); border-radius:999px; padding:.35rem .9rem; transition:border-color .15s, color .15s; }
  .by-badge:hover { color:var(--accent); border-color:var(--accent); text-decoration:none; }
  .by-badge img { display:block; }
  .site-nav { display:flex; gap:1.25rem; margin-top:.9rem; font-family:var(--font-mono); font-size:.82rem; flex-wrap:wrap; }
  .site-nav a { color:var(--muted); }
  .site-nav a:hover { color:var(--accent); text-decoration:underline; }

  .site-search { position:relative; }
  .site-search input[type="search"] { width:200px; padding:.4rem .7rem; border:1px solid var(--border); border-radius:8px; background:var(--surface); color:var(--fg); font-family:var(--font-sans); font-size:.85rem; }
  .site-search input[type="search"]:focus { outline:2px solid var(--accent); outline-offset:1px; }
  .search-results { position:absolute; top:calc(100% + .4rem); right:0; width:320px; max-width:80vw; max-height:360px; overflow-y:auto; background:var(--surface); border:1px solid var(--border); border-radius:10px; box-shadow:var(--shadow); z-index:30; }
  .search-results a { display:block; padding:.55rem .75rem; border-bottom:1px solid var(--border); text-decoration:none; color:var(--fg); }
  .search-results a:last-child { border-bottom:none; }
  .search-results a:hover { background:var(--accent-soft); }
  .search-results .sr-title { display:flex; align-items:center; gap:.4rem; font-weight:600; font-size:.88rem; }
  .search-results .sr-desc { display:block; color:var(--muted); font-size:.78rem; margin-top:.15rem; }
  .search-empty { padding:.6rem .75rem; color:var(--muted); font-size:.85rem; }

  .site-main { padding:2.5rem 2rem 3rem; max-width:960px; margin:0 auto; }

  table { border-collapse:collapse; width:100%; margin:1rem 0; font-size:.95rem; }
  th, td { border:1px solid var(--border); padding:.6rem .8rem; text-align:left; }
  th { font-weight:600; background:var(--accent-soft); }
  .pagination { display:flex; gap:.4rem; margin-top:1.5rem; flex-wrap:wrap; }
  .pagination a, .pagination span { padding:.4rem .8rem; border:1px solid var(--border); border-radius:8px; text-decoration:none; color:var(--fg); font-family:var(--font-mono); font-size:.85rem; transition:border-color .15s, background .15s; }
  .pagination a:hover { border-color:var(--accent); background:var(--accent-soft); text-decoration:none; }
  .pagination .active { background:var(--accent); color:#fff; border-color:var(--accent); font-weight:600; }

  .card { border:1px solid var(--border); background:var(--surface); border-radius:12px; padding:1.1rem; margin-bottom:.75rem; box-shadow:var(--shadow); transition:border-color .15s, transform .15s; }
  .card:hover { border-color:var(--accent); }
  a.card { display:block; text-decoration:none; color:inherit; }
  a.card:hover h3 { color:var(--accent); }
  .category-card p { color:var(--muted); font-size:.85rem; margin:0; }
  .stars { color:#f59e0b; letter-spacing:1px; }
  .product-price { font-size:1.3rem; font-weight:700; margin:.25rem 0; }
  .card h3 { margin:0 0 .35rem; font-size:1rem; }
  .grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(220px,1fr)); gap:1rem; }

  code { font-family:var(--font-mono); background:var(--accent-soft); color:var(--accent-dark); padding:.15rem .4rem; border-radius:5px; font-size:.85em; }
  .badge { display:inline-block; font-family:var(--font-mono); background:var(--accent-soft); color:var(--accent); padding:.15rem .55rem; border-radius:6px; font-size:.72rem; font-weight:600; text-transform:uppercase; letter-spacing:.03em; }

  form.test-form label { display:block; margin:.75rem 0 .3rem; font-weight:600; font-size:.9rem; }
  form.test-form input, form.test-form select, form.test-form textarea { width:100%; padding:.55rem .7rem; border:1px solid var(--border); border-radius:8px; background:var(--surface); color:var(--fg); font-family:inherit; font-size:.95rem; }
  form.test-form input:focus, form.test-form select:focus, form.test-form textarea:focus { outline:2px solid var(--accent); outline-offset:1px; }
  form.test-form button { margin-top:1.1rem; padding:.65rem 1.3rem; background:var(--accent); color:#fff; border:none; border-radius:8px; cursor:pointer; font-size:.95rem; font-weight:600; transition:background .15s; }
  form.test-form button:hover { background:var(--accent-dark); }
  form.test-form .honeypot { position:absolute; left:-9999px; top:-9999px; }

  button { padding:.65rem 1.3rem; background:var(--accent); color:#fff; border:none; border-radius:8px; cursor:pointer; font-size:.95rem; font-weight:600; font-family:inherit; transition:background .15s, opacity .15s; }
  button:hover:not(:disabled) { background:var(--accent-dark); }
  button:disabled { opacity:.5; cursor:not-allowed; }

  ul.index-list { list-style:none; padding:0; }
  ul.index-list li { padding:.65rem 0; border-bottom:1px solid var(--border); }
  ul.index-list li:last-child { border-bottom:none; }

  .intro { color:var(--muted); font-size:1.02rem; max-width:64ch; }

  .hero { background:var(--accent-soft); border-radius:14px; padding:2rem 2rem 1.75rem; margin-bottom:2.5rem; }
  .hero h1 { margin:0 0 .6rem; }
  .hero .lead { color:var(--fg); font-size:1.05rem; font-weight:600; margin:0 0 .75rem; max-width:64ch; }
  .hero .intro { margin:0; }

  .page-group { margin-top:3rem; }
  .page-group:first-of-type { margin-top:2rem; }
  .page-group + .page-group { padding-top:2.75rem; border-top:1px solid var(--border); }
  .group-header { margin-bottom:1.75rem; }
  .group-eyebrow { display:block; font-family:var(--font-mono); font-size:.78rem; font-weight:600; text-transform:uppercase; letter-spacing:.08em; color:var(--accent); margin-bottom:.4rem; }
  .group-title { font-size:1.55rem; margin:0 0 .5rem; }
  .group-title a { color:var(--fg); }
  .group-title a:hover { color:var(--accent); text-decoration:none; }
  .group-header p { color:var(--muted); margin:0; max-width:60ch; font-size:.98rem; }
  .crumb { font-size:.85rem; margin:0 0 1.25rem; }

  section.category { margin-bottom:2.25rem; }
  section.category:last-child { margin-bottom:0; }
  section.category h3 { font-size:1.05rem; border-bottom:2px solid var(--accent); padding-bottom:.4rem; margin-bottom:.4rem; }
  section.category > p { color:var(--muted); margin-top:0; font-size:.9rem; }

  .steps { display:flex; gap:.5rem; margin-bottom:1.5rem; }
  .steps span { padding:.3rem .75rem; border-radius:999px; border:1px solid var(--border); font-size:.82rem; font-family:var(--font-mono); }
  .steps .done { background:var(--accent); color:#fff; border-color:var(--accent); }
  .frame-embed { width:100%; height:420px; border:1px solid var(--border); border-radius:10px; }
  .a11y-demo, .demo-box { background:#fff; color:#1a1a1a; border:1px dashed #c7cbd1; border-radius:12px; padding:1.5rem; margin-top:1.5rem; position:relative; overflow:hidden; }
  .a11y-demo img { display:block; margin:.75rem 0; border-radius:8px; }
  .a11y-demo form { max-width:320px; }
  .a11y-demo input { width:100%; padding:.55rem .7rem; border:1px solid #c7cbd1; border-radius:8px; font-family:inherit; font-size:.95rem; margin:.3rem 0 .75rem; }
  .a11y-demo label { display:block; font-weight:600; font-size:.9rem; }
  pre { font-family:var(--font-mono); background:var(--accent-soft); padding:1rem; border-radius:10px; overflow-x:auto; }

  .code-block { position:relative; }
  .code-block pre { padding-right:4.25rem; margin:0 0 1rem; }
  .code-toolbar { position:absolute; top:.5rem; right:.5rem; display:flex; gap:.3rem; }
  .code-btn { display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; padding:0; border:1px solid var(--border); border-radius:6px; background:var(--surface); color:var(--muted); cursor:pointer; transition:color .15s, border-color .15s; }
  .code-btn:hover { color:var(--accent); border-color:var(--accent); }
  .code-btn .icon-check { display:none; }
  .code-btn.copied { color:#059669; border-color:#059669; }
  .code-btn.copied .icon-copy { display:none; }
  .code-btn.copied .icon-check { display:inline; }

  /* Footer */
  .site-footer { border-top:1px solid var(--border); margin-top:2rem; }
  .footer-inner { max-width:960px; margin:0 auto; padding:2rem 2rem 1.25rem; display:flex; justify-content:space-between; align-items:flex-start; gap:2rem; flex-wrap:wrap; }
  .footer-brand p { color:var(--muted); font-size:.85rem; max-width:32ch; margin:.4rem 0 0; }
  .footer-links { display:flex; gap:1.25rem; font-size:.85rem; }
  .footer-bottom { border-top:1px solid var(--border); padding:1rem 2rem; text-align:center; color:var(--muted); font-size:.78rem; font-family:var(--font-mono); }
  .footer-bottom a { color:var(--muted); text-decoration:underline; text-underline-offset:2px; }
  .footer-bottom a:hover { color:var(--accent); }
  .heart { display:inline-flex; vertical-align:-2px; color:#ef4444; opacity:.8; transform-origin:center; transition:opacity .15s; }
  .footer-bottom p:hover .heart { opacity:1; animation:heartbeat .8s ease-in-out; }
  @keyframes heartbeat {
    0%, 100% { transform:scale(1); }
    15% { transform:scale(1.3); }
    30% { transform:scale(1); }
    45% { transform:scale(1.22); }
    60% { transform:scale(1); }
  }

  @media (max-width: 600px) {
    .header-inner, .site-main, .footer-inner { padding-left:1.25rem; padding-right:1.25rem; }
    .header-actions { width:100%; justify-content:space-between; }
    .site-search { flex:1; }
    .site-search input[type="search"] { width:100%; }
    .search-results { left:0; right:0; width:auto; max-width:none; }
    .hero { padding:1.5rem 1.25rem; }
  }
`
