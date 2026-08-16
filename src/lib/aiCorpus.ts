export interface CorpusArticle {
  id: number
  title: string
  body: string
}

// Deliberately 15 short, unambiguous, non-overlapping topics: a retrieval
// system either finds the one clearly-correct article for a query, or it
// doesn't. Overlapping topics would make "correct" ambiguous and defeat
// the point of a known-answer test fixture.
export const CORPUS_ARTICLES: CorpusArticle[] = [
  {
    id: 1,
    title: 'Photosynthesis',
    body: "Photosynthesis is the process plants use to convert sunlight into chemical energy. Chlorophyll in a plant's leaves absorbs light and uses it to combine carbon dioxide and water into glucose, releasing oxygen as a byproduct. This glucose fuels the plant's growth and is the ultimate energy source for nearly every food chain on Earth.",
  },
  {
    id: 2,
    title: 'The water cycle',
    body: 'The water cycle describes how water moves between the ocean, atmosphere, and land. The sun heats water in oceans and lakes, causing it to evaporate into vapor that rises and cools into clouds through condensation. Eventually the water falls back to Earth as precipitation, replenishing rivers, groundwater, and oceans before the cycle repeats.',
  },
  {
    id: 3,
    title: 'Firewalls',
    body: "A firewall is a network security system that monitors and controls incoming and outgoing traffic based on a set of rules. It acts as a barrier between a trusted internal network and untrusted external networks like the internet, blocking connections that don't match its allowed criteria. Firewalls can be hardware devices, software running on a server, or built into a router.",
  },
  {
    id: 4,
    title: 'Compound interest',
    body: 'Compound interest is interest calculated on both the original amount of money and the interest that has already accumulated. Unlike simple interest, which only applies to the principal, compound interest causes savings or debt to grow at an accelerating rate over time. The more frequently interest compounds, such as daily versus annually, the faster the balance grows.',
  },
  {
    id: 5,
    title: 'How vaccines work',
    body: "Vaccines work by training the immune system to recognize and fight a specific pathogen without causing the disease itself. They typically contain a weakened, inactivated, or partial version of a virus or bacterium, prompting the body to produce antibodies. If the person is later exposed to the real pathogen, their immune system can respond quickly, often preventing illness entirely.",
  },
  {
    id: 6,
    title: 'DNS',
    body: 'DNS, or the Domain Name System, translates human-readable website names like example.com into the numeric IP addresses computers use to locate each other. When you type a web address into a browser, a DNS resolver looks up the corresponding IP address before your device can connect to the server. This system works like a phone book for the internet, making it unnecessary to memorize numeric addresses.',
  },
  {
    id: 7,
    title: 'The Pythagorean theorem',
    body: "The Pythagorean theorem states that in a right triangle, the square of the hypotenuse equals the sum of the squares of the other two sides, written as a² + b² = c². It's used to calculate an unknown side length whenever the other two sides of a right triangle are known. The theorem is named after the ancient Greek mathematician Pythagoras, though the relationship was known to earlier civilizations.",
  },
  {
    id: 8,
    title: 'How solar panels work',
    body: 'Solar panels generate electricity using photovoltaic cells that convert sunlight directly into electrical current. When photons from sunlight strike the silicon layers inside a cell, they knock electrons loose, creating a flow of electricity. This direct current is then usually converted to alternating current by an inverter so it can power homes and feed into the electrical grid.',
  },
  {
    id: 9,
    title: 'Ocean tides',
    body: 'Tides are the regular rise and fall of sea levels caused mainly by the gravitational pull of the moon, with a smaller contribution from the sun. As the moon orbits Earth, its gravity pulls ocean water toward it, creating a bulge on the near side and, due to inertia, a corresponding bulge on the far side. Most coastlines experience two high tides and two low tides roughly every 24 hours as the Earth rotates through these bulges.',
  },
  {
    id: 10,
    title: 'HTTP vs HTTPS',
    body: 'HTTP and HTTPS are both protocols for transferring data between a web browser and a server, but HTTPS adds a layer of encryption using TLS. This encryption prevents third parties from reading or tampering with data in transit, which is essential for protecting passwords, payment details, and other sensitive information. Most modern browsers now flag plain HTTP sites as "not secure" to encourage the use of HTTPS.',
  },
  {
    id: 11,
    title: 'The four-stroke engine',
    body: 'A four-stroke engine completes four distinct piston movements to convert fuel into motion: intake, compression, combustion, and exhaust. During intake, the piston draws in an air-fuel mixture; compression squeezes that mixture; combustion ignites it to drive the piston down with force; and exhaust expels the leftover gases. This cycle repeats continuously while the engine runs, powering most cars for over a century.',
  },
  {
    id: 12,
    title: 'Inflation',
    body: 'Inflation is the rate at which the general price level of goods and services rises over time, reducing the purchasing power of a currency. It is typically measured using indexes like the Consumer Price Index, which tracks the cost of a representative basket of goods. Moderate inflation is considered normal in a growing economy, but high or unpredictable inflation can erode savings and make long-term planning difficult.',
  },
  {
    id: 13,
    title: 'Noise-cancelling headphones',
    body: 'Noise-cancelling headphones use microphones to detect ambient sound and then generate an inverted sound wave that cancels it out before it reaches your ear. This technique, called active noise cancellation, is especially effective against steady, low-frequency sounds like engine hum. It works alongside passive noise isolation from the headphone\'s physical seal, which blocks higher-frequency sounds on its own.',
  },
  {
    id: 14,
    title: 'The carbon cycle',
    body: 'The carbon cycle describes how carbon moves between the atmosphere, oceans, soil, and living organisms. Plants absorb atmospheric carbon dioxide during photosynthesis, animals release it back through respiration, and decomposers return it to the soil as organic matter breaks down. Human activities like burning fossil fuels have significantly increased the amount of carbon entering the atmosphere, disrupting this natural balance.',
  },
  {
    id: 15,
    title: 'VPNs',
    body: 'A VPN, or virtual private network, creates an encrypted tunnel between your device and a remote server, masking your real IP address and protecting your traffic from being read by your internet provider or others on the same network. It is commonly used to access region-restricted content, protect data on public Wi-Fi, or connect securely to a company\'s internal network while working remotely. A VPN hides what data you are sending, but it does not make you completely anonymous online.',
  },
]

export function findCorpusArticle(id: number): CorpusArticle | undefined {
  return CORPUS_ARTICLES.find((a) => a.id === id)
}

export interface AnswerKeyEntry {
  query: string
  articleId: number
}

// Each query is written to clearly, unambiguously point at exactly one
// article. A correct retrieval pipeline should return that article as its
// top result every time.
export const ANSWER_KEY: AnswerKeyEntry[] = [
  { query: 'How do plants convert sunlight into energy?', articleId: 1 },
  { query: 'Why does it rain?', articleId: 2 },
  { query: 'What blocks unauthorized network traffic?', articleId: 3 },
  { query: 'Why does my savings account grow faster over time?', articleId: 4 },
  { query: 'How does the immune system learn to fight a disease before I catch it?', articleId: 5 },
  { query: "How does my browser find a website's server?", articleId: 6 },
  { query: 'How do I find the missing side of a right triangle?', articleId: 7 },
  { query: 'How does sunlight get turned into electricity?', articleId: 8 },
  { query: 'Why does the ocean rise and fall twice a day?', articleId: 9 },
  { query: 'Why do browsers say a site is not secure?', articleId: 10 },
  { query: "What are the four stages of a car engine's cycle?", articleId: 11 },
  { query: 'Why does money buy less over time?', articleId: 12 },
  { query: 'How do headphones block out engine noise?', articleId: 13 },
  { query: 'How does carbon move between the air and living things?', articleId: 14 },
  { query: 'How can I hide my IP address on public Wi-Fi?', articleId: 15 },
]
