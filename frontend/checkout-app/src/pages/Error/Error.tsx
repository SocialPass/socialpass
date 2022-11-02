import SomethingWentWrong from '../../assets/something_went_wrong.svg'

const Error = () => {
  return (
    <div className='page-wrapper'>
      {/* Content wrapper start */}
      <div className='content-wrapper ws-860 mw-100 min-vh-100 mx-auto bg-white-lm bg-dark-very-light-dm d-flex flex-column'>
        {/* Main content start */}
        <div className='content'>
          <div className='ws-500 mw-100 mx-auto text-center'>
            <div className='ws-300 mw-100 mx-auto'>
              <img
                src={SomethingWentWrong}
                className='d-block w-100 h-auto'
                alt='something_went_wrong'
              />
            </div>
            <h1 className='text-strong fw-700 fsr-1 mb-0'>Something went wrong!</h1>
            <p>
              Looks like something went wrong. Please try reloading the page, or try again after
              some time.
            </p>
            <p className='border-top pt-10 mt-10 text-muted fs-base-n4'>
              If this problem persists, please consider{' '}
              <a
                href='https://nfty-ecosystem.typeform.com/socialpass-help'
                className='fw-bold'
                target='_blank'
                rel='noreferrer'
              >
                contacting us
              </a>{' '}
              and letting us know.
            </p>
          </div>
        </div>
        {/* Main content end */}

        {/* Footer start */}
        <div className='content d-flex align-items-center mt-auto'>
          <a
            href='https://socialpass.gitbook.io/socialpass/'
            target='_blank'
            className='text-secondary text-decoration-none fs-base-p4'
            rel='noreferrer'
          >
            <i className='fa-regular fa-question-circle'></i>
            <span className='visually-hidden'>Help</span>
          </a>
          <span className='ms-auto text-muted'>
            &copy; 2022, SP Tech Inc.
            <span className='d-none d-sm-inline'> All rights reserved</span>
          </span>
        </div>
        {/* Footer end */}
      </div>
      {/* Content wrapper end */}
    </div>
  )
}

export default Error
