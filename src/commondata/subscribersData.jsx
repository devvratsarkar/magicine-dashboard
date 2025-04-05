import React, { useState, useRef } from "react";
import { Button, OverlayTrigger, Table, Tooltip, Row, Col, Form, } from "react-bootstrap";
import Loader from "../layouts/layoutcomponents/loader";
import Error from "../layouts/layoutcomponents/Error";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { useGetAllSubscribersQuery, useUpdateSubscribersStatusMutation } from "../redux/features/customerDataEndPoints";
import { openModal } from "../redux/slices/allModalSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../utils/config";

export const SubscribersDataTable = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [email, setEmail] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [queryParams, setQueryParams] = useState({
    email: '',
    fromDate: '',
    toDate: '',
  })


  const role = localStorage.getItem("role")
  const permission = JSON.parse(localStorage.getItem("permissions"))

  const showDelete = role === "Admin" || (role === "Staff" && permission.Subscriber.includes("delete"))
  const showEdit = role === "Admin" || (role === "Staff" && permission.Subscriber.includes("edit"))

  const { data, isError, error, isLoading, isFetching, isSuccess, refetch } = useGetAllSubscribersQuery(queryParams);
  const [updateSubscribersStatus, { isLoading: loading }] = useUpdateSubscribersStatusMutation()
  const handleSubmit = (e) => {
    e.preventDefault()
    setQueryParams({ email, fromDate, toDate })
  }

  if (isError) {
    return <Error error_mes={error} />;
  }
  // if (isSuccess) {
  const COLUMNS = [
    {
      name: "#",
      selector: (row) => row.index + 1,
      sortable: true,
      sortFunction: (a, b) => b.index - a.index,
    },
    {
      name: "Email ID",
      sortable: true,
      selector: (row) => row?.email,
      cell: (row) => (<div>{row?.email}</div>)
    },
    {
      name: "Date Of Subscription",
      sortable: true,
      selector: (row) => row?.date_of_subscription,
      cell: (row) => (<div>{row?.date_of_subscription}</div>)
    },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => {
        const [checked, setChecked] = useState(row?.status);
        const handleStatusChange = async () => {
          try {
            setChecked(!checked);
            const response = await updateSubscribersStatus({ subscriberId: row.id, subscriberStatus: { status: !checked } });
            if (response?.data?.http_status_code === 200) {
              toast.success(response.data.message);
            }
          } catch (error) {
            console.error(error);
          }
        };
        return (
          <>
            {
              showEdit ? (
                <label className="custom-switch">
                  <input type="checkbox" className="custom-switch-input" onChange={handleStatusChange} checked={checked} />
                  <span className="custom-switch-indicator custum-green-btn"></span>
                </label>
              ) : (
                <label className="custom-switch">
                  <input type="checkbox" className="custom-switch-input" onChange={handleStatusChange} checked={checked} disabled />
                  <span className="custom-switch-indicator custum-green-btn"></span>
                </label>
              )
            }
          </>
        );
      },
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          {
            showDelete && (
              <div className="action_icon_wrapper">
                <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                  <Button className="btn btn-con btn-danger border-danger" onClick={() => { dispatch(openModal({ componentName: 'DeleteSubscribers', data: row, })) }}> <i className="fe fe-trash"></i> </Button>
                </OverlayTrigger>
              </div>
            )
          }
        </>
      ),
    },
  ];

  const customerData = Array.isArray(data?.data) ? data.data : [];
  const indexedData = customerData.map((item, index) => ({ ...item, index }));
  const filteredData = indexedData?.filter((item) =>
    item.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const itemsPerPage = pageSize;
  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData?.slice(indexOfFirstItem, indexOfLastItem);

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
      <div className="e-table pb-5 table-responsive">
        <Row className="justify-content-end m-2 d-flex align-items-center">
          <Col as={Col}>
            <div className="d-block">
              <span>Show </span>
              <select className="mx-2" value={pageSize} onChange={handlePageSizeChange}>
                {[10, 25, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span>Entries</span>
            </div>
          </Col>
          {/* <Col as={Col} className="text-end">
            <Button className="btn btn-success text-white me-3 border-success" onClick={() => window.open(`${API_BASE_URL}/export-subscribers`, "_blank")}><i className="fa fa-download"></i> Export</Button>
          </Col> */}
        </Row>
        <Form onSubmit={handleSubmit}>
          {isLoading || isFetching || loading ? <Loader /> : null}
          <Row className="my-5 mx-2" style={{ rowGap: "5px" }}>
            <Col as={Col} lg={3} md={6} sm={6} xs={12}>
              <Form.Control placeholder="Search By Email ID" onChange={(e) => setEmail(e.target.value)} name="email" />
            </Col>
            <Col as={Col} lg={3} md={6} sm={6} xs={12} className={`date-input-container ${!fromDate ? 'empty' : ''}`}>
              <Form.Control type="date" className="date-input" onChange={(e) => setFromDate(e.target.value)} name="fromDate" max={new Date().toISOString().split('T')[0]} />
              <span className="placeholder">Date From</span>
            </Col>
            <Col as={Col} lg={3} md={6} sm={6} xs={12} className={`date-input-container ${!toDate ? 'empty' : ''}`}>
              <Form.Control type="date" className="date-input" onChange={(e) => setToDate(e.target.value)} name="toDate" max={new Date().toISOString().split('T')[0]} />
              <span className="placeholder">Date To</span>
            </Col>
            <Col>
              <Button type="submit" className="w-100">Search</Button>
            </Col>
          </Row>
        </Form>

        <DataTable data={currentItems} columns={COLUMNS} striped />

        <div className="pagination_wrapper">
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
      </div>
    </>
  );
}