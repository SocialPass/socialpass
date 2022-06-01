import React from "react";
import { MemoryRouter, Routes, Route, BrowserRouter } from "react-router-dom";
import { Loading, StyledContainer } from "./components";
import { EventPortalProvider } from "./context";
import Web3ProviderWrapper from "./web3/wrapper";
import { Init, Web3ConnectWallet, Web3CheckoutConfirmation } from "./pages";
import "./static/css/socialpass-theme.css";
import "./static/css/halfmoon.css";
import "./index.css";
import { Web3TicketSelection } from "./pages/Web3TicketSelection";
import { TicketedEvent } from "./pages/TicketedEvent";
import { StatusEventPage } from "./pages/StatusEventPage";

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
              <Route index element={<Init />} />
              <Route
                path="/loading"
                element={<Loading loadingText="Gathering Your Eligible NFTS" />}
              />
              <Route path="/ticketed-event" element={<TicketedEvent />} />
              <Route
                path="/checkout/web3/select"
                element={<Web3TicketSelection />}
              />
              <Route
                path="/checkout/web3/connect"
                element={<Web3ConnectWallet />}
              />
              <Route path="/checkout/status" element={<StatusEventPage />} />
              {/* ========================================================== */}
              <Route
                path="/checkout/web3/checkout"
                element={<Web3CheckoutConfirmation />}
              />
            </Routes>
          </StyledContainer>
        </Web3ProviderWrapper>
      </EventPortalProvider>
    </BrowserRouter>
  );
};

export default EventPortal;
