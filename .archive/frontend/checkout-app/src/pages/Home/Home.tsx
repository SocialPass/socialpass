import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useEvent from "@/hooks/useEvent";
import useCheckout from "@/hooks/useCheckout";

import { EventApi, CheckoutItemApi } from "@/services/api";

import TicketSelector from "@/components/TicketSelector";
import "./index.css";
import CountdownTimer from "@/components/CountdownTimer";

import DOMPurify from "dompurify";

export default function Home() {
	const navigate = useNavigate();
	const { event }: any = useEvent();
	const {
		saveCheckout,
		setCheckout,
		checkout,
		setCheckoutItems,
		checkoutItems,
		getTxType,
	}: any = useCheckout();

	const [ticketTiers, setTicketTiers] = useState<any[]>([]);

	const [name, setName] = useState<string>(checkout?.name || "");
	const [email, setEmail] = useState<string>(checkout?.email || "");
	const [tiersLoading, setTiersLoading] = useState<boolean>(true);

	const getTicketTiers = (eventPublicId: string) => {
		setTiersLoading(true);
		EventApi.getTicketTiers(eventPublicId)
			.then((res) => {
				setTicketTiers(res.data);
				setTiersLoading(false);
			})
			.catch(() => {});
	};

	const getFiatTicketTiers = () =>
		ticketTiers.filter((ticket) => "tier_fiat" in ticket && ticket.tier_fiat);

	const getBlockchainTicketTiers = () =>
		ticketTiers.filter((ticket) => "tier_blockchain" in ticket && ticket.tier_blockchain);

	const getAssetOwnershipTicketTiers = () =>
		ticketTiers.filter(
			(ticket) => "tier_asset_ownership" in ticket && ticket.tier_asset_ownership,
		);

	const getFreeTicketTiers = () =>
		ticketTiers.filter((ticket) => "tier_free" in ticket && ticket.tier_free);

	const getPaymentTypeTicketTiers = () => {
		if (checkout?.tx_type == "FIAT") {
			return getFiatTicketTiers();
		}
		if (checkout?.tx_type == "BLOCKCHAIN") {
			return getBlockchainTicketTiers();
		}
		if (checkout?.tx_type == "ASSET_OWNERSHIP") {
			return getAssetOwnershipTicketTiers();
		}
		if (checkout?.tx_type == "FREE") {
			return getFreeTicketTiers();
		}
		return [];
	};

	const setTicketTierSelectedAmount = (amount, guests, ticketTier) => {
		const new_selected = [...checkoutItems];

		const ticketIndex = new_selected.findIndex(
			(item) => item.ticket_tier.public_id === ticketTier.public_id,
		);

		if (ticketIndex !== -1) {
			if (amount > 0) {
				// Update on context
				new_selected[ticketIndex].quantity = amount;
				new_selected[ticketIndex].extra_party = guests;

				// Update on backend
				if (checkout.public_id) {
					CheckoutItemApi.edit(new_selected[ticketIndex].public_id, {
						...new_selected[ticketIndex],
						quantity: amount,
						extra_party: guests,
					});
				}
			} else {
				// Delete on backend
				if (checkout.public_id) {
					CheckoutItemApi.delete(new_selected[ticketIndex].public_id);
				}

				// Delete on context
				new_selected.splice(ticketIndex, 1);
			}
		} else {
			// Create on context
			new_selected.push({
				ticket_tier: {
					public_id: ticketTier.public_id,
					ticket_type: ticketTier.ticket_type,
					price: ticketTier[getTxType(checkout?.tx_type)]?.price,
				},
				quantity: amount,
				extra_party: guests,
			});

			// Create on backend
			if (checkout.public_id) {
				CheckoutItemApi.create({
					ticket_tier: ticketTier.public_id,
					checkout_session: checkout.public_id,
					quantity: amount,
					extra_party: guests,
				}).then((res) => {
					// save the new public_id on the checkout item context
					new_selected[new_selected.length - 1].public_id = res.data.public_id;
				});
			}
		}

		setCheckoutItems(new_selected);
	};

	const getTotalPrice = () =>
		checkoutItems.reduce(
			(acc, ticketTier) =>
				acc + ticketTier?.quantity * ticketTier?.ticket_tier?.price || 0,
			0,
		);

	const getPriceWithCurrencySymbol = (amount) => {
		if (checkout?.tx_type === "FIAT") {
			return `$${amount}`;
		} else if (checkout?.tx_type === "BLOCKCHAIN") {
			return `${amount} ETH`;
		}
		// The asset_ownership modality does not have currency
		return "N/A";
	};

	const validateEmail = () => {
		// Checks for '@', whitespaces and TLD existence
		const regex = /\S+@\S+\.\S+/;
		return regex.test(email);
	};

	const validateName = () => name.length > 0;

	// const eventHasTickets = () => ticketTiers.length

	const handleGetTicketsButton = () => {
		saveCheckout().then((res) => {
			navigate(`checkout/${res.public_id}`);
		});
	};

	const isNewCheckout = () => !checkout?.public_id;

	const sanitizedEventDescription = () => ({
		__html: DOMPurify.sanitize(event?.description),
	});

	useEffect(() => {
		setCheckout({ ...checkout, name: name, email: email });
	}, [name, email, checkout?.public_id]);

	useEffect(() => {
		if (!checkout?.public_id) {
			// Prioritize NFTs < CRYPTO < FIAT < FREE
			if (getAssetOwnershipTicketTiers().length > 0) {
				setCheckout({ ...checkout, tx_type: "ASSET_OWNERSHIP" });
			}
			if (getBlockchainTicketTiers().length > 0) {
				setCheckout({ ...checkout, tx_type: "BLOCKCHAIN" });
			}
			if (getFiatTicketTiers().length > 0) {
				setCheckout({ ...checkout, tx_type: "FIAT" });
			}
			if (getFreeTicketTiers().length > 0) {
				setCheckout({ ...checkout, tx_type: "FREE" });
			}
		}
	}, [ticketTiers, checkout?.public_id]);

	useEffect(() => {
		getTicketTiers(event?.public_id);
		setCheckout({ ...checkout, event: event?.public_id });
		if (isNewCheckout()) {
			setName("");
			setEmail("");
		}
	}, [event, checkout?.public_id]);

	const isSomeTiersAvailable = () =>
		ticketTiers?.some((tier) => tier.capacity - tier.quantity_sold > 0);

	return (
		<>
			<div className='w-100 hs-200 position-relative'>
				<div className='d-flex align-items-center justify-content-center w-100 h-100 bg-gray-very-light-lm bg-darkgray-very-dim-dm overflow-hidden pe-none'>
					<img src={event?.cover_image} className='w-100 h-auto' alt='Cover image'></img>
				</div>

				<div className='position-absolute z-1 top-100 start-50 translate-middle px-content'>
					<div className='ws-75 hs-75 rounded-circle border border-5 border-blend d-flex align-items-center justify-content-center overflow-hidden bg-gray-very-light-lm bg-darkgray-very-dim-dm'>
						<img
							src={event?.team.image}
							className='d-block w-100 h-auto'
							alt='Team image'
						></img>
					</div>
				</div>
			</div>

			<div className='px-content pt-40 text-center'>
				<p className='text-muted mt-5 mb-0'>Hosted By</p>
				<h6 className='text-strong fs-base fw-700 m-0'>
					{event?.team.name}
					{event?.team.is_verified && (
						<i className='fa-solid fa-badge-check text-primary ms-5'></i>
					)}
				</h6>
			</div>

			<div className='row'>
				<div className='col-md-7'>
					<div className='content mt-20 mb-0'>
						<h1 className='text-strong fw-700 display-6 m-0 text-break'>{event?.title}</h1>
						<div
							id='desc-cont'
							className='my-20 overflow-hidden position-relative max-h-250'
						>
							<div className='m-0' dangerouslySetInnerHTML={sanitizedEventDescription()} />
							{(document.getElementById("desc-cont")?.scrollHeight || -1) >
								(document.getElementById("desc-cont")?.clientHeight || 0) && (
								<div
									id='desc-read'
									className='position-absolute bottom-0 start-0 w-100 text-center pb-10'
									style={{
										paddingTop: "12rem",
										background:
											"linear-gradient(transparent, var(--base-content-bg-color))",
										borderBottom: "1px solid var(--border-color)",
									}}
								>
									<button
										type='button'
										className='btn btn-rounded'
										onClick={() => {
											document
												.getElementById("desc-cont")
												?.classList.remove("overflow-hidden");
											document.getElementById("desc-cont")?.classList.remove("max-h-250");
											document.getElementById("desc-read")?.classList.add("d-none");
										}}
									>
										Read More
									</button>
								</div>
							)}
						</div>
					</div>
				</div>

				<div className='col-md-5'>
					<div className='content pt-10 pt-md-30 my-0 position-md-sticky top-0 start-0'>
						<div>
							{checkout?.expiration == null || checkout?.tx_status == "FULFILLED" ? (
								""
							) : (
								<CountdownTimer expiration={new Date(checkout?.expiration)} />
							)}
						</div>
						<div className='d-flex align-items-center'>
							<div className='ws-25 flex-shrink-0'>
								<i className='fa-light fa-calendars'></i>
							</div>
							<div className='fw-bold'>
								Date
								{"  "}&mdash; {event?.timezone}
							</div>
						</div>
						<p className='text-muted mt-5 mb-0'>
							<strong className='text-base'>Start:</strong> {event?.start_date}
						</p>
						{event?.end_date && (
							<p className='text-muted mt-5 mb-0'>
								<strong className='text-base'>End:</strong> {event?.end_date}
							</p>
						)}
						<div className='d-flex align-items-center mt-15'>
							<div className='ws-25 flex-shrink-0'>
								<i className='fa-light fa-location-dot'></i>
							</div>
							<div className='fw-bold'>Location</div>
						</div>
						<p className='text-muted mt-5 mb-0'>{event?.localized_address_display}</p>
					</div>
				</div>
				<div className='col-12'>
					<div className='content mt-20 mb-0'>
						{tiersLoading ? (
							<></>
						) : isSomeTiersAvailable() ? (
							<>
								<div>
									<div
										className='alert alert-primary m-0 text-primary-dim-lm px-20 py-10 fw-bold rounded-2 d-flex align-items-center'
										role='alert'
									>
										<i className='fa-regular fa-check me-15'></i>
										<p className='m-0'>
											Tickets available! Please select the tickets you want to purchase.
										</p>
									</div>
								</div>
							</>
						) : (
							<>
								{ticketTiers.length > 0 && (
									<div>
										<div
											className='alert alert-danger m-0 text-danger-dim-lm px-20 py-10 fw-bold rounded-2 d-flex align-items-center'
											role='alert'
										>
											<i className='fa-regular fa-times me-15'></i>
											<p className='m-0'>
												Sorry! Tickets are not available for this event.
											</p>
										</div>
									</div>
								)}
							</>
						)}
					</div>
				</div>
			</div>
			{!tiersLoading &&
				getFreeTicketTiers().length > 0 &&
				getAssetOwnershipTicketTiers().length > 0 && (
					<div className='content mb-0'>
						<div className='ticket-tier-group'>
							<div
								className={"ticket-tier"}
								onClick={() => {
									if (getFreeTicketTiers().length && isNewCheckout()) {
										setCheckout({ ...checkout, tx_type: "FREE" });
										setCheckoutItems([]);
									}
								}}
							>
								<input
									type='radio'
									className='ticket-tier-input'
									disabled={!getFreeTicketTiers().length}
									checked={checkout?.tx_type === "FREE"}
									readOnly
								/>
								<label className='ticket-tier-label'>
									<h6 className='fw-700 m-0 fs-base'>
										<span className='ticket-tier-uncheck'>
											<i className='fa-light fa-party-horn'></i>
										</span>
										<span className='ticket-tier-check'>
											<i className='fa-light fa-party-horn'></i>
										</span>
										Free
									</h6>
								</label>
							</div>
							<div
								className={"ticket-tier"}
								onClick={() => {
									if (getAssetOwnershipTicketTiers().length && isNewCheckout()) {
										setCheckout({ ...checkout, tx_type: "ASSET_OWNERSHIP" });
										setCheckoutItems([]);
									}
								}}
							>
								<input
									type='radio'
									className='ticket-tier-input'
									disabled={!getAssetOwnershipTicketTiers().length}
									checked={checkout?.tx_type === "ASSET_OWNERSHIP"}
									readOnly
								/>
								<label className='ticket-tier-label'>
									<h6 className='fw-700 m-0 fs-base'>
										<span className='ticket-tier-uncheck'>
											<i className='fa-light fa-hexagon-image'></i>
										</span>
										<span className='ticket-tier-check'>
											<i className='fa-light fa-hexagon-image'></i>
										</span>
										NFTs
									</h6>
								</label>
							</div>
						</div>
					</div>
				)}

			{tiersLoading ? (
				<div className='text-center py-40'>
					<div className='spinner-border' role='status'>
						<span className='visually-hidden'>Loading...</span>
					</div>
				</div>
			) : (
				<>
					{ticketTiers.length > 0 && (
						<div className='row'>
							<div className='col-md-7'>
								<div className='content me-md-0'>
									{getPaymentTypeTicketTiers().map((tier, index) => (
										<TicketSelector
											amount={
												checkoutItems.find(
													(item) => item.ticket_tier.public_id === tier.public_id,
												)?.quantity || 0
											}
											onChange={(amount, guests, ticketTier) =>
												setTicketTierSelectedAmount(amount, guests, ticketTier)
											}
											paymentType={checkout?.tx_type}
											ticketTier={tier}
											key={`ticket-tier-${index}`}
											// below !! operator converts Object to boolean
											isChecked={
												!!checkoutItems.find(
													(item) => item.ticket_tier.public_id === tier.public_id,
												)
											}
											extraParty={
												checkoutItems.find(
													(item) => item.ticket_tier.public_id === tier.public_id,
												)?.extra_party || 0
											}
										/>
									))}
								</div>
							</div>
							<div className='col-md-5'>
								<div className='px-content pt-md-30 position-md-sticky top-0 start-0'>
									<div
										className='alert alert-primary text-base fs-base-n4 p-5 mt-10'
										role='alert'
									>
										<i className='fa-regular fa-info-circle me-5 text-primary'></i>
										We only require your email to deliver your tickets in a secure way.{" "}
										<strong>No account</strong> is created without your consent.
									</div>
									<form>
										<input
											type='text'
											name='name'
											className='form-control mb-10'
											placeholder='Name'
											value={name}
											onChange={(e) => setName(e.target.value)}
										></input>
										<input
											type='text'
											name='email'
											className='form-control'
											placeholder='Email Address'
											value={email}
											onChange={(e) => setEmail(e.target.value)}
										></input>
										<button
											className='btn btn-secondary btn-lg fsr-6 btn-block mt-15'
											// Get Tickets button is only enabled by having tickets selected and a valid e-mail input
											disabled={
												!validateName() || !validateEmail() || !checkoutItems.length
											}
											onClick={(e) => {
												e.preventDefault();
												handleGetTicketsButton();
											}}
										>
											<strong className='antialiased'>Get Tickets</strong>
										</button>
									</form>
									<p>
										<strong>Total Price</strong> &mdash;{" "}
										{getPriceWithCurrencySymbol(getTotalPrice())}
									</p>
									<hr />
									<p className='text-muted fs-base-n4'>
										You're also agreeing to our{" "}
										<a
											href={`${
												import.meta.env.VITE_APP_API_URL
											}/static/legal/terms-of-use.pdf`}
											className='fw-bold'
											target='_blank'
											rel='noreferrer'
										>
											Terms of Use <i className='fa-regular fa-external-link'></i>
										</a>{" "}
										by clicking on the above button.
									</p>
								</div>
							</div>
						</div>
					)}
				</>
			)}
		</>
	);
}