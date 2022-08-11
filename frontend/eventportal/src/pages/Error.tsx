import errorImage from '../static/images/something_went_wrong.svg'

export function Error() {
  return (
    <div className='content'>
      <div className='ws-500 mw-100 mx-auto text-center'>
        <div className='ws-300 mw-100 mx-auto'>
          <img src={errorImage} className='d-block w-100 h-auto' alt='something_went_wrong' />
        </div>
        <h1 className='text-strong fw-700 fsr-1 mb-0'>Something went wrong!</h1>
        <p>
          Looks like something went wrong. Please try reloading the page, or try again after some
          time.
        </p>
      </div>
    </div>
  )
}
