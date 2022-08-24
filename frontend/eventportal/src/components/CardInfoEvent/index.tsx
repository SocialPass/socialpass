import { useContext } from 'react'
import { CheckoutPortalContext } from '../../context'
import styles from './styles.module.css'

export default function CardInfoEvent() {
  const { retrieveJson, generalAdmissionSelect } = useContext(CheckoutPortalContext)
  const date = retrieveJson.start_date.split('|')

  return (
    <div className={`${styles.card_info_event} px-30 py-15 h-auto`}>
      <div>
        <span className='d-block fw-bold fs-26'>{retrieveJson.title}</span>
        <span className='text-muted'>Order #54878641</span>
      </div>
      {/* ICONS */}
      <div className='mt-15 d-flex flex-column align-items-start gap-15'>
        {/* icon */}
        <div className='d-flex flex-row align-items-center justify-content-start gap-15'>
          <i
            className={`fa fa-ticket text-secondary fs-20 ${styles.rotate_ticket_icon}`}
            aria-hidden='true'
          />
          <div className='ms-10'>
            <strong className='fs-18'>{generalAdmissionSelect} x Ticket</strong>
            <span className='d-block text-muted fs-15'>General Admission</span>
          </div>
        </div>
        {/* end icon */}
        <div className='d-flex flex-row align-items-center justify-content-start gap-15'>
          <i className='fa fa-map-marker text-secondary fs-20' aria-hidden='true' />
          <div className='ms-10'>
            <strong className='fs-18'>{retrieveJson.address_1} {retrieveJson.address_2}</strong>
            <span className='d-block text-muted fs-15'>{retrieveJson.city} {retrieveJson.region} {retrieveJson.country}</span>
          </div>
        </div>

        <div className='d-flex flex-row align-items-center justify-content-start gap-15'>
          <i className='fa-solid fa-alarm-clock text-secondary fs-20' />
          <div className='ms-5'>
            <strong className='fs-18'>{date[0]}</strong>
            <span className='d-block text-muted fs-15'>
              {date[1]} {retrieveJson.timezone}
            </span>
          </div>
        </div>
      </div>
      {/* END ICONS */}
      {/* <div className="mt-20 ">
        <a href="#" className="text-secondary text-underline fw-bold">
          See details <i className="fa-solid fa-angle-down" />
        </a>
      </div> */}
    </div>
  )
}
