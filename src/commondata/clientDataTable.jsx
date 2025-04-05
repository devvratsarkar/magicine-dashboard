import React, { useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import { useDispatch } from "react-redux";
import { openModal } from "../redux/slices/allModalSlice";
import { STATUS } from "rsuite/esm/utils/constants";

export const COLUMNS = [
  {
    Header: "#",
    accessor: "ID",
    className: "text-center wd-15p border-bottom-0",
  },
  {
    Header: "Client ID",
    accessor: "CLIENT_ID",
    className: "text-center wd-15p border-bottom-0 ",
  },
  {
    Header: "client secret",
    accessor: "CLIENTSECRET",
    className: "text-center wd-15p border-bottom-0",
  },
  {
    Header: "Name",
    accessor: "NAME",
    className: "text-center wd-15p border-bottom-0 ",
  },
  {
    Header: "Redirect",
    accessor: "REDIRECT",
    className: "text-center wd-15p border-bottom-0 ",
  },
  {
    Header: "Date",
    accessor: "DATE",
    className: "text-center wd-15p border-bottom-0 ",
  },
  {
    Header: "Status",
    accessor: "STATUS",
    className: "text-center wd-15p border-bottom-0 ",
    Cell: ({ value }) => {
      const [handleChecked, setHandleChecked] = useState(value);

      const handleChange = () => {
        setHandleChecked((prevChecked) => !prevChecked);
      };

      return (
        <label className="custom-switch">
          <input
            type="checkbox"
            name="custom-switch-checkbox"
            className="custom-switch-input"
            checked={handleChecked}
            onChange={handleChange}
          />
          <span className="custom-switch-indicator custum-green-btn"></span>
        </label>
      );
    },
  },
];


export const DATATABLE = [
  {
    ID: "1",
    CLIENT_ID: "Lorem Ipsum",
    CLIENTSECRET:
      "Lorem ipsum dolor sit amet consectetur. Elit et nec varius dui dictumst urna facilisis sed.",

    NAME: "Lorem Ipsum",
    DATE: "16 - 04 - 2024",
    REDIRECT: "https://credit-pass.suhaani.co.in/admin/client-lists",
    STATUS: true
  },
  {
    ID: "2",
    CLIENT_ID: "Lorem Ipsum",
    CLIENTSECRET:
      "Lorem ipsum dolor sit amet consectetur. Elit et nec varius dui dictumst urna facilisis sed.",

    NAME: "Lorem Ipsum",
    DATE: "16 - 04 - 2024",
    REDIRECT: "https://credit-pass.suhaani.co.in/admin/client-lists",
    STATUS: true
  },
  {
    ID: "3",
    CLIENT_ID: "Lorem Ipsum",
    CLIENTSECRET:
      "Lorem ipsum dolor sit amet consectetur. Elit et nec varius dui dictumst urna facilisis sed.",

    NAME: "Lorem Ipsum",
    DATE: "16 - 04 - 2024",
    REDIRECT: "https://credit-pass.suhaani.co.in/admin/client-lists",
    STATUS: true
  },
  {
    ID: "4",
    CLIENT_ID: "Lorem Ipsum",
    CLIENTSECRET:
      "Lorem ipsum dolor sit amet consectetur. Elit et nec varius dui dictumst urna facilisis sed.",

    NAME: "Lorem Ipsum",
    DATE: "16 - 04 - 2024",
    REDIRECT: "https://credit-pass.suhaani.co.in/admin/client-lists",
    STATUS: true
  },
  {
    ID: "5",
    CLIENT_ID: "Lorem Ipsum",
    CLIENTSECRET:
      "Lorem ipsum dolor sit amet consectetur. Elit et nec varius dui dictumst urna facilisis sed.",

    NAME: "Lorem Ipsum",
    DATE: "16 - 04 - 2024",
    REDIRECT: "https://credit-pass.suhaani.co.in/admin/client-lists",
    STATUS: true
  },
  {
    ID: "6",
    CLIENT_ID: "Lorem Ipsum",
    CLIENTSECRET:
      "Lorem ipsum dolor sit amet consectetur. Elit et nec varius dui dictumst urna facilisis sed.",

    NAME: "Lorem Ipsum",
    DATE: "16 - 04 - 2024",
    REDIRECT: "https://credit-pass.suhaani.co.in/admin/client-lists",
    STATUS: true
  },
  {
    ID: "7",
    CLIENT_ID: "Lorem Ipsum",
    CLIENTSECRET:
      "Lorem ipsum dolor sit amet consectetur. Elit et nec varius dui dictumst urna facilisis sed.",

    NAME: "Lorem Ipsum",
    DATE: "16 - 04 - 2024",
    REDIRECT: "https://credit-pass.suhaani.co.in/admin/client-lists",
    STATUS: true
  },
  {
    ID: "8",
    CLIENT_ID: "Lorem Ipsum",
    CLIENTSECRET:
      "Lorem ipsum dolor sit amet consectetur. Elit et nec varius dui dictumst urna facilisis sed.",

    NAME: "Lorem Ipsum",
    DATE: "16 - 04 - 2024",
    REDIRECT: "https://credit-pass.suhaani.co.in/admin/client-lists",
    STATUS: true
  },
  {
    ID: "9",
    CLIENT_ID: "Lorem Ipsum",
    CLIENTSECRET:
      "Lorem ipsum dolor sit amet consectetur. Elit et nec varius dui dictumst urna facilisis sed.",

    NAME: "Lorem Ipsum",
    DATE: "16 - 04 - 2024",
    REDIRECT: "https://credit-pass.suhaani.co.in/admin/client-lists",
    STATUS: true
  },
  {
    ID: "10",
    CLIENT_ID: "Lorem Ipsum",
    CLIENTSECRET:
      "Lorem ipsum dolor sit amet consectetur. Elit et nec varius dui dictumst urna facilisis sed.",

    NAME: "Lorem Ipsum",
    DATE: "16 - 04 - 2024",
    REDIRECT: "https://credit-pass.suhaani.co.in/admin/client-lists",
    STATUS: true
  },
  {
    ID: "11",
    CLIENT_ID: "Lorem Ipsum",
    CLIENTSECRET:
      "Lorem ipsum dolor sit amet consectetur. Elit et nec varius dui dictumst urna facilisis sed.",

    NAME: "Lorem Ipsum",
    DATE: "16 - 04 - 2024",
    REDIRECT: "https://credit-pass.suhaani.co.in/admin/client-lists",
    STATUS: true
  },
  {
    ID: "12",
    CLIENT_ID: "Lorem Ipsum",
    CLIENTSECRET:
      "Lorem ipsum dolor sit amet consectetur. Elit et nec varius dui dictumst urna facilisis sed.",

    NAME: "Lorem Ipsum",
    DATE: "16 - 04 - 2024",
    REDIRECT: "https://credit-pass.suhaani.co.in/admin/client-lists",
    STATUS: true
  },
  {
    ID: "13",
    CLIENT_ID: "Lorem Ipsum",
    CLIENTSECRET:
      "Lorem ipsum dolor sit amet consectetur. Elit et nec varius dui dictumst urna facilisis sed.",

    NAME: "Lorem Ipsum",
    DATE: "16 - 04 - 2024",
    REDIRECT: "https://credit-pass.suhaani.co.in/admin/client-lists",
    STATUS: true
  },
  {
    ID: "14",
    CLIENT_ID: "Lorem Ipsum",
    CLIENTSECRET:
      "Lorem ipsum dolor sit amet consectetur. Elit et nec varius dui dictumst urna facilisis sed.",

    NAME: "Lorem Ipsum",
    DATE: "16 - 04 - 2024",
    REDIRECT: "https://credit-pass.suhaani.co.in/admin/client-lists",
    STATUS: true
  },
  {
    ID: "15",
    CLIENT_ID: "Lorem Ipsum",
    CLIENTSECRET:
      "Lorem ipsum dolor sit amet consectetur. Elit et nec varius dui dictumst urna facilisis sed.",

    NAME: "Lorem Ipsum",
    DATE: "16 - 04 - 2024",
    REDIRECT: "https://credit-pass.suhaani.co.in/admin/client-lists",
    STATUS: true
  },
];

export const ClientDataTable = () => {
  const dispatch = useDispatch();

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
  const ActionOption = ({ id, onDelete }) => (
    <div className="action_icon_wrapper">
      <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
        <Button
          className="btn btn-icon btn-danger" variant=""
          onClick={() =>
            alert(`Data with id ${id} is added to trash.`)
          }
        >
          <i className="fe fe-trash text-light"></i>
        </Button>
      </OverlayTrigger>
    </div>
  );
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
                    <ActionOption id={row.original.ID} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <div className="d-block d-sm-flex mb-0 mt-0 mx-0 align-items-center">
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
