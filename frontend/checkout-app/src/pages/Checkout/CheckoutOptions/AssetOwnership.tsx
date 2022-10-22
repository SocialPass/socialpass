export default function AssetOwnershipCheckoutOption() {
  return (
    <>
      <div className='alert alert-primary text-base pe-none user-select-none' role='alert'>
        <h6 className='alert-heading fw-700 m-0'>
          <i className='fa-light fa-check-square text-primary me-5'></i>
          Proof of NFT ownership
        </h6>
        <p className='mt-5 mb-0'>Select from the Crypto wallet options below.</p>
      </div>

      <button className='btn btn-lg btn-block py-10 fs-base text-base text-start d-flex align-items-center my-20'>
        <div>
          <div className='fw-700 antialiased'>Metamask</div>
          <div className='fs-base-n2 text-muted'>Connect wallet</div>
        </div>
        <div className='ws-25 hs-25 ms-auto'>
          <img
            src='https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg'
            alt='Logo'
            className='w-auto h-100'
          />
        </div>
      </button>

      <button className='btn btn-lg btn-block py-10 fs-base text-base text-start d-flex align-items-center my-20'>
        <div>
          <div className='fw-700 antialiased'>Coinbase</div>
          <div className='fs-base-n2 text-muted'>Connect wallet</div>
        </div>
        <div className='ws-25 hs-25 ms-auto'>
          <img
            src='https://www.svgrepo.com/show/331345/coinbase-v2.svg'
            alt='Logo'
            className='w-auto h-100'
          />
        </div>
      </button>

      <button className='btn btn-lg btn-block py-10 fs-base text-base text-start d-flex align-items-center my-20'>
        <div>
          <div className='fw-700 antialiased'>Binance</div>
          <div className='fs-base-n2 text-muted'>Connect wallet</div>
        </div>
        <div className='ws-25 hs-25 ms-auto'>
          <img
            src='https://upload.wikimedia.org/wikipedia/commons/e/e8/Binance_Logo.svg'
            alt='Logo'
            className='w-auto h-100'
          />
        </div>
      </button>
    </>
  )
}
