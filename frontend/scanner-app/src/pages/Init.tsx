import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTicket } from "../contexts/TicketContext";
import { api } from "../services/api";

export const Init = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { setEventData }: any = useTicket();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`scanner/landing/${params.publicId}/`);
        setEventData(response.data);
        console.log(response);
        navigate("/home");
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [navigate, params.publicId, setEventData]);

  return <div>Loading</div>;
};
