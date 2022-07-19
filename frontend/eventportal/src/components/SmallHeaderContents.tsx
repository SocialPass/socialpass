import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CheckoutPortalContext } from "../context";
import _backButton from "../static/images/back.svg";

export default function SmallHeaderContents() {
  const navigate = useNavigate();
  const { retrieveJson } = useContext(CheckoutPortalContext);
  let coverImage = retrieveJson?.cover_image ? retrieveJson?.cover_image : 'https://images.pexels.com/photos/801863/pexels-photo-801863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

  return (
    <>
      <div className="w-100 hs-150 position-relative">
        <div className="d-flex align-items-center justify-content-center w-100 h-100 bg-gray-very-light-lm bg-darkgray-very-dim-dm rounded-top overflow-hidden pe-none">
          <img
            src={coverImage}
            className="w-100 h-auto"
            alt="Cover image"
          />
        </div>

        <div className="position-absolute z-1 bottom-0 start-0 px-content py-20">
          <a
            onClick={() => navigate(-1)}
            href="#"
            className="btn btn-rounded ps-5 d-flex align-items-center"
          >
            <div className="ws-25 hs-25 bg-secondary text-on-secondary rounded-circle d-flex align-items-center justify-content-center">
              <i className="fa-regular fa-arrow-left"></i>
            </div>
            <strong className="text-strong antialiased ms-10">Go Back</strong>
          </a>
        </div>
      </div>
    </>
  );
}
