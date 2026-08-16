import { MOCK_USERS } from './mockUsers'

export interface MockPost {
  id: number
  userId: number
  title: string
  body: string
}

export interface MockComment {
  id: number
  postId: number
  name: string
  email: string
  body: string
}

export interface MockAlbum {
  id: number
  userId: number
  title: string
}

export interface MockPhoto {
  id: number
  albumId: number
  title: string
}

export interface MockTodo {
  id: number
  userId: number
  title: string
  completed: boolean
}

const POST_TOPICS = [
  'A guide to caching strategies',
  'Notes on API versioning',
  'Why deterministic test data matters',
  'Debugging flaky integration tests',
  'A short history of REST',
  'On pagination design',
  'Thoughts about rate limiting',
  'Structuring a monorepo',
  'Writing better error messages',
  'Reviewing pull requests faster',
]
const POST_BODY_SENTENCES = [
  'It started as a small experiment and grew from there.',
  'The tradeoffs only became obvious after shipping.',
  'Most of the complexity was accidental, not essential.',
  'A simpler approach turned out to work just as well.',
  'The team disagreed at first, then converged on a shared approach.',
]

const COMMENTER_FIRST = ['Priya', 'Marcus', 'Aiko', 'Diego', 'Fatima', 'Lars', 'Noor', 'Tomas']
const COMMENTER_LAST = ['Shah', 'Ito', 'Silva', 'Kowalski', 'Haddad', 'Berg', 'Ali', 'Novak']
const COMMENT_SENTENCES = [
  'This matches what we saw in production too.',
  'Curious how this holds up at larger scale.',
  'Would love a follow-up on the edge cases.',
  'Solid write-up, bookmarking this.',
  'We tried something similar and hit a different bottleneck.',
]

const ALBUM_THEMES = [
  'Conference talks', 'Team offsite', 'Product screenshots', 'Whiteboard sketches', 'Office plants',
  'Desk setups', 'Release parties', 'Architecture diagrams', 'Onboarding photos', 'Hackathon demos',
]

const TODO_TASKS = [
  'Write tests for the new endpoint',
  'Reply to the open PR comments',
  'Update the changelog',
  'Rotate the staging API key',
  'Triage the bug backlog',
  'Draft the release notes',
  'Pair on the flaky test',
  'Clean up unused feature flags',
]

const POSTS_COUNT = 30
const COMMENTS_PER_POST = 3
const ALBUMS_COUNT = 20
const PHOTOS_PER_ALBUM = 3
const TODOS_COUNT = 40

function buildPosts(): MockPost[] {
  const posts: MockPost[] = []
  for (let id = 1; id <= POSTS_COUNT; id++) {
    const userId = ((id * 7) % MOCK_USERS.length) + 1
    const title = POST_TOPICS[(id - 1) % POST_TOPICS.length]
    const body = POST_BODY_SENTENCES[(id * 3) % POST_BODY_SENTENCES.length]
    posts.push({ id, userId, title, body })
  }
  return posts
}

export const MOCK_POSTS: MockPost[] = buildPosts()

function buildComments(): MockComment[] {
  const comments: MockComment[] = []
  let id = 1
  for (const post of MOCK_POSTS) {
    for (let i = 0; i < COMMENTS_PER_POST; i++) {
      const first = COMMENTER_FIRST[(id + i) % COMMENTER_FIRST.length]
      const last = COMMENTER_LAST[(id * 2 + i) % COMMENTER_LAST.length]
      comments.push({
        id,
        postId: post.id,
        name: `${first} ${last}`,
        email: `${first}.${last}@example.com`.toLowerCase(),
        body: COMMENT_SENTENCES[(id + i) % COMMENT_SENTENCES.length],
      })
      id++
    }
  }
  return comments
}

export const MOCK_COMMENTS: MockComment[] = buildComments()

function buildAlbums(): MockAlbum[] {
  const albums: MockAlbum[] = []
  for (let id = 1; id <= ALBUMS_COUNT; id++) {
    const userId = ((id * 11) % MOCK_USERS.length) + 1
    const title = ALBUM_THEMES[(id - 1) % ALBUM_THEMES.length]
    albums.push({ id, userId, title })
  }
  return albums
}

export const MOCK_ALBUMS: MockAlbum[] = buildAlbums()

function buildPhotos(): MockPhoto[] {
  const photos: MockPhoto[] = []
  let id = 1
  for (const album of MOCK_ALBUMS) {
    for (let i = 1; i <= PHOTOS_PER_ALBUM; i++) {
      photos.push({ id, albumId: album.id, title: `${album.title} #${i}` })
      id++
    }
  }
  return photos
}

export const MOCK_PHOTOS: MockPhoto[] = buildPhotos()

function buildTodos(): MockTodo[] {
  const todos: MockTodo[] = []
  for (let id = 1; id <= TODOS_COUNT; id++) {
    const userId = ((id * 9) % MOCK_USERS.length) + 1
    const title = TODO_TASKS[(id - 1) % TODO_TASKS.length]
    todos.push({ id, userId, title, completed: id % 3 === 0 })
  }
  return todos
}

export const MOCK_TODOS: MockTodo[] = buildTodos()

export function findPost(id: number) {
  return MOCK_POSTS.find((p) => p.id === id)
}
export function findComment(id: number) {
  return MOCK_COMMENTS.find((c) => c.id === id)
}
export function findAlbum(id: number) {
  return MOCK_ALBUMS.find((a) => a.id === id)
}
export function findPhoto(id: number) {
  return MOCK_PHOTOS.find((p) => p.id === id)
}
export function findTodo(id: number) {
  return MOCK_TODOS.find((t) => t.id === id)
}
