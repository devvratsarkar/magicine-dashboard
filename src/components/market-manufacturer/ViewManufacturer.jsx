import React from "react";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Nav, TabContainer, Tabs, Tab, Row, Card, Col, Button, Form, Modal, } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { AddNewManuFacturerValidation } from "../../commondata/formvalidations";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { closeModal } from "../../redux/slices/allModalSlice";
import { useGetManufacturerByIdQuery } from "../../redux/features/catalogueEndPoints";
// import Loader from "../../layouts/layoutcomponents/loader";
// import Error from "../../layouts/layoutcomponents/Error";

export default function ViewManufacturer() {
  const { isOpen, data } = useSelector((state) => state.allCommonModal)
  // const { data: singleManufacturer, isError, isLoading, isFetching, isSuccess } = useGetManufacturerByIdQuery(data.id)
  // console.log(data);
  const dispatch = useDispatch()
  const initialValues = {
    manufacturername: data.manufacturer_name,
    status: data.status,
    description: data.description || ""
  };
  const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, setFieldTouched, } = useFormik({
    initialValues: initialValues,
    validationSchema: AddNewManuFacturerValidation,
    onSubmit: async (values) => {
      console.log("Form submitted with values:", values);
    },
  });


  return (
    <>
      <Modal show={isOpen}>
        <Modal.Header className="bg-primary">
          <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center text-light">
            View Marketer/Manufacturer
          </Modal.Title>
          <Button onClick={() => dispatch(closeModal())} className="btn-close text-light" variant="" >
            <i className="fe fe-x"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit} className="p-2">
            <Row>
              <Col as={Col} md={6}>
                <Form.Group>
                  <Form.Label>
                    Manufacturer Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    readOnly={true}
                    name="manufacturername"
                    value={values.manufacturername}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.manufacturername && touched.manufacturername ? (
                    <p className="error">{errors.manufacturername}</p>
                  ) : null}
                </Form.Group>
              </Col>
              <Col as={Col} md={6}>
                <Form.Group>
                  <Form.Label>
                    Status <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    type="text"
                    disabled={true}
                    name="status"
                    value={values.status}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </Form.Select>
                  {errors.status && touched.status ? (
                    <p className="error">{errors.status}</p>
                  ) : null}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col as={Col} md={12}>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <textarea name="description" value={values.description} readOnly className="border border-3 border-black w-100 rouded-3" rows={5} />
                </Form.Group>
              </Col>
            </Row>

          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

