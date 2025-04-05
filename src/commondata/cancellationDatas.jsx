import React, { useState } from "react";
import logoImage from "../assets/images/dashboard/image 144.png";
import {
  useTable,
  // useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import { Button, Table, Row, Col, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { generateViewCancellationPage, generateViewCustomerPage } from "../utils/routes";

export const COLUMNS = [
  {
    Header: "#",
    accessor: "ID",
    className: "text-center",
  },
  {
    Header: "Order ID",
    accessor: "ORDER",
    className: "text-center",
  },
  {
    Header: "Customer",
    accessor: "CUSTOMER",
    Cell: ({ row, value }) => (<Link to={`${generateViewCustomerPage()}/${row.original.ID}`} target="_blank">{value}</Link>),
    className: "text-center",
  },
  {
    Header: "Grand Total",
    accessor: "GRANDTOTAL",
    className: "text-center",
  },
  {
    Header: "Payment",
    accessor: "PAYMENT",
    className: "text-center",
  },
  {
    Header: "Items",
    accessor: "ITEMS",
    className: "text-center",
  },
  {
    Header: "Requested At",
    accessor: "RequestedAT",
    className: "text-center",
  },
  {
    Header: "status",
    accessor: "STATUS",
    className: "text-center",
  },
];

const ActionOption = ({ id }) => (
  <div className="action_icon_wrapper">
    <Link to={`${generateViewCancellationPage()}/${id}`} className="btn btn-primary" variant="primary"><i className="fe fe-eye"></i></Link>
  </div>
);

export const DATATABLE = [
  {
    ID: "1",
    ORDER: "#262",
    CUSTOMER: "Rahul Sharma",
    GRANDTOTAL: "Rs. 1200.00",
    PAYMENT: "Successful",
    ITEMS: "1 / 2",
    RequestedAT: "20.04.204 at 9:15 am",
    STATUS: "Successful",
  },
  {
    ID: "2",
    ORDER: "#262",
    CUSTOMER: "Rahul Sharma",
    GRANDTOTAL: "Rs. 1200.00",
    PAYMENT: "Successful",
    ITEMS: "1 / 2",
    RequestedAT: "20.04.204 at 9:15 am",
    STATUS: "Successful",
  },
  {
    ID: "3",
    ORDER: "#262",
    CUSTOMER: "Rahul Sharma",
    GRANDTOTAL: "Rs. 1200.00",
    PAYMENT: "Successful",
    ITEMS: "1 / 2",
    RequestedAT: "20.04.204 at 9:15 am",
    STATUS: "Successful",
  },
  {
    ID: "4",
    ORDER: "#262",
    CUSTOMER: "Rahul Sharma",
    GRANDTOTAL: "Rs. 1200.00",
    PAYMENT: "Successful",
    ITEMS: "1 / 2",
    RequestedAT: "20.04.204 at 9:15 am",
    STATUS: "Successful",
  },
  {
    ID: "5",
    ORDER: "#262",
    CUSTOMER: "Rahul Sharma",
    GRANDTOTAL: "Rs. 1200.00",
    PAYMENT: "Successful",
    ITEMS: "1 / 2",
    RequestedAT: "20.04.204 at 9:15 am",
    STATUS: "Successful",
  },
  {
    ID: "6",
    ORDER: "#262",
    CUSTOMER: "Rahul Sharma",
    GRANDTOTAL: "Rs. 1200.00",
    PAYMENT: "Successful",
    ITEMS: "1 / 2",
    RequestedAT: "20.04.204 at 9:15 am",
    STATUS: "Successful",
  },
  {
    ID: "7",
    ORDER: "#262",
    CUSTOMER: "Rahul Sharma",
    GRANDTOTAL: "Rs. 1200.00",
    PAYMENT: "Successful",
    ITEMS: "1 / 2",
    RequestedAT: "20.04.204 at 9:15 am",
    STATUS: "Successful",
  },
  {
    ID: "8",
    ORDER: "#262",
    CUSTOMER: "Rahul Sharma",
    GRANDTOTAL: "Rs. 1200.00",
    PAYMENT: "Successful",
    ITEMS: "1 / 2",
    RequestedAT: "20.04.204 at 9:15 am",
    STATUS: "Successful",
  },
  {
    ID: "9",
    ORDER: "#262",
    CUSTOMER: "Rahul Sharma",
    GRANDTOTAL: "Rs. 1200.00",
    PAYMENT: "Successful",
    ITEMS: "1 / 2",
    RequestedAT: "20.04.204 at 9:15 am",
    STATUS: "Successful",
  },
  {
    ID: "10",
    ORDER: "#262",
    CUSTOMER: "Rahul Sharma",
    GRANDTOTAL: "Rs. 1200.00",
    PAYMENT: "Successful",
    ITEMS: "1 / 2",
    RequestedAT: "20.04.204 at 9:15 am",
    STATUS: "Successful",
  },
  {
    ID: "11",
    ORDER: "#262",
    CUSTOMER: "Rahul Sharma",
    GRANDTOTAL: "Rs. 1200.00",
    PAYMENT: "Successful",
    ITEMS: "1 / 2",
    RequestedAT: "20.04.204 at 9:15 am",
    STATUS: "Successful",
  },
  {
    ID: "12",
    ORDER: "#262",
    CUSTOMER: "Rahul Sharma",
    GRANDTOTAL: "Rs. 1200.00",
    PAYMENT: "Successful",
    ITEMS: "1 / 2",
    RequestedAT: "20.04.204 at 9:15 am",
    STATUS: "Successful",
  },
  {
    ID: "13",
    ORDER: "#262",
    CUSTOMER: "Rahul Sharma",
    GRANDTOTAL: "Rs. 1200.00",
    PAYMENT: "Successful",
    ITEMS: "1 / 2",
    RequestedAT: "20.04.204 at 9:15 am",
    STATUS: "Successful",
  },
  {
    ID: "14",
    ORDER: "#262",
    CUSTOMER: "Rahul Sharma",
    GRANDTOTAL: "Rs. 1200.00",
    PAYMENT: "Successful",
    ITEMS: "1 / 2",
    RequestedAT: "20.04.204 at 9:15 am",
    STATUS: "Successful",
  },
  {
    ID: "15",
    ORDER: "#262",
    CUSTOMER: "Rahul Sharma",
    GRANDTOTAL: "Rs. 1200.00",
    PAYMENT: "Successful",
    ITEMS: "1 / 2",
    RequestedAT: "20.04.204 at 9:15 am",
    STATUS: "Successful",
  },
];

export const CancellationDatas = () => {


  const tableInstance = useTable(
    {
      columns: COLUMNS,
      data: DATATABLE,
    },
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    headerGroups,
    getTableBodyProps,
    prepareRow,
    state,
    // setGlobalFilter,
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

  // const { globalFilter, pageIndex, pageSize } = state;
  const { pageIndex, pageSize } = state;

  const handleChange = (selectedValue) => {
    // Call your function here
    console.log("Selected value:", selectedValue);
    // Call your function here
  };

  return (
    <>
      <div className="e-table pb-1 table-responsive">
        <Row className="justify-content-end mx-2 d-flex align-items-center">
          <Col>
            <div className="d-block">
              <span>Show </span>
              <select
                className="mt-5 me-1"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                {[10, 25, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
              {/* <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} /> */}
              <span>Entries</span>
            </div>
          </Col>
          <Col className="text-end">
            <Button className="btn btn-success text-white w-auto border-success">
              <i className="fa fa-download"></i>&nbsp;Export
            </Button>
          </Col>
        </Row>
        <Form>
          <Row className="mt-5 mx-2" style={{ rowGap: "10px" }}>
            <Col as={Col} lg={3} md={6} sm={6} xs={12}>
              <Form.Group>
                <Form.Control
                  type="text"
                  name="customer_name"
                  placeholder="Search By Customer Name"
                // onChange={handleChange}
                // onBlur={handleBlur}
                // value={values.meta_title}
                />
              </Form.Group>
            </Col>
            <Col as={Col} lg={3} md={6} sm={6} xs={12}>
              <Form.Group>
                <Form.Select name="payment_status" className="form-control">
                  <option value="">Search By Payment Status</option>
                  <option value="sucessful">Successful</option>
                  <option value="pending">Pending</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col as={Col} lg={2} md={4} sm={4} xs={12}>
              <Form.Control name="payment_status" type="date" />
            </Col>
            <Col as={Col} lg={2} md={4} sm={4} xs={12}>
              <Form.Control name="payment_status" type="date" />
            </Col>
            <Col>
              <Button type="submit" className="w-100">
                Search
              </Button>
            </Col>
          </Row>
        </Form>

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
                    <ActionOption
                      id={row.original.ID}
                      // onApprove={handleApprove}
                      // onDecline={handleDecline}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <div className="d-block d-sm-flex m-4 ">
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

// const GlobalFilter = ({ filter, setFilter }) => {
//   return (
//     <span className="d-flex ms-auto d-inline-flex float-end">
//       <input
//         value={filter || ""}
//         onChange={(e) => setFilter(e.target.value)}
//         className="form-control m-4"
//         placeholder="Search..."
//       />
//     </span>
//   );
// };
