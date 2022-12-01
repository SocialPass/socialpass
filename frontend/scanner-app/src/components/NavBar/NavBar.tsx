import useTheme from '@/hooks/useTheme'

const NavBar = () => {
  const { theme }: any = useTheme()

  return (
    <nav className='d-flex align-items-center px-20 my-5 mx-10 bg-content rounded-3 shadow-lg'>
      <a
        href='#'
        className='d-flex align-items-center link-reset text-decoration-none fw-bold user-select-none'
      >
        <div className='ws-75'>
          <img src={theme?.logo} alt={theme?.brand_name} className='d-block w-100 h-auto' />
        </div>
        <div className='text-strong ms-10'>
          <div className='fs-base-p4'>{theme?.brand_name}</div>
          <div className='fs-base-n4 lh-1 fw-normal'>Ticket Scanner</div>
        </div>
      </a>

      <button
        type='button'
        className='btn btn-sm btn-square btn-rounded ms-auto'
        data-hm-toggle='dark-mode'
      >
        <i className='fa-solid fa-moon'></i>
        <span className='visually-hidden'>Toggle dark mode</span>
      </button>
    </nav>
  )
}

export default NavBar
