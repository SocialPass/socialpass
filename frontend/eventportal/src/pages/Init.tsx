import { useEffect, useContext } from "react";
import { EventPortalContext } from "../context";
import { TicketedEventRetrieve } from "../api";
import { useNavigate } from "react-router-dom";
import { Loading } from "../components";

export const Init = () => {
  const { setID, retrieveJson, setRetrieveJson, setRetrieveError } =
    useContext(EventPortalContext);
  const navigate = useNavigate();
  let id = window.location.pathname;
  id = id.replace("/", "");
  useEffect(() => {
    (async function () {
      if (id !== "/") {
        const response = await TicketedEventRetrieve.call({ public_id: id });
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
            navigate("/ticketed-event");
          }
        }
      }
    })();
  }, []);

  return <Loading loadingText="Fetching event data..." />;
};
