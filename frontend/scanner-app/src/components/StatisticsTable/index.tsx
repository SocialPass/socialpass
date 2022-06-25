import React, { useState, useMemo } from "react";
import { useQuery } from "react-query";
import { useEvent } from "../../contexts/EventContext";
import { fetchTickets } from "../../services/api";
import { useTable, usePagination } from 'react-table';
import MOCK_DATA from "./MOCK_DATA.json";
import { COLUMNS } from "./columns";
import "./table.css";




export function StatisticsTable() {
  const { publicId }: any = useEvent();
  const { isLoading, isError, error, data } = useQuery(
    ["fetchTickets", publicId],
    () => fetchTickets(publicId, true)
  );
  const columns = useMemo(() => COLUMNS, []);


  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } =
    useTable({
      columns,
      data,
    },
    usePagination
    );

  useTable({
    columns: COLUMNS,
    data,
  });

  if (isLoading) return <>Loading</>;
  if (isError) return <>Oops something went wrong</>;

  function ticketCount(data: { hasOwnProperty: (arg0: string) => any }) {
    var result = 0;
    for (var prop in data) {
      if (data.hasOwnProperty(prop)) {
        // or Object.prototype.hasOwnProperty.call(obj, prop)
        result++;
      }
    }
    return console.log("Resultado: ", result);

    


  }

  return (
    <div className="statistics-table-container d-flex flex-column align-items-center p-10">
      {/*
      <table>
        <thead>
          <tr>
            <th>Issued at</th>
            <th>Wallet Address</th>
            <th>Redeemed at</th>
          </tr>
        </thead>
        <tbody>
          {data.map((ticket: any) => (
            <tr key={ticket.public_id}>
              <td>{ticket.created}</td>
              <td>{ticket.wallet_address}</td>
              <td>{ticket.redeemed_at}</td>
            </tr>
          ))
          }
        </tbody>
      </table>
      */
        }

<table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody {...getTableBodyProps()}>
        {page.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
    </div>
  );
}
