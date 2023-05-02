import { useRef } from "react";
import { Html5QrcodeScanner } from "./Html5QrcodeScanner";
import { toast } from "react-hot-toast";

import useEvent from "@/hooks/useEvent";
import { useNavigate, useParams } from "react-router-dom";
import { TicketApi } from "@/services/api";
import Button from "@/components/Button";

const Scanner = () => {
	const { redemptionPublicId } = useParams();
	const navigate = useNavigate();
	const { event, setEvent }: any = useEvent();
	const lastQR = useRef();

	const handleRedirect = () => {
		navigate("..");
	};

	const handleScan = (qrcode: any) => {
		if (qrcode && qrcode !== lastQR.current) {
			lastQR.current = qrcode;
			TicketApi.claim(redemptionPublicId, qrcode)
				.then((data) => {
					console.log(data);
					setEvent({
						...event,
						ticket_count: data.ticket_count,
						redeemed_count: data.redeemed_count,
					});
					if (data.party_size > 1) {
						toast.success(
							`Succesful Scan, Tier: ${data.ticket_tier.ticket_type}
              | Party Size: ${data.party_size}`,
							{ duration: 15000 },
						);
					} else {
						toast.success(`Succesful Scan, Tier: ${data.ticket_tier.ticket_type}`, {
							duration: 15000,
						});
					}
					document.getElementById("successPlay")?.click();
				})
				.catch((err) => {
					if (err.message === "Ticket has already been redeemed.") {
						toast("Succesful Scan: Ticket has already been redeemed", {
							icon: "⚠️",
							duration: 15000,
						});
						document.getElementById("successPlay")?.click();
					} else {
						toast.error(`Scan Failed: ${err.message}`, { duration: 10000 });
					}
				});

			setTimeout(() => {
				lastQR.current = undefined;
			}, 2000);
		}
	};

	return (
		<>
			<div className='position-relative d-flex bg-content align-items-center justify-content-center hs-400 overflow-hidden'>
				<span className='text-center'>
					<Html5QrcodeScanner
						fps={1}
						qrbox={{ width: 250, height: 250 }}
						facingMode='environment'
						onScan={(result) => handleScan(result)}
					/>
				</span>
				<button
					type='button'
					className='btn btn-square btn-rounded border-transparent shadow position-absolute top-0 start-0 m-10'
					onClick={() => handleRedirect()}
				>
					<i className='fa-solid fa-arrow-left'></i>
					<span className='visually-hidden'>Go Back</span>
				</button>
			</div>

			<div className='py-10 px-10'>
				<Button
					className='mt-0'
					onClick={() => {
						navigate(`/${redemptionPublicId}/manual-redeem`);
					}}
				>
					<strong className='antialiased'>Redeem Manually</strong>
				</Button>
			</div>

			<div className='mt-auto'>
				<div className='content-wrapper px-20'>
					<h1 className='fw-700 fs-base-p6 mt-0'>{event.title}</h1>
					<div className='mt-10'>
						<i className='fa-regular fa-clock me-5'></i>
						{event.start_date}
					</div>
					<div className='row mt-5 fs-base-n2'>
						<div className='col-6 pe-5'>
							<div className='bg-secondary text-on-secondary rounded-3 px-15 py-10 h-100'>
								<strong className='antialiased'>Tickets: {event?.ticket_count}</strong>
							</div>
						</div>
						<div className='col-6 ps-5'>
							<div className='bg-secondary text-on-secondary rounded-3 px-15 py-10 h-100'>
								<strong className='antialiased'>
									Tickets Redeemed: {event?.redeemed_count}
								</strong>
							</div>
						</div>
					</div>
					<div className='row mt-5 fs-base-n2'>
						<div className='col-6 pe-5'>
							<div className='bg-secondary text-on-secondary rounded-3 px-15 py-10 h-100'>
								<strong className='antialiased'>
									Total people: {event?.total_people}
								</strong>
							</div>
						</div>
						<div className='col-6 ps-5'>
							<div className='bg-secondary text-on-secondary rounded-3 px-15 py-10 h-100'>
								<strong className='antialiased'>
									Check-ins (People): {event?.total_checkins}
								</strong>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Scanner;
