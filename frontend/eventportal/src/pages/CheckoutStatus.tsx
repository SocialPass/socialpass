import { useContext } from "react";
import { CheckoutPortalContext } from "../context";
import CheckoutSuccessPage from "../components/CheckoutSuccessPage";
import CheckoutFailedPage from "../components/CheckoutFailedPage";

export const CheckoutStatus = () => {
  const { grantAccessJson } = useContext(
    CheckoutPortalContext
  );

  if (grantAccessJson) {
    return (
      <CheckoutSuccessPage/>
    );
  }
  return (
    <CheckoutFailedPage/>
  );
};
