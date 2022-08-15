import { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { truncateAddress } from '../utils'
import infoButton from '../static/images/icons/infoButton.svg'
import { CheckoutPortalContext } from '../context'

const HoverableDiv = ({ handleMouseOver, handleMouseOut }) => {
  return (
    <div onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      <img src={infoButton} />
    </div>
  )
}

const HoverText = (props) => {
  const { retrieveJson } = useContext(CheckoutPortalContext)
  return (
    <div>
      <div className={props.location}>
        <span className='tooltip-text fs-11'>
          This General Admission ticket is free to all holders of 1 NFT collection:
          <hr />
          {retrieveJson?.requirements.map((req, i) => (
            <div key={i}>
              <h3>Option {i + 1}</h3>
              <span className='fs-12'>
                Contract: <span>{truncateAddress(req['asset_address'])}</span>
              </span>
              <hr />
            </div>
          ))}
        </span>
      </div>
    </div>
  )
}

const GeneralAdmissionFAQHoverIcon = (props) => {
  const [isHovering, setIsHovering] = useState(false)
  const handleMouseOver = () => {
    setIsHovering(true)
  }

  const handleMouseOut = () => {
    setIsHovering(false)
  }

  return (
    <div>
      {/* Hover over this div to hide/show <HoverText /> */}
      <HoverableDiv handleMouseOver={handleMouseOver} handleMouseOut={handleMouseOut} />
      {isHovering && <HoverText location={props.locationClass} />}
    </div>
  )
}

export default GeneralAdmissionFAQHoverIcon

HoverableDiv.propTypes = {
  handleMouseOver: PropTypes.func,
  handleMouseOut: PropTypes.func,
}

HoverText.propTypes = {
  location: PropTypes.string,
}

GeneralAdmissionFAQHoverIcon.propTypes = {
  locationClass: PropTypes.string,
}
