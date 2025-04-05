import React, { useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip, Row, Col, Form, } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { openModal } from "../redux/slices/allModalSlice";
import Loader from "../layouts/layoutcomponents/loader";
import Error from "../layouts/layoutcomponents/Error";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useGetTestimonialsIDQuery, useGetTestimonialsQuery, useUpdateTestimonialsMutation } from "../redux/features/cmsEndPoints";

export const TestimonialsData = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { data, isError, error, isLoading, isFetching, isSuccess, refetch } = useGetTestimonialsQuery()
  const [editTestimonials, { isLoading: loading }] = useUpdateTestimonialsMutation()

  const role = localStorage.getItem("role")
  const permissions = JSON.parse(localStorage.getItem("permissions"))

  const showEdit = role === "Admin" || (role === "Staff" && permissions.Testimonial.includes("edit"))
  const showAddTrash = role === "Admin" || (role === "Staff" && permissions.Testimonial.includes("add-trash"))


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
        selector: (row) => row?.id,
        sortable: true,
      },
      {
        name: "Customer",
        sortable: true,
        cell: (row) => (<Link to={row?.slug} >{row?.customer_name}</Link>)
      },
      {
        name: "Banner Image",
        selector: (row) => row?.image,
        cell: (row) => (
          <img src={row.image} width={75} height={75} />
        )
      },
      {
        name: "TESTIMONIAL",
        selector: (row) => <div dangerouslySetInnerHTML={{ __html: row?.content }}></div>,
        sortable: true,
      },
      // {
      //   name: "DATE",
      //   selector: (row) => row?.createdAt,
      //   sortable: true,
      // },
      {
        name: "RATING",
        selector: (row) => row?.rating,
        sortable: true,
      },
      {
        name: "Status",
        selector: (row) => row.status,
        cell: (row) => {
          const [checked, setChecked] = useState(row?.status);
          const { refetch: fetchSingleData } = useGetTestimonialsIDQuery(row?.id)
          const handleStatusChange = async () => {
            try {
              setChecked(!checked);
              const response = await editTestimonials({ testimonialID: row.id, formType: { status: !checked } });
              console.log("response", response);

              if (response?.data?.http_status_code === 200) {
                refetch()
                fetchSingleData()
                toast.success(response.data.message)
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
                      onChange={handleStatusChange}
                      checked={checked}
                      disabled
                    />
                    <span className="custom-switch-indicator custum-green-btn"></span>
                  </label>
                )
              }
            </>
          )
        },
      },
      {
        name: "Date",
        selector: (row) => row?.createdAt,
        sortable: true,
      },
      {
        name: "Action",
        cell: (row) => (
          <div className="action_icon_wrapper d-flex justify-content-center">
            {
              showEdit && (
                <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                  <Link
                    to={`/cms/edit-testimonials/${row.id}`}
                  >
                    <Button className="btn btn-icon btn-warning" variant="">
                      <i className="fe fe-edit"></i>
                    </Button>
                  </Link>
                </OverlayTrigger>
              )
            }
            {
              showAddTrash && (
                <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                  <Button
                    className="btn btn-icon btn-danger" variant=""
                    onClick={() => { dispatch(openModal({ componentName: 'DeleteTestimonial', data: row, softDelete: true })) }}
                  >
                    <i className="fe fe-trash text-light"></i>
                  </Button>
                </OverlayTrigger>
              )
            }
          </div>
        ),
      },
    ];
    const testimonialData = data?.data?.allTestimonials
    const filteredData = testimonialData?.filter((item) =>
      item.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
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
          {loading && <Loader />}
          <Row className="justify-content-end mt-3 mx-2 align-items-center mb-4">
            <Col as={Col} sm={6} xs={12}>
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
            <Col as={Col} sm={6} xs={12} className="text-sm-end">
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
      </>
    );
  }
}