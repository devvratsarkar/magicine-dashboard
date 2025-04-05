import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Button, Table, Form } from 'react-bootstrap';
import { MdShoppingCart } from "react-icons/md";
import { useAllOrgerQuery, useGetAllPrescriptionOPrderQuery, useGetOrderDetailQuery, useUpdatePrescriptionStatusMutation } from '../../redux/features/cartApiEndPoint';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from "../../layouts/layoutcomponents/loader";
import { FaFilePdf } from 'react-icons/fa';

export default function OrderDetailsData({ values, handleChange, handleBlur, errors, touched, setFieldValue }) {
    const navigate = useNavigate()
    const { id } = useParams();
    const [serialNumber] = useState(1);
    const [prescriptionStatuses, setPrescriptionStatuses] = useState({});

    const [queryParams, setQueryParams] = useState({
        prescription: '',
        status: '',
        fromDate: '',
        toDate: '',
    });

    const { refetch } = useAllOrgerQuery(queryParams)


    const { data, isError, error, isLoading, isFetching, isSuccess, refetch: orderId } = useGetOrderDetailQuery(id);
    const singleOrder = data?.data || [];

    const { data: prescriptionData, refetch: prescriptionId } = useGetAllPrescriptionOPrderQuery(id);
    const uploadedPrescriptions = prescriptionData?.data || [];
    const [updatePrescriptionStatus, { isLoading: loadingPrescription }] = useUpdatePrescriptionStatusMutation()

    useEffect(() => {
        // Initialize prescription statuses
        const statuses = uploadedPrescriptions.reduce((acc, item) => {
            acc[item.id] = item?.status || 'underreview';
            return acc;
        }, {});
        setPrescriptionStatuses(statuses);
    }, [uploadedPrescriptions]);

    const role = localStorage.getItem("role");
    const permissions = JSON.parse(localStorage.getItem("permissions"));

    const showOrderEdit = role === "Admin" || (role === "Staff" && permissions.Order.includes("edit"));


    const isIndian = singleOrder?.shipping_address?.country === "India" ? true : false


    const handleDownLoadPrescription = async (url, fileType = 'image') => {
        try {
            const response = await axios.get(url, {
                responseType: 'blob',
                withCredentials: true,
            });

            let fileExtension = '';
            let mimeType = response.data.type;

            if (fileType === 'image') {
                switch (mimeType) {
                    case 'image/png':
                        fileExtension = 'png';
                        break;
                    case 'image/jpeg':
                        fileExtension = 'jpg';
                        break;
                    case 'image/webp':
                        fileExtension = 'webp';
                        break;
                    default:
                        fileExtension = 'png';
                        break;
                }
            } else if (fileType === 'pdf') {
                fileExtension = 'pdf';
                mimeType = 'application/pdf';
            }

            const urlObject = window.URL.createObjectURL(new Blob([response.data], { type: mimeType }));
            const a = document.createElement('a');
            a.href = urlObject;

            const fileName = url.split('/').pop();
            a.download = fileName || `DownloadedFile.${fileExtension}`;

            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(urlObject);
            document.body.removeChild(a);

            toast.success("File downloaded successfully!");
        } catch (error) {
            console.error("Download error:", error);
            toast.error("An error occurred during download.");
        }
    };




    const handleStatusChange = async (id, newStatus) => {
        try {
            const response = await updatePrescriptionStatus({ prescriptionStatus: { status: newStatus }, prescriptionId: id });
            if (response?.data?.http_status_code === 200) {
                toast.success(response.data.message);
                navigate("/all-orders")
                orderId()
                prescriptionId()
                refetch()
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setFieldValue("status", singleOrder?.status);
        setFieldValue("remarks", singleOrder?.remarks);
    }, [isSuccess]);

    const handlePrescriptionStatusChange = (id, status) => {
        setPrescriptionStatuses(prevStatuses => ({
            ...prevStatuses,
            [id]: status
        }));
        handleStatusChange(id, status);
    };

    return (
        <>
            {loadingPrescription && <Loader />}
            <Card>
                <Card.Body className="order_details_data">
                    <Row className="row_border row_bg">
                        <Col as={Col} xl={6} lg={12} md={6} sm={6} xs={12}>
                            <MdShoppingCart className="fs-5" />
                            &nbsp;Order Id - {singleOrder?.order_number}
                        </Col>
                        {
                            showOrderEdit && (
                                <Col as={Col} xl={6} lg={12} md={6} sm={6} xs={12} className="mt-sm-0 mt-4 mt-lg-4 mt-xl-0 text-lg-start text-xl-end text-sm-end">
                                    Status -
                                    <select className="row_border mb-0 p-0 px-1" name='status' value={values.status} onChange={handleChange} onBlur={handleBlur}>
                                        <option value="pending">Order Placed</option>
                                        <option value="accepted">Order Accepted</option>
                                        <option value="processed">Order Processed</option>
                                        <option value="packed">Order Packed</option>
                                        <option value="dispatched">Order Dispatched</option>
                                        <option value="delivered">order Delivered</option>
                                        <option value="rejected">Rejected</option>
                                        <option value="hold">Hold</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                    {errors.status && touched.status ? (
                                        <p className="error">{errors.status}</p>
                                    ) : null}
                                </Col>
                            )}
                    </Row>
                    <Row className="row_border row_bg">
                        <Col md={6} xs={12}>
                            Payment Status - <span className={`text-green`}>{singleOrder?.payment_status === "Pending" ? "Failed" : singleOrder?.payment_status}</span>
                        </Col>
                    </Row>
                    {values.status === "rejected" || values.status === "hold" || values.status === "cancelled" ? (
                        <Row className='mb-4'>
                            Reason For Rejection/Hold/Cancelation
                            <textarea className="row_border" name="remarks" onChange={handleChange} onBlur={handleBlur} value={values.remarks}></textarea>
                            {errors.remarks && touched.remarks ? (
                                <p className="error">{errors.remarks}</p>
                            ) : null}
                        </Row>
                    ) : (null)}
                    <div>
                        <Col as={Col} sm={12} xs={12} className='fs-5 mb-2'>Orders Details</Col>
                        <Table className='border-bottom'>
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Product Image</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                    {/* <th></th> */}

                                </tr>
                            </thead>
                            <tbody>
                                {singleOrder?.orderItems?.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item?.product?.product_name}</td>
                                            <td><img src={item?.product?.featured_image} alt={item?.product?.product_name} width={75} height={75} /></td>
                                            <td>{item?.quantity}</td>
                                            <td>{item?.single_mrp}</td>
                                            <td>{item?.single_mrp * item?.quantity}</td>
                                            {/* <td>{item?.product?.prescription_required ? <Button className='btn btn-icon btn-primary' onClick={() => window.open(item?.product?.prescription_file, '_blank')}> <i className='fa fa-download fs-5 text-center d-grid'></i> </Button> : null}</td> */}
                                        </tr>
                                    )
                                })}
                                <tr>
                                    <td>Total</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>{singleOrder?.sub_total
                                        ? `${singleOrder.currency === "USD" ? "$" : "Rs."}${(singleOrder.sub_total).toFixed(2)}`
                                        : "null"}</td>
                                    {/* <td></td> */}
                                </tr>
                                <tr>
                                    <td>Discount</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        {singleOrder?.discount_amount
                                            ? `${singleOrder.currency === "USD" ? "-$" : "-Rs."}${(singleOrder.discount_amount).toFixed(2)}`
                                            : "null"}
                                    </td>

                                    {/* <td></td> */}
                                </tr>
                                <tr>
                                    <td>Coupon Discount</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>{singleOrder?.coupon_discount ? `${singleOrder.currency === "USD" ? "-$" : "-Rs."}${(singleOrder.coupon_discount).toFixed(2)}` : 0}</td>
                                    {/* <td></td> */}
                                </tr>
                                <tr>
                                    <td>Tax Amount</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        {singleOrder &&
                                            singleOrder?.tax_amount &&
                                            singleOrder?.isIndian
                                            ? `${singleOrder.currency === "USD" ? "+$" : "+Rs."}${singleOrder.tax_amount.toFixed(2)}`
                                            : 0}
                                    </td>
                                    {/* <td></td> */}
                                </tr>
                                <tr className='border-bottom'>
                                    <td>Shipping Charges</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>{singleOrder?.shipping_amount ? `${singleOrder.currency === "USD" ? "+$" : "+Rs."}${(singleOrder.shipping_amount).toFixed(2)}` : 0}</td>
                                    {/* <td></td> */}
                                </tr>
                                <tr>
                                    <td>Gross Total</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>{singleOrder?.total_amount ? `${singleOrder?.currency === "USD" ? "$." : "Rs."}${(singleOrder.total_amount).toFixed(2)}` : 0}</td>
                                    {/* <td></td> */}
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
            <Card>
                <Card.Header>Uploaded Prescriptions</Card.Header>
                <Card.Body>
                    {isLoading && <Loader />}
                    {uploadedPrescriptions?.map((item, index) => {
                        const isPdf = item.file?.endsWith('.pdf');

                        return (
                            <div className='d-flex justify-content-around align-items-center border-bottom pt-3 pb-3' key={item.id}>
                                <div>{serialNumber + index}</div>
                                <div>
                                    {isPdf ? (
                                        <FaFilePdf size={75} color="red" className='pdf-icon' />
                                    ) : (
                                        <img src={item?.file} alt="File preview" width={75} height={75} />
                                    )}
                                </div>
                                <div>
                                    <Form.Group>
                                        <Form.Label htmlFor={`prescription_status_${item.id}`}></Form.Label>
                                        <Form.Select
                                            aria-label="Prescription status"
                                            name={`prescription_status_${item.id}`}
                                            className="row_border mb-0"
                                            value={prescriptionStatuses[item.id] || ''}
                                            onChange={(e) => handlePrescriptionStatusChange(item.id, e.target.value)}
                                        >
                                            <option value="underreview">Under Review</option>
                                            <option value="rejected">Rejected</option>
                                            <option value="approved">Approved</option>
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                                <div>
                                    <Button onClick={() => window.open(item.file, '_blank')}>
                                        <i className='fe fe-eye'></i>
                                    </Button>

                                </div>
                            </div>
                        );
                    })}
                </Card.Body>
            </Card>
        </>
    );
}
