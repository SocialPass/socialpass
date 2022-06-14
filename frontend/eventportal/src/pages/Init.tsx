import { useEffect, useContext } from "react";
import { EventPortalContext } from "../context";
import { TicketedEventRetrieve } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import { Loading } from "../components";

export const Init = () => {
  const { setID, setRetrieveJson, setRetrieveError } = useContext(EventPortalContext);
  const navigate = useNavigate();
  const params = useParams();
  const id = params.publicId;
  useEffect(() => {
    (async function () {
      if (id !== "/") {
        setID(id);
        const response = await TicketedEventRetrieve.call({ public_id: id });

        if (response && response.httpStatus) {
          if (response.httpStatus === 200) {
            setRetrieveJson(response);
            setTimeout(() => {
              navigate(`event`);
            },1000)

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
