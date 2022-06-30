import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckoutPortalContext } from "../context";
import clock from "../static/images/icons/clock.svg";
import location from "../static/images/icons/location.svg";
import timezone from "../static/images/icons/timezone.svg";
import { AiOutlineClose } from "react-icons/Ai";
import Modal from "react-modal";
// Event Component

const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    width: "600px",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "20px",
  },
};

export const Event = ({ headerType }): JSX.Element => {
  const navigate = useNavigate();
  const { id, retrieveJson, setHeaderType } = useContext(CheckoutPortalContext);
  const [modalIsOpen, setIsOpen] = useState(false);

  setHeaderType(headerType);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function handleNavigate() {
    navigate(`/${id}/ticket-selection`);
  }

  return (
    <>
      <div className="row m-0 align-items-end">
        <div className="col-md-7 d-flex">
          <div className="col col-md-10 mb-30">
            <div className="mb-15 d-flex flex-column align-items-start justify-content-center">
              <span className="fs-16 fw-500">
                {retrieveJson && retrieveJson?.team?.name}
              </span>
              <span className="fs-28 fw-bold">{retrieveJson.title}</span>
              <span className="fs-16 fw-light text-muted text-justify">
                {retrieveJson?.description.length > 200
                  ? retrieveJson?.description.slice(0, 180).concat("...")
                  : retrieveJson?.description}
              </span>
            </div>
            {retrieveJson.description.length > 200 && (
              <div className="my-10 d-flex align-items-center justify-content-start">
                <a
                  className="text-muted fs-16 cursor-pointer text-decoration-underline"
                  onClick={openModal}
                >
                  Read more
                </a>
              </div>
            )}
            <div className="d-flex flex-column gap-5 mb-15">
              <p className="d-flex align-items-center m-0 mt-1 mb-1 fs-16">
                <img
                  src={clock}
                  height="16.9"
                  width="16.9"
                  className="me-5"
                  alt="Date & Time"
                />
                {retrieveJson.start_date}
              </p>
              <p className="d-flex align-items-center m-0 mt-1 mb-1 fs-16">
                <img
                  src={timezone}
                  height="16.9"
                  width="16.9"
                  className="me-5"
                  alt="Timezone"
                />
                {retrieveJson.timezone}
              </p>
              <p className="d-flex align-items-center m-0 mt-1 mb-1 fs-16">
                <img
                  src={location}
                  height="16.9"
                  width="16.9"
                  className="me-5"
                  alt="Location"
                />
                {retrieveJson?.location}
              </p>
            </div>
            <span className="col-md-7 bg-success py-5 px-30 text-center">
              <strong>{retrieveJson.ticket_count}</strong> out of{" "}
              {retrieveJson.capacity} available
            </span>
          </div>
        </div>
        <div className="col-md-4 offset-md-1 ms-5">
          <button className="btn-primary fs-20" onClick={handleNavigate}>
            Claim Tickets
          </button>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
      >
        <div className="d-flex flex-column align-items-end gap-10">
          <AiOutlineClose
            fontSize={18}
            className="cursor-pointer me-5"
            onClick={closeModal}
          />
          <div className="d-flex align-items-center justify-content-center">
            <span className="fs-16 fw-light text-muted text-justify">
              {retrieveJson?.description}
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
};
