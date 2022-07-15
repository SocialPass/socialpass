import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import _backButton from "../static/images/back.svg";
import LargeHeaderContents from "./LargeHeaderContents";
import SmallHeaderContents from "./SmallHeaderContents";

export default function Header() {
  const location = useLocation();

  // Every URL change we rebuild the header if needed
  useEffect(() => {
    makeHeader();
  }, [location]);

  var [headerState, setHeaderState] = useState("header");

  const makeHeader = () => {
    // We are checking for the string event on the URL to show the full header
    // And if the string is not found, we display the smaller, darker header
    if (location.pathname.includes("event")) {
      setHeaderState("header");
    } else {
      setHeaderState("small-header");
    }
  };

  return headerState === "header" ? (
    <LargeHeaderContents />
  ) : (
    <SmallHeaderContents />
  );
}
