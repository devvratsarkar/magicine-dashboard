import React, { useState } from "react";
import {
  Button,
  OverlayTrigger,
  Table,
  Tooltip,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openModal } from "../redux/slices/allModalSlice";

export const COLUMNS = [
  {
    Header: "#",
    accessor: "ID",
    className: "text-center wd-15p border-bottom-0",
  },
  {
    Header: "Subscriber Name",
    accessor: "SUBSCRIBER_NAME",
    className: "text-center wd-15p border-bottom-0 ",
  },
  {
    Header: "Email ID",
    accessor: "EMAILID",
    className: "text-center wd-15p border-bottom-0",
  },
  {
    Header: "Date Of Subscription",
    accessor: "DATE_OF_SUBSCRIPTION",
    className: "text-center wd-15p border-bottom-0 ",
  },
];

export const DATATABLE = [
  {
    ID: "1",
    SUBSCRIBER_NAME: "Rahul Sharma",
    EMAILID: "rohulsharma123@gmail.com",
    DATE_OF_SUBSCRIPTION: "04/01/2024",
  },
  {
    ID: "2",
    SUBSCRIBER_NAME: "Rahul Sharma",
    EMAILID: "rohulsharma123@gmail.com",
    DATE_OF_SUBSCRIPTION: "04/01/2024",
  },
  {
    ID: "3",
    SUBSCRIBER_NAME: "Rahul Sharma",
    EMAILID: "rohulsharma123@gmail.com",
    DATE_OF_SUBSCRIPTION: "04/01/2024",
  },
  {
    ID: "4",
    SUBSCRIBER_NAME: "Rahul Sharma",
    EMAILID: "rohulsharma123@gmail.com",
    DATE_OF_SUBSCRIPTION: "04/01/2024",
  },
  {
    ID: "5",
    SUBSCRIBER_NAME: "Rahul Sharma",
    EMAILID: "rohulsharma123@gmail.com",
    DATE_OF_SUBSCRIPTION: "04/01/2024",
  },
  {
    ID: "6",
    SUBSCRIBER_NAME: "Rahul Sharma",
    EMAILID: "rohulsharma123@gmail.com",
    DATE_OF_SUBSCRIPTION: "04/01/2024",
  },
  {
    ID: "7",
    SUBSCRIBER_NAME: "Rahul Sharma",
    EMAILID: "rohulsharma123@gmail.com",
    DATE_OF_SUBSCRIPTION: "04/01/2024",
  },
  {
    ID: "8",
    SUBSCRIBER_NAME: "Rahul Sharma",
    EMAILID: "rohulsharma123@gmail.com",
    DATE_OF_SUBSCRIPTION: "04/01/2024",
  },
  {
    ID: "9",
    SUBSCRIBER_NAME: "Rahul Sharma",
    EMAILID: "rohulsharma123@gmail.com",
    DATE_OF_SUBSCRIPTION: "04/01/2024",
  },
  {
    ID: "10",
    SUBSCRIBER_NAME: "Rahul Sharma",
    EMAILID: "rohulsharma123@gmail.com",
    DATE_OF_SUBSCRIPTION: "04/01/2024",
  },
  {
    ID: "11",
    SUBSCRIBER_NAME: "Rahul Sharma",
    EMAILID: "rohulsharma123@gmail.com",
    DATE_OF_SUBSCRIPTION: "04/01/2024",
  },
  {
    ID: "12",
    SUBSCRIBER_NAME: "Rahul Sharma",
    EMAILID: "rohulsharma123@gmail.com",
    DATE_OF_SUBSCRIPTION: "04/01/2024",
  },
  {
    ID: "13",
    SUBSCRIBER_NAME: "Rahul Sharma",
    EMAILID: "rohulsharma123@gmail.com",
    DATE_OF_SUBSCRIPTION: "04/01/2024",
  },
  {
    ID: "14",
    SUBSCRIBER_NAME: "Rahul Sharma",
    EMAILID: "rohulsharma123@gmail.com",
    DATE_OF_SUBSCRIPTION: "04/01/2024",
  },
  {
    ID: "15",
    SUBSCRIBER_NAME: "Rahul Sharma",
    EMAILID: "rohulsharma123@gmail.com",
    DATE_OF_SUBSCRIPTION: "04/01/2024",
  },
];

export const CMSDataTable = () => {
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
          className="btn btn-icon btn-danger"
          onClick={() =>
            dispatch(openModal({ componentName: "Delete", data: id }))
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
        <Row className="justify-content-end mt-3 mx-2">
          <Button className="btn btn-success text-white w-auto border-success">
            <i className="fa fa-download"></i>Export
          </Button>
        </Row>
        <Form>
          <Row className="d-flex mt-5 mx-2">
            <Col as={Col} md={3}>
              <Form.Select name="order_status" id="order_status">
                <option value="" disabled>
                  Select an order status
                </option>
                <option value="confirm">Confirm</option>
                <option value="pending">Pending</option>
              </Form.Select>
            </Col>
            <Col as={Col} md={3}>
              <Form.Select
                name="payment_status"
                id="payment_status"
                placeholder="search by payment status"
              >
                <option value="" disabled>
                  Select an payment status
                </option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </Form.Select>
            </Col>
            <Col as={Col} md={2}>
              <Form.Control
                name="payment_status"
                placeholder="search by payment status"
                type="date"
              />
            </Col>
            <Col as={Col} md={2}>
              <Form.Control
                name="payment_status"
                placeholder="search by payment status"
                type="date"
              />
            </Col>
            <Col>
              <Button type="submit" className="w-100">
                Search
              </Button>
            </Col>
          </Row>
        </Form>
        <div className="d-block ms-5">
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
        <div className="d-block d-sm-flex m-4 ">
          <span className="">
            <strong>
              Showing&nbsp;{pageIndex * pageSize + 1}&nbsp;to&nbsp;
              {Math.min((pageIndex + 1) * pageSize, DATATABLE.length)}
              &nbsp;of&nbsp;
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
