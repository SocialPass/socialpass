import { useEffect } from 'react'

import { Outlet, useParams, useNavigate } from 'react-router-dom'

import EventLoading from '@/components/EventLoading'

import useEvent from '@/hooks/useEvent'
import useTheme from '@/hooks/useTheme'

import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'

const Base = () => {
	const navigate = useNavigate()
	const { eventPublicId } = useParams()
	const { event, getEvent, isLoading, error }: any = useEvent()
	const { isReady }: any = useTheme()

	useEffect(() => {
		if (!event || event.publicId !== eventPublicId) {
			getEvent(eventPublicId).catch(() => {})
		}
	}, [eventPublicId])

	useEffect(() => {
		if (error) {
			navigate(`/${eventPublicId}/error`)
		}
	}, [error])

	return (
		<div>
			{error ? (
				<Outlet />
			) : isLoading || !isReady ? (
				<EventLoading />
			) : event ? (
				<>
					<div className='modal' tabIndex={-1} id='discord-support-ticket-modal'>
						<div className='modal-dialog'>
							<div className='modal-content'>
								<button className='btn close' aria-label='Close' data-hm-dismiss='modal'>&times;</button>
								<div 
									className='ws-50 hs-50 d-flex align-items-center justify-content-center text-white rounded-circle mx-auto fs-base-p12'
									style={{ backgroundColor: '#7289d9' }}
								>
									<i className='fa-brands fa-discord' />
								</div>
								<h5 className='modal-title text-center mt-20'>Support Ticket</h5>
								<p className='text-center'>
									Need help? Please use the following link to create a ticket on the <code>#support-ticket</code> channel in our Discord server.
								</p>
								<div className='text-truncate p-10 bg-gray-very-light-lm bg-darkgray-very-dim-dm rounded my-10 lh-1'>
									<a 
										href='https://discord.com/channels/1062852686015369289/1063885474294403112'
										className='fw-bold antialiased'
										target='_blank'
										rel='noreferrer'
									>
										<i className='fa-regular fa-external-link' />
										<span className='ms-5'>https://discord.com/channels/1062852686015369289/1063885474294403112</span>
									</a>
								</div>
								<p className='text-center'>
									Once the ticket has been created, our team will reach out to you ASAP.
								</p>
							</div>
						</div>
					</div>
					<div className='page-wrapper'>
						<div className='content-wrapper ws-860 mw-100 min-vh-100 mx-auto bg-white-lm bg-dark-very-light-dm d-flex flex-column'>
							<NavBar />

							<Outlet />

							<Footer />
						</div>
					</div>
				</>
			) : null}
		</div>
	)
}

export default Base
