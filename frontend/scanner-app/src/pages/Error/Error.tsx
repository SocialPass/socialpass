import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import CloseCircleIcon from '../../assets/closeIcon.svg'
import useEvent from '@/hooks/useEvent'

const Error = () => {
  const navigate = useNavigate()
  const { redemptionPublicId } = useParams()
  const { getEvent }: any = useEvent()

  function handleGoBack() {
    getEvent(redemptionPublicId)
    navigate(`/${redemptionPublicId}`)
  }

  return (
    <div className='error-footer'>
      <header className='d-flex flex-row justify-content-between align-items-start py-4 px-4'>
        <div className='py-2'>
          <div className='btn-back mt-30'>
            <FiArrowLeft onClick={handleGoBack} size={26} />
          </div>
        </div>
        <div className='mx-40'></div>
      </header>

      <div className='error-body d-flex flex-column align-items-center justify-content-center gap-4'>
        <div className='error-title'>Invalid</div>

        <div className='error-subtitle py-10'>
          <img src={CloseCircleIcon} />
        </div>

        <div className='error-body'>No event was found.</div>
      </div>
    </div>
  )
}

export default Error
