import SomethingWentWrong from '../../assets/something_went_wrong.svg'

const Error = () => {
  return (
    <div className="page-wrapper">
      <div className="content-wrapper ws-820 mw-100 min-vh-100 mx-auto bg-white-lm bg-dark-very-light-dm d-flex flex-column">
        <div>


          <div className="row">
            <div className="col-md-10 col-lg-8 mx-auto">
              <div className="content mt-50 mb-0 text-center">
                <div className="ws-300 mw-100 mx-auto">
                  <img src={SomethingWentWrong} className="d-block w-100 h-auto" alt="something_went_wrong" />
                </div>
                <h1 className="text-strong fw-700 fsr-4 mb-0">
                  Something went wrong!!!
                </h1>
                <p className="mt-10">
                  Looks like something went wrong. Please try reloading the page, or try again after some time.
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
  )
}

export default Error
