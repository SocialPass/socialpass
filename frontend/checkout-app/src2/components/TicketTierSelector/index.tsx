import React from 'react';
import { useState } from 'react';

function TicketTierSelector(): JSX.Element {
    const [isSelected, setIsSelected] =
        useState(false);

    return (
        <>
            <div className="content mb-0">
                <div className="ticket-tier-group">
                    {/*<!-- Fiat start -->*/}
                    <div className="ticket-tier">
                        <input className= {`${ "ticket-tier-input"} ${
            isSelected === true ? "btn-active" : "btn-inactive"
          }`} name="payment-type" id="fiat" checked
                        onClick={() => setIsSelected(() => true)}></input>
                        <label htmlFor="fiat" className="ticket-tier-label">
                            <h6 className="fw-700 m-0 fs-base">
                                <span className="ticket-tier-uncheck">
                                    <i className="fa-light fa-money-check-dollar-pen"></i>
                                </span>
                                <span className="ticket-tier-check">
                                    <i className="fa-light fa-money-check-dollar-pen"></i>
                                </span>
                                Fiat
                            </h6>
                        </label>
                    </div>
                    {/*<!-- Fiat end -->*/}

                    {/*<!-- Crypto start -->*/}
                    <div className="ticket-tier">
                        <input type="radio" className="ticket-tier-input" name="payment-type" id="crypto"></input>
                        <label htmlFor="crypto" className="ticket-tier-label">
                            <h6 className="fw-700 m-0 fs-base">
                                <span className="ticket-tier-uncheck">
                                    <i className="fa-light fa-wallet"></i>
                                </span>
                                <span className="ticket-tier-check">
                                    <i className="fa-light fa-wallet"></i>
                                </span>
                                Crypto
                            </h6>
                        </label>
                    </div>
                    {/*<!-- Crypto end -->*/}

                    {/*<!-- NFTs start -->*/}
                    <div className="ticket-tier">
                        <input type="radio" className="ticket-tier-input" name="payment-type" id="nfts"></input>
                        <label htmlFor="nfts" className="ticket-tier-label">
                            <h6 className="fw-700 m-0 fs-base">
                                <span className="ticket-tier-uncheck">
                                    <i className="fa-light fa-hexagon-image"></i>
                                </span>
                                <span className="ticket-tier-check">
                                    <i className="fa-light fa-hexagon-image"></i>
                                </span>
                                NFTs
                            </h6>
                        </label>
                    </div>
                    {/*<!-- NFTs end -->*/}
                </div>
            </div>
        </>
    );
}

export default TicketTierSelector;