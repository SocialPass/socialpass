import useTheme from '@/hooks/useTheme'

const CapacityReached = () => {
  const { theme }: any = useTheme()

  return (
    <div className='landing-page-background p-10 py-50'>
      <div className='d-flex flex-column align-items-center justify-content-around'>
        <img className='p-30' src={theme?.logo} />
        <div className='d-flex flex-column align-items-center justify-content-center gap-4 p-10'>
          <div className='capacity-reached-title pt-20'>Awesome!</div>
          <div className='capacity-reached-body p-20'>Every generated ticket has been scanned!</div>
        </div>
      </div>
    </div>
  )
}

export default CapacityReached
