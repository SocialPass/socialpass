import useEvent from '@/hooks/useEvent'

const NavBar = () => {
  const { event }: any = useEvent()
  const { team } = event

  return (
    <nav className='d-flex align-items-center px-20 py-5 m-10 bg-content rounded-3 shadow-lg'>
      <a
        href='#'
        className='d-flex align-items-center link-reset text-decoration-none fw-bold user-select-none'
      >
        <div className='ws-75'>
          <img
            src={team?.theme?.logo}
            alt={team?.theme?.brand_name}
            className='d-block w-100 h-auto'
          />
        </div>
        <div className='text-strong ms-10'>
          <div className='fs-base-p4'>{team?.theme?.brand_name}</div>
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
