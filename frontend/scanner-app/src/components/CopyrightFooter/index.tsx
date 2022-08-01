import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { HashLoader } from "react-spinners";
import { useEvent } from "../../contexts/EventContext";


export function CopyrightFooter()   {

  return (
    <div className="copyright-footer d-flex flex-column py-10 px-30 justify-content-center align-items-center">
        © 2022, SPTech Group Inc. All rights reserved
    </div>
  );
}
