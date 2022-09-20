import { useNavigate, useParams } from 'react-router-dom'

import { useEvent } from '@/contexts/EventContext'

import { StatisticsTable } from '@/components/StatisticsTable'
import { Footer } from '@/components/Footer'

export function Statistics() {
  const navigate = useNavigate()
  const params = useParams()
  const { event }: any = useEvent()

  return (
    <div className='statistics-body'>
      <div className='statistics-title py-20 px-10'>
        {event.title}
        <StatisticsTable />
        <div className='container p-5 d-flex flex-column'>
          <button
            className='btn-start-scanning'
            onClick={() => {
              navigate(`/${params.publicId}/scanner`)
            }}
          >
            Return to Scanner
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}
