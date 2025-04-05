import React, { useState } from "react";
import { Button, Col, Form, OverlayTrigger, Row, Table, Tooltip } from "react-bootstrap";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import { Link, useNavigate } from "react-router-dom";
import inventoryImage from "../assets/images/dashboard/inventory.png";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import SingleReviews from "../components/reviews/SingleReviews";
import { useDispatch } from "react-redux";
import { openModal } from "../redux/slices/allModalSlice";
import { useEditBrandMutation, useGetReviewsDataQuery } from "../redux/features/catalogueEndPoints";
import Loader from "../layouts/layoutcomponents/loader";
import Error from "../layouts/layoutcomponents/Error";
import DataTable from "react-data-table-component";
import { generateViewProductPage } from "../utils/routes";

export const ReviewData = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [editBrand, { isLoading: loading }] = useEditBrandMutation();
  const { data, isError, error, isLoading, isFetching, isSuccess } = useGetReviewsDataQuery()
  const [serialNumber, setSerialNumber] = useState(1)

  const role = localStorage.getItem("role")
  const permissions = JSON.parse(localStorage.getItem("permissions"))

  const showEdit = role === "Admin" || (role === "Staff" && permissions.Review.includes("edit"))

  if (isLoading || isFetching) {
    return <Loader />;
  }
  if (isError) {
    return <Error error_mes={error} />;
  }

  if (isSuccess) {

    const handleRowClick = (modelType, productId) => {
      navigate(`/product-reviews/${modelType}/${productId}`);
    };


    const COLUMNS = [
      {
        name: "#",
        cell: (row, index) => index + serialNumber,
        sortable: true,
      },
      {
        name: "Customer Name",
        selector: (row) => row.customerName,
        cell: (row) => (<Link to={`${generateViewProductPage()}/${row.customerId}`}>{row.customerName}</Link>),
        sortable: true,
      },
      {
        name: "Product Name",
        selector: (row) => row.productName,
      },
      {
        name: "Total Rating",
        selector: (row) => row.averageStarRating,
        cell: (row) => (
          <div className="d-flex justify-content-center align-items-center">
            <Box sx={{ "& > legend": { mt: 0 } }}>
              <Rating name="read-only" className="Rating" value={row.averageStarRating} readOnly />
            </Box>
          </div>
        ),
        sortable: true,
      },
      {
        name: "Reviews",
        selector: (row) => row.ReviewText,
        cell: (row) => (
          <div className="grid review-section">
            <div className="review_content">
              <p dangerouslySetInnerHTML={{ __html: row.ReviewText }}></p>
            </div>
            <br />
            <br />
            <div className="d-flex justify-content-around">
              {
                row.status === "active" && (
                  <>
                    <p className="text-success action-btn">Approved</p>
                    <Link to={`/edit-reviews/${row?.modelType}/${row.productId}/${row?.reviewId}`} className="text-warning action-btn">Edit</Link>
                  </>
                )
              }
              {
                row.status === "inactive" && (
                  <>
                    <p className="text-danger action-btn">Rejected</p>
                    <Link to={`/edit-reviews/${row?.modelType}/${row.productId}/${row?.reviewId}`} className="text-warning action-btn">Edit</Link>
                  </>
                )
              }
              {row.status === "" && (
                <>
                  {

                    showEdit && (
                      <>
                        <p className="text-success action-btn" onClick={() => dispatch(openModal({ componentName: "ApproveReview", data: row.reviewId }))}>Accept</p>
                        <p className="text-danger action-btn" onClick={() => dispatch(openModal({ componentName: "RejectReview", data: row.reviewId }))}>Reject</p>
                        <Link to={`/edit-reviews/${row?.modelType}/${row.productId}/${row?.reviewId}`} className="text-warning action-btn">Edit</Link>
                      </>
                    )
                  }
                </>
              )}

            </div>
          </div>
        ),
      },
      {
        name: "Submitted On",
        selector: (row) => row.submittedOn,
      },
      {
        name: "Action",
        cell: (row) => (
          <div className="action_icon_wrapper">
            <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
              <Link to={`/product-reviews/${row.modelType}/${row.productId}`} className="btn btn-icon btn-primary"><i className="fe fe-eye"></i></Link>
            </OverlayTrigger>
          </div>
        ),
      },
    ]


    const allReviewData = data?.data?.newReview || []
    const filteredData = allReviewData?.filter((item) =>
      item?.productName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const itemsPerPage = pageSize;
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

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
        <div className="e-table pb-5 table-responsive review_table">
          <Row className="m-5">
            {loading && <Loader />}
            <Col as={Col} sm={9}>
              <span>Show</span>
              <select className="mx-2" value={pageSize} onChange={handlePageSizeChange}>
                {[10, 25, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span>Entries</span>
            </Col>
            <Col as={Col} sm={3}>
              <Form.Group className="mx-3">
                <Form.Control type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
              </Form.Group>
            </Col>
          </Row>
          <DataTable
            data={currentItems}
            columns={COLUMNS}
            striped
            customStyles={{
              rows: {
                style: {
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                },
              },
            }}
            onRowClicked={(row) => handleRowClick(row.modelType, row.productId)}
          />
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
  };
};

