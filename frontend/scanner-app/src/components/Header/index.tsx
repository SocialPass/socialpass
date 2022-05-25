import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
  total: number;
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
      <div className="py-2 ">
        <div className="card rounded p-1">
          <FiArrowLeft onClick={handleGoBack} size={22} />
        </div>
      </div>
      <div className="d-flex flex-column align-items-center">
        <h3>{title}</h3>
        {attendees && (
          <h6 className="text-secondary">
            Attendees {attendees}/{total}
          </h6>
        )}
      </div>
      <div></div>
    </header>
  );
}
