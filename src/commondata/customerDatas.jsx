import React, { useState, useRef } from "react";
import { Button, OverlayTrigger, Table, Tooltip, Row, Col, Form, } from "react-bootstrap";
import Loader from "../layouts/layoutcomponents/loader";
import Error from "../layouts/layoutcomponents/Error";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { useEditUserMutation, useGetAllUsersQuery } from "../redux/features/customerDataEndPoints";
import { generateViewCustomerPage } from "../utils/routes";
import toast from "react-hot-toast";

export const CustomerDatas = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [serialNumberm, setSerialNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [userType, setUserType] = useState('')
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [queryParams, setQueryParams] = useState({
    name: '',
    email: '',
    country: '',
    fromDate: '',
    toDate: '',
    purchaseStatus: ""
  })
  const [editUser, { isLoading: loading }] = useEditUserMutation()
  const { data, isError, error, isLoading, isFetching, isSuccess, refetch } = useGetAllUsersQuery(queryParams);
  const handleSubmit = (e) => {
    e.preventDefault()
    setQueryParams({ name, email, country, fromDate, toDate, purchaseStatus: userType })
  }

  const role = localStorage.getItem("role")
  const permissions = JSON.parse(localStorage.getItem("permissions"))

  const showEdit = role === "Admin" || (role === "Staff" && permissions.User.includes("edit"))

  if (isError) {
    return <Error error_mes={error} />;
  }
  // if (isSuccess) {
  const COLUMNS = [
    {
      name: "#",
      selector: (row, index) => `${index + serialNumberm} {${row.id}}`,
      sortable: true,
    },
    {
      name: "Customer Name",
      sortable: true,
      selector: (row) => row?.name,
      cell: (row) => (<div>{row?.name}</div>)
    },
    {
      name: "Picture",
      selector: (row) => row?.profile_pic,
      cell: (row) => (<img src={row?.profile_pic} width={70} height={70} />)
    },
    {
      name: "Country",
      selector: (row) => row?.user_address?.country,
      sortable: true,
    },
    {
      name: "Email Id",
      selector: (row) => row?.email,
      cell: (row) => (<div>{row?.email}</div>),
      sortable: true,
    },
    {
      name: "Member Since",
      selector: (row) => row?.member_since,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => {
        const [checked, setChecked] = useState(row?.status);
        const handleStatusChange = async () => {
          try {
            setChecked(!checked);
            const response = await editUser({ userId: row.id, userData: { status: !checked } });
            if (response?.data?.http_status_code === 200) {
              toast.success("User Status Updated Successfully");
            }
          } catch (error) {
            console.error(error);
          }
        };
        return (
          <>{
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
        <div className="action_icon_wrapper">
          <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
            <Link to={`${generateViewCustomerPage()}/${row.id}`}><Button type="button" className="btn btn-icon btn-primary" variant=""><i className="fe fe-eye"></i></Button></Link>
          </OverlayTrigger>
          {
            showEdit && (
              <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                <Link to={`/edit-customer/ ${row.id}`}><Button type="button" className="btn btn-icon btn-warning" variant=""><i className="fe fe-edit"></i></Button></Link>
              </OverlayTrigger>
            )
          }
        </div>
      ),
    },
  ];

  // console.log("data?.data", data?.data)
  const customerData = Array.isArray(data?.data?.users) ? data.data?.users : [];
  const indexedData = customerData.map((item, index) => ({ ...item, index }));
  const filteredData = indexedData?.filter((item) =>
    (item?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("filtered data", filteredData)

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
        <Row className="m-2 d-flex align-items-center">
          <Col as={Col} md={3}>
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
          <Col as={Col} md={3}>
            <p className="fw-bolder">Total Customer:- <span className="border rounded-3 p-2">{data?.data?.totalUsers}</span>  </p>
          </Col>
          <Col as={Col} md={3}>
            <p className="fw-bolder">Never Purchased:- <span className="border rounded-3 p-2">{data?.data?.neverPurchasedCount}</span>  </p>
          </Col>
          <Col as={Col} md={3}>
            <p className="fw-bolder">Purchased:- <span className="border rounded-3 p-2">{data?.data?.purchasedCount}</span>  </p>
          </Col>

        </Row>
        <Form onSubmit={handleSubmit}>
          {isLoading || isFetching ? <Loader /> : null}
          <Row className="my-5 mx-2" style={{ rowGap: "5px" }}>
            <Col as={Col} md={10}>
              <Row>
                <Col as={Col} md={4} className="mb-3">
                  <Form.Label>Customer Name</Form.Label>
                  <Form.Control placeholder="Search By Customer Name" onChange={(e) => setName(e.target.value)} name="name" />
                </Col>
                <Col as={Col} md={4} className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control placeholder="Search By Email ID" onChange={(e) => setEmail(e.target.value)} name="email" />
                </Col>
                <Col as={Col} md={4} className="mb-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Control placeholder="Search By Country" onChange={(e) => setCountry(e.target.value)} name="country" />
                </Col>
                <Col as={Col} md={4} >
                  <Form.Label>Date From</Form.Label>
                  <Form.Control type="date" className="date-input" onChange={(e) => setFromDate(e.target.value)} name="fromDate" max={new Date().toISOString().split('T')[0]} />
                </Col>
                <Col as={Col} md={4} >
                  <Form.Label>Date To</Form.Label>
                  <Form.Control type="date" className="date-input" onChange={(e) => setToDate(e.target.value)} name="toDate" max={new Date().toISOString().split('T')[0]} />
                </Col>
                <Col as={Col} md={4}>
                  <Form.Label>User Type</Form.Label>
                  <Form.Select placeholder="Search By Country" value={userType} onChange={(e) => setUserType(e.target.value)} name="country" >
                    <option value="all">All</option>
                    <option value="never_purchased">Never purchased anything</option>
                    <option value="purchased">Have purchased products</option>
                  </Form.Select>
                </Col>
              </Row>
            </Col>
            <Col as={Col} md={2} className="m-auto">
              <Col>
                <Button type="submit" className="w-100">Search</Button>
              </Col>
            </Col>
          </Row>
        </Form>

        <DataTable data={currentItems} columns={COLUMNS} striped />

        <div className="pagination_wrapper">
          <div className="mt-3 ms-3 fw-bolder">Total: <span>{filteredData?.length}</span></div>
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
