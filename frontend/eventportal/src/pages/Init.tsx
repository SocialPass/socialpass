import { useEffect, useContext } from "react";
import { EventPortalContext } from "../context";
import { TicketedEventRetrieve } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import { Loading } from "../components";

export const Init = () => {
  const { setID, setRetrieveJson, setRetrieveError } =
    useContext(EventPortalContext);
  const navigate = useNavigate();
  const params = useParams();
  const id = params.publicId;
  useEffect(() => {
    (async function () {
      if (id !== "/") {
        setID(id);
        console.log(id);
        localStorage.setItem("@eventId", JSON.stringify(id));
        const response = await TicketedEventRetrieve.call({ public_id: id });

        if (response && response.httpStatus) {
          // success
          if (response.httpStatus === 200) {
            setRetrieveJson(response);
            localStorage.setItem("@retrieveJson", JSON.stringify(response));
            navigate(`event`);
          }
          // error
          else {
            setRetrieveError(response);
          }
        }
      }
    })();
  }, []);

  return <Loading loadingText="Fetching event data..." />;
};
