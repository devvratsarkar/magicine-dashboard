import React, { useState } from "react";
import { Button, Table, Row, Col, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useTable, useGlobalFilter, useSortBy, usePagination, } from "react-table";
import { Link } from "react-router-dom";

import { useAllOrgerQuery } from "../redux/features/cartApiEndPoint";
import DataTable from "react-data-table-component";
import { useDispatch } from "react-redux";
import { API_BASE_URL } from "../utils/config";
import axios from "axios";
import Loader from "../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";
import moment from "moment";
import { openModal } from "../redux/slices/allModalSlice";

function capitalizeFirstLetter(word) {
  return word?.charAt(0).toUpperCase() + word?.slice(1).toLowerCase();
}

export const OrdersDataTable = () => {
  const dispatch = useDispatch();

  const [prescription, setPrescription] = useState("")
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [queryParams, setQueryParams] = useState({
    prescription: '',
    status: '',
    fromDate: '',
    toDate: '',
  });

  const { data, isError, error, isLoading, isFetching, isSuccess } = useAllOrgerQuery(queryParams)

  const handleSubmit = (e) => {
    e.preventDefault();
    setQueryParams({ prescription: prescription, status, fromDate, toDate });
  };

  const [serialNumber, setSerialNumber] = useState(1)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const permissions = JSON.parse(localStorage.getItem("permissions"))
  const role = localStorage.getItem("role")
  const shouldShowExportButton = role === "Admin" ||
    (role === "Staff" && permissions.order && permissions.Order.includes("export"));
  const shouldShowSingleView = role === "Admin" ||
    (role === "Staff" && permissions.Order.includes("view"));

  const handleExport = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/download-order-csv`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'Orders.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Orders downloaded successfully!");
    } catch (error) {
      toast.error("An error occurred during export.");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => toast.success("Transaction ID copied to clipboard!"),
      (err) => toast.error("Failed to copy Transaction ID.")
    );
  };

  const COLUMNS = [
    {
      name: "#",
      selector: (row, index) => index + serialNumber,
      sortable: true,
    },
    {
      name: "Order Id",
      selector: (row) => row?.order_number,
      sortable: true,
    },
    {
      name: "Order Date",
      selector: (row) => row && row?.createdAt ? moment(row?.createdAt).format("DD-MM-YYYY [at] hh:mm A") : null,
      sortable: true,
    },
    {
      name: "Customer Name",
      selector: (row) => row?.user?.name || "null",
      sortable: true,
    },
    {
      name: "Phone Number",
      selector: (row) => row?.user?.phone_number || "null",
      sortable: true,
    },
    {
      name: "Prescription",
      selector: (row) => row?.prescription ? "Yes" : "No",
      sortable: true,
    },
    {
      name: "Total",
      selector: (row) => row?.total_amount,
      sortable: true,
      cell: (row) => {
        if (row?.currency === "USD") {
          return `$.${(row.total_amount).toFixed(2)}`;
        } else {
          return `Rs.${row.total_amount}`;
        }
      },
    },
    {
      name: "Payment",
      selector: (row) => {
        if (row?.payment_status === "Pending") {
          return (
            <Button variant="" className="btn btn-danger  text-light">
              Failed
            </Button>
          );
        } else if (row?.payment_status === "Paid") {
          return (
            <button className="btn custum-paid-color text-light px-5">
              {row?.payment_status}
            </button>
          );
        } else {
          return (
            <button className="btn custum-failed-color text-light px-4">
              {row?.payment_status}
            </button>
          );
        }
      },
      sortable: true,
    },
    {
      name: "Transaction ID",
      selector: (row) => row?.transaction_id,
      cell: (row) => (
        <button
          className="btn btn-link text-primary"
          onClick={() => copyToClipboard(row.transaction_id)}
        >
          {row.transaction_id}
        </button>
      ),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => {
        return row?.status === "pending"
          ? "Order Placed"
          : row?.status === "accepted"
            ? "Order Accepted"
            : row?.status === "processed"
              ? "Order Processed"
              : row?.status === "packed"
                ? "Order Packed"
                : row?.status === "dispatched"
                  ? "Order Dispatched"
                  : row?.status === "delivered"
                    ? "Order Delivered"
                    : capitalizeFirstLetter(row?.status);
      },
      sortable: true,
    },
    {
      name: "Live Status",
      selector: (row) => {
        return row?.status === "dispatched" && row?.tracking_id
          ? (
            <>
              <OverlayTrigger placement="top" overlay={<Tooltip>Track</Tooltip>}>
                <Button className="btn btn-icon btn-primary" onClick={() => dispatch(openModal({ componentName: "TrackingModel", data: row }))}>
                  <i className="fe fe-map-pin"></i>
                </Button>
              </OverlayTrigger>
            </>
          )
          : null
      },
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="action_icon_wrapper">
          {
            shouldShowSingleView && (
              <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
                <Link
                  to={`/all-orders/order-details/${row.id}`}
                  className="action_icon"
                >
                  <Button className="btn btn-icon btn-primary">
                    <i className="fe fe-eye"></i>
                  </Button>
                </Link>
              </OverlayTrigger>
            )
          }
        </div>
      ),
    }
  ];

  const productsData = data?.data || []
  const filteredproductData = searchTerm
    ? productsData.filter((item) => {
      const searchTermLower = searchTerm.toLowerCase();
      const formattedDate = item?.createdAt
        ? moment(item.createdAt).format("DD-MM-YYYY [at] hh:mm A").toLowerCase()
        : "";

      return (
        item?.order_number?.toString()?.toLowerCase().includes(searchTermLower) ||
        item?.user?.name?.toLowerCase().includes(searchTermLower) ||
        item?.user?.phone_number?.toLowerCase().includes(searchTermLower) ||
        item?.total_amount?.toString().includes(searchTermLower) ||
        item?.payment_status?.toLowerCase().includes(searchTermLower) ||
        item?.transaction_id?.toLowerCase().includes(searchTermLower) ||
        item?.status?.toLowerCase().includes(searchTermLower) ||
        formattedDate.includes(searchTermLower)
      );
    })
    : productsData;

  const itemsPerPage = pageSize;
  const totalPages = Math.ceil(filteredproductData?.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredproductData?.slice(indexOfFirstItem, indexOfLastItem);

  const displayPages = () => {
    const pageButtons = [];
    const delta = 2;
    const left = currentPage - delta;
    const right = currentPage + delta + 1;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i < right)) {
        pageButtons.push(
          <li key={i} className={currentPage === i ? "active" : ""}>
            <Button className="btn btn-default" variant={currentPage === i ? "primary" : "default"} onClick={() => paginate(i)}>
              {i}
            </Button>
          </li>
        );
      } else if (i === left - 1 || i === right + 1) {
        pageButtons.push(<li key={i} className="ellipsis_pagination">......</li>);
      }
    }
    return pageButtons;
  };
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="e-table pb-5 table-responsive">
        <Row className="justify-content-between mt-3 mx-2">
          <Col as={Col} xs={12} sm={6} className="order-sm-2 text-end">
            {shouldShowExportButton && (
              <Button
                className="btn btn-success text-white me-3 border-success"
                onClick={handleExport}
              >
                <i className="fa fa-download"></i> Export
              </Button>
            )}
          </Col>
          <Col as={Col} xs={12} sm={6} className="order-sm-1">
            <div className="d-block ms-5">
              <span>Show </span>
              <select
                className="m-1"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                {[10, 25, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
              <span>Entries</span>
            </div>
          </Col>
        </Row>
        <Form className="mb-4" onSubmit={handleSubmit}>
          <Row className="mt-2 mx-2" style={{ rowGap: '10px' }}>
            <Col as={Col} md={3}>
              <Form.Select name="status" onChange={(e) => setStatus(e.target.value)}>
                <option value="">Search By Order Status</option>
                <option value="pending">Order Placed</option>
                <option value="accepted">Order Accepted</option>
                <option value="processed">Order Processed</option>
                <option value="packed">Order Packed</option>
                <option value="dispatched">Order Dispatched</option>
                <option value="delivered">order Delivered</option>
                <option value="rejected">Rejected</option>
                <option value="hold">Hold</option>
                <option value="cancelled">Cancelled</option>
              </Form.Select>
            </Col>
            <Col as={Col} md={3}>
              <Form.Select
                name="prescription"
                onChange={(e) => setPrescription(e.target.value)}
              >
                <option value="">Search By Prescriptions</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Form.Select>
            </Col>
            <Col as={Col} md={2}>
              <div className="date-input-wrapper" onClick={() => document.getElementById('fromDate').focus()}>
                <Form.Control
                  type="date"
                  name="fromDate"
                  id="fromDate"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  placeholder="Search By Date"
                />
              </div>
            </Col>
            <Col as={Col} md={2}>
              <div className="date-input-wrapper" onClick={() => document.getElementById('toDate').focus()}>
                <Form.Control
                  type="date"
                  name="toDate"
                  id="toDate"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  placeholder="Search By Date"
                />
              </div>
            </Col>
            <Col as={Col} md={2}>
              <Button type="submit" className="w-100">
                Search
              </Button>
            </Col>
          </Row>
        </Form>
        <Row className="p-3">
          <Col as={Col} md={10}></Col>
          <Col as={Col} md={2}>
            <Form.Control type="text" placeholder="Search" value={searchTerm} onChange={handleSearch} />
          </Col>
        </Row>

        {filteredproductData.length > 0 ? (
          <DataTable data={currentItems} columns={COLUMNS} striped />
        ) : (
          <div className="text-center py-4">
            <h5>No orders found</h5>
          </div>
        )}
        <div className="pagination_wrapper">
          <Row>
            <Col>
              <p className="fw-bolder mx-3 mt-3">Total: - <span>{filteredproductData?.length}</span></p>
            </Col>
          </Row>
          <ul className="pagination">
            <li>
              <Button className="btn btn-default" variant="default" onClick={prevPage}>
                <i className="fa fa-angle-left"></i> Previous
              </Button>
            </li>
            {displayPages()}
            <li>
              <Button className="btn btn-default" variant="default" onClick={nextPage}>
                Next <i className="fa fa-angle-right"></i>
              </Button>
            </li>
          </ul>
        </div>
      </div >
    </>
  );
};