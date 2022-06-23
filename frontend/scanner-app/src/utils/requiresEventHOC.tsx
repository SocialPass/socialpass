/* eslint-disable jsx-a11y/alt-text */
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEvent } from "../contexts/EventContext";

function RequiresEvent({children}: any) {
  const { status, isLoading, isError, setPublicId, data: eventData }: any = useEvent();
  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    setPublicId(params.publicId)
  }, [params])

  useEffect(() => {
    if (isError){
      navigate("../error")
    }
  }, [isError])

  if (isLoading){
    // TODO: this should be a loading spinner
    return <>Loading</>
  }

  if (isError){
    return null
  }

  if (status !== "success") return null

  return (
    <>
      {children}
    </>
  );
}

export default RequiresEvent;
