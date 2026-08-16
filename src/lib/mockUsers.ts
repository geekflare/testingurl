export interface MockUser {
  id: number
  name: string
  email: string
  phone: string
  country: string
  dob: string
}

const FIRST_NAMES = [
  'Olivia', 'Liam', 'Emma', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'Lucas',
  'Mia', 'Elijah', 'Amelia', 'James', 'Harper', 'Benjamin', 'Evelyn', 'Henry', 'Abigail', 'Alexander',
  'Ella', 'Sebastian', 'Scarlett', 'Jack', 'Grace', 'Owen', 'Chloe', 'Daniel', 'Victoria', 'Matthew',
]
const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
]
const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'India', 'Japan',
  'Brazil', 'South Africa', 'Mexico', 'Netherlands', 'Sweden', 'Ireland', 'Singapore',
]
const EMAIL_DOMAINS = ['example.com', 'mail.com', 'testmail.dev', 'inbox.test']

const USERS_COUNT = 50

// Deterministic, seed-free "fake" user directory: same shape and same
// values on every request, so responses are safe to assert on in tests.
function buildUsers(): MockUser[] {
  const users: MockUser[] = []
  for (let id = 1; id <= USERS_COUNT; id++) {
    const first = FIRST_NAMES[(id * 3) % FIRST_NAMES.length]
    const last = LAST_NAMES[(id * 7) % LAST_NAMES.length]
    const domain = EMAIL_DOMAINS[id % EMAIL_DOMAINS.length]
    const email = `${first}.${last}${id}@${domain}`.toLowerCase()
    const areaCode = 200 + ((id * 13) % 700)
    const exchange = 100 + ((id * 29) % 900)
    const lineNum = 1000 + ((id * 53) % 9000)
    const phone = `(${areaCode}) ${exchange}-${lineNum}`
    const country = COUNTRIES[(id * 5) % COUNTRIES.length]
    const year = 1970 + ((id * 3) % 45)
    const month = 1 + (id % 12)
    const day = 1 + ((id * 7) % 28)
    const dob = new Date(Date.UTC(year, month - 1, day)).toISOString().slice(0, 10)
    users.push({ id, name: `${first} ${last}`, email, phone, country, dob })
  }
  return users
}

export const MOCK_USERS: MockUser[] = buildUsers()

export function findMockUser(id: number): MockUser | undefined {
  return MOCK_USERS.find((u) => u.id === id)
}
