import React, { useState, useRef, useEffect } from "react";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Form, Row, Col, Card } from "react-bootstrap";
import { useFormik } from "formik";
import { AddNewCarrierSchema } from "../../../commondata/formvalidations";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { useParams } from "react-router-dom";
import logoImage from "../../../assets/images/dashboard/image 144.png";
import { useEditCarrierMutation, useGetAllCarrierQuery, useGetSingleCarrierQuery } from "../../../redux/features/shippingZoneEndPoints";
import Loader from "../../../layouts/layoutcomponents/loader";
import { useDispatch } from "react-redux";
import { openModal } from "../../../redux/slices/allModalSlice";
import toast from "react-hot-toast";
import { getCarrierPage } from "../../../utils/routes";


export default function EditCarrier() {
  const [viewThubnail, setViewThubnail] = useState(true);
  const [selectedThubnail, setSelectedThubnail] = useState(null);
  const { id } = useParams()
  const dispatch = useDispatch();
  const { data, isError, error, isLoading: loading, isFetching, isSuccess, refetch: refetchCurrent } = useGetSingleCarrierQuery(id);
  const singleCarrier = data?.data;
  const [editCarrier, { isLoading }] = useEditCarrierMutation()
  const { refetch } = useGetAllCarrierQuery()
  const navigate = useNavigate()
  const initialValues = {
    name: "",
    tracking_url: "",
    phone: "",
    email: "",
    logo: "",
    status: null,
  };
  const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, } = useFormik({
    initialValues: initialValues,
    validationSchema: AddNewCarrierSchema,
    onSubmit: async (values) => {
      console.log(values);
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });
      try {
        const response = await editCarrier({ carrierData: formData, carrierId: id });
        if (response?.data?.http_status_code === 200) {
          toast.success(response.data.message)
          refetch()
          refetchCurrent()
          navigate(`${getCarrierPage()}`)
        }
      } catch (error) {
        console.error(error);
      }
    },
  });
  if (isError) {
    return <Error error_mes={error} />;
  }
  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    setFieldValue('logo', file)
    if (file) {
      setViewThubnail(false)
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedThubnail(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    setFieldValue('name', singleCarrier?.name)
    setFieldValue('tracking_url', singleCarrier?.tracking_url)
    setFieldValue('phone', singleCarrier?.phone)
    setFieldValue('email', singleCarrier?.email)
    setFieldValue('logo', singleCarrier?.logo)
    setFieldValue('status', singleCarrier?.status)
  }, [isSuccess])
  return (
    <>
      <Row className="align-items-center">
        <Col className="text-start">
          <PageHeader titles="Shipping-Carrier" active={["Edit Carrier/"]} items={["Home", "Carrier List"]} links={["/dashboard", "/shipping/carrier"]} />
        </Col>
        <Col className="text-end">
          <Link to="/shipping/carrier" className="btn btn-success text-white me-3" >View All Carriers</Link>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h3 className="card-title">Edit Carrier</h3>
            </Card.Header>
            <Card.Body className="edit_product">
              {isLoading || isFetching || loading ? <Loader /> : null}
              <Form onSubmit={handleSubmit} className="add_category_form">
                <Row className="mb-4">
                  <Form.Group as={Col} md="6">
                    <Form.Label>
                      Name <span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                    />
                    {errors.name && touched.name ? (
                      <p className={`error`}>{errors.name}</p>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label>
                      Tracking Url <span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="tracking_url"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.tracking_url}
                    />
                    {errors.tracking_url && touched.tracking_url ? (
                      <p className={`error`}>{errors.tracking_url}</p>
                    ) : null}
                  </Form.Group>
                </Row>
                <Row className="mb-6">
                  <Form.Group as={Col} md="6">
                    <Form.Label>
                      Phone <span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.phone}
                    />
                    {errors.phone && touched.phone ? (
                      <p className={`error`}>{errors.phone}</p>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label>
                      Email <span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                    />
                    {errors.email && touched.email ? (
                      <p className={`error`}>{errors.email}</p>
                    ) : null}
                  </Form.Group>
                </Row>
                <Row className="mb-6">
                  <Form.Group as={Col} md="6">
                    <Form.Label>
                      Logo Only (JPG,JPEG,PNG, 2mb Size)
                      <span className="required_icon">*</span>
                    </Form.Label>
                    <Row>
                      <Col as={Col} md={3} className="d-flex justify-content-center" >
                        {viewThubnail ? <div className="position-relative">
                          <span onClick={() => { dispatch(openModal({ componentName: 'FeaturedImgModal', data: singleCarrier?.logo })) }} className="cursor-pointer"><img src={singleCarrier?.logo} alt="error" width={50} height={50} /></span>
                          <span className="position-absolute">
                            <button className="p-0 px-1" onClick={() => { setViewThubnail(false), setFieldValue('logo', null) }}><i className="icon icon-close text-danger"></i></button>
                          </span>
                        </div> : (<div className="position-relative"><img src={selectedThubnail} alt="error" width={50} height={50} /></div>)}
                      </Col>
                      <Col as={Col} md={9}>
                        <Form.Control
                          type="file"
                          name="logo"
                          accept=".jpg,.jpeg,.png,.webp"
                          onChange={handleThumbnailChange}
                          onBlur={handleBlur}
                        // value={values.banner_image}
                        />
                      </Col>
                    </Row>
                    {errors.logo_img && touched.logo_img ? (
                      <p className={`error`}>{errors.logo_img}</p>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label>Status</Form.Label>
                    <Form.Group>
                      <label className="custom-switch">
                        <input
                          type="checkbox"
                          name="status"
                          className="custom-switch-input"
                          checked={values.status}
                          onChange={(e) => {
                            setFieldValue("status", e.target.checked);
                          }}
                        />
                        <span className="custom-switch-indicator custum-green-btn"></span>
                      </label>
                    </Form.Group>
                    {errors.status && touched.status ? (
                      <p className={`error`}>{errors.status}</p>
                    ) : null}
                  </Form.Group>
                </Row>
                <Row>
                  <Button type="submit" className="btn-primary mx-auto w-auto">Update</Button>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
