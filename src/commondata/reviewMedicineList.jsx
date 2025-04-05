import React, { useState } from 'react';
import { Button, Col, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import { useGetMedicinesQuery, useReviewMedicineMutation } from '../redux/features/productEndPoints';
import { useGetBrandQuery, useGetManufactutrerQuery } from '../redux/features/catalogueEndPoints';
import Loader from '../layouts/layoutcomponents/loader';
import Error from '../layouts/layoutcomponents/Error';
import moment from 'moment';
import toast from 'react-hot-toast';
import Select from "react-select"
import CustomDatePicker from '../layouts/layoutcomponents/CustomDatePicker';

export default function ReviewMedicineListDataTable() {
    const role = localStorage.getItem('role');
    const permissions = JSON.parse(localStorage.getItem('permissions'));

    const showEdit = role === 'Admin' || (role === 'Staff' && permissions.Medicine.includes('reviewer'));
    const [markReviewed, { isLoading: markReviewLoading }] = useReviewMedicineMutation();

    const [serialNumber, setSerialNumber] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [brandId, setBrandId] = useState('');
    const [marketerId, setMarketerId] = useState('');
    const [status, setStatus] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [queryParams, setQueryParams] = useState({
        brand: '',
        marketer: '',
        status: '',
        fromDate: '',
        toDate: '',
        search: '',
        page: "" || 1,
        limit: "" || 10
    });

    const [queryBrand, setQuerybrand] = useState({
        type: "",
        status: ""
    })

    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    const { data, isError, error, isLoading, isFetching, isSuccess, refetch } = useGetMedicinesQuery(queryParams);
    const { data: manufacturer } = useGetManufactutrerQuery()
    const { data: brand } = useGetBrandQuery(queryBrand)
    const manufacturerData = manufacturer?.data?.manufacturer
    const brandData = brand?.data?.allBrand;

    const searchBrandOptiion = Array.isArray(brandData) && brandData?.length > 0 ? brandData?.map((item) => ({
        value: item.id,
        label: item.brand_name,
    })) : []

    const searchOptionManufacturer = Array.isArray(manufacturerData) && manufacturerData?.length > 0 ? manufacturerData?.map((item) => ({
        value: item.id,
        label: item.manufacturer_name,
    })) : []

    const searchBrandOption = Array.isArray(brandData) && brandData?.length > 0 ? brandData?.map((item) => ({
        value: item.id,
        label: item.brand_name
    })) : []


    const searchManufacturerOption = Array.isArray(manufacturerData) && manufacturerData?.length > 0 ? manufacturerData?.map((item) => ({
        value: item.id,
        label: item.manufacturer_name
    })) : []

    const handleSubmit = (e) => {
        e.preventDefault();
        setQueryParams({ ...queryParams, brand: brandId, marketer: marketerId, status, fromDate, toDate });
    };


    const handleReviewStatusChange = async (e, row) => {
        try {
            const resp = await markReviewed({ reviewMedicineId: row.id, reviewMedicineData: row?.description });
            if (resp?.data?.http_status_code === 200) {
                refetch()
                toast.success(resp?.data?.message)
            } else {
                alert("error")
                toast.error(resp?.data?.message)
            }
        } catch (error) {
            toast.error(error?.message)
        }
    };


    if (isLoading || isFetching) {
        return <Loader />;
    }
    if (isError) {
        return <Error error_mes={error} />;
    }

    if (isSuccess) {
        const COLUMNS = [
            {
                name: '#',
                selector: (row, index) => `${serialNumber + index} {${row.id}}`,
                sortable: true,
            },
            {
                name: 'Product Name',
                sortable: true,
                cell: (row) => <Link to={`/catalogue/edit-medicines/${row.id}`}>{row?.product_name}</Link>,
            },
            {
                name: 'Image',
                selector: (row) => row?.featured_image,
                cell: (row) => <img src={row.featured_image} alt={row.product_name} width={75} height={75} />,
            },
            {
                name: 'Brand',
                selector: (row) => row?.brand?.brand_name,
                sortable: true,
            },
            {
                name: 'Manufacturer',
                selector: (row) => row?.marketer?.manufacturer_name,
                sortable: true,
            },
            {
                name: 'Created At',
                selector: (row) => row.createdAt ? moment(row.createdAt).format('DD-MM-YYYY [at] hh:mm A') : null,
                sortable: true,
            },
            {
                name: 'Review Status',
                selector: (row) => (
                    row?.is_reviewed === true ? (
                        <input
                            type='checkbox'
                            name="reviewStatus"
                            checked={row.is_reviewed || false}
                            onChange={(e) => handleReviewStatusChange(e, row)}
                            disabled
                        />
                    ) : (
                        <input
                            type='checkbox'
                            name="reviewStatus"
                            checked={row.is_reviewed || false}
                            onChange={(e) => handleReviewStatusChange(e, row)}
                            disabled={markReviewLoading}
                        />
                    )

                ),
                sortable: true,
            },
            {
                name: 'Action',
                cell: (row) => (
                    <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
                        <Link to={`/view-review-medicine/${row.id}`}>
                            <Button type="button" className="btn btn-icon btn-primary" variant="">
                                <i className="fe fe-eye"></i>
                            </Button>
                        </Link>
                    </OverlayTrigger>
                ),
            },
        ];

        const medicineData = data?.data?.filteredMedicine
        const paginationData = data?.data

        const filteredData = medicineData?.filter((item) => {
            const searchTermLower = searchTerm.toLowerCase();

            return (
                item?.product_name?.toLowerCase().includes(searchTermLower) ||
                item?.brand?.brand_name?.toLowerCase().includes(searchTermLower) ||
                item?.marketer?.manufacturer_name?.toLowerCase().includes(searchTermLower) ||
                item?.createdAt?.toLowerCase().includes(searchTermLower)
            );
        });

        const itemsPerPage = pageSize;
        const totalPages = Math.ceil(paginationData?.totalPages);
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = filteredData || [];


        const displayPages = () => {
            const pageButtons = [];
            const delta = 2;
            const left = Math.max(1, currentPage - delta);
            const right = Math.min(totalPages, currentPage + delta);

            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= left && i <= right)) {
                    pageButtons.push(
                        <li key={i} className={currentPage === i ? "active" : ""}>
                            <Button
                                className="btn btn-default"
                                variant={currentPage === i ? "primary" : "default"}
                                onClick={() => {
                                    setQueryParams({
                                        ...queryParams,
                                        page: i
                                    })
                                    setCurrentPage(i)
                                }}
                            >
                                {i}
                            </Button>
                        </li>
                    );
                } else if (i === left - 1 || i === right + 1) {
                    pageButtons.push(
                        <li key={i} className="ellipsis_pagination">...</li>
                    );
                }
            }
            return pageButtons;
        }

        const nextPage = () => {

            if (currentPage < totalPages) {
                setQueryParams((prevState) => ({
                    ...prevState,
                    page: currentPage + 1,
                }))
                setCurrentPage(currentPage + 1)
            }
        };

        const prevPage = () => {
            if (currentPage > 1) {
                setQueryParams((prevState) => ({
                    ...prevState,
                    page: currentPage - 1,
                }))
                setCurrentPage(currentPage - 1)
            }
        };


        const handlePageSizeChange = (e) => {
            const newSize = parseInt(e.target.value, 10);
            setPageSize(newSize);
            setQueryParams((prevState) => ({
                ...prevState,
                limit: newSize,
                page: 1,
            }));
            setCurrentPage(1);
        };

        const handleSearch = (e) => {
            const value = e.target.value;
            setSearchTerm(value);

            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }


            debounceTimeout.current = setTimeout(() => {
                setQueryParams({
                    ...queryParams,
                    search: value,
                });
                setCurrentPage(1);
            }, 1000);
        };
        return (
            <>
                {markReviewLoading && <Loader />}
                <div className="e-table pb-5 table-responsive">
                    {/* {loading && <Loader />} */}
                    <Row className="justify-content-between mt-3 mx-2 align-items-center">
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
                    <Form onSubmit={handleSubmit}>
                        <Row className="mt-5 mx-2" style={{ rowGap: "10px" }}>
                            <Col lg={2} md={3} sm={5} xs={12}>
                                <Select
                                    name="brand"
                                    options={searchBrandOptiion}
                                    isSearchable
                                    placeholder="Search By Brand"
                                    onChange={(selectedOption) => setBrandId(selectedOption?.value)}
                                    value={searchBrandOptiion.find(option => option.value === brandId) || null}
                                />
                            </Col>
                            <Col lg={2} md={3} sm={5} xs={12}>
                                <Select
                                    name="marketer"
                                    options={searchOptionManufacturer}
                                    placeholder="Search By Manufacturer"
                                    isSearchable
                                    onChange={(selectedOption) => setMarketerId(selectedOption?.value)}
                                    value={searchOptionManufacturer.find(option => option.value === marketerId) || null}
                                />
                            </Col>
                            <Col lg={2} md={3} sm={5} xs={12}>
                                <Form.Select name="search_status" onChange={(e) => setStatus(e.target.value)} value={status}>
                                    <option value="">Search By Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="draft">Draft</option>
                                </Form.Select>
                            </Col>
                            <Col lg={2} md={6} sm={6} xs={12}>
                                <CustomDatePicker selectedDate={fromDate} setSelectedDate={setFromDate} placeholder="Date From" />
                            </Col>
                            <Col lg={2} md={6} sm={6} xs={12}>
                                <CustomDatePicker selectedDate={toDate} setSelectedDate={setToDate} placeholder="Date To" />
                            </Col>
                            <Col lg={2} md={3} sm={2} xs={12}>
                                <Button type="submit" className="w-100">Search</Button>
                            </Col>
                        </Row>
                    </Form>
                    <Row className="justify-content-end">
                        <Col as={Col} sm={3}>
                            <Form.Group className="m-3">
                                <Form.Control type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <DataTable data={currentItems} columns={COLUMNS} striped fixedHeader />
                    <div className="pagination_wrapper">
                        <Row>
                            <Col>
                                <p className="fw-bolder mx-3 mt-3">Total: - <span>{paginationData?.totalItems}</span></p>
                            </Col>
                        </Row>
                        <ul className="pagination">
                            <li>
                                <Button
                                    className="btn btn-default"
                                    variant="default"
                                    onClick={prevPage}
                                    disabled={currentPage === 1}
                                >
                                    <i className="fa fa-angle-left"></i> Previous
                                </Button>
                            </li>
                            {displayPages()}
                            <li>
                                <Button
                                    className="btn btn-default"
                                    variant="default"
                                    onClick={nextPage}
                                    disabled={currentPage === totalPages}
                                >
                                    Next <i className="fa fa-angle-right"></i>
                                </Button>
                            </li>
                        </ul>
                    </div>

                </div>
            </>
        );
    }
}
