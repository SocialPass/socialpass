/* eslint-disable jsx-a11y/alt-text */
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEvent } from "../contexts/EventContext";
import { FiArrowLeft } from "react-icons/fi";
import CloseCircleIcon from "../assets/closeIcon.svg";
import { HashLoader } from "react-spinners";

function RequiresEvent({ children }: any) {
  const {
    status,
    isLoading,
    isError,
    setPublicId,
    eventData,
  }: any = useEvent();
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setPublicId(params.publicId);
  }, [params]);

  useEffect(() => {
    if (isError) {
      navigate("../error");
    }
  }, [isError]);

  if (isError) {
    return null;
  }

  if (isLoading) {
    // TODO: this should be a loading spinner
    return (
      <div className="error-footer">
        <div className="error-padding"></div>
        <div className="d-flex flex-column align-items-center justify-content-center">
          <div className="mb-50">
            <HashLoader color="#EF7C4E" size={120} />
          </div>
          <div className="fs-16 fw-500 mt-50">
            Loading event, please wait a second...
          </div>
        </div>
      </div>
    );
  }

  if (status !== "success" || (eventData === undefined)){
    return null;
  }

  return <>{children}</>;
}

export default RequiresEvent;
