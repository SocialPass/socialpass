export type Event = {
  public_id: string
  team: Team
  title: string
  description: string
  start_date: string
  timezone: string
  localized_address_display: string
  cover_image: string
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
