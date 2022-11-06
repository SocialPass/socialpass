export type Event = {
  title: string
  start_date: string
  localized_address_display: string
  capacity: number
  ticket_count: number
  redeemed_count: number
  team: Team
}

export type Team = {
  image: string | null
  name: string
  theme: Theme
}

export type Theme = {
  brand_name: string
  css_theme: string
  favicon: string
  logo: string
}

type GetEvent = (redemptionPublicId: string) => Promise<Event | unknown>

export type EventError = {
  detail: string
  message: string
}

export type EventContextType = {
  event: Event | null
  getEvent: GetEvent | null
  setEvent
  isLoading: boolean
  error: EventError | null
}
