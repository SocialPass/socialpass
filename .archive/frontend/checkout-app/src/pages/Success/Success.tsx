import { useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";

import useEvent from "@/hooks/useEvent";
import useCheckout from "@/hooks/useCheckout";
// import { useCountdown } from '@/hooks/useCountdown'

import Receipt from "./Receipt";

export default function Success() {
	const { eventPublicId, checkoutPublicId } = useParams();
	const navigate = useNavigate();
	const { event }: any = useEvent();
	const { checkout, getCheckout, getCheckoutItems }: any = useCheckout();
	// const { seconds } = useCountdown(new Date((new Date().getTime()) + 6000))

	/*
  useEffect(() => {
    if (seconds <= 0) {
      document.getElementById('get-tickets-link')?.click()
    }
  }, [seconds])
  */

	useEffect(() => {
		if (!checkout) {
			getCheckout(checkoutPublicId).catch(() => {
				navigate(`/${eventPublicId}/checkout/${checkoutPublicId}/error`);
			});

			getCheckoutItems(checkoutPublicId).catch(() => {});
		}
	}, []);

	return (
		<>
			<div className='w-100 hs-150 position-relative'>
				<div className='d-flex align-items-center justify-content-center w-100 h-100 bg-gray-very-light-lm bg-darkgray-very-dim-dm overflow-hidden pe-none'>
					<img src={event?.cover_image} className='w-100 h-auto' alt='Cover image' />
				</div>
			</div>

			<div className='px-content pt-20'>
				<p className='text-muted mt-5 mb-0'>By {event?.team.name}</p>
				<h2 className='text-strong fs-base-p2 fw-700 m-0'>{event?.title}</h2>
			</div>

			<div className='row'>
				<div className='col-md-7'>
					<div className='content mt-20 mb-0 me-md-0'>
						<h1 className='text-strong fw-700 fsr-4 m-0'>
							<i className='fa-light fa-check-circle text-success-dim-lm text-success-light-dm me-5'></i>
							Congratulations!
						</h1>
						<p className='mt-10'>
							You made it! We've generated your ticket(s) for the event?. You can get them
							in the email we sent you at{" "}
							<a href={`mailto:${checkout?.email}`} className='fw-bold'>
								{checkout?.email}
							</a>
							.
						</p>

						<h6 className='fw-700 fsr-6 mt-20'>Event Summary</h6>
						<table className='table table-no-outer-padding'>
							<tbody>
								<tr>
									<th>Name</th>
									<td>{event?.title}</td>
								</tr>
								<tr>
									<th>Date</th>
									<td>{event?.start_date}</td>
								</tr>
								<tr>
									<th>Location</th>
									<td>{event?.localized_address_display}</td>
								</tr>
							</tbody>
						</table>

						<div
							className='alert alert-primary mt-20 mb-20 m-0 text-primary-dim-lm px-20 py-10 fw-bold rounded-2 d-flex align-items-center'
							role='alert'
						>
							<i className='fa-regular fa-check me-15'></i>
							<p className='m-0'>Your tickets have been sent to your email address.</p>
						</div>

						<p className='mb-5'>
							You can also use the following link to get your tickets:
						</p>
						<div className='bg-gray-very-light-lm bg-darkgray-very-dim-dm rounded py-10 px-15 text-truncate border border-dotted'>
							<a
								id='get-tickets-link'
								href={checkout?.get_tickets_link}
								className='d-block text-center fw-bold antialiased'
							>
								Get My Tickets
								<i className='fa-regular fa-external-link ms-10'></i>
							</a>
						</div>
						{/*
            <div className='rounded-bottom border border-dotted border-top-0 py-10 px-15'>
              You will be automatically redirected to the tickets download page in <strong className='text-strong'>{seconds} seconds.</strong>
            </div>
            */}
						<p className='text-muted fs-base-n2'>
							In case you don't receive your tickets or the link above does not work,
							please{" "}
							<a
								href='#'
								data-hm-toggle='modal'
								data-hm-target='discord-support-ticket-modal'
								className='fw-bold antialiased'
								target='_blank'
								rel='noreferrer'
							>
								contact us
							</a>{" "}
							and tell us this ID: <br></br>
							<strong className='text-strong'>{checkout?.public_id}</strong>
						</p>

						{/* <h6 className='fw-700 fsr-6 mt-20'>Get Tickets</h6>

            <button className='btn btn-primary btn-lg btn-block px-20 py-10 text-start d-flex align-items-center my-20'>
              <div>
                <div className='fw-700 antialiased'>Download PDF</div>
              </div>
              <i className='fa-light fa-file-pdf ms-auto fs-base-p4'></i>
            </button>


            <button className='btn btn-lg btn-block px-20 py-10 fs-base text-base text-start d-flex align-items-center my-20'>
              <div>
                <div className='fw-700 antialiased'>Save to Google Wallet</div>
              </div>
              <i className='fa-brands fa-google ms-auto fs-base-p4'></i>
            </button>

            <button className='btn btn-lg btn-block px-20 py-10 fs-base text-base text-start d-flex align-items-center my-20'>
              <div>
                <div className='fw-700 antialiased'>Save to Apple Wallet</div>
              </div>
              <i className='fa-brands fa-apple ms-auto fs-base-p4'></i>
            </button> */}
					</div>
				</div>

				<div className='col-md-5'>
					<Receipt />
				</div>
			</div>
		</>
	);
}