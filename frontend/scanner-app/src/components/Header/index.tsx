import React from "react";

type HeaderProps = {
  total: number;
  attendees: number;
  title: String;
};

export function Header({ total, attendees, title }: HeaderProps) {
  return (
    <header className="d-flex flex-column align-items-center py-2">
      <h3>{title}</h3>
      <h6>
        Attendees {attendees}/{total}
      </h6>
    </header>
  );
}
