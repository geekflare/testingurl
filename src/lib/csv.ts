function escapeCsvCell(value: unknown): string {
  const str = String(value ?? '')
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`
  return str
}

export function toCsv<T extends object>(rows: T[]): string {
  if (rows.length === 0) return ''
  const headers = Object.keys(rows[0]) as (keyof T)[]
  const lines = [headers.join(',')]
  for (const row of rows) {
    lines.push(headers.map((h) => escapeCsvCell(row[h])).join(','))
  }
  return lines.join('\n')
}
