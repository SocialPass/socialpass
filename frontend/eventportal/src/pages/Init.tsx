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
  let id = window.location.pathname;
  id = params.publicId;
  console.log(id);
  useEffect(() => {
    (async function () {
      if (id !== "/") {
        const response = await TicketedEventRetrieve.call({ public_id: id });
        console.log(response);
        if (response && response.httpStatus) {
          // success
          if (response.httpStatus === 200) {
            setID(id);
            setRetrieveJson(response);
            navigate("/ticketed-event");
          }
          // error
          else {
            setRetrieveError(response);
            // navigate("/ticketed-event");
          }
        }
      }
    })();
  }, []);

  return <Loading loadingText="Fetching event data..." />;
};
