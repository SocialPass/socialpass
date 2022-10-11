export default function Success() {
  return (
    <>
      <div className='w-100 hs-150 position-relative'>
        <div className='d-flex align-items-center justify-content-center w-100 h-100 bg-gray-very-light-lm bg-darkgray-very-dim-dm overflow-hidden pe-none'>
          <img
            src='https://images.pexels.com/photos/801863/pexels-photo-801863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            className='w-100 h-auto'
            alt='Cover image'
          />
        </div>

        <div className='position-absolute z-1 bottom-0 start-0 px-content py-20'>
          <a href='#' className='btn btn-rounded ps-5 d-flex align-items-center'>
            <div className='ws-25 hs-25 bg-secondary text-on-secondary rounded-circle d-flex align-items-center justify-content-center'>
              <i className='fa-regular fa-arrow-left'></i>
            </div>
            <strong className='text-strong antialiased ms-10'>Go Back</strong>
          </a>
        </div>
      </div>

      <div className='px-content pt-20'>
        <p className='text-muted mt-5 mb-0'>By SocialPass</p>
        <h2 className='text-strong fs-base-p2 fw-700 m-0'>NFT Holders Party</h2>
      </div>

      <div className='row'>
        <div className='col-md-7'>
          <div className='content mt-20 mb-0 me-md-0'>
            <h1 className='text-strong fw-700 fsr-4 m-0'>
              <i className='fa-light fa-check-circle text-success-dim-lm text-success-light-dm me-5'></i>
              Congratulations!
            </h1>
            <p className='mt-10'>
              You made it! We've generated your ticket(s) for the event. You can get them on this
              page, or in the email we sent you at{' '}
              <a href='mailto:tahmid@nftylabs.io' className='fw-bold'>
                tahmid@nftylabs.io
              </a>
              .
            </p>

            <h6 className='fw-700 fsr-6 mt-20'>Event Summary</h6>
            <table className='table table-no-outer-padding'>
              <tbody>
                <tr>
                  <th>Name</th>
                  <td>NFT Holders Party</td>
                </tr>
                <tr>
                  <th>Date</th>
                  <td>Friday, May 15, 8:00 - 10:30 PM EST</td>
                </tr>
                <tr>
                  <th>Location</th>
                  <td>James L. Knight Center, Miami, Florida, USA</td>
                </tr>
              </tbody>
            </table>

            <h6 className='fw-700 fsr-6 mt-20'>Get Tickets</h6>

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
            </button>
          </div>
        </div>

        <div className='col-md-5'>
          <div className='px-content pt-md-20 position-md-sticky top-0 start-0'>
            <h6 className='fw-700 fsr-6 mt-0 mb-10'>Receipt</h6>

            <div className='py-10 border-top'>
              <h6 className='fw-700 m-0 fs-base d-flex align-items-center'>
                <span>General Admission</span>
                <span className='ms-auto ps-10 fw-normal'>&times; 2</span>
              </h6>
              <div className='fs-base-n2 mt-5'>
                <strong>Price</strong>
                &mdash; 0.05 ETH
              </div>
            </div>

            <div className='py-10 border-top'>
              <h6 className='fw-700 m-0 fs-base d-flex align-items-center'>
                <span>Deluxe Admission</span>
                <span className='ms-auto ps-10 fw-normal'>&times; 1</span>
              </h6>
              <div className='fs-base-n2 mt-5'>
                <strong>Price</strong>
                &mdash; 0.075 ETH
              </div>
            </div>

            <button className='btn btn-secondary btn-lg fsr-6 btn-block mt-15' type='button'>
              <strong className='antialiased'>Download Receipt</strong>
            </button>
            <p>
              <strong>Total Price</strong>
              &mdash; 0.125 ETH
            </p>
            <hr />
            <p className='fs-base-n2'>Want to buy more tickets?</p>
            <button className='btn btn-lg btn-block px-20 py-10 fs-base text-base' type='button'>
              <i className='fa-regular fa-rotate-right me-5'></i>
              <strong className='antialiased'>Order Again</strong>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
