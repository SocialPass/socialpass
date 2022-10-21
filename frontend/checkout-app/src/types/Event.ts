export type Event = {
  title: string
  start_date: string
  localized_address_display: string
  capacity: number
  ticket_count: number
  redeemed_count?: number
  team: Team
}

export type Team = {
  image: string | null
  name: string
  theme: Theme
}

export type Theme = {
  brand_name?
  css_theme: string
  favicon: string
  logo: string
}

type GetEvent = (eventPublicId: string) => Promise<Event | unknown>

export type EventError = {
  detail: string
  message: string
}

export type EventContextType = {
  event: Event | null
  getEvent: GetEvent | null
  isLoading: boolean
  error: EventError | null
}
