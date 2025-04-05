import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { AddRateValidation } from "../../../commondata/formvalidations";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../redux/slices/allModalSlice";
import Switch from "react-switch";
import { useAddRateMutation, useGetAllCarrierQuery, useGetAllZonesQuery } from "../../../redux/features/shippingZoneEndPoints";
import toast from "react-hot-toast";
import Loader from "../../../layouts/layoutcomponents/loader";

export default function AddRate() {
  const { isOpen, data } = useSelector((state) => state.allCommonModal);
  const [switch1, setswitch1] = useState(true);
  const dispatch = useDispatch();
  const { refetch } = useGetAllZonesQuery();
  const [addRate, { isLoading }] = useAddRateMutation();
  const { data: carrier } = useGetAllCarrierQuery();
  const carrierData = carrier?.data;

  const initialValues = {
    name: "",
    carrier_id: "",
    delivery_takes: "",
    mini_order: "",
    max_order: "",
    rate: "",
    free_shipping: true,
    zone_id: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: AddRateValidation,
    onSubmit: async (values) => {
      values.free_shipping = switch1;
      const newMinOrder = parseInt(values.mini_order);
      const newMaxOrder = parseInt(values.max_order);

      const matchedRates = data?.rates.filter((rate) => {
        const minOrderWeight = parseInt(rate.mini_order);
        const maxOrderWeight = parseInt(rate.max_order);

        return (
          (newMinOrder >= minOrderWeight && newMinOrder <= maxOrderWeight) ||
          (newMaxOrder >= minOrderWeight && newMaxOrder <= maxOrderWeight) ||
          (newMinOrder <= minOrderWeight && newMaxOrder >= maxOrderWeight)
        );
      });

      if (matchedRates.length > 0) {
        const matchedRatesMessage = matchedRates
          .map((rate) => {
            return `Rate Name: ${rate.name}, Minimum Order Weight: ${rate?.mini_order}, Maximum Order Weight: ${rate.max_order}`;
          })
          .join("\n");

        alert(`Order weight falls within or touches the following shipping rates:\n\n${matchedRatesMessage}`);
      } else {
        try {
          const response = await addRate(values);
          if (response?.data?.http_status_code === 201) {
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
    if (data?._doc?._id) {
      formik.setFieldValue("zone_id", data._doc._id);
    }
  }, [data]);

  useEffect(() => {
    formik.setFieldValue("rate", switch1 ? 0 : "");
  }, [switch1]);

  return (
    <>
      <Modal show={isOpen}>
        <Modal.Header className="justify-content-center mx-2">
          <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
            Add Rate
          </Modal.Title>
        </Modal.Header>
        <Button onClick={() => dispatch(closeModal())} className="btn-close position-absolute end-0 p-3" variant="">
          <i className="fe fe-x fw-bolder"></i>
        </Button>
        <Modal.Body className="p-2">
          <Form className="border rounded-2 p-2 overflow-hidden" onSubmit={formik.handleSubmit}>
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
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                  />
                  {formik.errors.name && formik.touched.name ? <p className={`error`}>{formik.errors.name}</p> : null}
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
                    type="text"
                    name="carrier_id"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.carrier_id}
                  >
                    <option value="">Select Carrier</option>
                    {carrierData?.length > 0 ? (
                      carrierData.map((item, index) => (
                        item.status === true ? (
                          <option value={item?.id} key={index}>
                            {item?.name}
                          </option>
                        ) : null
                      ))
                    ) : (
                      <option disabled>No Carrier Available</option>
                    )}

                  </Form.Select>

                  {formik.errors.carrier_id && formik.touched.carrier_id && (
                    <div className="error">{formik.errors.carrier_id}</div>
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
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.delivery_takes}
                  />
                  {formik.errors.delivery_takes && formik.touched.delivery_takes ? (
                    <p className={`error`}>{formik.errors.delivery_takes}</p>
                  ) : null}
                </Form.Group>
              </Col>
            </Row>
            <Row className="pb-3">
              <Col as={Col} md="6">
                <Form.Group>
                  <Form.Label>
                    Minimum Order Weight(grams)
                    <span className="required_icon">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="mini_order"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.mini_order}
                  />
                  {formik.errors.mini_order && formik.touched.mini_order ? (
                    <p className={`error`}>{formik.errors.mini_order}</p>
                  ) : null}
                </Form.Group>
              </Col>
              <Col as={Col} md="6">
                <Form.Group>
                  <Form.Label>
                    Maximum Order Weight(grams)
                    <span className="required_icon">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="max_order"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.max_order}
                  />
                  {formik.errors.max_order && formik.touched.max_order ? (
                    <p className={`error`}>{formik.errors.max_order}</p>
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
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.rate}
                    readOnly={switch1}
                  />
                  {formik.errors.rate && formik.touched.rate ? <p className={`error`}>{formik.errors.rate}</p> : null}
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
                  {formik.errors.free_shipping && formik.touched.free_shipping ? (
                    <p className={`error`}>{formik.errors.free_shipping}</p>
                  ) : null}
                </Form.Group>
              </Col>
            </Row>
            <Row className="text-end">
              <Col>
                <Button type="submit">Submit</Button>
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
        paddingRight: 2,
      }}
    >
      {" "}
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
        paddingRight: 2,
      }}
    >
      {" "}
      Free
    </div>
  );
};
