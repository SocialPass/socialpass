import React, { useState } from "react";

import useTable from "../../hooks/useTable";
import TableFooter from "./TableFooter";

const Table = ({ data, rowsPerPage }: any) => {
  const [page, setPage] = useState(1);
  const { slice, range } = useTable(data, page, rowsPerPage);
  const sliceAddress = (address:string) => {
    return address.slice(0,5) + "..." +  address.slice(-5)
  }
  return (
    <div className="table">
      <table>
        <thead className="table-row-header">
          <tr>
            <th className="col">Issued</th>
            <th className="col">Redeemed</th>
            <th className="col">Wallet Address</th>
          </tr>
        </thead>
        <tbody>
          {slice.map((el: any) => (
            <tr key={el.public_id}>
              <td className="col">{el.created}</td>
              <td className="col">{el.redeemed_at}</td>
              <td className="col">{sliceAddress(el.wallet_address)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <TableFooter range={range} slice={slice} setPage={setPage} page={page} />
    </div>
  );
};

export default Table;
