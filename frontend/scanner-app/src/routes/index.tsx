import { Routes, Route, BrowserRouter } from 'react-router-dom'

import Base from '@/pages/Base'
import { EventInfo } from '@/pages/EventInfo'
import { Index } from '@/pages/Index'
import { Error } from '@/pages/Error'
import { CapacityReached } from '@/pages/CapacityReached'
import { Scanner } from '@/pages/Scanner'
import { Statistics } from '@/pages/Statistics'

function EventRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='' element={<Index />} />
        <Route path='/:redemptionPublicId' element={<Base />}>
          <Route path='' element={<EventInfo />} />
          <Route path='scanner' element={<Scanner />} />
          <Route path='statistics' element={<Statistics />} />
          <Route path="capacity-reached'" element={<CapacityReached />} />
        </Route>
        <Route path='error' element={<Error />} />
      </Routes>
    </BrowserRouter>
  )
}

export default EventRoutes
