import React, { useState } from "react";
import { Button, Col, Form, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEditCouponMutation, useGetCouponDataQuery, useGetSingleCouponQuery } from "../redux/features/catalogueEndPoints";
import Loader from "../layouts/layoutcomponents/loader";
import Error from "../layouts/layoutcomponents/Error";
import DataTable from "react-data-table-component";
import { openModal } from "../redux/slices/allModalSlice";
import toast from "react-hot-toast";


export const CouponData = () => {
  const [serialNumber, setSerialNumber] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  const { data, isError, error, isLoading, isFetching, isSuccess, refetch } = useGetCouponDataQuery();
  const [editCoupon, { isLoading: loading }] = useEditCouponMutation();

  const role = localStorage.getItem("role");
  const permissions = JSON.parse(localStorage.getItem("permissions"));

  const showEdit = role === "Admin" || (role === "Staff" && permissions.Coupons.includes("edit"));
  const showAddTrash = role === "Admin" || (role === "Staff" && permissions.Coupons.includes("add-trash"));

  if (isLoading || isFetching) {
    return <Loader />;
  }
  if (isError) {
    return <Error error_mes={error} />;
  }

  if (isSuccess) {
    const COLUMNS = [
      {
        name: "#",
        selector: (row, index) => `${index + serialNumber} {${row?.id}}`,
        sortable: true
      },
      {
        name: "Coupon Code",
        selector: (row) => row.couponCode,
        sortable: true
      },
      {
        name: "Coupon Type",
        selector: (row) => row.couponType,
        sortable: true
      },
      {
        name: "Value",
        selector: (row) => row?.value,
        sortable: true
      },
      {
        name: "Expiry Date",
        selector: (row) => row?.expirey_date,
        sortable: true
      },
      {
        name: "No. of Coupon",
        selector: (row) => row?.number_coupon,
        sortable: true
      },
      {
        name: "Remaining Coupon",
        selector: (row) => row?.number_coupon,
        sortable: true
      },
      {
        name: "Created At",
        selector: (row) => row?.createdAt,
        sortable: true
      },
      {
        name: "Status",
        selector: (row) => row.status,
        cell: (row) => {
          const [checked, setChecked] = useState(row?.status);
          const { refetch: fetchCoupon } = useGetSingleCouponQuery(row?.id)
          const handleStatusChange = async () => {
            try {
              setChecked(!checked);
              const response = await editCoupon({ couponId: row.id, couponData: { status: !checked } });
              if (response?.data?.http_status_code === 200) {
                toast.success(response.data.message);
                fetchCoupon()
                refetch();
              }
            } catch (error) {
              console.error(error);
            }
          };
          return (
            <>
              {showEdit ? (
                <label className="custom-switch">
                  <input
                    type="checkbox"
                    className="custom-switch-input"
                    onChange={handleStatusChange}
                    checked={checked}
                  />
                  <span className="custom-switch-indicator custum-green-btn"></span>
                </label>
              ) : (
                <label className="custom-switch">
                  <input
                    type="checkbox"
                    className="custom-switch-input"
                    checked={checked}
                    disabled
                  />
                  <span className="custom-switch-indicator custum-green-btn"></span>
                </label>
              )}
            </>
          );
        },
      },
      {
        name: "Action",
        cell: (row) => (
          <div className="action_icon_wrapper">
            <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
              <Link to={`/view-coupon/${row.id}`}>
                <Button className="btn btn-icon btn-primary"><i className="fe fe-eye"></i></Button>
              </Link>
            </OverlayTrigger>
            {showEdit && (
              <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                <Link to={`/edit-coupon/${row.id}`}>
                  <Button className="btn btn-icon btn-warning" variant=""><i className="fe fe-edit"></i></Button>
                </Link>
              </OverlayTrigger>
            )}
            {showAddTrash && (
              <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                <Button
                  className="btn btn-icon btn-danger"
                  variant=""
                  onClick={() => { dispatch(openModal({ componentName: 'DeleteCoupon', data: row, softDelete: true })); }}
                >
                  <i className="fe fe-trash text-white"></i>
                </Button>
              </OverlayTrigger>
            )}
          </div>
        ),
      },
    ];

    const couponData = data?.data?.availableCoupons?.length > 0 ? data?.data?.availableCoupons : [];

    const filteredData = couponData?.filter((item) => {
      const search = searchTerm.trim().toLowerCase();

      return (
        item.couponCode.toLowerCase().includes(search) ||
        item.couponType.toLowerCase().includes(search) ||
        item.value.toString().toLowerCase().includes(search) ||
        item.expirey_date.toLowerCase().includes(search) ||
        item.number_coupon.toString().includes(search) ||
        item.createdAt.toLowerCase().includes(search)
      );
    });


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
          {loading && <Loader />}
          <Row className="m-5">
            <Col sm={9}>
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
            <Col sm={3}>
              <Form.Group className="mx-3">
                <Form.Control type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
              </Form.Group>
            </Col>
          </Row>

          <DataTable data={currentItems} columns={COLUMNS} striped />

          <div className="pagination_wrapper">
            <ul className="pagination">
              <li>
                <Button className="btn btn-default" variant="default" disabled={currentPage === 1} onClick={prevPage}>
                  {"< Previous"}
                </Button>
              </li>
              {displayPages()}
              <li>
                <Button className="btn btn-default" variant="default" disabled={currentPage === totalPages} onClick={nextPage}>
                  {"Next >"}
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </>
    );
  }
};
