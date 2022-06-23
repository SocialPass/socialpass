/* eslint-disable jsx-a11y/alt-text */
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEvent } from "../contexts/EventContext";

function RequiresEvent({children}: any) {
  const { isLoading, isError, setPublicId, eventData }: any = useEvent();
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
    console.log("isLoading")
    // TODO: this should be a loading spinner
    return <>Loading</>
  }

  if (isError){
    console.log("isError")
    return null
  }

  console.log("rendering", eventData)

  return (
    <>
      {children}
    </>
  );
}

export default RequiresEvent;
