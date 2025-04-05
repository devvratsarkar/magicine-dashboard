import React, { useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import {
    useTable,
    useGlobalFilter,
    useSortBy,
    usePagination,
} from "react-table";
import { Link, NavLink, useNavigate } from "react-router-dom";
import inventoryImage from "../assets/images/dashboard/inventory.png";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { generateViewCustomerPage, generateViewProductPage } from "../utils/routes";

export const COLUMNS = [
    {
        Header: "#",
        accessor: "ID",
    },
    {
        Header: "Customer Name",
        accessor: "CUSTOMERNAME",
        Cell: ({ row, value }) => (<Link to={`${generateViewCustomerPage()}/${row.original.ID}`} target="_blank">{value}</Link>),
    },
    {
        Header: "Product",
        accessor: "PRODUCTNAME",
        Cell: ({ row, value }) => (<Link to={`${generateViewProductPage()}/${row.original.ID}`} target="_blank">{value}</Link>),
    },
    {
        Header: "Total Rating",
        accessor: "STARRATING",
        Cell: ({ value }) => (
            <div className="d-flex justify-content-center align-items-center">
                <Box sx={{ "& > legend": { mt: 0 } }}>
                    <Rating name="read-only" className="Rating" value={value} readOnly />
                </Box>
                <span>(33)</span>
            </div>
        ),
    },
    {
        Header: "Review",
        accessor: "REVIEW",
        Cell: ({ value, row }) => (
            <div className="data_table_text"> {value}
                {/* <div className="action_icon_wrapper justify-content-start mt-1">
                    <p className="text-green">Approved | </p>
                    <p className="text-primary">Edit</p>
                </div> */}
            </div>
        ),
    },
    {
        Header: "Submitted On",
        accessor: "DATEOFREVIEW",
    },
];


export const DATATABLE = [
    {
        ID: "1",
        PICTURE: inventoryImage,
        CUSTOMERNAME: "Rahul Sharma",
        PRODUCTNAME: "Facewash and cleanser",
        REVIEW: "I recently tried the Mamaearth Ubtan Natural Face Wash for All Skin Types with Turmeric & Saffron, and I must say it has been a refreshing addition to my skincare routine. This face wash not only promises to remove tan but also claims to brighten the skin, making it suitable for a wide range of skin types.",
        STARRATING: 4,
        DATEOFREVIEW: "02/01/2022",
    },
    {
        ID: "2",
        PICTURE: inventoryImage,
        CUSTOMERNAME: "Rahul Sharma",
        PRODUCTNAME: "Protein Drinks",
        REVIEW: "I recently tried the Mamaearth Ubtan Natural Face Wash for All Skin Types with Turmeric & Saffron, and I must say it has been a refreshing addition to my skincare routine. This face wash not only promises to remove tan but also claims to brighten the skin, making it suitable for a wide range of skin types.",
        STARRATING: 4,
        DATEOFREVIEW: "02/01/2022",
    },
    {
        ID: "3",
        PICTURE: inventoryImage,
        CUSTOMERNAME: "Rahul Sharma",
        PRODUCTNAME: "Hair Care",
        REVIEW: "I recently tried the Mamaearth Ubtan Natural Face Wash for All Skin Types with Turmeric & Saffron, and I must say it has been a refreshing addition to my skincare routine. This face wash not only promises to remove tan but also claims to brighten the skin, making it suitable for a wide range of skin types.",
        STARRATING: 4,
        DATEOFREVIEW: "02/01/2022",
    },
    {
        ID: "4",
        PICTURE: inventoryImage,
        CUSTOMERNAME: "Rahul Sharma",
        PRODUCTNAME: "Face Serums",
        REVIEW: "I recently tried the Mamaearth Ubtan Natural Face Wash for All Skin Types with Turmeric & Saffron, and I must say it has been a refreshing addition to my skincare routine. This face wash not only promises to remove tan but also claims to brighten the skin, making it suitable for a wide range of skin types.",
        STARRATING: 4,
        DATEOFREVIEW: "02/01/2022",
    },
    {
        ID: "5",
        PICTURE: inventoryImage,
        CUSTOMERNAME: "Rahul Sharma",
        PRODUCTNAME: "Facewash and cleanser",
        REVIEW: "I recently tried the Mamaearth Ubtan Natural Face Wash for All Skin Types with Turmeric & Saffron, and I must say it has been a refreshing addition to my skincare routine. This face wash not only promises to remove tan but also claims to brighten the skin, making it suitable for a wide range of skin types.",
        STARRATING: 4,
        DATEOFREVIEW: "02/01/2022",
    },
    {
        ID: "6",
        PICTURE: inventoryImage,
        CUSTOMERNAME: "Rahul Sharma",
        PRODUCTNAME: "Protein Drinks",
        REVIEW: "I recently tried the Mamaearth Ubtan Natural Face Wash for All Skin Types with Turmeric & Saffron, and I must say it has been a refreshing addition to my skincare routine. This face wash not only promises to remove tan but also claims to brighten the skin, making it suitable for a wide range of skin types.",
        STARRATING: 4,
        DATEOFREVIEW: "02/01/2022",
    },
    {
        ID: "7",
        PICTURE: inventoryImage,
        CUSTOMERNAME: "Rahul Sharma",
        PRODUCTNAME: "Hair Care",
        REVIEW: "I recently tried the Mamaearth Ubtan Natural Face Wash for All Skin Types with Turmeric & Saffron, and I must say it has been a refreshing addition to my skincare routine. This face wash not only promises to remove tan but also claims to brighten the skin, making it suitable for a wide range of skin types.",
        STARRATING: 4,
        DATEOFREVIEW: "02/01/2022",
    },
    {
        ID: "8",
        PICTURE: inventoryImage,
        CUSTOMERNAME: "Rahul Sharma",
        PRODUCTNAME: "Face Serums",
        REVIEW: "I recently tried the Mamaearth Ubtan Natural Face Wash for All Skin Types with Turmeric & Saffron, and I must say it has been a refreshing addition to my skincare routine. This face wash not only promises to remove tan but also claims to brighten the skin, making it suitable for a wide range of skin types.",
        STARRATING: 4,
        DATEOFREVIEW: "02/01/2022",
    },
    {
        ID: "9",
        PICTURE: inventoryImage,
        CUSTOMERNAME: "Rahul Sharma",
        PRODUCTNAME: "Protein Drinks",
        REVIEW: "I recently tried the Mamaearth Ubtan Natural Face Wash for All Skin Types with Turmeric & Saffron, and I must say it has been a refreshing addition to my skincare routine. This face wash not only promises to remove tan but also claims to brighten the skin, making it suitable for a wide range of skin types.",
        STARRATING: 4,
        DATEOFREVIEW: "02/01/2022",
    },
    {
        ID: "10",
        PICTURE: inventoryImage,
        CUSTOMERNAME: "Rahul Sharma",
        PRODUCTNAME: "Facewash and cleanser",
        REVIEW: "I recently tried the Mamaearth Ubtan Natural Face Wash for All Skin Types with Turmeric & Saffron, and I must say it has been a refreshing addition to my skincare routine. This face wash not only promises to remove tan but also claims to brighten the skin, making it suitable for a wide range of skin types.",
        STARRATING: 4,
        DATEOFREVIEW: "02/01/2022",
    },
    {
        ID: "11",
        PICTURE: inventoryImage,
        CUSTOMERNAME: "Rahul Sharma",
        PRODUCTNAME: "Hair Care",
        REVIEW: "I recently tried the Mamaearth Ubtan Natural Face Wash for All Skin Types with Turmeric & Saffron, and I must say it has been a refreshing addition to my skincare routine. This face wash not only promises to remove tan but also claims to brighten the skin, making it suitable for a wide range of skin types.",
        STARRATING: 4,
        DATEOFREVIEW: "02/01/2022",
    },
    {
        ID: "12",
        PICTURE: inventoryImage,
        CUSTOMERNAME: "Rahul Sharma",
        PRODUCTNAME: "Facewash and cleanser",
        REVIEW: "I recently tried the Mamaearth Ubtan Natural Face Wash for All Skin Types with Turmeric & Saffron, and I must say it has been a refreshing addition to my skincare routine. This face wash not only promises to remove tan but also claims to brighten the skin, making it suitable for a wide range of skin types.",
        STARRATING: 4,
        DATEOFREVIEW: "02/01/2022",
    },
    {
        ID: "13",
        PICTURE: inventoryImage,
        CUSTOMERNAME: "Rahul Sharma",
        PRODUCTNAME: "Hair Care",
        REVIEW: "I recently tried the Mamaearth Ubtan Natural Face Wash for All Skin Types with Turmeric & Saffron, and I must say it has been a refreshing addition to my skincare routine. This face wash not only promises to remove tan but also claims to brighten the skin, making it suitable for a wide range of skin types.",
        STARRATING: 4,
        DATEOFREVIEW: "02/01/2022",
    },
    {
        ID: "14",
        PICTURE: inventoryImage,
        CUSTOMERNAME: "Rahul Sharma",
        PRODUCTNAME: "Protein Drinks",
        REVIEW: "I recently tried the Mamaearth Ubtan Natural Face Wash for All Skin Types with Turmeric & Saffron, and I must say it has been a refreshing addition to my skincare routine. This face wash not only promises to remove tan but also claims to brighten the skin, making it suitable for a wide range of skin types.",
        STARRATING: 4,
        DATEOFREVIEW: "02/01/2022",
    },
    {
        ID: "15",
        PICTURE: inventoryImage,
        CUSTOMERNAME: "Rahul Sharma",
        PRODUCTNAME: "Facewash and cleanser",
        REVIEW: "I recently tried the Mamaearth Ubtan Natural Face Wash for All Skin Types with Turmeric & Saffron, and I must say it has been a refreshing addition to my skincare routine. This face wash not only promises to remove tan but also claims to brighten the skin, making it suitable for a wide range of skin types.",
        STARRATING: 4,
        DATEOFREVIEW: "02/01/2022",
    },
];

export const ExistingReviewData = () => {
    const navigate = useNavigate()
    const tableInstance = useTable(
        {
            columns: COLUMNS,
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
    const ActionOption = ({ data }) => (
        <div className="action_icon_wrapper justify-content-start mt-1">
            <p className="text-green" >Approved | </p>
            {/* <p className="text-danger" onClick={() => { dispatch(openModal({ componentName: 'RejectReview', data: data })) }}>Reject | </p> */}
            <Link to={`/edit-reviews/${data.ID}`} className="text-primary">Edit</Link>
        </div>
    );
    const ViewOption = ({ data }) => (
        <div className="action_icon_wrapper justify-content-start mt-1">
            <Link to={`/product-reviews/${data.ID}`} className="btn btn-icon btn-primary"><i className="fe fe-eye"></i></Link>
        </div>
    );
    return (
        <>
            <div className="e-table pb-5 table-responsive">
                <div className="w-100 bg-primary text-white px-5 py-2">
                    <p>Existing Reviews</p>
                </div>
                <div className="d-block ms-5 mt-3">
                    <span>Show</span>
                    <select
                        className="mx-2"
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                    >
                        {[10, 25, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                    <span>Entries</span>
                </div>


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
                                <th>Action</th>
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map((row, rowIndex) => {
                            prepareRow(row);

                            return (
                                <tr key={rowIndex} className={`text-center cursor-pointer ${rowIndex % 2 === 0 ? "odd_data_table_tr" : ""}`} {...row.getRowProps()}>
                                    {row.cells.map((cell) => {
                                        return (
                                            <td {...cell.getCellProps()} className="align-middle">
                                                {cell.column.id === "REVIEW" ? (
                                                    <>
                                                        {cell.render("Cell")}
                                                        <ActionOption data={row.original} />
                                                    </>
                                                ) : (
                                                    cell.render("Cell")
                                                )}
                                            </td>
                                        );
                                    })}
                                    <td role="cell" class="align-middle"><ViewOption data={row.original} /></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
                <div className="d-block d-sm-flex mb-0 mx-4 mt-4  align-items-center">
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

const GlobalFilter = ({ filter, setFilter }) => {
    return (
        <span className="d-flex ms-auto d-inline-flex float-end">
            <input
                value={filter || ""}
                onChange={(e) => setFilter(e.target.value)}
                className="form-control"
                placeholder="Search..."
            />
        </span>
    );
};
