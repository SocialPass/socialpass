/* eslint-disable jsx-a11y/alt-text */
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEvent } from "../contexts/EventContext";

function RequiresEvent({children}: any) {
  const { isLoading, isError, setPublicId }: any = useEvent();
  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    console.log("sup")
    setPublicId(params.publicId)
  }, [params.publicId])

  if (isLoading){
    // TODO: this should be a loading spinner
    return <>Loading</>
  }

  if (isError){
    navigate("../error")
  }

  return (
    <>
      {children}
    </>
  );
}

export default RequiresEvent;
