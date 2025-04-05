import React, { useState } from "react";
import { Button, Col, Form, OverlayTrigger, Row, Table, Tooltip } from "react-bootstrap";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import { Link } from "react-router-dom";
import { generateViewCustomerPage } from "../utils/routes";

const handleChange = (selectedValue) => {
  console.log("Selected value:", selectedValue);
};

export const COLUMNS = [
  {
    Header: "#",
    accessor: "ID",
    className: "text-center wd-15p border-bottom-0",
  },
  {
    Header: "Order",
    accessor: "ORDER",
    className: "text-center wd-15p border-bottom-0 ",
  },
  {
    Header: "Customer",
    accessor: "CUSTOMER",
    Cell: ({ row, value }) => (<Link to={`${generateViewCustomerPage()}/${row.original.ID}`} target="_blank">{value}</Link>),
    className: "text-center wd-15p border-bottom-0",
  },
  {
    Header: "Phone No.",
    accessor: "Phone",
    className: "text-center wd-15p border-bottom-0",
  },
  {
    Header: "Grand Total",
    accessor: "GRANDTOTAL",
    className: "text-center wd-15p border-bottom-0 ",
  },
  {
    Header: "Payment",
    accessor: "PAYMENT",
    className: "text-center wd-15p border-bottom-0 ",
  },
  {
    Header: "Items",
    accessor: "ITEMS",
    className: "text-center wd-15p border-bottom-0 ",
  },
  {
    Header: "Requested At",
    accessor: "REQUESTEDAT",
    className: "text-center wd-15p border-bottom-0 ",
  },
  {
    Header: "Status",
    accessor: "STATUS",
    className: "text-center wd-15p border-bottom-0",
    // Cell: ({ value }) => (
    //   <Form.Group>
    //     <Form.Control defaultValue={value} className="w-auto" readOnly />
    //   </Form.Group>
    // ),
  },
  {
    Header: "Rejection Reason",
    accessor: "rejection_reason",
    className: "text-center wd-15p border-bottom-0 ",
  },
];

const ActionOption = ({ id, name }) => (
  <div className="action_icon_wrapper">
    <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
      <Link to={`/returns/view-returns/${id}`} state={{ name: { name } }}>
        <Button type="button" className="btn btn-icon  btn-primary" variant=""><i className="fe fe-eye"></i></Button>
      </Link>
    </OverlayTrigger>
    <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>} >
      <Link to={`/returns/edit-returns/${id}`} state={{ name: { name } }}>
        <Button type="button" className="btn btn-icon btn-warning" variant=""><i className="fe fe-edit"></i></Button>
      </Link>
    </OverlayTrigger>
  </div>
);
export const DATATABLE = [
  {
    ID: "1",
    ORDER: "#262",
    CUSTOMER: "Rahul Sharma",
    GRANDTOTAL: "Rs. 1200.00",
    Phone: "998989887",
    PAYMENT: "Successful",
    ITEMS: "1/2",
    REQUESTEDAT: "10:15 AM on 25.04.2024",
    STATUS: "Successful",
  },
  {
    ID: "2",
    ORDER: "#262",
    CUSTOMER: "Rahul Sharma",
    GRANDTOTAL: "Rs. 1200.00",
    Phone: "998989887",
    PAYMENT: "Successful",
    ITEMS: "1/2",
    REQUESTEDAT: "10:15 AM on 25.04.2024",
    STATUS: "Successful",
  },
  {
    ID: "3",
    ORDER: "#262",
    CUSTOMER: "Rahul Sharma",
    GRANDTOTAL: "Rs. 1200.00",
    Phone: "998989887",
    PAYMENT: "Rejected",
    rejection_reason: "reason mentioned here",
    ITEMS: "1/2",
    REQUESTEDAT: "10:15 AM on 25.04.2024",
    STATUS: "Successful",
  },
  {
    ID: "4",
    ORDER: "#262",
    CUSTOMER: "Rahul Sharma",
    GRANDTOTAL: "Rs. 1200.00",
    Phone: "998989887",
    PAYMENT: "Successful",
    ITEMS: "1/2",
    REQUESTEDAT: "10:15 AM on 25.04.2024",
    STATUS: "Successful",
  },
  {
    ID: "5",
    ORDER: "#262",
    CUSTOMER: "Rahul Sharma",
    GRANDTOTAL: "Rs. 1200.00",
    Phone: "998989887",
    PAYMENT: "Successful",
    ITEMS: "1/2",
    REQUESTEDAT: "10:15 AM on 25.04.2024",
    STATUS: "Successful",
  },
  {
    ID: "6",
    ORDER: "#262",
    CUSTOMER: "Rahul Sharma",
    GRANDTOTAL: "Rs. 1200.00",
    Phone: "998989887",
    PAYMENT: "Successful",
    ITEMS: "1/2",
    REQUESTEDAT: "10:15 AM on 25.04.2024",
    STATUS: "Successful",
  },
  {
    ID: "7",
    ORDER: "#262",
    CUSTOMER: "Rahul Sharma",
    GRANDTOTAL: "Rs. 1200.00",
    Phone: "998989887",
    PAYMENT: "Successful",
    ITEMS: "1/2",
    REQUESTEDAT: "10:15 AM on 25.04.2024",
    STATUS: "Successful",
    rejection_reason: "reason mentioned here",
  },
  {
    ID: "8",
    ORDER: "#262",
    CUSTOMER: "Rahul Sharma",
    GRANDTOTAL: "Rs. 1200.00",
    Phone: "998989887",
    PAYMENT: "Successful",
    ITEMS: "1/2",
    REQUESTEDAT: "10:15 AM on 25.04.2024",
    STATUS: "Successful",
  },
  {
    ID: "9",
    ORDER: "#262",
    CUSTOMER: "Rahul Sharma",
    GRANDTOTAL: "Rs. 1200.00",
    Phone: "998989887",
    PAYMENT: "Successful",
    ITEMS: "1/2",
    REQUESTEDAT: "10:15 AM on 25.04.2024",
    STATUS: "Successful",
  },
  {
    ID: "10",
    ORDER: "#262",
    CUSTOMER: "Rahul Sharma",
    GRANDTOTAL: "Rs. 1200.00",
    Phone: "998989887",
    PAYMENT: "Successful",
    ITEMS: "1/2",
    REQUESTEDAT: "10:15 AM on 25.04.2024",
    STATUS: "Successful",
  },
  {
    ID: "11",
    ORDER: "#262",
    CUSTOMER: "Rahul Sharma",
    GRANDTOTAL: "Rs. 1200.00",
    Phone: "998989887",
    PAYMENT: "Successful",
    ITEMS: "1/2",
    REQUESTEDAT: "10:15 AM on 25.04.2024",
    STATUS: "Successful",
  },
  {
    ID: "12",
    ORDER: "#262",
    CUSTOMER: "Rahul Sharma",
    GRANDTOTAL: "Rs. 1200.00",
    Phone: "998989887",
    PAYMENT: "Successful",
    ITEMS: "1/2",
    REQUESTEDAT: "10:15 AM on 25.04.2024",
    STATUS: "Successful",
  },
  {
    ID: "13",
    ORDER: "#262",
    CUSTOMER: "Rahul Sharma",
    GRANDTOTAL: "Rs. 1200.00",
    Phone: "998989887",
    PAYMENT: "Successful",
    ITEMS: "1/2",
    REQUESTEDAT: "10:15 AM on 25.04.2024",
    STATUS: "Successful",
  },
  {
    ID: "14",
    ORDER: "#262",
    CUSTOMER: "Rahul Sharma",
    GRANDTOTAL: "Rs. 1200.00",
    Phone: "998989887",
    PAYMENT: "Successful",
    ITEMS: "1/2",
    REQUESTEDAT: "10:15 AM on 25.04.2024",
    STATUS: "Successful",
  },
  {
    ID: "15",
    ORDER: "#262",
    CUSTOMER: "Rahul Sharma",
    GRANDTOTAL: "Rs. 1200.00",
    Phone: "998989887",
    PAYMENT: "Successful",
    ITEMS: "1/2",
    REQUESTEDAT: "10:15 AM on 25.04.2024",
    STATUS: "Successful",
  },
];

export const ReturnsData = () => {
  const [approveConfermation, setApproveConfermation] = useState(false);
  const [declineConfermation, setDeclineConfermation] = useState(false);
  const [selectedReturnid, setSelectedReturnid] = useState(null);

  const handleAppreoveConfermationOpen = (return_id) => {
    setApproveConfermation(true);
    setSelectedReturnid(return_id);
  };
  const handleAppreoveConfermationClose = () => {
    setApproveConfermation(false);
  };
  const handleDeclineConfermationOpen = (return_id) => {
    setDeclineConfermation(true);
    setSelectedReturnid(return_id);
  };
  const handleDeclineConfermationClose = () => {
    setDeclineConfermation(false);
  };

  const tableInstance = useTable(
    {
      columns: COLUMNS,
      data: DATATABLE,
    },
    // useGlobalFilter,
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

  return (
    <>
      <div className="e-table pb-5 table-responsive">
        <div className="d-block ms-5">
          <span>Show</span>
          <select
            className="my-5 mx-2"
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
        <Form>
          <Row className="m-2" style={{ rowGap: "10px" }}>
            <Col as={Col} lg={3} md={3} sm={3} xs={12}>
              <Form.Control
                name="search-product-name"
                placeholder="Search By Customer Name"
              />
            </Col>
            <Col as={Col} lg={3} md={3} sm={3} xs={12}>
              <Form.Control
                name="search_brand"
                placeholder="Search By Order ID"
              />
            </Col>
            <Col as={Col} lg={3} md={3} sm={3} xs={12}>
              <Form.Select name="search">
                <option value="">Search By Status</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="approved">Approved</option>
                <option value="pickup-scheduled">Pickup Scheduled</option>
                <option value="collected">Collected</option>
                <option value="refunded">Refunded</option>
              </Form.Select>
            </Col>
            <Col as={Col} lg={3} md={3} sm={3} xs={12}>
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
                      onApprove={handleAppreoveConfermationOpen}
                      onDecline={handleDeclineConfermationOpen}
                      name={row.original.CUSTOMER}
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
