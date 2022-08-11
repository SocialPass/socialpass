import { useState } from 'react'
import PropTypes from 'prop-types'

import infoButton from '../static/images/icons/infoButton.svg'

const HoverableDiv = ({ handleMouseOver, handleMouseOut }) => {
  return (
    <div onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      <img src={infoButton} />
    </div>
  )
}

const HoverText = (props) => {
  return (
    <div>
      <div className={props.location}>
        <span className='tooltip-text fs-12'>
          Proof of ownership is not a NFT trade. We need to prove you own the NFT in order to get
          the ticket.
        </span>
        <i></i>
      </div>
    </div>
  )
}

const NFTOwnershipFAQHoverIcon = (props) => {
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

export default NFTOwnershipFAQHoverIcon

HoverableDiv.propTypes = {
  handleMouseOver: PropTypes.func,
  handleMouseOut: PropTypes.func,
}

HoverText.propTypes = {
  location: PropTypes.string,
}

NFTOwnershipFAQHoverIcon.propTypes = {
  locationClass: PropTypes.string,
}
