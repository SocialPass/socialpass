import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export function Error() {
  const navigate = useNavigate();

  function handleGoBack() {
    navigate(-1);
  }

  return (
    <div className="row d-flex align-items-center justify-content-center">
      <div>
        <FiArrowLeft onClick={handleGoBack} size={30} />
      </div>
      <div className="d-flex flex-column justify-content-center align-items-center mt-30">
        <span className="fs-25 fw-600">Error</span>
        <p className="fs-15">Sorry, no event was found.</p>
      </div>
    </div>
  );
}
