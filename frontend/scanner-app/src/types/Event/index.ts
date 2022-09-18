export type Event = {
  title: string
  start_date: string
  localized_address_display: string
  capacity: number
  ticket_count: number
  redeemed_count: number
  team: string
}

type GetEvent = (eventPublicId: string) => Promise<Event>

export type EventError = {
  detail: string
  message: string
}

export type EventContext = {
  event: Event
  getEvent: GetEvent
  isLoading: boolean
  error: EventError
}
