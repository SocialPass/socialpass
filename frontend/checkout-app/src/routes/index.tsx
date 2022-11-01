import Base from '@/pages/Base'
import Home from '@/pages/Home'
import Checkout from '@/pages/Checkout'
import Success from '@/pages/Success'
import Error from '@/pages/Error'
import TransactionValidation from '@/pages/TransactionValidation'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/:eventPublicId' element={<Base />}>
          <Route index element={<Home />} />
          <Route path='checkout/:checkoutPublicId'>
            <Route index element={<Checkout />} />
            <Route path='validation' element={<TransactionValidation />} />
            <Route path='success' element={<Success />} />
            <Route path='error' element={<Error />} />
          </Route>
          <Route path='error' element={<Error />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
