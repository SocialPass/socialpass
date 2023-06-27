export default function WalletCheckout() {
	return (
		<div>
			{/* Header start */}
			<div className='w-100 hs-150 position-relative'>
				{/* Event cover image start */}
				<div className='d-flex align-items-center justify-content-center w-100 h-100 bg-gray-very-light-lm bg-darkgray-very-dim-dm rounded-top overflow-hidden pe-none'>
					<img
						src='https://images.pexels.com/photos/801863/pexels-photo-801863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
						className='w-100 h-auto'
						alt='Cover image'
					/>
				</div>
				{/* Event cover image end */}

				{/* Back button start */}
				<div className='position-absolute z-1 bottom-0 start-0 px-content py-20'>
					<a href='#' className='btn btn-rounded ps-5 d-flex align-items-center'>
						<div className='ws-25 hs-25 bg-secondary text-on-secondary rounded-circle d-flex align-items-center justify-content-center'>
							<i className='fa-regular fa-arrow-left'></i>
						</div>
						<strong className='text-strong antialiased ms-10'>Go Back</strong>
					</a>
				</div>
				{/* Back button end */}
			</div>
			{/* Header end */}

			{/* Event and team names start */}
			<div className='px-content pt-20'>
				<p className='text-muted mt-5 mb-0'>By SocialPass</p>
				<h2 className='text-strong fs-base-p2 fw-700 m-0'>NFT Holders Party</h2>
			</div>
			{/* Event and team names end */}

			{/* Checkout content start */}
			<div className='row'>
				{/* Checkout information start */}
				<div className='col-md-7'>
					<div className='content'>
						<h1 className='text-strong fw-700 fsr-4 mt-0 mb-0'>Complete Checkout</h1>
						<p className='mt-10'>Select from one of the checkout options below.</p>
						<h6 className='text-strong fw-700 fsr-6 mt-30'>Checkout Options</h6>
						<div
							className='alert rounded-3 border-secondary d-flex align-items-center'
							role='alert'
						>
							<div className='text-secondary fs-base-p4'>
								<i className='fa-regular fa-check-circle'></i>
							</div>
							<div className='ms-20'>
								<h6 className='alert-heading text-strong fw-700 mb-0'>
									Proof of NFT Ownership
								</h6>
								<p className='my-0'>Select from the crypto wallet options.</p>
							</div>
						</div>
						<p className='d-flex align-items-start fs-base-n2'>
							<i className='fa-regular fa-info-circle me-10 mt-5'></i>
							<span>
								Proof of NFT ownership is <strong>not</strong> an NFT trade. We only need
								you to prove that you own the NFT to create the ticket.
							</span>
						</p>

						{/* Wallet radio buttons start */}
						<div className='row'>
							{/* Wallet radio button start */}
							<div className='col-sm-4 pe-sm-10'>
								<div className='wallet-button'>
									<input
										type='radio'
										name='wallet'
										className='wallet-button-input'
										id='wallet-button-input-1'
										checked
									/>
									<label htmlFor='wallet-button-input-1' className='wallet-button-label'>
										<div className='ws-75 mw-100 mx-auto'>
											<img
												src='https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/492d95c038bbcde1517cab5fb90ed4514690e919/svg/circle/walletconnect-circle-blue.svg'
												className='img-fluid'
												alt='WalletConnect'
											/>
										</div>
										<div className='fs-base-n2 text-strong fw-700 text-truncate text-center mt-10'>
											WalletConnect
										</div>
									</label>
								</div>
							</div>
							{/* Wallet radio button end */}

							{/* Wallet radio button start */}
							<div className='col-sm-4 pe-sm-10 pt-10 pt-sm-0'>
								<div className='wallet-button'>
									<input
										type='radio'
										name='wallet'
										className='wallet-button-input'
										id='wallet-button-input-2'
									/>
									<label htmlFor='wallet-button-input-2' className='wallet-button-label'>
										<div className='ws-75 mw-100 mx-auto'>
											<img
												src='https://avatars.githubusercontent.com/u/18060234?s=280&v=4'
												className='img-fluid'
												alt='Coinbase'
											/>
										</div>
										<div className='fs-base-n2 text-strong fw-700 text-truncate text-center mt-10'>
											WalletLink
										</div>
									</label>
								</div>
							</div>
							{/* Wallet radio button end */}

							{/* Wallet radio button start */}
							<div className='col-sm-4 pe-sm-10 pt-10 pt-sm-0'>
								<div className='wallet-button'>
									<input
										type='radio'
										name='wallet'
										className='wallet-button-input'
										id='wallet-button-input-3'
									/>
									<label htmlFor='wallet-button-input-3' className='wallet-button-label'>
										<div className='ws-75 mw-100 mx-auto'>
											<img
												src='https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg'
												className='img-fluid'
												alt='Metamask'
											/>
										</div>
										<div className='fs-base-n2 text-strong fw-700 text-truncate text-center mt-10'>
											Metamask
										</div>
									</label>
								</div>
							</div>
							{/* Wallet radio button end */}
						</div>
						{/* Wallet radio buttons end */}
					</div>
				</div>
				{/* Checkout information end */}

				{/* CTA section start */}
				<div className='col-md-5'>
					<div className='p-content position-md-sticky top-0 start-0'>
						<div className='d-flex align-items-center'>
							<h6 className='text-strong fw-700 fsr-6 mt-0 mb-0'>Summary</h6>

							{/* Edit button start */}
							<div className='text-secondary ms-auto'>
								<a href='#' className='link-reset fw-bold'>
									Edit
								</a>
							</div>
							{/* Edit button end */}
						</div>
						<p className='mt-10'>
							2 &times; General Admission Ticket
							<br />
							<strong>Price &mdash; </strong> Free
						</p>
						<button className='btn btn-secondary btn-lg fsr-6 btn-block' disabled>
							<strong className='antialiased'>Continue</strong>
						</button>
					</div>
				</div>
				{/* CTA section end */}
			</div>
			{/* Checkout content end */}
		</div>
	);
}
