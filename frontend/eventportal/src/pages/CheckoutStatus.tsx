import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CheckoutPortalContext } from "../context";
import CheckoutSuccessPage from "../components/CheckoutSuccessPage";
import CheckoutFailedPage from "../components/CheckoutFailedPage";

export const CheckoutStatus = () => {
  const { grantAccessJson, grantAccessError } = useContext(
    CheckoutPortalContext
  );

  //console.log(grantAccessJson, grantAccessError);

  if (grantAccessJson) {
    return (
      <CheckoutSuccessPage/>
    );
  }
  return (
    <CheckoutFailedPage/>
  );
};
