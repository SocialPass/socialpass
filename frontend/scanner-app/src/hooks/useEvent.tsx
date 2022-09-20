import { useContext } from 'react'

import { EventContext } from '@/contexts/EventContext'

const useEvent = () => {
  const context = useContext(EventContext)

  if (!context) {
    throw new Error('useEvent must be used within a EventProvider')
  }

  return context
}

export default useEvent
