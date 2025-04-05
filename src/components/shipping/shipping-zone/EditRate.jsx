import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { AddRateValidation } from "../../../commondata/formvalidations";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../redux/slices/allModalSlice";
import Switch from "react-switch";
import { useAddRateMutation, useEditRateMutation, useGetAllCarrierQuery, useGetAllZonesQuery } from "../../../redux/features/shippingZoneEndPoints";
import toast from "react-hot-toast";
import Loader from "../../../layouts/layoutcomponents/loader";

export default function EditRate() {
  const { isOpen, data } = useSelector((state) => state.allCommonModal);
  const [switch1, setswitch1] = useState(data?.rate?.free_shipping);
  const [originalRate, setOriginalRate] = useState(""); // Track the original rate
  const dispatch = useDispatch();
  const { refetch } = useGetAllZonesQuery();
  const [editRate, { isLoading }] = useEditRateMutation();
  const { data: carrier } = useGetAllCarrierQuery();
  const carrierData = carrier?.data;

  const initialValues = {
    name: "",
    carrier_id: "",
    delivery_takes: "",
    mini_order: "",
    max_order: "",
    rate: "",
    free_shipping: false,
  };

  const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue } = useFormik({
    initialValues: initialValues,
    validationSchema: AddRateValidation,
    onSubmit: async (values) => {
      values.free_shipping = switch1;
      const newMinOrder = parseInt(values.mini_order);
      const newMaxOrder = parseInt(values.max_order);

      const matchedRates = data?.item?.rates.filter(rate => {
        const minOrderWeight = parseInt(rate.mini_order);
        const maxOrderWeight = parseInt(rate.max_order);

        return (newMinOrder >= minOrderWeight && newMinOrder <= maxOrderWeight) ||
          (newMaxOrder >= minOrderWeight && newMaxOrder <= maxOrderWeight) ||
          (newMinOrder <= minOrderWeight && newMaxOrder >= maxOrderWeight);
      }).filter(rate => {
        return (rate.name !== values.name || rate.mini_order !== values.mini_order || rate.max_order !== values.max_order) &&
          (rate.id !== data?.rate?.id);
      });

      if (matchedRates.length > 0) {
        const matchedRatesMessage = matchedRates.map(rate => {
          return `Rate Name: ${rate.name}, Minimum Order Weight: ${rate?.mini_order}, Maximum Order Weight: ${rate.max_order}`;
        }).join('\n');

        alert(`Order weight falls within or touches the following shipping rates:\n\n${matchedRatesMessage}`);
      } else {
        try {
          const response = await editRate({ rateData: values, rateId: data?.rate?.id });
          if (response?.data?.http_status_code === 200) {
            toast.success(response.data.message);
            dispatch(closeModal());
            refetch();
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
  });

  useEffect(() => {
    if (data?.rate) {
      setFieldValue("name", data.rate.name || "");
      setFieldValue("carrier_id", data.rate.carrier_id?.id || "");
      setFieldValue("delivery_takes", data.rate.delivery_takes || "");
      setFieldValue("mini_order", data.rate.mini_order || "");
      setFieldValue("max_order", data.rate.max_order || "");
      setFieldValue("rate", data.rate.rate || "");
      setFieldValue("free_shipping", data.rate.free_shipping || false);
      setOriginalRate(data.rate.rate || "");
    }
  }, [data, setFieldValue]);

  useEffect(() => {
    if (switch1) {
      setFieldValue("rate", "0");
    } else {
      setFieldValue("rate", originalRate);
    }
  }, [switch1, setFieldValue, originalRate]);

  return (
    <>
      <Modal show={isOpen}>
        <Modal.Header className="justify-content-center mx-2">
          <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
            Edit Rate
          </Modal.Title>
        </Modal.Header>
        <Button onClick={() => dispatch(closeModal())} className="btn-close position-absolute end-0 p-3" variant="" ><i className="fe fe-x fw-bolder"></i></Button>
        <Modal.Body className="p-2">
          <Form className="border rounded-2 p-2 overflow-hidden" onSubmit={handleSubmit}>
            {isLoading && <Loader />}
            <Row className="pb-3">
              <Col as={Col} md="12">
                <Form.Group>
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
              </Col>
            </Row>
            <Row className="pb-3">
              <Col as={Col} md="6">
                <Form.Group>
                  <Form.Label>
                    Shipping Carrier<span className="required_icon">*</span>
                  </Form.Label>
                  <Form.Select
                    name="carrier_id"
                    value={values.carrier_id || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Select Carrier</option>
                    {carrierData?.map((item, index) => (
                      item.status === true ? (
                        <option value={item.id} key={index}>
                          {item.name}
                        </option>
                      ) : null
                    ))}
                  </Form.Select>
                  {errors.carrier_id && touched.carrier_id && (
                    <div className="error">{errors.carrier_id}</div>
                  )}
                </Form.Group>
              </Col>
              <Col as={Col} md="6">
                <Form.Group>
                  <Form.Label>
                    Delivery Takes (days) <span className="required_icon">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="delivery_takes"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.delivery_takes}
                  />
                  {errors.delivery_takes && touched.delivery_takes ? (
                    <p className={`error`}>{errors.delivery_takes}</p>
                  ) : null}
                </Form.Group>
              </Col>
            </Row>
            <Row className="pb-3">
              <Col as={Col} md="6">
                <Form.Group>
                  <Form.Label>
                    Minimum Order Weight (grams)
                    <span className="required_icon">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="mini_order"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.mini_order}
                  />
                  {errors.mini_order && touched.mini_order ? (
                    <p className="text-danger">{errors.mini_order}</p>
                  ) : null}
                </Form.Group>
              </Col>
              <Col as={Col} md="6">
                <Form.Group>
                  <Form.Label>
                    Maximum Order Weight (grams)
                    <span className="required_icon">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="max_order"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.max_order}
                  />
                  {errors.max_order && touched.max_order ? (
                    <p className="text-danger">{errors.max_order}</p>
                  ) : null}
                </Form.Group>
              </Col>
            </Row>
            <Row className="pb-3">
              <Col as={Col} md="6">
                <Form.Group>
                  <Form.Label>
                    Rate<span className="required_icon">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="rate"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.rate}
                    readOnly={switch1}
                  />
                  {errors.rate && touched.rate ? (
                    <p className={`error`}>{errors.rate}</p>
                  ) : null}
                </Form.Group>
              </Col>
              <Col as={Col} md="6">
                <Form.Group>
                  <Form.Label>
                    Free Shipping
                    <span className="required_icon">*</span>
                  </Form.Label>
                  <Form.Group>
                    <Switch
                      onColor="#626ed4"
                      uncheckedIcon={<Offsymbol />}
                      checkedIcon={<OnSymbol />}
                      onChange={() => {
                        setswitch1(!switch1);
                      }}
                      checked={switch1}
                    />
                  </Form.Group>
                  {errors.free_shipping && touched.free_shipping ? (
                    <p className={`error`}>{errors.free_shipping}</p>
                  ) : null}
                </Form.Group>
              </Col>
            </Row>
            <Row className="text-end">
              <Col>
                <Button type="submit">Update</Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

const Offsymbol = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: 12,
        color: "#fff",
        paddingRight: 2
      }}
    >
      Paid
    </div>
  );
};

const OnSymbol = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: 12,
        color: "#fff",
        paddingRight: 2
      }}
    >
      Free
    </div>
  );
};
