import { useContext } from "react";
import { CheckoutPortalContext } from "../context";
import _backButton from "../static/images/back.svg";

export default function LargeHeaderContents() {
  const { retrieveJson } = useContext(CheckoutPortalContext);
  let coverImage = retrieveJson?.cover_image ? retrieveJson?.cover_image : 'https://images.pexels.com/photos/801863/pexels-photo-801863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

  return (
    <>
      <div className="w-100 hs-200 position-relative">
        {/* <!-- Event cover image start --> */}
        <div className="d-flex align-items-center justify-content-center w-100 h-100 bg-gray-very-light-lm bg-darkgray-very-dim-dm rounded-top overflow-hidden pe-none">
          <img
            src={coverImage}
            className="w-100 h-auto"
            alt="Cover image"
          />
        </div>
        {/* <!-- Event cover image end --> */}

        {/* <!-- Team image start --> */}
        {retrieveJson?.team.image && retrieveJson.show_team_image &&
        <div className="position-absolute z-1 top-100 start-0 translate-y-middle px-content">
          <div className="ws-100 hs-100 rounded-circle border border-5 border-blend d-flex align-items-center justify-content-center overflow-hidden">
            <img
              src={retrieveJson?.team.image}
              className="d-block w-100 h-auto"
              alt="Team image"
            />
          </div>
        </div>
        }
        {/* <!-- Team image end --> */}
      </div>
      <div className="px-content pt-50">
        <p className="text-muted mt-5 mb-0">Hosted By</p>
        <h2 className="text-strong fs-base fw-700 m-0">
          {retrieveJson?.team.name}
        </h2>
      </div>
    </>
  );
}
