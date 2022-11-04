import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import CloseCircleIcon from '../../assets/closeIcon.svg'
import useEvent from '@/hooks/useEvent'

const ManualRedeem = () => {
    const navigate = useNavigate()
    const { redemptionPublicId } = useParams()
    const { getEvent }: any = useEvent()

    function handleGoBack() {
        getEvent(redemptionPublicId)
        navigate(`/${redemptionPublicId}`)
    }

    function handleSubmit() {
        console.log("Code: ")
    }

    const [code, setCode] = useState<any>('')


    const data = "";

    return (
        <div >
            <div className='py-20'></div>
            <form onSubmit={handleSubmit}>
                <label>
                    <input type="text" name='ticket_code_input' className='form-control' placeholder='Insert ticket code' />
                </label>
                <button className='btn btn-secondary btn-lg fsr-6 btn-block mt-15' disabled={false}
                    onClick={handleSubmit}>
                    <strong className='antialiased'>Redeem code</strong>
                </button>
            </form>
        </div>
    )
}

export default ManualRedeem
