import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { userDetails } from "../../redux/slices/userNotificationSlice";
import { Link, useParams } from "react-router-dom";
import { useGetOrderDetailQuery } from "../../redux/features/cartApiEndPoint";
import toast from "react-hot-toast";
import axios from "axios";
import { API_BASE_URL } from "../../utils/config";
import Loader from "../../layouts/layoutcomponents/loader";

export default function CustomerDetails() {
  const { id } = useParams()
  const role = localStorage.getItem("role")
  const permissions = JSON.parse(localStorage.getItem("permissions"))
  const [loadingInvoiceDownload, setLoadingInvoiceDownload] = useState(false)


  const { data, isError, error, isLoading, isFetching, isSuccess } = useGetOrderDetailQuery(id)
  const singleOrder = data?.data || []

  console.log("singleOrder", singleOrder)

  const customer_details = singleOrder?.shipping_address

  const handleDownLoadInvoice = async (e) => {
    e.preventDefault();
    setLoadingInvoiceDownload(true)
    try {
      const resp = await axios.get(`${API_BASE_URL}/download-invoice/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        responseType: 'blob',
      });
      console.log("resp?.data?.http_status_code", resp);

      if (resp?.status === 200) {
        setLoadingInvoiceDownload(false)
      }
      // Create a URL for the file and trigger the download
      const url = window.URL.createObjectURL(resp.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${id}.pdf`);  // Customize the filename
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

    } catch (err) {
      console.error("Error downloading invoice:", err);
      toast.error(err?.response?.data?.message || err.message || "An error occurred");
    }
  };

  const showOrderEdit = role === "Admin" || (role === "Staff" && permissions.Order.includes("edit"))
  return (
    <>
      {
        loadingInvoiceDownload && <Loader />
      }
      <Card className="mb-3">
        <Card.Body className="order_details_data">
          <Row className="">
            <Card.Header className="justify-content-center border-0 mb-3 fs-6">Customer Details</Card.Header>
          </Row>
          <Row className="mb-5">
            <div className="customer_details">
              <p>Name - {customer_details?.full_name}</p>
              <p>Email ID - {customer_details?.email}</p>
              <p>Phone - {customer_details?.phone_number}</p>
              {
                showOrderEdit && (

                  <Row className="mt-4">
                    {/* {
                      singleOrder && singleOrder?.user?.email ? (
                        <Col as={Col} sm={6} lg={12} className="mb-1 px-1">
                          <Link to={`/notification/add-notification`} state={{ order_data: singleOrder }} className="btn w-100 btn-success" variant="success">
                            Send Notification
                          </Link>
                        </Col>
                      ) : null
                    } */}
                    <Col as={Col} sm={6} lg={12} className="mb-1 px-1">
                      <Button onClick={handleDownLoadInvoice} className="btn w-100 btn-primary" variant="primary">
                        <i className="fa fa-download"></i>&nbsp;Download Invoice
                      </Button>
                    </Col>
                  </Row>
                )}
            </div>
          </Row>
          <Row className="">
            <Card.Header className="justify-content-center border-0 mb-3 fs-6">Shipping Address</Card.Header>
          </Row>
          <Row className="mb-3">
            <p>
              {customer_details?.address_line_one}, {customer_details?.city}, {customer_details?.country}, {customer_details?.postal_code}
            </p>
            <p>Phone - {customer_details?.phone_number}</p>
          </Row>
          <Row className="">
            <Card.Header className="justify-content-center border-0 mb-3 fs-6">Billing Address</Card.Header>
            {/* <Col className="text-center">Billing Address</Col> */}
          </Row>
          <Row>
            <p>
              {customer_details?.address_line_one}, {customer_details?.city}, {customer_details?.country}, {customer_details?.postal_code}
            </p>
            <p>Phone - {customer_details?.phone_number}</p>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}
