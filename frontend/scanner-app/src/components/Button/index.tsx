import propTypes from 'prop-types'

export function Button(props) {
  const { onClick, children } = props

  return (
    <button
      className='btn-start-scanning'
      onClick={() => {
        onClick()
      }}
    >
      {children}
    </button>
  )
}

Button.propTypes = {
  onClick: propTypes.func,
  children: propTypes.node,
}
