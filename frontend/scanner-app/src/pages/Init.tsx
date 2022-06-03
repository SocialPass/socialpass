import { useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTicket } from "../contexts/TicketContext";
import { api } from "../services/api";

export const Init = () => {
    const navigate = useNavigate();
    const params = useParams();
    const  {setEventData}: any = useTicket();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get(`api/scanner/${params.id}/scan-landing`);
                setEventData(response.data)
                navigate("/home");
                console.log(response.data)
                
            } catch (error) {
                console.log(error)                
            }
        }
        fetchData();
    }, [])

    


    return <div>Loading</div>;
};
