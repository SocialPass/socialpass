import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
  total: String;
  attendees: number;
  title: String;
};

export function Header({ total, attendees, title }: HeaderProps) {
  const navigate = useNavigate();

  function handleGoBack() {
    navigate(-1);
  }
  return (
    <header className="d-flex flex-row justify-content-between py-4 px-4">
        <div className="py-2">
          <div className="btn-back">
            <FiArrowLeft onClick={handleGoBack} size={26} />
          </div>
        </div>
        <div className="d-flex flex-column align-items-center py-10">
          <div className="scanner-title">"Teste do Título"</div>
          <h6 className="scanner-subtitle">
            Attendees{" "}
            {attendees === null || attendees === undefined ? 0 : attendees}/
            {total}
          </h6>
        </div>
        <div className="mx-40">
        </div>
    </header>
  );
}
