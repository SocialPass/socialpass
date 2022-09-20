import { useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import CloseCircleIcon from '../../assets/closeIcon.svg'

const Error = () => {
  const navigate = useNavigate()

  function handleGoBack() {
    navigate(-1)
  }

  return (
    <div className='error-footer'>
      <header className='d-flex flex-row justify-content-between align-items-start py-4 px-4'>
        <div className='py-2'>
          <div className='btn-back mt-30'>
            <FiArrowLeft onClick={handleGoBack} size={26} />
          </div>
        </div>
        <div className='d-flex flex-column align-items-center py-10'>
          <div className='error-title py-30'>Invalid</div>
        </div>
        <div className='mx-40'></div>
      </header>
      <div className='error-padding'></div>
      <div className='error-body d-flex flex-column align-items-center justify-content-center gap-4'>
        <div>
          <img src={CloseCircleIcon} />
        </div>
        <div className='error-body'>No event was found.</div>
      </div>
    </div>
  )
}

export default Error
