import React from "react";
import {
  //   MemoryRouter,
  Routes as RoutesRom,
  Route,
  BrowserRouter,
} from "react-router-dom";
import { CapacityReached } from "../pages/CapacityReached";
import { Home } from "../pages/Home";
import { Scanner } from "../pages/Scanner";
import { Scanner2 } from "../pages/Scanner2";
import { Statistics } from "../pages/Statistics";
import { Init } from "../pages/Init";
import { InvalidScanner } from "../pages/InvalidScanner";

function Routes() {
  return (
    <BrowserRouter>
      <RoutesRom>
        <Route path="/" element={<Home />} />
        <Route path="/:publicId" element={<Init />} />
        <Route path="/:publicId/error" element={<InvalidScanner />} />
        <Route path="/home" element={<Home />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/scanner2" element={<Scanner2 />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/capacity-reached" element={<CapacityReached />} />
      </RoutesRom>
    </BrowserRouter>
  );
}

export default Routes;
