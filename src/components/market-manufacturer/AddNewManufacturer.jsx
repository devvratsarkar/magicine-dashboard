import React from "react";
import { Nav, TabContainer, Tabs, Tab, Row, Card, Col, Button, Form, Modal, } from "react-bootstrap";
import { useFormik } from "formik";
import { AddNewManuFacturerValidation } from "../../commondata/formvalidations";
import { closeModal } from "../../redux/slices/allModalSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useAddManufactutrerMutation, useGetManufactutrerQuery } from "../../redux/features/catalogueEndPoints";
import Loader from "../../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { options_for_sunEditor } from "../../commondata/formEditorOptions";

export default function AddNewManufacturer() {
  const { isOpen, data } = useSelector((state) => state.allCommonModal)
  const dispatch = useDispatch()
  const { refetch } = useGetManufactutrerQuery()
  const [addManufactutrer, { isLoading }] = useAddManufactutrerMutation();
  const initialValues = {
    manufacturer_name: "",
    status: true,
    description: ""
  };
  const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, setFieldTouched, } = useFormik({
    initialValues: initialValues,
    validationSchema: AddNewManuFacturerValidation,
    onSubmit: async (values) => {
      try {
        const response = await addManufactutrer({ Manufactutrer: values });
        if (response?.data?.http_status_code === 201) {
          toast.success(response.data.message)
          refetch()
          dispatch(closeModal())
        }
      } catch (error) {
        console.error(error);
      }
    },
  });
  return (
    <>
      <Modal show={isOpen}>
        <Modal.Header className="bg-primary">
          <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center text-light">
            Add Marketer/Manufacturer
          </Modal.Title>
          <Button onClick={() => dispatch(closeModal())} className="btn-close text-light" variant="" >
            <i className="fe fe-x"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          {isLoading && <Loader />}
          <Form onSubmit={handleSubmit} className="p-2">
            <Row>
              <Col as={Col} md={6}>
                <Form.Group>
                  <Form.Label>
                    Manufacturer Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="manufacturer_name"
                    value={values.manufacturer_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Manufacturer Name"
                  />
                  {errors.manufacturer_name && touched.manufacturer_name ? (
                    <p className="error">{errors.manufacturer_name}</p>
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
                    name="status"
                    value={values.status.toString()}
                    onChange={(e) => {
                      const newStatus = e.target.value === 'true';
                      handleChange({
                        target: {
                          name: "status",
                          value: newStatus,
                        },
                      })
                    }}
                    onBlur={handleBlur}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </Form.Select>
                  {errors.status && touched.status ? (
                    <p className="error">{errors.status}</p>
                  ) : null}
                </Form.Group>
              </Col>
              <Col as={Col} md={12}>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <textarea
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="border border-2 border-black rounded-3 w-100"
                    rows={5}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="my-2 justify-content-center">
              <button type="submit" className="btn btn-primary w-auto mt-3">
                Save
              </button>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
