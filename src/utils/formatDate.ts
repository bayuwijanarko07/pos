const DEFAULT_TIMEZONE = 'Asia/Jakarta'

function getParts(value?: string | Date) {
  if (!value) return null

  const date = typeof value === 'string' ? new Date(value) : value

  return new Intl.DateTimeFormat('id-ID', {
    timeZone: DEFAULT_TIMEZONE,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(date)
}

function extract(parts: Intl.DateTimeFormatPart[] | null, type: string) {
  return parts?.find(p => p.type === type)?.value ?? ''
}

export function formatDateTime(value?: string | Date) {
  const parts = getParts(value)
  if (!parts) return '-'

  return `${extract(parts, 'day')} ${extract(parts, 'month')} ${extract(parts, 'year')}, ${extract(parts, 'hour')}:${extract(parts, 'minute')}`
}

export function formatDate(value?: string | Date) {
  const parts = getParts(value)
  if (!parts) return '-'

  return `${extract(parts, 'day')} ${extract(parts, 'month')} ${extract(parts, 'year')}`
}

export function formatTime(value?: string | Date) {
  const parts = getParts(value)
  if (!parts) return '-'

  return `${extract(parts, 'hour')}:${extract(parts, 'minute')}`
}