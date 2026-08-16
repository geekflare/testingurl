// A hand-authored OpenAPI 3.0 document covering every JSON-returning
// endpoint on the site (Mock Data, HTTP & Networking, Generators). The
// HTML test pages under /scraping aren't included: they're scrape
// targets, not an API contract, so an OpenAPI operation wouldn't make
// sense for them. Served as JSON at /openapi.json.

const notPersisted = (verb: string) => ({
  type: 'object',
  description: `Echoes the submitted fields back (plus a generated id where relevant) with a "note" field explaining nothing was actually ${verb}. This mock API never persists writes between requests.`,
  additionalProperties: true,
  properties: { note: { type: 'string' } },
})

const idParam = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'integer' },
}
const pageParam = { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } }
const limitParam = { name: 'limit', in: 'query', schema: { type: 'integer', default: 10, maximum: 50 } }

const errorResponse = {
  description: 'Not found',
  content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
}

export const OPENAPI_SPEC = {
  openapi: '3.0.3',
  info: {
    title: 'TestingURL.dev API',
    description:
      'Every JSON endpoint on testingurl.dev: deterministic Mock Data fixtures, HTTP & Networking endpoints, and non-deterministic Generators. No authentication required anywhere except the endpoints that are specifically testing authentication.',
    version: '1.0.0',
    contact: { url: 'https://testingurl.dev/contact' },
    license: { name: 'MIT' },
  },
  servers: [{ url: 'https://testingurl.dev' }],
  // No auth required anywhere by default; the two auth-testing operations
  // override this with their own `security` array.
  security: [],
  tags: [
    { name: 'Mock Data: Users' },
    { name: 'Mock Data: Posts & Comments' },
    { name: 'Mock Data: Albums & Photos' },
    { name: 'Mock Data: Todos' },
    { name: 'HTTP: Status & Redirects' },
    { name: 'HTTP: Headers & Cookies' },
    { name: 'HTTP: Authentication' },
    { name: 'HTTP: Caching' },
    { name: 'HTTP: Streaming & Content Negotiation' },
    { name: 'Generators' },
  ],
  paths: {
    // --- Mock Data: Users --------------------------------------------------
    '/mock-data/users': {
      get: {
        tags: ['Mock Data: Users'],
        summary: 'List users',
        parameters: [
          pageParam,
          limitParam,
          { name: 'country', in: 'query', schema: { type: 'string' }, description: 'Exact match, case-insensitive.' },
        ],
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/UserListResponse' } } } } },
      },
      post: {
        tags: ['Mock Data: Users'],
        summary: 'Fake create a user',
        requestBody: { content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { '201': { description: 'Created (not persisted)', content: { 'application/json': { schema: notPersisted('created') } } } },
      },
    },
    '/mock-data/users/{id}': {
      get: {
        tags: ['Mock Data: Users'],
        summary: 'Get a user',
        parameters: [idParam],
        responses: {
          '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
          '404': errorResponse,
        },
      },
      put: {
        tags: ['Mock Data: Users'],
        summary: 'Fake update a user (full)',
        parameters: [idParam],
        requestBody: { content: { 'application/json': { schema: { type: 'object' } } } },
        responses: {
          '200': { description: 'OK (not persisted)', content: { 'application/json': { schema: notPersisted('saved') } } },
          '404': errorResponse,
        },
      },
      patch: {
        tags: ['Mock Data: Users'],
        summary: 'Fake update a user (partial)',
        parameters: [idParam],
        requestBody: { content: { 'application/json': { schema: { type: 'object' } } } },
        responses: {
          '200': { description: 'OK (not persisted)', content: { 'application/json': { schema: notPersisted('saved') } } },
          '404': errorResponse,
        },
      },
      delete: {
        tags: ['Mock Data: Users'],
        summary: 'Fake delete a user',
        parameters: [idParam],
        responses: {
          '200': { description: 'OK (not persisted)', content: { 'application/json': { schema: notPersisted('deleted') } } },
          '404': errorResponse,
        },
      },
    },
    '/mock-data/users/{id}/avatar.svg': {
      get: {
        tags: ['Mock Data: Users'],
        summary: 'Deterministic per-user initials avatar',
        parameters: [idParam],
        responses: { '200': { description: 'OK', content: { 'image/svg+xml': {} } } },
      },
    },

    // --- Mock Data: Posts & Comments -----------------------------------------
    '/mock-data/posts': {
      get: {
        tags: ['Mock Data: Posts & Comments'],
        summary: 'List posts',
        parameters: [pageParam, limitParam, { name: 'userId', in: 'query', schema: { type: 'integer' } }],
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/PostListResponse' } } } } },
      },
      post: {
        tags: ['Mock Data: Posts & Comments'],
        summary: 'Fake create a post',
        requestBody: { content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { '201': { description: 'Created (not persisted)', content: { 'application/json': { schema: notPersisted('created') } } } },
      },
    },
    '/mock-data/posts/{id}': {
      get: {
        tags: ['Mock Data: Posts & Comments'],
        summary: 'Get a post',
        parameters: [idParam],
        responses: {
          '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } } },
          '404': errorResponse,
        },
      },
      put: {
        tags: ['Mock Data: Posts & Comments'],
        summary: 'Fake update a post (full)',
        parameters: [idParam],
        requestBody: { content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { '200': { description: 'OK (not persisted)', content: { 'application/json': { schema: notPersisted('saved') } } }, '404': errorResponse },
      },
      patch: {
        tags: ['Mock Data: Posts & Comments'],
        summary: 'Fake update a post (partial)',
        parameters: [idParam],
        requestBody: { content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { '200': { description: 'OK (not persisted)', content: { 'application/json': { schema: notPersisted('saved') } } }, '404': errorResponse },
      },
      delete: {
        tags: ['Mock Data: Posts & Comments'],
        summary: 'Fake delete a post',
        parameters: [idParam],
        responses: { '200': { description: 'OK (not persisted)', content: { 'application/json': { schema: notPersisted('deleted') } } }, '404': errorResponse },
      },
    },
    '/mock-data/posts/{id}/comments': {
      get: {
        tags: ['Mock Data: Posts & Comments'],
        summary: 'List comments on a post',
        parameters: [idParam],
        responses: {
          '200': { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Comment' } } } } },
          '404': errorResponse,
        },
      },
    },
    '/mock-data/comments': {
      get: {
        tags: ['Mock Data: Posts & Comments'],
        summary: 'List comments',
        parameters: [pageParam, limitParam, { name: 'postId', in: 'query', schema: { type: 'integer' } }],
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/CommentListResponse' } } } } },
      },
      post: {
        tags: ['Mock Data: Posts & Comments'],
        summary: 'Fake create a comment',
        requestBody: { content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { '201': { description: 'Created (not persisted)', content: { 'application/json': { schema: notPersisted('created') } } } },
      },
    },
    '/mock-data/comments/{id}': {
      get: {
        tags: ['Mock Data: Posts & Comments'],
        summary: 'Get a comment',
        parameters: [idParam],
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Comment' } } } }, '404': errorResponse },
      },
      put: {
        tags: ['Mock Data: Posts & Comments'],
        summary: 'Fake update a comment (full)',
        parameters: [idParam],
        requestBody: { content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { '200': { description: 'OK (not persisted)', content: { 'application/json': { schema: notPersisted('saved') } } }, '404': errorResponse },
      },
      patch: {
        tags: ['Mock Data: Posts & Comments'],
        summary: 'Fake update a comment (partial)',
        parameters: [idParam],
        requestBody: { content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { '200': { description: 'OK (not persisted)', content: { 'application/json': { schema: notPersisted('saved') } } }, '404': errorResponse },
      },
      delete: {
        tags: ['Mock Data: Posts & Comments'],
        summary: 'Fake delete a comment',
        parameters: [idParam],
        responses: { '200': { description: 'OK (not persisted)', content: { 'application/json': { schema: notPersisted('deleted') } } }, '404': errorResponse },
      },
    },

    // --- Mock Data: Albums & Photos -------------------------------------------
    '/mock-data/albums': {
      get: {
        tags: ['Mock Data: Albums & Photos'],
        summary: 'List albums',
        parameters: [pageParam, limitParam, { name: 'userId', in: 'query', schema: { type: 'integer' } }],
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/AlbumListResponse' } } } } },
      },
      post: {
        tags: ['Mock Data: Albums & Photos'],
        summary: 'Fake create an album',
        requestBody: { content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { '201': { description: 'Created (not persisted)', content: { 'application/json': { schema: notPersisted('created') } } } },
      },
    },
    '/mock-data/albums/{id}': {
      get: {
        tags: ['Mock Data: Albums & Photos'],
        summary: 'Get an album',
        parameters: [idParam],
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Album' } } } }, '404': errorResponse },
      },
      put: {
        tags: ['Mock Data: Albums & Photos'],
        summary: 'Fake update an album (full)',
        parameters: [idParam],
        requestBody: { content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { '200': { description: 'OK (not persisted)', content: { 'application/json': { schema: notPersisted('saved') } } }, '404': errorResponse },
      },
      patch: {
        tags: ['Mock Data: Albums & Photos'],
        summary: 'Fake update an album (partial)',
        parameters: [idParam],
        requestBody: { content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { '200': { description: 'OK (not persisted)', content: { 'application/json': { schema: notPersisted('saved') } } }, '404': errorResponse },
      },
      delete: {
        tags: ['Mock Data: Albums & Photos'],
        summary: 'Fake delete an album',
        parameters: [idParam],
        responses: { '200': { description: 'OK (not persisted)', content: { 'application/json': { schema: notPersisted('deleted') } } }, '404': errorResponse },
      },
    },
    '/mock-data/albums/{id}/photos': {
      get: {
        tags: ['Mock Data: Albums & Photos'],
        summary: 'List photos in an album',
        parameters: [idParam],
        responses: {
          '200': { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Photo' } } } } },
          '404': errorResponse,
        },
      },
    },
    '/mock-data/photos': {
      get: {
        tags: ['Mock Data: Albums & Photos'],
        summary: 'List photos',
        parameters: [pageParam, limitParam, { name: 'albumId', in: 'query', schema: { type: 'integer' } }],
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/PhotoListResponse' } } } } },
      },
      post: {
        tags: ['Mock Data: Albums & Photos'],
        summary: 'Fake create a photo',
        requestBody: { content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { '201': { description: 'Created (not persisted)', content: { 'application/json': { schema: notPersisted('created') } } } },
      },
    },
    '/mock-data/photos/{id}': {
      get: {
        tags: ['Mock Data: Albums & Photos'],
        summary: 'Get a photo',
        parameters: [idParam],
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Photo' } } } }, '404': errorResponse },
      },
      put: {
        tags: ['Mock Data: Albums & Photos'],
        summary: 'Fake update a photo (full)',
        parameters: [idParam],
        requestBody: { content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { '200': { description: 'OK (not persisted)', content: { 'application/json': { schema: notPersisted('saved') } } }, '404': errorResponse },
      },
      patch: {
        tags: ['Mock Data: Albums & Photos'],
        summary: 'Fake update a photo (partial)',
        parameters: [idParam],
        requestBody: { content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { '200': { description: 'OK (not persisted)', content: { 'application/json': { schema: notPersisted('saved') } } }, '404': errorResponse },
      },
      delete: {
        tags: ['Mock Data: Albums & Photos'],
        summary: 'Fake delete a photo',
        parameters: [idParam],
        responses: { '200': { description: 'OK (not persisted)', content: { 'application/json': { schema: notPersisted('deleted') } } }, '404': errorResponse },
      },
    },
    '/mock-data/photos/{id}/image.svg': {
      get: {
        tags: ['Mock Data: Albums & Photos'],
        summary: 'Deterministic per-photo generated image',
        parameters: [idParam, { name: 'size', in: 'query', schema: { type: 'string', enum: ['thumb'] }, description: '80px square if "thumb", otherwise 400px.' }],
        responses: { '200': { description: 'OK', content: { 'image/svg+xml': {} } } },
      },
    },

    // --- Mock Data: Todos ------------------------------------------------------
    '/mock-data/todos': {
      get: {
        tags: ['Mock Data: Todos'],
        summary: 'List todos',
        parameters: [pageParam, limitParam, { name: 'userId', in: 'query', schema: { type: 'integer' } }, { name: 'completed', in: 'query', schema: { type: 'boolean' } }],
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/TodoListResponse' } } } } },
      },
      post: {
        tags: ['Mock Data: Todos'],
        summary: 'Fake create a todo',
        requestBody: { content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { '201': { description: 'Created (not persisted)', content: { 'application/json': { schema: notPersisted('created') } } } },
      },
    },
    '/mock-data/todos/{id}': {
      get: {
        tags: ['Mock Data: Todos'],
        summary: 'Get a todo',
        parameters: [idParam],
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Todo' } } } }, '404': errorResponse },
      },
      put: {
        tags: ['Mock Data: Todos'],
        summary: 'Fake update a todo (full)',
        parameters: [idParam],
        requestBody: { content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { '200': { description: 'OK (not persisted)', content: { 'application/json': { schema: notPersisted('saved') } } }, '404': errorResponse },
      },
      patch: {
        tags: ['Mock Data: Todos'],
        summary: 'Fake update a todo (partial)',
        parameters: [idParam],
        requestBody: { content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { '200': { description: 'OK (not persisted)', content: { 'application/json': { schema: notPersisted('saved') } } }, '404': errorResponse },
      },
      delete: {
        tags: ['Mock Data: Todos'],
        summary: 'Fake delete a todo',
        parameters: [idParam],
        responses: { '200': { description: 'OK (not persisted)', content: { 'application/json': { schema: notPersisted('deleted') } } }, '404': errorResponse },
      },
    },

    // --- HTTP: Status & Redirects ------------------------------------------
    '/http/status/{code}': {
      get: {
        tags: ['HTTP: Status & Redirects'],
        summary: 'Echo an HTTP status code',
        description: 'Responds with the HTTP status given in the path (not always 200) and a matching JSON body.',
        parameters: [{ name: 'code', in: 'path', required: true, schema: { type: 'integer' }, example: 404 }],
        responses: { default: { description: 'Status matches the {code} path parameter', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'integer' } } } } } } },
      },
    },
    '/http/redirect/{n}': {
      get: {
        tags: ['HTTP: Status & Redirects'],
        summary: 'Follow a chain of N redirects',
        parameters: [{ name: 'n', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '302': { description: 'Redirects to /http/redirect/{n-1}' },
          '200': { description: 'Landed (n reached 0)', content: { 'application/json': { schema: { type: 'object', properties: { landed: { type: 'boolean' } } } } } },
        },
      },
    },
    '/http/redirect-to': {
      get: {
        tags: ['HTTP: Status & Redirects'],
        summary: 'Redirect to an arbitrary http(s) URL',
        parameters: [
          { name: 'url', in: 'query', required: true, schema: { type: 'string' } },
          { name: 'status_code', in: 'query', schema: { type: 'integer', enum: [301, 302, 303, 307, 308], default: 302 } },
        ],
        responses: {
          '302': { description: 'Redirects to the given url (or the requested status_code)' },
          '400': { description: 'Missing/invalid url, or a non-http(s) protocol', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/http/delay/{seconds}': {
      get: {
        tags: ['HTTP: Status & Redirects'],
        summary: 'Delay the response',
        parameters: [{ name: 'seconds', in: 'path', required: true, schema: { type: 'integer', maximum: 10 } }],
        responses: { '200': { description: 'OK, after the delay', content: { 'application/json': { schema: { type: 'object', properties: { delayed_seconds: { type: 'integer' } } } } } } },
      },
    },

    // --- HTTP: Headers & Cookies --------------------------------------------
    '/http/headers': {
      get: {
        tags: ['HTTP: Headers & Cookies'],
        summary: 'Echo request headers',
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { type: 'object', properties: { headers: { type: 'object', additionalProperties: { type: 'string' } } } } } } } },
      },
    },
    '/http/anything': {
      get: { tags: ['HTTP: Headers & Cookies'], summary: 'Echo the request (any method works, incl. sub-paths)', responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/AnythingResponse' } } } } } },
      post: { tags: ['HTTP: Headers & Cookies'], summary: 'Echo the request, including the body', requestBody: { content: { 'application/json': { schema: { type: 'object' } }, 'text/plain': { schema: { type: 'string' } } } }, responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/AnythingResponse' } } } } } },
    },
    '/http/response-headers': {
      get: {
        tags: ['HTTP: Headers & Cookies'],
        summary: 'Every query param becomes a real response header',
        description: 'e.g. ?X-Test=hello sends back an X-Test: hello response header, and echoes it in the JSON body too.',
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { type: 'object', additionalProperties: { type: 'string' } } } } } },
      },
    },
    '/http/ip': {
      get: {
        tags: ['HTTP: Headers & Cookies'],
        summary: 'Your connecting IP',
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { type: 'object', properties: { origin: { type: 'string' } } } } } } },
      },
    },
    '/http/cookies/set': {
      get: {
        tags: ['HTTP: Headers & Cookies'],
        summary: 'Set a cookie, then redirect to /http/cookies/get',
        parameters: [{ name: 'name', in: 'query', schema: { type: 'string' } }, { name: 'value', in: 'query', schema: { type: 'string' } }],
        responses: { '302': { description: 'Redirects to /http/cookies/get' } },
      },
    },
    '/http/cookies/get': {
      get: {
        tags: ['HTTP: Headers & Cookies'],
        summary: 'Get current cookies',
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { type: 'object', properties: { cookies: { type: 'object', additionalProperties: { type: 'string' } } } } } } } },
      },
    },

    // --- HTTP: Authentication ------------------------------------------------
    '/http/auth/basic': {
      get: {
        tags: ['HTTP: Authentication'],
        summary: 'HTTP Basic Auth (user: demo / pass: demo)',
        security: [{ basicAuth: [] }],
        responses: {
          '200': { description: 'Authenticated', content: { 'application/json': { schema: { type: 'object', properties: { authenticated: { type: 'boolean' }, user: { type: 'string' } } } } } },
          '401': { description: 'Missing/wrong credentials', content: { 'application/json': { schema: { type: 'object', properties: { authenticated: { type: 'boolean' } } } } } },
        },
      },
    },
    '/http/auth/bearer': {
      get: {
        tags: ['HTTP: Authentication'],
        summary: 'Bearer token auth (token: demo-token)',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Authenticated', content: { 'application/json': { schema: { type: 'object', properties: { authenticated: { type: 'boolean' }, token: { type: 'string' } } } } } },
          '401': { description: 'Missing/wrong token', content: { 'application/json': { schema: { type: 'object', properties: { authenticated: { type: 'boolean' } } } } } },
        },
      },
    },
    '/http/user-agent': {
      get: {
        tags: ['HTTP: Authentication'],
        summary: 'Header-spoofing check — 403 unless the User-Agent looks like a real browser',
        responses: {
          '200': { description: 'User-Agent passed', content: { 'application/json': { schema: { type: 'object', properties: { blocked: { type: 'boolean' }, message: { type: 'string' }, yourUserAgent: { type: 'string' } } } } } },
          '403': { description: 'Blocked', content: { 'application/json': { schema: { type: 'object', properties: { blocked: { type: 'boolean' }, reason: { type: 'string' }, yourUserAgent: { type: 'string', nullable: true } } } } } },
        },
      },
    },
    '/http/rate-limit': {
      get: {
        tags: ['HTTP: Authentication'],
        summary: 'Rate limited to 5 requests per 60s per client',
        responses: {
          '200': { description: 'OK', content: { 'application/json': { schema: { type: 'object', properties: { ok: { type: 'boolean' }, requests_used: { type: 'integer' }, limit: { type: 'integer' }, window_seconds: { type: 'integer' } } } } } },
          '429': { description: 'Rate limited', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' }, limit: { type: 'integer' }, window_seconds: { type: 'integer' } } } } } },
          '501': { description: 'No KV namespace bound in this environment', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/http/gzip': {
      get: {
        tags: ['HTTP: Authentication'],
        summary: 'A response the edge compresses transparently when Accept-Encoding allows it',
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { type: 'object', properties: { note: { type: 'string' }, padding: { type: 'string' } } } } } } },
      },
    },

    // --- HTTP: Caching ---------------------------------------------------------
    '/http/cache': {
      get: {
        tags: ['HTTP: Caching'],
        summary: 'Conditional GET round-trip',
        description: 'Send If-Modified-Since or If-None-Match on a second request to get a 304 with no body.',
        responses: {
          '200': { description: 'OK, with ETag/Last-Modified headers set', content: { 'application/json': { schema: { type: 'object', properties: { cached: { type: 'boolean' }, lastModified: { type: 'string' }, etag: { type: 'string' } } } } } },
          '304': { description: 'Not Modified' },
        },
      },
    },
    '/http/etag/{etag}': {
      get: {
        tags: ['HTTP: Caching'],
        summary: 'ETag round-trip',
        description: 'Send the same value back via If-None-Match to get a 304.',
        parameters: [{ name: 'etag', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'OK', content: { 'application/json': { schema: { type: 'object', properties: { etag: { type: 'string' } } } } } },
          '304': { description: 'Not Modified' },
        },
      },
    },

    // --- HTTP: Streaming & Content Negotiation --------------------------------
    '/http/stream/{n}': {
      get: {
        tags: ['HTTP: Streaming & Content Negotiation'],
        summary: 'Stream N newline-delimited JSON lines',
        parameters: [{ name: 'n', in: 'path', required: true, schema: { type: 'integer', maximum: 100 } }],
        responses: { '200': { description: 'OK', content: { 'application/x-ndjson': { schema: { type: 'string' } } } } },
      },
    },
    '/http/range/{n}': {
      get: {
        tags: ['HTTP: Streaming & Content Negotiation'],
        summary: 'N bytes of content, supporting byte-range requests',
        parameters: [{ name: 'n', in: 'path', required: true, schema: { type: 'integer', maximum: 10000 } }],
        responses: {
          '200': { description: 'Full content', content: { 'text/plain': { schema: { type: 'string' } } } },
          '206': { description: 'Partial content (when a Range header is sent)', content: { 'text/plain': { schema: { type: 'string' } } } },
          '416': { description: 'Range not satisfiable' },
        },
      },
    },
    '/http/image': {
      get: {
        tags: ['HTTP: Streaming & Content Negotiation'],
        summary: 'Accept-negotiated image (svg+xml or png)',
        parameters: [{ name: 'Accept', in: 'header', schema: { type: 'string' }, description: 'image/png returns a real PNG; anything else falls back to SVG.' }],
        responses: { '200': { description: 'OK', content: { 'image/svg+xml': {}, 'image/png': {} } } },
      },
    },

    // --- Generators --------------------------------------------------------
    '/generator/users/api': {
      get: {
        tags: ['Generators'],
        summary: 'Generate fresh fake users',
        parameters: [
          { name: 'count', in: 'query', schema: { type: 'integer', default: 5, maximum: 100 } },
          { name: 'format', in: 'query', schema: { type: 'string', enum: ['json', 'csv'], default: 'json' } },
        ],
        responses: {
          '200': {
            description: 'OK: a new, random result every call',
            content: {
              'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/GeneratedUser' } } },
              'text/csv': { schema: { type: 'string' } },
            },
          },
        },
      },
    },
    '/generator/cards/api': {
      get: {
        tags: ['Generators'],
        summary: 'Generate synthetic Luhn-valid test card numbers',
        parameters: [
          { name: 'count', in: 'query', schema: { type: 'integer', default: 5, maximum: 50 } },
          { name: 'network', in: 'query', schema: { type: 'string', enum: ['visa', 'mastercard', 'amex', 'discover'] } },
          { name: 'format', in: 'query', schema: { type: 'string', enum: ['json', 'csv'], default: 'json' } },
        ],
        responses: {
          '200': {
            description: 'OK, with a different random result each call. Not real cards.',
            content: {
              'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/GeneratedCard' } } },
              'text/csv': { schema: { type: 'string' } },
            },
          },
        },
      },
    },
    '/generator/files/api': {
      get: {
        tags: ['Generators'],
        summary: 'Generate a dummy file of a given type and size',
        parameters: [
          { name: 'type', in: 'query', schema: { type: 'string', enum: ['txt', 'csv', 'json', 'bin'], default: 'txt' } },
          { name: 'sizeKb', in: 'query', schema: { type: 'integer', default: 10, maximum: 5120 } },
        ],
        responses: { '200': { description: 'OK, as a file download (Content-Disposition: attachment)', content: { 'application/octet-stream': {} } } },
      },
    },
    '/generator/images/{width}/{height}': {
      get: {
        tags: ['Generators'],
        summary: 'A placeholder image at the given dimensions',
        description: 'Deterministic per width/height, unlike the other generators: the same URL always returns the same image.',
        parameters: [
          { name: 'width', in: 'path', required: true, schema: { type: 'integer', maximum: 4000 } },
          { name: 'height', in: 'path', required: true, schema: { type: 'integer', maximum: 4000 } },
        ],
        responses: { '200': { description: 'OK', content: { 'image/svg+xml': {} } } },
      },
    },
  },
  components: {
    securitySchemes: {
      basicAuth: { type: 'http', scheme: 'basic' },
      bearerAuth: { type: 'http', scheme: 'bearer' },
    },
    schemas: {
      Error: { type: 'object', properties: { error: { type: 'string' } } },
      AnythingResponse: {
        type: 'object',
        properties: {
          method: { type: 'string' },
          url: { type: 'string' },
          headers: { type: 'object', additionalProperties: { type: 'string' } },
          query: { type: 'object', additionalProperties: { type: 'string' } },
          body: { description: 'Parsed JSON if Content-Type was application/json, raw text otherwise. null for GET/HEAD or an empty body.' },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          country: { type: 'string' },
          dob: { type: 'string', format: 'date' },
          avatarUrl: { type: 'string' },
        },
      },
      UserListResponse: {
        type: 'object',
        properties: { page: { type: 'integer' }, limit: { type: 'integer' }, total: { type: 'integer' }, items: { type: 'array', items: { $ref: '#/components/schemas/User' } } },
      },
      Post: {
        type: 'object',
        properties: { id: { type: 'integer' }, userId: { type: 'integer' }, title: { type: 'string' }, body: { type: 'string' } },
      },
      PostListResponse: {
        type: 'object',
        properties: { page: { type: 'integer' }, limit: { type: 'integer' }, total: { type: 'integer' }, items: { type: 'array', items: { $ref: '#/components/schemas/Post' } } },
      },
      Comment: {
        type: 'object',
        properties: { id: { type: 'integer' }, postId: { type: 'integer' }, name: { type: 'string' }, email: { type: 'string' }, body: { type: 'string' } },
      },
      CommentListResponse: {
        type: 'object',
        properties: { page: { type: 'integer' }, limit: { type: 'integer' }, total: { type: 'integer' }, items: { type: 'array', items: { $ref: '#/components/schemas/Comment' } } },
      },
      Album: {
        type: 'object',
        properties: { id: { type: 'integer' }, userId: { type: 'integer' }, title: { type: 'string' } },
      },
      AlbumListResponse: {
        type: 'object',
        properties: { page: { type: 'integer' }, limit: { type: 'integer' }, total: { type: 'integer' }, items: { type: 'array', items: { $ref: '#/components/schemas/Album' } } },
      },
      Photo: {
        type: 'object',
        properties: { id: { type: 'integer' }, albumId: { type: 'integer' }, title: { type: 'string' }, url: { type: 'string' }, thumbnailUrl: { type: 'string' } },
      },
      PhotoListResponse: {
        type: 'object',
        properties: { page: { type: 'integer' }, limit: { type: 'integer' }, total: { type: 'integer' }, items: { type: 'array', items: { $ref: '#/components/schemas/Photo' } } },
      },
      Todo: {
        type: 'object',
        properties: { id: { type: 'integer' }, userId: { type: 'integer' }, title: { type: 'string' }, completed: { type: 'boolean' } },
      },
      TodoListResponse: {
        type: 'object',
        properties: { page: { type: 'integer' }, limit: { type: 'integer' }, total: { type: 'integer' }, items: { type: 'array', items: { $ref: '#/components/schemas/Todo' } } },
      },
      GeneratedUser: {
        type: 'object',
        description: 'Fresh and random on every call, unlike the deterministic Mock Data User schema.',
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          fullName: { type: 'string' },
          email: { type: 'string' },
          username: { type: 'string' },
          password: { type: 'string' },
          phone: { type: 'string' },
          street: { type: 'string' },
          city: { type: 'string' },
          region: { type: 'string' },
          postalCode: { type: 'string' },
          country: { type: 'string' },
          dob: { type: 'string', format: 'date' },
          avatarSeed: { type: 'string' },
          avatarUrl: { type: 'string' },
        },
      },
      GeneratedCard: {
        type: 'object',
        description: 'Synthetic and Luhn-valid, for testing payment-form validation only. Not a real card.',
        properties: {
          network: { type: 'string' },
          number: { type: 'string' },
          formattedNumber: { type: 'string' },
          cardholder: { type: 'string' },
          expiryMonth: { type: 'string' },
          expiryYear: { type: 'string' },
          cvv: { type: 'string' },
        },
      },
    },
  },
}

// Derives a unique, readable operationId from each (method, path) pair
// instead of hand-writing ~60 of them. For example, GET /mock-data/users/{id}
// becomes "getMockDataUsersId".
function toOperationId(method: string, path: string): string {
  const pascal = path
    .replace(/[{}]/g, '')
    .split(/[/\-.]/)
    .filter(Boolean)
    .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
    .join('')
  return method.toLowerCase() + pascal
}

for (const [path, methods] of Object.entries(OPENAPI_SPEC.paths)) {
  for (const [method, operation] of Object.entries(methods as Record<string, { operationId?: string }>)) {
    operation.operationId = toOperationId(method, path)
  }
}
