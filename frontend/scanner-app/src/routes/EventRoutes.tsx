import {
  Routes as RoutesRom,
  Route,
  BrowserRouter,
  useParams,
} from "react-router-dom";

import RequiresEvent from "../utils/requiresEventHOC"

import { CapacityReached } from "../pages/CapacityReached";
import { Home } from "../pages/Home";
import { Index } from "../pages/Index";
import { Scanner } from "../pages/Scanner";
import { Statistics } from "../pages/Statistics";
import { Error } from "../pages/Error";


function EventRoutes() {
  return (
    <BrowserRouter>
      <RoutesRom>
        <Route path="/:publicId">
          <Route path="" element={<RequiresEvent><Home/></RequiresEvent>} />
          <Route path="scanner" element={<RequiresEvent><Scanner/></RequiresEvent>} />
          <Route path="statistics" element={<RequiresEvent><Statistics/></RequiresEvent>} />
          <Route path="capacity-reached" element={<RequiresEvent><CapacityReached/></RequiresEvent>} />
          <Route path="error" element={<Error/>} />
        </Route>
        <Route path="" element={<Index/>} />
      </RoutesRom>
    </BrowserRouter>
  );
}

export default EventRoutes;
