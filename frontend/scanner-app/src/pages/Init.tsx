import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTicket } from "../contexts/TicketContext";
import { api } from "../services/api";

export const Init = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { setEventData, bustEventDataCache }: any = useTicket();

  useEffect(() => {
    api.get(
      `scanner/landing/${params.publicId}/`
    ).then((response) => {
      setEventData({...response.data, redemption_code: params.publicId});
      navigate("/home");
    }).catch((error) => {
      bustEventDataCache();
      navigate("error");
    });
  }, []);

  return <div>Loading</div>;
};
