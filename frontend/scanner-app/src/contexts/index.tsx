import React from "react";
import { TicketProvider } from "./TicketContext";

const AppProvider = ({ children }: JSX.ElementChildrenAttribute) => (
    <TicketProvider>{children}</TicketProvider>
);

export default AppProvider;