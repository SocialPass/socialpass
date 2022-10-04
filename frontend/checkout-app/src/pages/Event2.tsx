import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckoutPortalContext } from '../context'

export const Event = (): JSX.Element => {
  const navigate = useNavigate()
  const { id, retrieveJson, generalAdmissionSelect, setGeneralAdmissionSelect } =
    useContext(CheckoutPortalContext)

  const generalAdmissionSelectArray = Array.from(
    { length: generalAdmissionSelect },
    (_, i) => i + 1,
  )

  function handleNavigate() {
    navigate(`/${id}/checkout/blockchain`)
  }

  function handleSelect(event: any) {
    setGeneralAdmissionSelect(event.target.value)
  }

  return (

    <div className="page-wrapper">
      <div>
        <div className="content-wrapper ws-820 mw-100 min-vh-100 mx-auto bg-white-lm bg-dark-very-light-dm d-flex flex-column">
          <div>
            <nav className="d-flex align-items-center px-20">
              <a href="#" className="d-flex align-items-center link-reset text-decoration-none fw-bold user-select-none">
                <div className="ws-75">
                  <div className="d-block w-100 h-auto"></div>
                </div>
                <div className="text-strong ms-10">
                  <div className="fs-base-p4">
                    SocialPass
                  </div>
                  <div className="fs-base-n4 lh-1 fw-normal">
                    Ticket Portal
                  </div>
                </div>
              </a>
              <button type="button" className="btn btn-sm btn-square btn-rounded ms-20" data-hm-toggle="dark-mode">
                <i className="fa-solid fa-moon"></i>
                <span className="visually-hidden">Toggle dark mode</span>
              </button>
            </nav>
            <div className="w-100 hs-200 position-relative">
              <div className="d-flex align-items-center justify-content-center w-100 h-100 bg-gray-very-light-lm bg-darkgray-very-dim-dm rounded-top overflow-hidden pe-none">
                <div className="w-100 h-auto"></div>
              </div>

              <div className="position-absolute z-1 top-100 start-50 translate-middle px-content">
                <div className="ws-75 hs-75 rounded-circle border border-5 border-blend d-flex align-items-center justify-content-center overflow-hidden">
                <div className="d-block w-100 h-auto"></div>
                </div>
              </div>
            </div>

            <div className="px-content pt-40 text-center">
              <p className="text-muted mt-5 mb-0">
                Hosted By
              </p>
              <h6 className="text-strong fs-base fw-700 m-0">
                SocialPass
              </h6>
            </div>

            <div className="row">
              <div className="col-md-7">
                <div className="content mt-20 mb-0">
                  <h1 className="text-strong fw-700 display-6 m-0">
                    NFT Holders Party
                  </h1>
                  <p className="mt-20 fsr-6">
                    Come celebrate with the SocialPass Team! All NFT holders are invited. You just need to make sure you're 21+ to enter.
                  </p>
                </div>
              </div>

              <div className="col-md-5">
                <div className="content mt-0 mt-md-30 mb-0">
                  <div className="d-flex align-items-center">
                    <div className="ws-25 flex-shrink-0">
                      <i className="fa-regular fa-clock"></i>
                    </div>
                    <div className="fw-bold">
                      Date and Time
                    </div>
                  </div>
                  <p className="text-muted mt-5 mb-0">
                    Friday, May 15, 8:00 - 10:30 PM EST
                  </p>

                  <div className="d-flex align-items-center mt-15">
                    <div className="ws-25 flex-shrink-0">
                      <i className="fa-regular fa-location-dot"></i>
                    </div>
                    <div className="fw-bold">
                      Location
                    </div>
                  </div>
                  <p className="text-muted mt-5 mb-0">
                    James L. Knight Center,
                    <br />
                    Miami, Florida, USA
                  </p>
                </div>
              </div>

              <div className="col-12">
                <div className="content mt-20 mb-0">
                  <div className="alert alert-primary m-0 text-primary-dim-lm px-20 py-10 fw-bold rounded-2 d-flex align-items-center" role="alert">
                    <i className="fa-regular fa-check me-15"></i>
                    <p className="m-0">
                      Tickets available! Please select the payment type and tickets you want to purchase.
                    </p>
                  </div>
                  <div className="alert alert-danger m-0 text-danger-dim-lm px-20 py-10 fw-bold rounded-2 d-flex align-items-center" role="alert">
                    <i className="fa-regular fa-times me-15"></i>
                    <p className="m-0">
                      Sorry! Tickets are not available for this event.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="content mb-0">
              <div className="ticket-tier-group">
                <div className="ticket-tier">
                  <button className="ticket-tier-input" name="payment-type" id="fiat"></button>
                    <label className="ticket-tier-label">
                      <h6 className="fw-700 m-0 fs-base">
                        <i className="fa-light fa-money-check-dollar-pen text-primary me-5"></i>
                        Fiat
                      </h6>
                    </label>
                </div>

                <div className="ticket-tier">
                  <button className="ticket-tier-input" name="payment-type" id="crypto"></button>
                    <label className="ticket-tier-label">
                      <h6 className="fw-700 m-0 fs-base">
                        <i className="fa-light fa-wallet text-primary me-5"></i>
                        Crypto
                      </h6>
                    </label>
                </div>

                <div className="ticket-tier">
                  <button className="ticket-tier-input" name="payment-type" id="nfts"></button>
                    <label className="ticket-tier-label">
                      <h6 className="fw-700 m-0 fs-base">
                        <i className="fa-light fa-hexagon-image text-primary me-5"></i>
                        NFTs
                      </h6>
                    </label>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-7">
                <div className="content me-md-0">
                  <div className="ticket-tier mb-20">
                    <button className="ticket-tier-input" id="c1"></button>
                      <label className="ticket-tier-label">
                        <div className="d-sm-flex align-items-center">
                          <div className="pe-sm-15">
                            <h6 className="fw-700 m-0 fs-base">
                              <span className="ticket-tier-uncheck">
                                <i className="fa-light fa-square"></i>
                              </span>
                              <span className="ticket-tier-check">
                                <i className="fa-light fa-check-square"></i>
                              </span>
                              General Admission
                            </h6>
                            <p className="m-0 fs-base-n2">
                              45 available
                            </p>
                          </div>
                          <div className="ticket-tier-controls ms-auto mt-10 mt-sm-0">
                            <div className="input-group input-group-sm input-group-pill ws-100 mx-auto">
                              <button className="btn ws-25 px-0">&minus;</button>
                              <button className="form-control form-number text-center"></button>
                                <button className="btn ws-25 px-0">&plus;</button>
                            </div>
                            <div className="text-center fs-base-n2 mt-5">
                              <strong>Price &times; 1</strong>
                              &mdash; $9.99
                            </div>
                          </div>
                        </div>
                      </label>
                  </div>

                  <div className="ticket-tier mb-20">
                    <button className="ticket-tier-input" id="c2"></button>
                      <label className="ticket-tier-label">
                        <div className="d-sm-flex align-items-center">
                          <div className="pe-sm-15">
                            <h6 className="fw-700 m-0 fs-base">
                              <span className="ticket-tier-uncheck">
                                <i className="fa-light fa-square"></i>
                              </span>
                              <span className="ticket-tier-check">
                                <i className="fa-light fa-check-square"></i>
                              </span>
                              Deluxe Admission
                            </h6>
                            <p className="m-0 fs-base-n2">
                              124 available
                            </p>
                          </div>
                          <div className="ticket-tier-controls ms-auto mt-10 mt-sm-0">
                            <div className="input-group input-group-sm input-group-pill ws-100 mx-auto">
                              <button className="btn ws-25 px-0">&minus;</button>
                              <button className="form-control form-number text-center"></button>
                                <button className="btn ws-25 px-0">&plus;</button>
                            </div>
                            <div className="text-center fs-base-n2 mt-5">
                              <strong>Price &times; 1</strong>
                              &mdash; $24.99
                            </div>
                          </div>
                        </div>
                      </label>
                  </div>

                  <div className="ticket-tier mb-20">
                    <button className="ticket-tier-input" id="c3"></button>
                      <label className="ticket-tier-label">
                        <div className="d-sm-flex align-items-center">
                          <div className="pe-sm-15">
                            <h6 className="fw-700 m-0 fs-base">
                              <span className="ticket-tier-uncheck">
                                <i className="fa-light fa-square"></i>
                              </span>
                              <span className="ticket-tier-check">
                                <i className="fa-light fa-check-square"></i>
                              </span>
                              VIP Admission
                            </h6>
                            <p className="m-0 fs-base-n2">
                              4 available
                            </p>
                          </div>
                          <div className="ticket-tier-controls ms-auto mt-10 mt-sm-0">
                            <div className="input-group input-group-sm input-group-pill ws-100 mx-auto">
                              <button className="btn ws-25 px-0">&minus;</button>
                              <button className="form-control form-number text-center"></button>
                                <button className="btn ws-25 px-0">&plus;</button>
                            </div>
                            <div className="text-center fs-base-n2 mt-5">
                              <strong>Price &times; 1</strong>
                              &mdash; $99.99
                            </div>
                          </div>
                        </div>
                      </label>
                  </div>
                </div>
              </div>

              <div className="col-md-5">
                <div className="px-content pt-md-30 position-md-sticky top-0 start-0">
                  <button className="btn btn-secondary btn-lg fsr-6 btn-block">
                    <strong className="antialiased">Get Tickets</strong>
                  </button>
                  <p>
                    <strong>Total Price</strong>
                    &mdash;
                    $9.99
                  </p>
                  <hr />
                  <p className="text-muted fs-base-n2">
                    By clicking on the above button, you're agreeing to our <a href="#" className="fw-bold">Terms & Conditions</a>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="content text-end border-top pt-10">
            <span className="ms-auto text-muted fs-base-n2">
              &copy; 2022, SP Tech Inc. All rights reserved
            </span>
          </div>
        </div>
      </div>
    </div >

  )
}
