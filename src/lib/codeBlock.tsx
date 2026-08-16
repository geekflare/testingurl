import type { FC } from 'hono/jsx'

// A shared, site-wide click handler (registered once in Layout) reads
// whatever text is currently inside `pre code` at click time — so this
// works identically for static docs examples and for the generator pages'
// dynamically-populated preview panels, with no per-instance script.
export const CodeBlock: FC<{ content?: string; filename?: string; codeId?: string }> = ({
  content,
  filename = 'data.txt',
  codeId,
}) => (
  <div class="code-block">
    <pre>
      <code id={codeId}>{content}</code>
    </pre>
    <div class="code-toolbar">
      <button type="button" class="code-btn" data-action="copy" aria-label="Copy to clipboard" title="Copy">
        <svg class="icon-copy" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="12" height="12" rx="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
        <svg class="icon-check" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </button>
      <button type="button" class="code-btn" data-action="download" data-filename={filename} aria-label="Download" title="Download">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </button>
    </div>
  </div>
)
