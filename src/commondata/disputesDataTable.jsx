import React, { useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import { Link } from "react-router-dom";

export const COLUMNS = [
  {
    Header: "#",
    accessor: "ID",
    className: "text-center wd-15p border-bottom-0",
  },
  {
    Header: "Customer",
    accessor: "CUSTOMER",
    className: "text-center wd-15p border-bottom-0 ",
  },
  {
    Header: "Order ID",
    accessor: "ORDERID",
    className: "text-center wd-15p border-bottom-0",
  },
  {
    Header: "Type",
    accessor: "TYPE",
    className: "text-center wd-15p border-bottom-0 ",
  },
  {
    Header: "Status",
    accessor: "STATUS",
    className: "text-center wd-15p border-bottom-0 ",
  },
  {
    Header: "Refund Request",
    accessor: "REFUNDREQUEST",
    className: "text-center wd-15p border-bottom-0 ",
  },
  {
    Header: "Refund Amount",
    accessor: "REFUNDAMOUNT",
    className: "text-center wd-15p border-bottom-0 ",
  },
  {
    Header: "Response",
    accessor: "RESPONSE",
    className: "text-center wd-15p border-bottom-0 ",
  },
  {
    Header: "Last Updated",
    accessor: "LASTUPDATED",
    className: "text-center wd-15p border-bottom-0 ",
  },
];

const ActionOption = ({ id, name }) => (
  <div className="action_icon_wrapper">
    <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
      <Link className="action_icon" to={`/support-desk/view-dispute/${id}`}>
        <Button className="btn btn-icon btn-primary">
          <i className="fe fe-eye"></i>
        </Button>
      </Link>
    </OverlayTrigger>
    <OverlayTrigger placement="top" overlay={<Tooltip>Reply</Tooltip>}>
      <Link className="action_icon" to={`/support-desk/reply-disputes/${id}`} state={{ name: { name } }}>
        <Button className="btn btn-icon btn-warning" variant="">
          <i className="fa fa-mail-reply"></i>
        </Button>
      </Link>
    </OverlayTrigger>
  </div>
);
export const DATATABLE = [
  {
    ID: "1",
    CUSTOMER: "Rahul Sharma",
    ORDERID: "AV238320",
    TYPE: "Did not receive code",
    STATUS: "Open",
    REFUNDREQUEST: 1,
    REFUNDAMOUNT: "Rs. 300",
    RESPONSE: 1,
    LASTUPDATED: "1 Day ago",
    CLIENTSECRET:
      "Lorem ipsum dolor sit amet consectetur. Elit et nec varius dui dictumst urna facilisis sed.",

    NAME: "Lorem Ipsum",
    REDIRECT: "https://credit-pass.suhaani.co.in/admin/client-lists",
  },
  {
    ID: "2",
    CUSTOMER: "Rahul Sharma",
    ORDERID: "AV238320",
    TYPE: "Did not receive code",
    STATUS: "Open",
    REFUNDREQUEST: 1,
    REFUNDAMOUNT: "Rs. 300",
    RESPONSE: 1,
    LASTUPDATED: "1 Day ago",
    CLIENTSECRET:
      "Lorem ipsum dolor sit amet consectetur. Elit et nec varius dui dictumst urna facilisis sed.",

    NAME: "Lorem Ipsum",
    REDIRECT: "https://credit-pass.suhaani.co.in/admin/client-lists",
  },
  {
    ID: "3",
    CUSTOMER: "Rahul Sharma",
    ORDERID: "AV238320",
    TYPE: "Did not receive code",
    STATUS: "Open",
    REFUNDREQUEST: 1,
    REFUNDAMOUNT: "Rs. 300",
    RESPONSE: 1,
    LASTUPDATED: "1 Day ago",
    CLIENTSECRET:
      "Lorem ipsum dolor sit amet consectetur. Elit et nec varius dui dictumst urna facilisis sed.",

    NAME: "Lorem Ipsum",
    REDIRECT: "https://credit-pass.suhaani.co.in/admin/client-lists",
  },
  {
    ID: "4",
    CUSTOMER: "Rahul Sharma",
    ORDERID: "AV238320",
    TYPE: "Did not receive code",
    STATUS: "Open",
    REFUNDREQUEST: 1,
    REFUNDAMOUNT: "Rs. 300",
    RESPONSE: 1,
    LASTUPDATED: "1 Day ago",
    CLIENTSECRET:
      "Lorem ipsum dolor sit amet consectetur. Elit et nec varius dui dictumst urna facilisis sed.",

    NAME: "Lorem Ipsum",
    REDIRECT: "https://credit-pass.suhaani.co.in/admin/client-lists",
  },
  {
    ID: "5",
    CUSTOMER: "Rahul Sharma",
    ORDERID: "AV238320",
    TYPE: "Did not receive code",
    STATUS: "Open",
    REFUNDREQUEST: 1,
    REFUNDAMOUNT: "Rs. 300",
    RESPONSE: 1,
    LASTUPDATED: "1 Day ago",
    CLIENTSECRET:
      "Lorem ipsum dolor sit amet consectetur. Elit et nec varius dui dictumst urna facilisis sed.",

    NAME: "Lorem Ipsum",
    REDIRECT: "https://credit-pass.suhaani.co.in/admin/client-lists",
  },
  {
    ID: "6",
    CUSTOMER: "Rahul Sharma",
    ORDERID: "AV238320",
    TYPE: "Did not receive code",
    STATUS: "Open",
    REFUNDREQUEST: 1,
    REFUNDAMOUNT: "Rs. 300",
    RESPONSE: 1,
    LASTUPDATED: "1 Day ago",
    CLIENTSECRET:
      "Lorem ipsum dolor sit amet consectetur. Elit et nec varius dui dictumst urna facilisis sed.",

    NAME: "Lorem Ipsum",
    REDIRECT: "https://credit-pass.suhaani.co.in/admin/client-lists",
  },
  {
    ID: "7",
    CUSTOMER: "Rahul Sharma",
    ORDERID: "AV238320",
    TYPE: "Did not receive code",
    STATUS: "Open",
    REFUNDREQUEST: 1,
    REFUNDAMOUNT: "Rs. 300",
    RESPONSE: 1,
    LASTUPDATED: "1 Day ago",
    CLIENTSECRET:
      "Lorem ipsum dolor sit amet consectetur. Elit et nec varius dui dictumst urna facilisis sed.",

    NAME: "Lorem Ipsum",
    REDIRECT: "https://credit-pass.suhaani.co.in/admin/client-lists",
  },
  {
    ID: "8",
    CUSTOMER: "Rahul Sharma",
    ORDERID: "AV238320",
    TYPE: "Did not receive code",
    STATUS: "Open",
    REFUNDREQUEST: 1,
    REFUNDAMOUNT: "Rs. 300",
    RESPONSE: 1,
    LASTUPDATED: "1 Day ago",
    CLIENTSECRET:
      "Lorem ipsum dolor sit amet consectetur. Elit et nec varius dui dictumst urna facilisis sed.",

    NAME: "Lorem Ipsum",
    REDIRECT: "https://credit-pass.suhaani.co.in/admin/client-lists",
  },
  {
    ID: "9",
    CUSTOMER: "Rahul Sharma",
    ORDERID: "AV238320",
    TYPE: "Did not receive code",
    STATUS: "Open",
    REFUNDREQUEST: 1,
    REFUNDAMOUNT: "Rs. 300",
    RESPONSE: 1,
    LASTUPDATED: "1 Day ago",
    CLIENTSECRET:
      "Lorem ipsum dolor sit amet consectetur. Elit et nec varius dui dictumst urna facilisis sed.",

    NAME: "Lorem Ipsum",
    REDIRECT: "https://credit-pass.suhaani.co.in/admin/client-lists",
  },
  {
    ID: "10",
    CUSTOMER: "Rahul Sharma",
    ORDERID: "AV238320",
    TYPE: "Did not receive code",
    STATUS: "Open",
    REFUNDREQUEST: 1,
    REFUNDAMOUNT: "Rs. 300",
    RESPONSE: 1,
    LASTUPDATED: "1 Day ago",
    CLIENTSECRET:
      "Lorem ipsum dolor sit amet consectetur. Elit et nec varius dui dictumst urna facilisis sed.",

    NAME: "Lorem Ipsum",
    REDIRECT: "https://credit-pass.suhaani.co.in/admin/client-lists",
  },
  {
    ID: "11",
    CUSTOMER: "Rahul Sharma",
    ORDERID: "AV238320",
    TYPE: "Did not receive code",
    STATUS: "Open",
    REFUNDREQUEST: 1,
    REFUNDAMOUNT: "Rs. 300",
    RESPONSE: 1,
    LASTUPDATED: "1 Day ago",
    CLIENTSECRET:
      "Lorem ipsum dolor sit amet consectetur. Elit et nec varius dui dictumst urna facilisis sed.",

    NAME: "Lorem Ipsum",
    REDIRECT: "https://credit-pass.suhaani.co.in/admin/client-lists",
  },
  {
    ID: "12",
    CUSTOMER: "Rahul Sharma",
    ORDERID: "AV238320",
    TYPE: "Did not receive code",
    STATUS: "Open",
    REFUNDREQUEST: 1,
    REFUNDAMOUNT: "Rs. 300",
    RESPONSE: 1,
    LASTUPDATED: "1 Day ago",
    CLIENTSECRET:
      "Lorem ipsum dolor sit amet consectetur. Elit et nec varius dui dictumst urna facilisis sed.",

    NAME: "Lorem Ipsum",
    REDIRECT: "https://credit-pass.suhaani.co.in/admin/client-lists",
  },
  {
    ID: "13",
    CUSTOMER: "Rahul Sharma",
    ORDERID: "AV238320",
    TYPE: "Did not receive code",
    STATUS: "Open",
    REFUNDREQUEST: 1,
    REFUNDAMOUNT: "Rs. 300",
    RESPONSE: 1,
    LASTUPDATED: "1 Day ago",
    CLIENTSECRET:
      "Lorem ipsum dolor sit amet consectetur. Elit et nec varius dui dictumst urna facilisis sed.",

    NAME: "Lorem Ipsum",
    REDIRECT: "https://credit-pass.suhaani.co.in/admin/client-lists",
  },
  {
    ID: "14",
    CUSTOMER: "Rahul Sharma",
    ORDERID: "AV238320",
    TYPE: "Did not receive code",
    STATUS: "Open",
    REFUNDREQUEST: 1,
    REFUNDAMOUNT: "Rs. 300",
    RESPONSE: 1,
    LASTUPDATED: "1 Day ago",
    CLIENTSECRET:
      "Lorem ipsum dolor sit amet consectetur. Elit et nec varius dui dictumst urna facilisis sed.",

    NAME: "Lorem Ipsum",
    REDIRECT: "https://credit-pass.suhaani.co.in/admin/client-lists",
  },
  {
    ID: "15",
    CUSTOMER: "Rahul Sharma",
    ORDERID: "AV238320",
    TYPE: "Did not receive code",
    STATUS: "Open",
    REFUNDREQUEST: 1,
    REFUNDAMOUNT: "Rs. 300",
    RESPONSE: 1,
    LASTUPDATED: "1 Day ago",
    CLIENTSECRET:
      "Lorem ipsum dolor sit amet consectetur. Elit et nec varius dui dictumst urna facilisis sed.",

    NAME: "Lorem Ipsum",
    REDIRECT: "https://credit-pass.suhaani.co.in/admin/client-lists",
  },
];

export const DisputesDataTable = () => {
  const tableInstance = useTable(
    {
      columns: COLUMNS,
      data: DATATABLE,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    headerGroups,
    getTableBodyProps,
    prepareRow,
    state,
    setGlobalFilter,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
  } = tableInstance;

  const { globalFilter, pageIndex, pageSize } = state;

  return (
    <>
      <div className="e-table pb-5 table-responsive">
        <div className="d-block mx-5">
          <span>Show</span>
          <select
            className="m-5"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[10, 25, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          <span>Entries</span>
        </div>

        <Table {...getTableProps()} className="text-nowrap border-bottom">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={column.className}
                  >
                    <span className="tabletitle">
                      {column.render("Header")}
                    </span>
                    <span>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <i className="fa fa-angle-down"></i>
                        ) : (
                          <i className="fa fa-angle-up"></i>
                        )
                      ) : (
                        ""
                      )}
                    </span>
                  </th>
                ))}
                <th className="text-center wd-15p border-bottom-0">Action</th>
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, rowIndex) => {
              prepareRow(row);

              return (
                <tr
                  className={`text-center ${rowIndex % 2 === 0 ? "odd_data_table_tr" : ""
                    }`}
                  {...row.getRowProps()}
                >
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()} className="align-middle">
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                  <td>
                    <ActionOption id={row.original.ID} name={row.original.CUSTOMER} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <div className="d-block d-sm-flex mb-0 mt-4 mx-4 align-items-center">
          <span className="">
            <strong>
              Showing&nbsp;{pageIndex * pageSize + 1}&nbsp;To&nbsp;
              {Math.min((pageIndex + 1) * pageSize, DATATABLE.length)}
              &nbsp;Of&nbsp;
              {DATATABLE.length}&nbsp;Items
            </strong>
          </span>
          <span className="ms-sm-auto">
            <Button
              variant=""
              className="btn- d-sm-inline d-block me-2 my-2"
              onClick={() => gotoPage(pageIndex - 1)}
              disabled={!canPreviousPage}
            >
              <i className="fa fa-angle-left"></i>
              {" Previous "}
            </Button>
            {pageOptions.slice(pageIndex, pageIndex + 4).map((page, index) => (
              <Button
                variant=""
                className="btn-default tablebutton d-sm-inline d-block me-2 my-2"
                key={index}
                onClick={() => gotoPage(pageIndex + index)}
              >
                {pageIndex + index + 1}
              </Button>
            ))}
            <Button
              variant=""
              className="btn-none me-2 my-2"
              onClick={() => gotoPage(pageIndex + 1)}
              disabled={!canNextPage}
            >
              {" Next "}
              <i className="fa fa-angle-right"></i>
            </Button>
          </span>
        </div>
      </div>
    </>
  );
};

const GlobalFilter = ({ filter, setFilter }) => {
  return (
    <span className="d-flex ms-auto d-inline-flex float-end">
      <input
        value={filter || ""}
        onChange={(e) => setFilter(e.target.value)}
        className="form-control m-4"
        placeholder="Search..."
      />
    </span>
  );
};
