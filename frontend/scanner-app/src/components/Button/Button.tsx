import propTypes from 'prop-types'

const Button = (props) => {
  const { onClick, children, className } = props

  return (
    <button
      className={`btn btn-secondary btn-block rounded-3 shadow ${className}`}
      onClick={() => {
        onClick()
      }}
    >
      {children}
    </button>
  )
}

export default Button

Button.propTypes = {
  onClick: propTypes.func,
  children: propTypes.node,
  className: propTypes.string,
}
