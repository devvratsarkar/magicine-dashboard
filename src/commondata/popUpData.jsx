import React, { useState } from 'react'
import { Button, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import DataTable from 'react-data-table-component'
import { useGetAllPopUpsQuery, useGetSinglePOPUPQuery, useUpdatePopupMutation } from '../redux/features/popUpEndpoints';
import { Link } from 'react-router-dom';
import Loader from '../layouts/layoutcomponents/loader';
import { useDispatch } from 'react-redux';
import { openModal } from '../redux/slices/allModalSlice';
import toast from 'react-hot-toast';

export default function PopUpDataTable() {

    const dispatch = useDispatch()
    const [serialNumber, setSerialNumber] = useState(1)
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const { data, isError, error, isLoading, isFetching, isSuccess, refetch } = useGetAllPopUpsQuery()
    // const { refetch: getSingle } = useGetSinglePOPUPQuery(data?.data?.id)
    // console.log("data?.data?.id", data?.data);

    const [updatePopUp, { isLoading: loading }] = useUpdatePopupMutation()




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
                name: "Type",
                sortable: true,
                cell: (row) => row?.type
            },
            {
                name: "Title",
                sortable: true,
                cell: (row) => row?.title
            },
            {
                name: "Image",
                sortable: true,
                cell: (row) => <img src={row.image} alt='error' height={60} width={60} />
            },
            {
                name: "Status",
                selector: (row) => row.status,
                cell: (row) => {
                    const [checked, setChecked] = useState(row?.status);
                    const { refetch: getSingle } = useGetSinglePOPUPQuery(row.id)
                    const handleStatusChange = async () => {
                        try {
                            setChecked(!checked);
                            const response = await updatePopUp({ popupId: row.id, popupData: { status: !checked } });
                            if (response?.data?.http_status_code === 200) {
                                refetch()
                                getSingle()
                                toast.success(response.data.message);
                            }
                        } catch (error) {
                            console.error(error);
                        }
                    };
                    return (
                        <>
                            {/* {
                                showEdit ? ( */}
                            <label className="custom-switch">
                                <input
                                    type="checkbox"
                                    className="custom-switch-input"
                                    onChange={handleStatusChange}
                                    checked={checked}
                                />
                                <span className="custom-switch-indicator custum-green-btn"></span>
                            </label>
                            {/* ) : ( */}
                            {/* <label className="custom-switch">
                                        <input
                                            type="checkbox"
                                            className="custom-switch-input"
                                            onChange={handleStatusChange}
                                            checked={checked}
                                            disabled
                                        />
                                        <span className="custom-switch-indicator custum-green-btn"></span>
                                    </label> */}
                            {/* )
                            } */}
                            {/* <label className="custom-switch">
                                <input
                                    type="checkbox"
                                    className="custom-switch-input"
                                    onChange={handleStatusChange}
                                    checked={checked}
                                />
                                <span className="custom-switch-indicator custum-green-btn"></span>
                            </label> */}
                        </>
                    );
                },
            },
            {
                name: "Created At",
                sortable: true,
                cell: (row) => row?.createdAt
            },
            {
                name: "Action",
                cell: (row) => (
                    <div className="action_icon_wrapper d-flex justify-content-center">
                        <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
                            <Link to={`/view-pop-up/${row?.id}`}><Button className="btn btn-icon btn-primary"><i className="fe fe-eye"></i></Button></Link>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                            <Link to={`/edit-pop-up/${row?.id}`}><Button className="btn btn-icon btn-warning border-warning" ><i className="fe fe-edit"></i></Button></Link>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                            <Button className="btn btn-con btn-danger border-danger" onClick={() => { dispatch(openModal({ componentName: 'DeletePopUpModel', data: row.id })) }}> <i className="fe fe-trash"></i> </Button>
                        </OverlayTrigger>
                    </div>
                ),
            },

        ];

        const notFoundSearch = data?.data || []
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
            <div className="e-table pb-5 table-responsive">
                {isLoading && <Loader /> || loading && <Loader />}
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
        )
    }
}
