import React from "react";
import {
  //   MemoryRouter,
  Routes as RoutesRom,
  Route,
  BrowserRouter,
} from "react-router-dom";
import { EventClose } from "../pages/EventClose";
import { Home } from "../pages/Home";
import { Scanner } from "../pages/Scanner";
import { Init } from "../pages/Init";

function Routes() {
  return (
    <BrowserRouter>
      <RoutesRom>
        <Route path="/:publicId" element={<Init />} />
        <Route path="/home" element={<Home />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/end-event" element={<EventClose />} />
      </RoutesRom>
    </BrowserRouter>
  );
}

export default Routes;
