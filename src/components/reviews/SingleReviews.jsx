import React, { useEffect, useState } from "react";
import { Col, Row, Card, Form, Button } from "react-bootstrap";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Link, useParams, useNavigate } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/slices/allModalSlice";
import { useGetSelectedReviewsQuery } from "../../redux/features/catalogueEndPoints";
import moment from "moment";

function SingleReviews() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { TYPE, ID } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const { data, isError, isLoading, isSuccess, refetch } = useGetSelectedReviewsQuery({ modelType: TYPE, productId: ID });

    const selectedReview = data?.data || { review: [], averageStarRating: 0, totalReviews: 0 };

    const itemsPerPage = pageSize;

    const totalPages = Math.ceil(selectedReview?.totalReviews / itemsPerPage);

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

    const filteredReviews = selectedReview.review.filter(review =>
        review?.status?.toLowerCase().includes(searchTerm.toLowerCase()) || review.status === null
    );

    const displayedReviews = filteredReviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))

    const showEdit = role === "Admin" || (role === "Staff" && permissions.Review.includes("edit"))


    useEffect(() => {
        refetch()
    }, [isSuccess, ""])

    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <PageHeader
                        titles="Reviews"
                        active="Product Review"
                        items={["Home", "Reviews List"]}
                        links={["/dashboard", "/reviews"]}
                    />
                </Col>
                <Col className="text-end">
                    <Link className="btn btn-success" to="/reviews">
                        View All Reviews
                    </Link>
                </Col>
            </Row>
            {selectedReview ? (
                <Row className="my-4">
                    <Col>
                        <Card className="p-4">
                            <Row className="align-items-center mb-4">
                                <Col className="d-flex gap-4 flex-wrap">
                                    <h1 className="fs-5">{selectedReview.productName}</h1>
                                    <div className="d-flex justify-content-center align-items-center">
                                        <div>
                                            <Box sx={{ "& > legend": { mt: 4 } }}>
                                                <Rating
                                                    name="read-only"
                                                    className="Rating"
                                                    value={parseFloat(selectedReview.averageStarRating) || 0}
                                                    readOnly
                                                />
                                            </Box>
                                        </div>
                                        <span>({selectedReview.totalReviews})</span>
                                    </div>
                                </Col>
                                <Col className="text-end" md={4}>
                                    <Form.Select name="reviews" className="w-auto" onChange={handleSearch}>
                                        <option value="">Search</option>
                                        <option value="active">Approved</option>
                                        <option value="inactive">Inapproved</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                            {displayedReviews && displayedReviews.length > 0 ? (
                                displayedReviews.map((item, index) => (
                                    <>
                                        <Card Card key={index} className="p-4 mb-4" >
                                            <Row className="m-4">
                                                <Col md={4}>Customer Name</Col>
                                                <Col md={4}>Star Rating</Col>
                                                <Col md={4}>Reviewed On</Col>
                                            </Row>
                                            <Row className="m-4">
                                                <Col md={4}>{item.customer_name}</Col>
                                                <Col md={4}>
                                                    <div>
                                                        <Box sx={{ "& > legend": { mt: 4 } }}>
                                                            <Rating
                                                                name="read-only"
                                                                className="Rating"
                                                                value={item.star_rating}
                                                                readOnly
                                                            />
                                                        </Box>
                                                    </div>
                                                </Col>
                                                <Col md={4}>{item && item.createdAt ? moment(item.createdAt).format("DD-MM-YYYY [at] hh:mm A") : null}</Col>
                                            </Row>
                                            <Row className="m-4 d-block">
                                                <Col className="fs-5">Comments</Col>
                                                <Col dangerouslySetInnerHTML={{ __html: item.text_content }}></Col>
                                            </Row>
                                            <Row className="m-4">
                                                {item.status === "inactive" && (
                                                    <span className="text-danger border-end w-auto">Rejected</span>
                                                )}

                                                {item.status === "active" && (
                                                    <span className="text-success border-end w-auto">Approved</span>
                                                )}

                                                {(item.status === null || item.status === "") && (
                                                    <>
                                                        {
                                                            showEdit && (
                                                                <button
                                                                    className="text-success w-auto border-end"
                                                                    onClick={() => dispatch(openModal({ componentName: "ApproveReview", data: item }))}
                                                                >
                                                                    Approve
                                                                </button>
                                                            )
                                                        }
                                                        {showEdit && (
                                                            <button
                                                                className="text-danger w-auto border-end"
                                                                onClick={() => dispatch(openModal({ componentName: "RejectReview", data: item }))}
                                                            >
                                                                Reject
                                                            </button>
                                                        )
                                                        }
                                                    </>
                                                )}


                                                <Link to={`/edit-reviews/${item.modelType}/${item.product}/${item.id}`}
                                                    className="text-warning w-auto border-end"
                                                >
                                                    Edit
                                                </Link>
                                                <Link to={`/view-review/${item.modelType}/${item.product}/${item.id}`}
                                                    className="text-primary w-auto"
                                                >
                                                    View
                                                </Link>
                                                <button
                                                    className="text-danger w-auto"
                                                    onClick={() => { dispatch(openModal({ componentName: "DeleteReview", data: item })) }}
                                                >
                                                    Delete
                                                </button>

                                            </Row>
                                        </Card>
                                    </>
                                ))
                            ) : (
                                <p>No reviews available</p>
                            )}

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
                        </Card>
                    </Col>
                </Row >
            ) : (
                <p>No Review Data Available</p>
            )
            }
        </>
    );
}

export default SingleReviews;
