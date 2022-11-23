import PropTypes from 'prop-types'
// Loading Component
// todo
export const Loading = ({ loadingText }) => {
  return (
    <div className='row d-flex align-items-center justify-content-center mt-30'>
      <div className='col-12 text-center'>
        <div className='d-flex flex-column justify-content-center'>
          <span className='fs-25 fw-600'>{loadingText}</span>
          <p className='fs-15'>Please wait, this might take a second</p>
        </div>
        <div className='container-progress-bar'>
          <div className='sp-progress'>
            <div
              className='sp-progress-bar sp-progress-bar-animated'
              style={{ width: '100vw' }}
              role='progressbar'
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

Loading.propTypes = {
  loadingText: PropTypes.string,
}