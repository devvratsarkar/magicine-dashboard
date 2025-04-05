import React, { useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip, Row, Col, Form, Card, } from "react-bootstrap";
import { useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import { useEditProductMutation, useGetDeletedProductsQuery } from "../../../redux/features/productEndPoints";
import { Link } from "react-router-dom";
import Loader from "../../../layouts/layoutcomponents/loader";
import Error from "../../../layouts/layoutcomponents/Error";
import { openModal } from "../../../redux/slices/allModalSlice";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";

export const ProductDeletedItems = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [serialNumber, setSerialNumber] = useState(1)
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { data, isError, error, isLoading, isFetching, isSuccess } = useGetDeletedProductsQuery()
  const [editProduct, { isLoading: loading }] = useEditProductMutation()

  const role = localStorage.getItem("role")
  const permissions = JSON.parse(localStorage.getItem("permissions"))

  const showDelete = role === 'Admin' || (role === "Staff" && permissions.Product.includes("delete"))
  const showRestore = role === 'Admin' || (role === "Staff" && permissions.Product.includes("restore-trash"))

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
        name: "Product Name",
        sortable: true,
        cell: (row) => (<Link to={row?.slug} >{row?.product_name}</Link>)
      },
      {
        name: "Image",
        selector: (row) => row?.featured_image,
        cell: (row) => (
          <img src={row.featured_image} width={75} height={75} />
        )
      },
      {
        name: "Brand",
        selector: (row) => row?.brand?.brand_name,
        sortable: true,
      },
      {
        name: "Manufacturer",
        selector: (row) => row?.marketer?.manufacturer_name,
        sortable: true,
      },
      {
        name: "Status",
        selector: (row) => row.status,
        cell: (row) => {
          const [checked, setChecked] = useState(row?.status);
          const handleStatusChange = async () => {
            try {
              setChecked(!checked);
              const response = await editProduct({ productId: row.id, updatedproduct: { status: !checked } });
              if (response?.data?.http_status_code === 200) {
                toast.success(response.data.message)
              }
            } catch (error) {
              console.error(error);
            }
          }
          return (
            <label className="custom-switch">
              <input
                type="checkbox"
                className="custom-switch-input"
                onChange={handleStatusChange}
                checked={checked}
              />
              <span className="custom-switch-indicator custum-green-btn"></span>
            </label>
          )
        },
      },
      {
        name: "Created At",
        selector: (row) => row?.createdAt,
        sortable: true,
      },
      {
        name: "Action",
        cell: (row) => (
          <div className="action_icon_wrapper d-flex justify-content-center">
            {
              showRestore && (
                <OverlayTrigger placement="top" overlay={<Tooltip>Restore</Tooltip>}>
                  <Button onClick={() => { dispatch(openModal({ componentName: 'RestoreProduct', data: row, })) }} className="btn btn-icon btn-warning" variant=""><i className="fa fa-refresh"></i></Button>
                </OverlayTrigger>
              )
            }

            {
              showDelete &&
              (
                <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                  <Button className="btn btn-con btn-danger border-danger" onClick={() => { dispatch(openModal({ componentName: 'DeleteProduct', data: row, softDelete: false })) }}> <i className="fe fe-trash"></i> </Button>
                </OverlayTrigger>
              )
            }

          </div >
        ),
      },
    ];

    const productsData = data?.data?.trashProduct

    const filteredData = productsData?.filter((item) => {
      const searchTermLower = searchTerm.toLowerCase();

      return (
        item?.product_name?.toLowerCase().includes(searchTermLower) ||
        item?.brand?.brand_name?.toLowerCase().includes(searchTermLower) ||
        item?.marketer?.manufacturer_name?.toLowerCase().includes(searchTermLower) ||
        item?.createdAt.toLowerCase().includes(searchTermLower)
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
        <Row className="align-items-center">
          <Col>
            <PageHeader titles="Catalogue- Deleted Product" active="Deleted Product List" items={["Home", "Products"]} links={["/dashboard", "/catalogue/products"]} />
          </Col>
        </Row>
        <Card>
          <Card.Body className="data_table">
            <div className="e-table pb-5 table-responsive">
              {loading && <Loader />}
              <Row className="justify-content-end mt-3 mx-2 align-items-center">
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
                  {/* <Button className="btn btn-success text-white me-3 border-success">
                    <i className="fa fa-download"></i> Export
                  </Button>
                  <Button className="btn btn-success text-white me-3 border-success">
                    <i className="fa fa-upload"></i> Import
                  </Button> */}
                </Col>
              </Row>
              {/* <Form>
                <Row className="my-5 mx-2" style={{ rowGap: "10px" }}>
                  <Col as={Col} lg={3} md={3} sm={5} xs={12}>
                    <Form.Control
                      name="search_product"
                      placeholder="Search By Product Name"
                    />
                  </Col>
                  <Col as={Col} lg={3} md={3} sm={5} xs={12}>
                    <Form.Control
                      name="search_brand"
                      placeholder="Search By Brand"
                    />
                  </Col>
                  <Col as={Col} lg={3} md={3} sm={5} xs={12}>
                    <Form.Select
                      name="search_status"
                    >
                      <option value="" >Search By Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Form.Select>
                  </Col>
                  <Col as={Col} lg={3} md={3} sm={2} xs={12}>
                    <Button type="submit" className="w-100">
                      Search
                    </Button>
                  </Col>
                </Row>
              </Form> */}
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
            </div>
          </Card.Body>
        </Card>
      </>
    );
  }
}