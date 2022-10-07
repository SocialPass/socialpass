const Footer = () => {
  return (
    <div className='content d-flex align-items-center mt-auto'>
      <a
        href='https://socialpass.gitbook.io/socialpass/'
        target='_blank'
        rel="noreferrer"
        className='text-secondary text-decoration-none fs-base-p4'
      >
        <i className='fa-regular fa-question-circle'></i>
        <span className='visually-hidden'>Help</span>
      </a>
      <span className='ms-auto text-muted'>
        &copy; 2022, SP Tech Inc.<span className='d-none d-sm-inline'> All rights reserved</span>
      </span>
    </div>
  )
}

export default Footer
