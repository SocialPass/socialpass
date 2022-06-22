/* eslint-disable eqeqeq */
import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

const TicketListContext = createContext({});

type TicketListDataProps = {
  event: String;
  embed_code: String;
  redeemed: String;
  redeemed_at: String;
  blockchain_ownership: String;
};


const TicketListProvider = ({ children }: any) => {
  const [ticketListData, setTicketListData] = useState<TicketListDataProps>();


  return (
    <TicketListContext.Provider
      value={{
        setTicketListData
      }}
    >
      {children}
    </TicketListContext.Provider>
  );
};

function useTicketList() {
  const context = useContext(TicketListContext);

  if (!context) {
    throw new Error("useTicketList must be used within a TicketListProvider");
  }

  return context;
}

export { TicketListProvider, useTicketList };
