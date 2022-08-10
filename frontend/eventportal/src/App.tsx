import { Routes, Route, BrowserRouter } from "react-router-dom";
import { StyledContainer } from "./components";
import { EventPortalProvider } from "./context";
import { WagmiConfig } from "wagmi";
import { client } from "./web3/client";
import { Init, CheckoutWeb3, Event } from "./pages";
import RequiresEvent from "./utils/requiresEventHOC";
import { QueryClient, QueryClientProvider } from "react-query";
import { Error } from "./pages/Error";
import "./styles/global.css";
import { SuccessCheckoutPage } from "./components/SuccessCheckoutPage";
import CheckoutSuccessPage from "./components/CheckoutSuccessPage";
import CheckoutFailedPage from "./components/CheckoutFailedPage";

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
          <WagmiConfig client={client}>
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
                    path="checkout/success"
                    element={
                      <RequiresEvent>
                        <CheckoutSuccessPage />
                      </RequiresEvent>
                    }
                  />
                  <Route
                    path="checkout/fail"
                    element={
                      <RequiresEvent>
                        <CheckoutFailedPage />
                      </RequiresEvent>
                    }
                  />
                  {/* this is new success page should be replace de old one since backend is ready */}
                  <Route
                    path="new/success/page"
                    element={
                      <RequiresEvent>
                        <SuccessCheckoutPage />
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
