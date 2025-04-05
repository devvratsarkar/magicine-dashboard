import React, { useEffect, useState } from "react";
import { Row, Col, Dropdown, Button, Form, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { useParams } from "react-router-dom";
import OrderDetailsData from "./OrderDetailsData";
import CustomerDetails from "./CustomerDetails";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useAllOrgerQuery, useDeleteOrderStatushistoryMutation, useGetOrderDetailQuery, useSendInvoiceMutation, useUpdateOrderStatusMutation } from "../../redux/features/cartApiEndPoint";
import toast from "react-hot-toast";
import Loader from "../../layouts/layoutcomponents/loader";

export default function OrdersDetails() {
  const { id } = useParams();
  const { data, isError, error, isLoading: loading, isFetching, isSuccess, refetch: fetchStatusHistory } = useGetOrderDetailQuery(id)
  const singleOrder = data?.data || []


  const [deleteStatus, { isLoading: statusLoading }] = useDeleteOrderStatushistoryMutation()

  const dispatch = useDispatch();
  const navigate = useNavigate()

  const [updateStatus, { isLoading }] = useUpdateOrderStatusMutation();
  const [sendInvoice, { isLoading: loadingSendInvoice }] = useSendInvoiceMutation();

  const [queryParams, setQueryParams] = useState({
    prescription: '',
    status: '',
    fromDate: '',
    toDate: '',
  });

  const { refetch } = useAllOrgerQuery(queryParams)
  const [orderHistory, setOrderHistory] = useState(false);
  const [orderSections, setOrderSections] = useState([
    { value: "Order Action", order: 1 },
    { value: "Order History", order: 2 },
    { value: "Customer Details", order: 3 },
  ]);


  const role = localStorage.getItem("role");
  const permissions = JSON.parse(localStorage.getItem("permissions"));

  const showOrderEdit = role === "Admin" || (role === "Staff" && permissions.Order.includes("edit"));

  useEffect(() => {
    const savedOrderSections = localStorage.getItem("orderSections");
    if (savedOrderSections) {
      setOrderSections(JSON.parse(savedOrderSections));
    }
  }, []);

  const initialValues = {
    status: "",
    remarks: "",
  };

  const { values, handleBlur, handleChange, handleSubmit, errors, touched, resetForm, setFieldValue } = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.lazy((values) => {
      if (values.status === "pending" || values.status === "dispatched" || values.status === "delivered" || values.status === "accepted" || values.status === "processed" || values.status === "packed") {
        return Yup.object().shape({
          status: Yup.string().required("This field is required."),
        });
      } else {
        return Yup.object().shape({
          status: Yup.string().required("This field is required."),
          remarks: Yup.string().required("This field is required."),
        });
      }
    }),
    onSubmit: async (values) => {
      try {
        const response = await updateStatus({ orderBody: values, orderId: id });
        if (response?.data?.http_status_code === 200) {
          refetch()
          toast.success(response?.data?.message)
          navigate("/all-orders")
          fetchStatusHistory()
        }
        else {
          toast.error(response?.data?.message)
        }
      } catch (error) {
        console.error("Failed to update order status:", error);
      }
    },
  });

  let handleDeleteStatus = async (id) => {
    try {
      const response = await deleteStatus(id)
      if (response?.data?.http_status_code === 200) {
        toast.success(response?.data?.message)
        navigate("/all-orders")
      } else (
        toast.error(response?.data?.message)
      )
    } catch (err) {
      console.log("err", err);

    }
  }


  const handleSectionOrderChange = (index, direction) => {
    const newOrderSections = [...orderSections];
    const newIndex = index + direction;

    if (newIndex >= 0 && newIndex < newOrderSections.length) {
      const temp = newOrderSections[newIndex];
      newOrderSections[newIndex] = newOrderSections[index];
      newOrderSections[index] = temp;
      setOrderSections(newOrderSections);
      localStorage.setItem("orderSections", JSON.stringify(newOrderSections));
    }
  };

  const sendInvoiceFunction = async (e) => {
    try {
      const resp = await sendInvoice(e)
      if (resp.data.http_status_code === 200) {
        toast.success(resp.data.message)
      } else {
        toast.error(resp.data.message)
      }
    } catch (e) {
      toast.error(error?.message || "Unable to send invoice")
    }
  }


  return (
    <>
      {statusLoading && <Loader /> || isLoading && <Loader /> || loadingSendInvoice && <Loader />}
      <Row>
        <Col>
          <Row className="align-items-center">
            <Col>
              <PageHeader
                titles="Orders"
                active="Order Details"
                items={["Home", "Orders"]}
                links={["/dashboard", "/all-orders"]}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col as={Col} xl={8} lg={7} md={12} sm={12} xs={12}>
            <OrderDetailsData
              values={values}
              handleBlur={handleBlur}
              handleChange={handleChange}
              errors={errors}
              touched={touched}
              setFieldValue={setFieldValue}
            />
          </Col>
          <Col as={Col} xl={4} lg={5} md={12} sm={12} xs={12}>
            {orderSections.map((section, index) => (
              <div key={index}>
                {section.value === "Order Action" && (
                  <div className="order_details_row">
                    {showOrderEdit && (
                      <Dropdown className="btn-group mb-2">
                        <Dropdown.Toggle
                          type="button"
                          className="btn custom_border_color dropdown-toggle bg-white custom_dropdown"
                          variant=""
                          title="Action"
                        >
                          {section.value}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="w-100">
                          <Dropdown.Item>
                            <Button variant="" onClick={() => sendInvoiceFunction(singleOrder?.id)} className="text-primary">Send Invoice</Button>
                          </Dropdown.Item>
                          <Dropdown.Item>
                            <Link
                              to={`/notification/add-notification`}
                              state={{ order_data: singleOrder }}
                            >
                              Resend Order Notification
                            </Link>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                    <div className="order_details_keys">
                      <i className="fa fa-angle-up" onClick={() => handleSectionOrderChange(index, -1)}></i>
                      <i className="fa fa-angle-down" onClick={() => handleSectionOrderChange(index, 1)}></i>
                    </div>
                  </div>
                )}
                {section.value === "Order History" && (
                  <div className="order_details_row">
                    <Button
                      className="btn btn-outline-default custom_border_color bg-white w-100 mb-2 text-start"
                      variant=""
                      onClick={() => setOrderHistory(!orderHistory)}
                    >
                      {section.value}
                    </Button>
                    <div className="order_details_keys">
                      <i className="fa fa-angle-up" onClick={() => handleSectionOrderChange(index, -1)}></i>
                      <i className="fa fa-angle-down" onClick={() => handleSectionOrderChange(index, 1)}></i>
                    </div>
                    {orderHistory && (
                      <Card>
                        <Card.Header>Order History</Card.Header>
                        <Card.Body className="p-4">
                          {
                            singleOrder?.orderStatusHistory?.map((item, index) => {
                              return (
                                <Row className="mb-3" key={index}>
                                  <Col as={Col} className="order_history mx-3">
                                    <p>{item?.message}</p>
                                  </Col>
                                  <Row className="mt-1 g-2 px-3">
                                    <Col
                                      as={Col}
                                      xs={12}
                                      sm={7}
                                      md={4}
                                      lg={9}
                                      className="order_history_author_text"
                                    >
                                      <p>{`${item?.createdBy ? `(${item?.createdBy?.name})` : ''}`}</p>
                                      <p>{item?.createdAt}</p>
                                    </Col>
                                    <Col
                                      as={Col}
                                      xs={12}
                                      sm={5}
                                      md={8}
                                      lg={3}
                                      className="order_history_author_text"
                                    >
                                      <p onClick={() => handleDeleteStatus(item?.id)}>Delete Note</p>
                                    </Col>
                                  </Row>
                                </Row>
                              );
                            }) || <p>No order status history available.</p>
                          }
                        </Card.Body>
                      </Card>
                    )}
                  </div>
                )}
                {section.value === "Customer Details" && (
                  <div className="order_details_row">
                    <CustomerDetails />
                    <div className="order_details_keys">
                      <i className="fa fa-angle-up" onClick={() => handleSectionOrderChange(index, -1)}></i>
                      <i className="fa fa-angle-down" onClick={() => handleSectionOrderChange(index, 1)}></i>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {showOrderEdit && (
              <Button type="submit" className="w-100 mb-4">
                Update
              </Button>
            )}
          </Col>
        </Row>
      </Form>
    </>
  );
}
