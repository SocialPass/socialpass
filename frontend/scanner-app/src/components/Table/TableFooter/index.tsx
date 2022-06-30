import React, { useEffect } from "react";

const TableFooter = ({ range, setPage, page, slice }: any) => {
  useEffect(() => {
    if (slice.length < 1 && page !== 1) {
      setPage(page - 1);
    }
  }, [slice, page, setPage]);

  return (
    <div className="tableFooter p-5">
    {range.map((el: any, index: any) => (
      <button
        key={index}
        onClick={() => setPage(el)}
        className={`${"button"} ${
          page === el ? "btn-active" : "btn-inactive"
        }`}
      >
        {el}
      </button>
    ))}
    </div>
  );
};

export default TableFooter;