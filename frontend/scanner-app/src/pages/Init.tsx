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
                const response = await api.get(`http://localhost:8000/api/scanner/landing/${params.publicId}/`);
               /* setEventData(response.data)*/
                console.log(response)
                
                
            } catch (error) {
                console.log(error)                
            }
        }
        fetchData();
    }, [])

    


    return <div>Loading</div>;
};
