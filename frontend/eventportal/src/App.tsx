import { Routes, Route, BrowserRouter } from "react-router-dom";
import { StyledContainer } from "./components";
import { EventPortalProvider } from "./context";
import { web3Client } from "./web3/client";
import { WagmiConfig } from "wagmi";
import { Init, CheckoutWeb3, CheckoutStatus, Event } from "./pages";
import RequiresEvent from "./utils/requiresEventHOC";
import { QueryClient, QueryClientProvider } from "react-query";
import { Error } from "./pages/Error";
import "./styles/global.css";

// Main CheckoutPortal component. Does a couple of things
// 1. Setup CheckoutPortalProvider (react context)
// 2. Setup WAGMI web3 provider (need to make optional in future)
// 3. Setup Routes, which takes over logic handling
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 0 } },
});
const CheckoutPortal = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <EventPortalProvider>
          <WagmiConfig client={web3Client}>
            <StyledContainer>
              <Routes>
                <Route path="/:publicId">
                  <Route
                    path=""
                    element={
                      <RequiresEvent>
                        <Init />
                      </RequiresEvent>
                    }
                  />
                  <Route
                    path="event"
                    element={
                      <RequiresEvent>
                        <Event />
                      </RequiresEvent>
                    }
                  />
                  <Route
                    path="checkout/blockchain"
                    element={
                      <RequiresEvent>
                        <CheckoutWeb3 />
                      </RequiresEvent>
                    }
                  />
                  <Route
                    path="checkout/status"
                    element={
                      <RequiresEvent>
                        <CheckoutStatus />
                      </RequiresEvent>
                    }
                  />
                  <Route path="error" element={<Error />} />
                </Route>
              </Routes>
            </StyledContainer>
          </WagmiConfig>
        </EventPortalProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default CheckoutPortal;
