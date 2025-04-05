import React, { useState } from "react";
import { Button, Col, Form, OverlayTrigger, Row, Table, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useCopyCategoryMutation, useEditCategoryMutation, useGetCategoryByIdQuery, useGetCategoryQuery } from "../redux/features/catalogueEndPoints";
import Loader from "../layouts/layoutcomponents/loader";
import Error from "../layouts/layoutcomponents/Error";
import DataTable from "react-data-table-component";
import { openModal } from "../redux/slices/allModalSlice";
import toast from "react-hot-toast";


export const CategoryDataTable = () => {
  const [type, setType] = useState("")
  const [status, setStatus] = useState("")

  const [query, setQuery] = useState({
    status: "",
    type: ""
  });

  const handleSearchClick = (e) => {
    e.preventDefault()

    setQuery({ status: status, type: type })
  }


  const [serialNumberm, setSerialNUmber] = useState(1)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { data, isError, error, isLoading, isFetching, isSuccess, refetch } = useGetCategoryQuery(query)

  const [copyCategory, { isLoading: loadingCategoryCopy }] = useCopyCategoryMutation()


  const handleCopyCategory = async (row) => {
    const submittingData = {
      id: row?.id,
      category_name: `${row?.category_name}-copy-${Date.now()}`,
      status: false,
      slug: `${row?.slug}-copy-${Date.now()}`
    }
    try {
      const resp = await copyCategory(submittingData)
      console.log("resp", resp);
      if (resp?.data?.http_status_code === 201) {
        refetch()
        toast.success(resp?.data?.message)
      } else {
        toast.error(resp?.data?.message)
      }
    } catch (err) {
      toast.error(err?.message)
    }
  }


  const [editBrand, { isLoading: loading }] = useEditCategoryMutation();
  const role = localStorage.getItem("role")
  const permission = JSON.parse(localStorage.getItem("permissions"))

  const showEdit = role === "Admin" || (role === "Staff" && permission.Category.includes("edit"))
  const showTrash = role === "Admin" || (role === "Staff" && permission.Category.includes("add-trash"))

  if (isLoading || isFetching) {
    return <Loader />;
  }

  if (isSuccess) {
    const COLUMNS = [
      {
        name: "#",
        selector: (row, index) => `${index + serialNumberm} {${row?.id}}`,
        sortable: true
      },
      {
        name: "Category Name",
        selector: (row) => row.category_name,
        sortable: true
      },
      {
        name: "Category Image",
        selector: (row) => row.thumbnail_image,
        cell: (row) => (
          <img
            src={row?.thumbnail_image}
            alt="Product Image"
            className={`inventory_product_image`}
          />
        ),
      },
      {
        name: "Parent Category",
        selector: (row) => row?.parent_category?.category_name,
        sortable: true
      },
      {
        name: "Type",
        selector: (row) => row?.type === "general_product" ? "General Product" : row?.type === "medicine" ? "Medicine" : "Surgical Equipment",
        sortable: true
      },
      {
        name: "Status",
        selector: (row) => row.status,
        cell: (row) => {
          const [checked, setChecked] = useState(row?.status);
          const { refetch: categoryFetchedSuccessfully } = useGetCategoryByIdQuery(row?.id, { refetchOnMountOrArgChange: true })
          const handleStatusChange = async () => {
            try {
              setChecked(!checked);
              const response = await editBrand({ categoryId: row.id, categoryData: { status: !checked } });
              if (response?.data?.http_status_code === 200) {
                refetch()
                categoryFetchedSuccessfully()
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
        name: "Created At",
        selector: (row) => row?.createdAt,
        sortable: true
      },
      {
        name: "Action",
        cell: (row) => (
          <div className="action_icon_wrapper">
            <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
              <Link to={`/catalogue/category/${row?.id}`}><Button className="btn btn-icon btn-primary"><i className="fe fe-eye"></i></Button></Link>
            </OverlayTrigger>
            {
              showEdit && (
                <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                  <Link to={`/catalogue/edit-category/${row?.id}`}><Button type="button" className="btn btn-icon btn-warning" variant=""><i className="fe fe-edit"></i></Button></Link>
                </OverlayTrigger>
              )
            }
            {
              showTrash && (
                <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                  <Button type="button" className="btn btn-icon  btn-danger" variant="" onClick={() => { dispatch(openModal({ componentName: 'DeleteCategory', data: row, softDelete: true })) }}><i className="fe fe-trash text-white"></i></Button>
                </OverlayTrigger>
              )
            }
            {
              showTrash && (
                <OverlayTrigger placement="top" overlay={<Tooltip>Copy</Tooltip>}>
                  <Button
                    type="button"
                    className="btn btn-icon  btn-info"
                    variant=""
                    onClick={() => handleCopyCategory(row)}
                  >
                    <i className="fe fe-copy text-white">
                    </i>
                  </Button>
                </OverlayTrigger>
              )
            }
          </div>
        ),
      },
    ];
    const categoryData = Array.isArray(data?.data?.activeCategories) && data.data.activeCategories.length > 0 ? data.data.activeCategories : [];
    const filteredData = categoryData.filter((item) =>
      item.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.createdAt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.parent_category?.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
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
          {loading && <Loader />}
          <Row className="mt-3 px-3">
            <Form onSubmit={handleSearchClick}>
              <Row>
                <Col as={Col} md={5}>
                  <Form.Group>
                    <Form.Select
                      onChange={(e) => setType(e.target.value)}
                      value={type}
                    >
                      <option value="">Select Type</option>
                      <option value="general_product">General Product</option>
                      <option value="medicine">Medicine</option>
                      <option value="equipment">Surgical Equipment</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col as={Col} md={5}>
                  <Form.Group>
                    <Form.Select
                      onChange={(e) => setStatus(e.target.value)}
                      value={status}
                    >
                      <option value="">Select Status</option>
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col as={Col} md={2} className="text-center">
                  <Button type="submit">Search</Button>
                </Col>
              </Row>
            </Form>
          </Row>
          <Row className="m-5">
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

          <DataTable data={currentItems} columns={COLUMNS} striped />

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
        </div >
      </>
    );
  };
};
