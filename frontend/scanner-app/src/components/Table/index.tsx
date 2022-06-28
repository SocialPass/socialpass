import React, { useState } from "react";

import useTable from "../../hooks/useTable";
import TableFooter from "./TableFooter";

const Table = ({ data, rowsPerPage }: any) => {
  const [page, setPage] = useState(1);
  const { slice, range } = useTable(data, page, rowsPerPage);
  return (
    <>
      <table>
        <thead className="table-row-header">
          <tr>
            <th>Issued at</th>
            <th>Wallet Address</th>
            <th>Redeemed at</th>
          </tr>
        </thead>
        <tbody>
          {slice.map((el: any) => (
            <tr key={el.public_id}>
              <td>{el.created}</td>
              <td>{el.wallet_address}</td>
              <td>{el.redeemed_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <TableFooter range={range} slice={slice} setPage={setPage} page={page} />
    </>
  );
};

export default Table;