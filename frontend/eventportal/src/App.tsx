import { Routes, Route, BrowserRouter } from "react-router-dom";
import { StyledContainer } from "./components";
import { CheckoutPortalProvider } from "./context";
import { web3Client } from "./web3/client";
import { WagmiConfig } from 'wagmi'
import {
  Init,
  CheckoutWeb3,
  CheckoutStatus,
  TicketSelection,
  Event,
} from "./pages";
import "./static/css/socialpass-theme.css";
import "./static/css/halfmoon.css";
import "./index.css";

// Main CheckoutPortal component. Does a couple of things
// 1. Setup CheckoutPortalProvider (react context)
// 2. Setup WAGMI web3 provider (need to make optional in future)
// 3. Setup Routes, which takes over logic handling
const CheckoutPortal = () => {
  return (
    <BrowserRouter>
      <base href="/" />{" "}
      {/* set static asset to base path for relative imports */}
      <CheckoutPortalProvider>
        <WagmiConfig client={web3Client}>
          <StyledContainer>
            <Routes>
              <Route path="/:publicId" element={<Init />} />
              <Route path="/:publicId/event" element={<Event />} />
              <Route
                path="/:publicId/ticket-selection"
                element={<TicketSelection />}
              />
              <Route
                path="/:publicId/checkout/blockchain"
                element={<CheckoutWeb3 />}
              />
              <Route
                path="/:publicId/checkout/status"
                element={<CheckoutStatus />}
              />
            </Routes>
          </StyledContainer>
        </WagmiConfig>
      </CheckoutPortalProvider>
    </BrowserRouter>
  );
};

export default CheckoutPortal;
