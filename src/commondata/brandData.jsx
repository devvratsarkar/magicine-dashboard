import React, { useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip, Row, Col, Form, } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openModal } from "../redux/slices/allModalSlice";
import { useEditBrandMutation, useGetBrandByIdQuery, useGetBrandQuery } from "../redux/features/catalogueEndPoints";
import Loader from "../layouts/layoutcomponents/loader";
import Error from "../layouts/layoutcomponents/Error";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";

export const BrandDataTable = () => {

  const [queryParam, setQueryParam] = useState({
    type: "",
    status: ""
  })


  const [serialNumber, setSerialNumber] = useState(1)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const [editBrand, { isLoading: loading }] = useEditBrandMutation();
  const { data, isError, error, isLoading, isFetching, isSuccess, refetch } = useGetBrandQuery(queryParam)
  const [type, setType] = useState("")
  const [status, setStatus] = useState("")

  const role = localStorage.getItem("role")
  const permissions = JSON.parse(localStorage.getItem("permissions"))

  const showEdit = role === "Admin" || (role === "Staff" && permissions.Brand.includes("edit"))
  const showAddTrash = role === "Admin" || (role === "Staff" && permissions.Brand.includes("add-trash"))

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
        sortable: true,
      },
      {
        name: "Brand Name",
        selector: (row) => row.brand_name,
        sortable: true,
      },
      {
        name: "Image",
        selector: (row) => row.featured_image,
        cell: (row) => (
          <div className="">
            <img src={row.featured_image} alt={row.brand_name} width={75} height={75} />
          </div>
        )
      },
      {
        name: "Short Description",
        selector: (row) => <div dangerouslySetInnerHTML={{ __html: row.short_description }}></div>,
        sortable: true,
      },
      {
        name: "Status",
        selector: (row) => row.status,
        cell: (row) => {
          const [checked, setChecked] = useState(row?.status);
          const { refetch: brandRefetch } = useGetBrandByIdQuery(row?.id, { refetchOnMountOrArgChange: true })
          const handleStatusChange = async () => {
            try {
              setChecked(!checked);
              const response = await editBrand({ updatedData: { status: !checked }, brandId: row.id, });
              if (response?.data?.http_status_code === 200) {
                refetch()
                brandRefetch()
                toast.success("Brand Status Updated Successfully")
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
        name: "Type",
        selector: (row) => row?.type,
        sortable: true,
      },
      {
        name: "Action",
        cell: (row) => (
          <div className="action_icon_wrapper">
            <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
              <Link to={`/view-brand/${row.id}`}><Button className="btn btn-icon btn-primary"><i className="fe fe-eye"></i></Button></Link>
            </OverlayTrigger>
            {
              showEdit && (
                <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                  <Link to={`/edit-brand/${row.id}`}><Button className="btn btn-icon btn-warning border-warning"><i className="fe fe-edit"></i></Button></Link>
                </OverlayTrigger>
              )
            }
            {
              showAddTrash && (
                <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                  <Button type="button" className="btn btn-icon  btn-danger" variant="" onClick={() => { dispatch(openModal({ componentName: 'DeleteBrand', data: row, softDelete: true })) }}> <i className="fe fe-trash text-white"></i></Button>
                </OverlayTrigger>
              )
            }
          </div>
        ),
      },
    ];


    const handleSubmitSearch = (e) => {
      e.preventDefault()
      setQueryParam({ status: status, type: type })
    }

    console.log("query", queryParam);



    const allBrandData = data?.data?.allBrand?.length > 0 ? data?.data?.allBrand : []
    const filteredData = allBrandData.filter((item) =>
      item.brand_name.toLowerCase().includes(searchTerm.toLowerCase())
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
          </Row>
          <div className="px-3 mb-3">
            <Form onSubmit={handleSubmitSearch}>
              <Row>
                <Col as={Col} md={5}>
                  <Form.Select
                    placeholder="Selecty Type"
                    onChange={(e) => setType(e.target.value)}
                    value={type}
                  >
                    <option value="">Select Type</option>
                    <option value="General Product">General Product</option>
                    <option value="Medicine">Medicine</option>
                  </Form.Select>
                </Col>
                <Col as={Col} md={5}>
                  <Form.Select
                    placeholder="Selecty Type"
                    onChange={(e) => setStatus(e.target.value)}
                    value={status}
                  >
                    <option value="">Select Status</option>
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </Form.Select>
                </Col>
                <Col as={Col} md={2}>
                  <Button type="sibmit">Search</Button>
                </Col>
              </Row>
            </Form>
          </div>

          <Row className="justify-content-end mb-3">
            <Col as={Col} sm={3}>
              <Form.Group className="mx-3">
                <Form.Control type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
              </Form.Group>
            </Col>
          </Row>

          <DataTable data={currentItems} columns={COLUMNS} striped />
          <div className="pagination_wrapper">

            <Row>
              <Col>
                <p className="fw-bolder mx-3 mt-3">Total: - <span>{filteredData?.length}</span></p>
              </Col>
            </Row>
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

