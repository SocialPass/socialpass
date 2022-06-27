
import { FiHome } from "react-icons/fi";
import { MdOutlineQrCodeScanner } from "react-icons/md";
import { IoMdStats } from "react-icons/io";

import { useNavigate, useParams } from "react-router-dom";

type FooterProps = {
  event_name: String;
  event_attendance: number;
  event_date: String;
  event_venue: String;
};

export function NavigationBar() {
    const navigate = useNavigate();
    const params = useParams();

    return (
        <>
            <div className="btn-close">
                <FiHome onClick={() => {navigate(`/${params.publicId}/`)}} size={26} />
            </div>
            <div className="btn-close">
                <MdOutlineQrCodeScanner onClick={() => {navigate(`/${params.publicId}/scanner`)}} size={26} />
            </div>
            <div className="btn-close">
                <IoMdStats onClick={() => {navigate(`/${params.publicId}/statistics`)}} size={26} />
            </div>
        </>
    )
}
