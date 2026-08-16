// Unlike the deterministic Mock Data fixtures, everything in this module is
// intentionally randomized: a "generator" is supposed to give you fresh
// values every time you ask.

const FIRST_NAMES = [
  'Olivia', 'Liam', 'Emma', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'Lucas',
  'Mia', 'Elijah', 'Amelia', 'James', 'Harper', 'Benjamin', 'Evelyn', 'Henry', 'Abigail', 'Alexander',
  'Ella', 'Sebastian', 'Scarlett', 'Jack', 'Grace', 'Owen', 'Chloe', 'Daniel', 'Victoria', 'Matthew',
  'Priya', 'Marcus', 'Aiko', 'Diego', 'Fatima', 'Lars', 'Noor', 'Tomas', 'Yuki', 'Zainab',
]
const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
]
const STREET_NAMES = [
  'Maple St', 'Oak Ave', 'Elm Rd', '2nd St', 'Sunset Blvd', 'Park Ave', 'Cedar Ln', 'Highland Dr', 'River Rd', 'Lake St',
]
const CITIES = ['Springfield', 'Riverside', 'Fairview', 'Georgetown', 'Madison', 'Franklin', 'Clinton', 'Salem', 'Ashland', 'Greenville']
const REGIONS = ['North', 'South', 'East', 'West', 'Central']
const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'India', 'Japan',
  'Brazil', 'South Africa', 'Mexico', 'Netherlands', 'Sweden', 'Ireland', 'Singapore',
]
const EMAIL_DOMAINS = ['example.com', 'mail.test', 'inbox.test', 'sample.dev']
const PASSWORD_WORDS = ['Swift', 'Bold', 'Quiet', 'Rapid', 'Sunny', 'Amber', 'Coral', 'Ember']

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)]
}

export interface GeneratedUser {
  firstName: string
  lastName: string
  fullName: string
  email: string
  username: string
  password: string
  phone: string
  street: string
  city: string
  region: string
  postalCode: string
  country: string
  dob: string
  avatarSeed: string
}

export function generateUser(): GeneratedUser {
  const firstName = pick(FIRST_NAMES)
  const lastName = pick(LAST_NAMES)
  const fullName = `${firstName} ${lastName}`
  const email = `${firstName}.${lastName}${randInt(1, 999)}@${pick(EMAIL_DOMAINS)}`.toLowerCase()
  const username = `${firstName}${lastName}${randInt(10, 99)}`.toLowerCase()
  const password = `${pick(PASSWORD_WORDS)}${randInt(1000, 9999)}!`
  const phone = `(${randInt(200, 899)}) ${randInt(100, 999)}-${randInt(1000, 9999)}`
  const street = `${randInt(100, 9999)} ${pick(STREET_NAMES)}`
  const city = pick(CITIES)
  const region = pick(REGIONS)
  const postalCode = String(randInt(10000, 99999))
  const country = pick(COUNTRIES)
  const dob = new Date(Date.UTC(randInt(1950, 2005), randInt(0, 11), randInt(1, 28))).toISOString().slice(0, 10)
  const avatarSeed = `${fullName}-${randInt(0, 999999)}`
  return { firstName, lastName, fullName, email, username, password, phone, street, city, region, postalCode, country, dob, avatarSeed }
}

// --- Cards -------------------------------------------------------------

export interface CardNetwork {
  key: string
  label: string
  prefixes: string[]
  length: number
  cvvLength: number
}

export const CARD_NETWORKS: CardNetwork[] = [
  { key: 'visa', label: 'Visa', prefixes: ['4'], length: 16, cvvLength: 3 },
  { key: 'mastercard', label: 'Mastercard', prefixes: ['51', '52', '53', '54', '55'], length: 16, cvvLength: 3 },
  { key: 'amex', label: 'American Express', prefixes: ['34', '37'], length: 15, cvvLength: 4 },
  { key: 'discover', label: 'Discover', prefixes: ['6011', '65'], length: 16, cvvLength: 3 },
]

function luhnCheckDigit(partial: string): number {
  let sum = 0
  let shouldDouble = true
  for (let i = partial.length - 1; i >= 0; i--) {
    let digit = partial.charCodeAt(i) - 48
    if (shouldDouble) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    shouldDouble = !shouldDouble
  }
  return (10 - (sum % 10)) % 10
}

function generateCardNumber(network: CardNetwork): string {
  let digits = pick(network.prefixes)
  while (digits.length < network.length - 1) {
    digits += String(randInt(0, 9))
  }
  return digits + String(luhnCheckDigit(digits))
}

export interface GeneratedCard {
  network: string
  number: string
  formattedNumber: string
  cardholder: string
  expiryMonth: string
  expiryYear: string
  cvv: string
}

// Synthetic, Luhn-valid test numbers for exercising a form's card-format
// and checksum validation, nothing else. Not tied to any real BIN/issuer
// lookup, and cannot be charged.
export function generateCard(networkKey?: string): GeneratedCard {
  const network = (networkKey && CARD_NETWORKS.find((n) => n.key === networkKey)) || pick(CARD_NETWORKS)
  const number = generateCardNumber(network)
  const now = new Date()
  const expiryMonth = String(randInt(1, 12)).padStart(2, '0')
  const expiryYear = String(now.getUTCFullYear() + randInt(1, 5)).slice(-2)
  const cvv = String(randInt(0, Math.pow(10, network.cvvLength) - 1)).padStart(network.cvvLength, '0')
  return {
    network: network.label,
    number,
    formattedNumber: number.match(/.{1,4}/g)!.join(' '),
    cardholder: generateUser().fullName,
    expiryMonth,
    expiryYear,
    cvv,
  }
}

// --- Files ---------------------------------------------------------------

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
  'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua',
]

function loremSentence(): string {
  const len = randInt(6, 14)
  const words = Array.from({ length: len }, () => pick(LOREM_WORDS))
  return words.join(' ') + '.'
}

export function generateFileContent(type: 'txt' | 'csv' | 'json' | 'bin', targetBytes: number): Uint8Array {
  if (type === 'bin') {
    const bytes = new Uint8Array(targetBytes)
    for (let i = 0; i < bytes.length; i++) bytes[i] = randInt(0, 255)
    return bytes
  }

  let out: string
  if (type === 'txt') {
    out = ''
    while (out.length < targetBytes) out += loremSentence() + ' '
    out = out.slice(0, targetBytes)
  } else if (type === 'csv') {
    out = 'id,name,email,city,country\n'
    let id = 1
    while (out.length < targetBytes) {
      const u = generateUser()
      out += `${id},${u.fullName},${u.email},${u.city},${u.country}\n`
      id++
    }
    out = out.slice(0, targetBytes)
  } else {
    // json: build an array, stopping once the next item would exceed the
    // target. Slicing a finished JSON string would produce invalid JSON.
    const items: GeneratedUser[] = []
    out = '[]'
    while (true) {
      const candidate = [...items, generateUser()]
      const candidateStr = JSON.stringify(candidate, null, 2)
      if (candidateStr.length > targetBytes && items.length > 0) break
      items.push(candidate[candidate.length - 1])
      out = candidateStr
      if (candidateStr.length > targetBytes) break
    }
  }
  return new TextEncoder().encode(out)
}
