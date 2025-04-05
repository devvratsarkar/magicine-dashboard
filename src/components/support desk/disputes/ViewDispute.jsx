import React from "react";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Row, Col, Card, Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";

export const REFUND_COLUMNS = [
  {
    Header: "Refund Amount",
    accessor: "REFUNDAMOUNT",
    className: "text-center wd-15p border-bottom-0 ",
  },
  {
    Header: "Status",
    accessor: "STATUS",
    className: "text-center wd-15p border-bottom-0",
  },
  {
    Header: "Created At",
    accessor: "CREATEDAT",
    className: "text-center wd-15p border-bottom-0 ",
  },
  {
    Header: "Last Update",
    accessor: "LASTUPDATE",
    className: "text-center wd-15p border-bottom-0 ",
  },
];

export const DATATABLE = [
  {
    REFUNDAMOUNT: "$ 150",
    STATUS: "OPEN",
    CREATEDAT: "2 Days",
    LASTUPDATE: "2 Days",
  },
];

const customerData = {
  customer_name: "Rahul Sharma",
  total_dispute: "01",
  response: "0",
  created_at: "2 days",
  last_updated_on: "2 days",
};

export default function ViewDispute() {
  const tableInstance = useTable(
    {
      columns: REFUND_COLUMNS,
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
      <Row>
        <Col>
          <Row className="align-items-center">
            <Col>
              <PageHeader
                titles="Support Desk"
                active="View"
                items={["Home","Dispute List"]}
                links={["/dashboard", "","/support-desk/disputes"]}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      {/*----------------------------------dispute status------------------------*/}
      <Row>
        <Col>
          <Card>
            <Card.Header className="justify-content-between">
              <Row>
                <Col className="d-flex align-items-center">
                  <p className="mb-0">Dispute&nbsp;Status</p>
                </Col>
                <Col>
                  <Button className="dispute-primary-btn">Open</Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Link
                    className="btn dispute-success-btn text-white"
                    to="/all-orders/order-details/1"
                  >
                    {" "}
                    Order Detail
                  </Link>
                </Col>
                <Col>
                  <Link
                    className="btn dispute-primary-btn text-white"
                    to="/support-desk/disputes"
                  >
                    View All Disputes
                  </Link>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col>
                  <p>
                    <strong>Order ID : </strong> #AV29329
                  </p>
                </Col>
                <Col>
                  <p>
                    <strong>Refund Request : </strong> Amount Rs. 300
                  </p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p className="text-decoration-underline">
                    <strong>Type : </strong> Quantity shortage
                  </p>
                </Col>
              </Row>

              <Row className="border border-1 py-1 px-2 rounded-3 dispute-backgroundcolor-text-parent ">
                <p className="mb-0 dispute-backgroundcolor-text">
                  Lorem ipsum dolor sit amet consectetur. Tincidunt ipsum ut
                  vitae amet diam accumsan aliquet molestie turpis. Nunc ut
                  lectus amet nulla aliquam suspendisse fames integer. Congue
                  integer quisque quam et vel nullam scelerisque interdum.
                  Euismod est dictum gravida condimentum convallis.
                </p>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/*----------------------------------refunds--------------------------------*/}

      <Row>
        <Col>
          <Card>
            <Card.Header>Refunds</Card.Header>
            <Card.Body className="data_table_custum">
              <div className="e-table pb-5 table-responsive">
                <div className="d-block">
                  <select
                    className="m-5"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                  >
                    {[10, 25, 50].map((pageSize) => (
                      <option key={pageSize} value={pageSize}>
                        Show {pageSize}
                      </option>
                    ))}
                  </select>
                  <GlobalFilter
                    filter={globalFilter}
                    setFilter={setGlobalFilter}
                  />
                </div>
              </div>
              {/*---------------------------------------------------------------------------*/}
              <Table
                {...getTableProps()}
                className="text-nowrap border-bottom table-responsive"
              >
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
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
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {page.map((row, rowIndex) => {
                    prepareRow(row);

                    return (
                      <tr className="text-center" {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                          return (
                            <td
                              {...cell.getCellProps()}
                              className="align-middle"
                            >
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              {/*---------------------------------pagination--------------------------------*/}
              <div className="d-block d-sm-flex m-4">
                <span>
                  Page <strong>{pageIndex + 1}</strong> of {pageOptions.length}
                </span>
                <span className="ms-auto">
                  <Button
                    variant=""
                    className="btn-default tablebutton d-sm-inline d-block me-2 my-2"
                    onClick={() => gotoPage(0)}
                    disabled={!canPreviousPage}
                  >
                    {" Previous "}
                  </Button>
                  <span className="mx-3 border border-dark px-2 py-1 rounded-3 ">
                    <strong>{pageIndex + 1}</strong>
                  </span>
                  <Button
                    variant=""
                    className="btn-default tablebutton me-2 my-2"
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={!canNextPage}
                  >
                    {" Next "}
                  </Button>
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ----------------------------------customer detail------------------------ */}

      <Row>
        <Col>
          <Card>
            <Card.Header>Customer Details</Card.Header>
            <Card.Body>
              <Table className="table-responsive">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Total Disputes</th>
                    <th>Response</th>
                    <th>Created At</th>
                    <th>Last Updated On</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{customerData.customer_name}</td>
                    <td>{customerData.total_dispute}</td>
                    <td>{customerData.response}</td>
                    <td>{customerData.created_at}</td>
                    <td>{customerData.last_updated_on}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

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
