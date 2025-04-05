import React, { useState } from "react";
import { Button, Row, Col, Form, Card, } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { useGetNotFoundSearchesQuery } from "../../redux/features/blogsEndPoints";
import Loader from "../../layouts/layoutcomponents/loader";
import Error from "../../layouts/layoutcomponents/Error";
import PageHeader from "../../layouts/layoutcomponents/pageheader";

export const NotFoundSearchTable = () => {
    // const dispatch = useDispatch();
    // const role = localStorage.getItem("role")
    // const permissions = JSON.parse(localStorage.getItem("permissions"))

    // const showExport = role === "Admin" || (role === "Staff" && permissions.Medicine.includes("export"))
    // const showImport = role === "Admin" || (role === "Staff" && permissions.Medicine.includes("import"))
    // const showEdit = role === "Admin" || (role === "Staff" && permissions.Medicine.includes("edit"))
    // const showAddTrash = role === "Admin" || (role === "Staff" && permissions.Medicine.includes("add-trash"))

    const [serialNumber, setSerialNumber] = useState(1)
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const { data, isError, error, isLoading, isFetching, isSuccess, refetch } = useGetNotFoundSearchesQuery()




    if (isLoading || isFetching) {
        return <Loader />;
    }
    if (isError) {
        return <Error error_mes={Error} />;
    }

    if (isSuccess) {
        const COLUMNS = [
            {
                name: "#",
                selector: (row, index) => serialNumber + index,
                sortable: true,
            },
            {
                name: "Name",
                sortable: true,
                cell: (row) => row?.name
            },
            {
                name: "Count",
                sortable: true,
                cell: (row) => row?.count
            },

        ];

        const notFoundSearch = data?.data || []
        console.log("notFoundSearch", notFoundSearch);

        // const filteredData = notFoundSearch?.filter((item) =>
        //     item.name.toLowerCase().includes(searchTerm.toLowerCase())
        // );
        const itemsPerPage = pageSize;
        const totalPages = Math.ceil(notFoundSearch?.length / itemsPerPage);
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = notFoundSearch?.slice(indexOfFirstItem, indexOfLastItem);

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
                <Row>
                    <Col>
                        <PageHeader titles="Not Found" active="Not Found" items={["Home"]} links={['/dashboard']} />
                    </Col>
                </Row>
                <Card>
                    <Card.Body>
                        <div className="e-table pb-5 table-responsive">
                            {isLoading && <Loader />}
                            <Row className="mt-3 mx-2 align-items-center my-3">
                                <Col as={Col} sm={5} xs={12}>
                                    <div className="d-block ms-5">
                                        <span>Show</span>
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
                            </Row>
                            {/* <Row className="justify-content-end">
                                <Col as={Col} sm={3}>
                                    <Form.Group className="m-3">
                                        <Form.Control type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
                                    </Form.Group>
                                </Col>
                            </Row> */}
                            <DataTable data={currentItems} columns={COLUMNS} striped fixedHeader />
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
                    </Card.Body>
                </Card>
            </>
        );
    }
}