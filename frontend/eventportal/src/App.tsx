import { Routes, Route, BrowserRouter } from "react-router-dom";
import { StyledContainer } from "./components";
import { EventPortalProvider } from "./context";
import Web3ProviderWrapper from "./web3/wrapper";
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

// Main EventPortal component. Does a couple of things
// 1. Setup EventPortalProvider (react context)
// 2. Setup WAGMI web3 provider (need to make optional in future)
// 3. Setup Routes, which takes over logic handling
const EventPortal = () => {
  return (
    <BrowserRouter>
      <base href="/" />{" "}
      {/* set static asset to base path for relative imports */}
      <EventPortalProvider>
        <Web3ProviderWrapper>
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
        </Web3ProviderWrapper>
      </EventPortalProvider>
    </BrowserRouter>
  );
};

export default EventPortal;
