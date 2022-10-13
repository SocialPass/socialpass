export default function FiatCheckoutOption() {
  return (
    <>
      <div className='alert alert-primary text-base pe-none user-select-none' role='alert'>
        <h6 className='alert-heading fw-700 m-0'>
          <i className='fa-light fa-check-square text-primary me-5'></i>
          Fiat Payment
        </h6>
        <p className='mt-5 mb-0'>Select from the Fiat payment options below.</p>
      </div>

      <button className='btn btn-lg btn-block py-10 fs-base text-base text-start d-flex align-items-center my-20'>
        <div>
          <div className='fw-700 antialiased'>Credit Card</div>
          <div className='fs-base-n2 text-muted'>Pay via Stripe</div>
        </div>
        <i className='fa-light fa-credit-card ms-auto fs-base-p4'></i>
      </button>

      <button className='btn btn-lg btn-block py-10 fs-base text-base text-start d-flex align-items-center my-20'>
        <div>
          <div className='fw-700 antialiased'>Google Pay</div>
          <div className='fs-base-n2 text-muted'>Pay with Google Pay app</div>
        </div>
        <i className='fa-brands fa-google ms-auto fs-base-p4'></i>
      </button>

      <button className='btn btn-lg btn-block py-10 fs-base text-base text-start d-flex align-items-center my-20'>
        <div>
          <div className='fw-700 antialiased'>Apple Pay</div>
          <div className='fs-base-n2 text-muted'>Pay with Apple Pay app</div>
        </div>
        <i className='fa-brands fa-apple ms-auto fs-base-p4'></i>
      </button>
    </>
  )
}
