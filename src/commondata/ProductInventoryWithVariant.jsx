import React, { useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip, Row, Col, Form, } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { openModal } from "../redux/slices/allModalSlice";
import Loader from "../layouts/layoutcomponents/loader";
import Error from "../layouts/layoutcomponents/Error";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { useGetAllInventoryWithVariantQuery } from "../redux/features/stockInventoryEndPoint";

export const ProductInventoryWithVariant = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();
    const { data, isError, error, isLoading, isFetching } = useGetAllInventoryWithVariantQuery();

    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))

    const showEdit = role === "Admin" || (role === "Staff" && permissions.InventoryWithVarient?.includes("edit"))
    const showAddTrash = role === "Admin" || (role === "Staff" && permissions.InventoryWithVarient?.includes("add-trash"))

    const COLUMNS = [
        {
            name: "#",
            selector: (row) => row.index + 1,
            sortable: true,
            sortFunction: (a, b) => b.index - a.index,
        },
        {
            name: "Product Name",
            sortable: true,
            selector: (row) => row?.modelId?.product_name,
            cell: (row) => (<div>{row?.
                modelId?.product_name}</div>)
        },
        {
            name: "Image",
            cell: (row) => (<img src={row?.modelId?.featured_image} width={50} height={50} alt="error" />)
        },
        {
            name: "Brand",
            selector: (row) => row?.modelId?.brand?.brand_name,
            sortable: true,
        },
        {
            name: "Manufacturer",
            selector: (row) => row?.modelId?.marketer?.manufacturer_name,
        },
        // {
        //   name: "",
        //   selector: (row) => row?.stock_quantity,
        // },
        {
            name: "CreatedAt",
            selector: (row) => row?.variants[0]?.createdAt,
        },
        {
            name: "Action",
            cell: (row) => (
                <div className="action_icon_wrapper">
                    <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
                        <Link to={`/inventor/view-invertory-with-varient/${row.modelType}/${row.modelId.id}`}><Button type="button" className="btn btn-icon  btn-primary" variant=""><i className="fe fe-eye"></i></Button></Link>
                    </OverlayTrigger>
                    {
                        showEdit && (
                            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                                <Button onClick={() => { dispatch(openModal({ componentName: 'AddVariant', data: row })) }} type="button" className="btn btn-icon  btn-warning" variant="" ><i className="fe fe-edit"></i></Button>
                            </OverlayTrigger>
                        )
                    }
                    {
                        showAddTrash && (
                            <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                                <Button type="button" className="btn btn-icon  btn-danger" variant="" onClick={() => { dispatch(openModal({ componentName: 'AddTrashVariant', data: row, softDelete: true })) }}><i className="fe fe-trash text-white"></i></Button>
                            </OverlayTrigger>
                        )
                    }
                </div>
            ),
        },
    ];
    const inventoryWithVariantData = Array.isArray(data?.data?.data?.ProductData) ? data?.data?.data?.ProductData : [];
    const indexedData = inventoryWithVariantData.map((item, index) => ({ ...item, index }));
    const filteredData = indexedData.filter((item) =>
        item?.modelId?.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) || item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) || item.selling_price?.toString().includes(searchTerm)
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
            <div className="e-table pb-5 table-responsive">
                <Row className="m-5">
                    {isLoading || isFetching ? <Loader /> : null}
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

                <DataTable data={currentItems} columns={COLUMNS} striped fixedHeader />
                <div className="pagination_wrapper">
                    <ul className="pagination">
                        <li>
                            <div className="btn btn-default" variant="default" onClick={prevPage}>
                                <i className="fa fa-angle-left"></i> Previous
                            </div>
                        </li>
                        {displayPages()}
                        <li>
                            <div className="btn btn-default" variant="default" onClick={nextPage}>
                                Next <i className="fa fa-angle-right"></i>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}