import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import CloseCircleIcon from '../../assets/closeIcon.svg'
import CodeInput from '@/components/CodeInput'
import useEvent from '@/hooks/useEvent'

const ManualRedeem = () => {
  const navigate = useNavigate()
  const { redemptionPublicId } = useParams()
  const { getEvent }: any = useEvent()

  function handleGoBack() {
    getEvent(redemptionPublicId)
    navigate(`/${redemptionPublicId}`)
  }

  return (
    <div className='error-footer'>
      <CodeInput />
    </div>
  )
}

export default ManualRedeem
