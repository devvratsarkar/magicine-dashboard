import React from "react";
import { Button, Modal, Form, Row } from "react-bootstrap";
import { useFormik } from "formik";
import { addClientValidations } from "../../../commondata/formvalidations";

export default function AddClient({ show, hide }) {

  const { values, errors, handleBlur, touched, handleChange, handleSubmit, setFieldValue } =
    useFormik({
      initialValues: {
        name: "",
        link: "",
        status: true,
      },
      validationSchema: addClientValidations,
      onSubmit: async (values) => {
        console.log(values);
        alert("new client added  successfully.");
        hide(false);
      },
    });

  return (
    <div>
      <Modal show={show}>
        <Modal.Header className="border-bottom-5 justify-content-between">
          <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
            Form
          </Modal.Title>
          <Button onClick={() => hide(false)} className="btn-close" variant="">
            x
          </Button>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Form.Group>
                <Form.Label className="text-start"> Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Client Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.name && touched.name ? (
                  <p className={`error`}>{errors.name}</p>
                ) : null}
              </Form.Group>
            </Row>
            <Row>
              <Form.Group>
                <Form.Label className="text-start">Link</Form.Label>
                <Form.Control
                  type="text"
                  name="link"
                  value={values.link}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                {errors.link && touched.link ? (
                  <p className={`error`}>{errors.link}</p>
                ) : null}
              </Form.Group>
            </Row>
            <Row>
              <Form.Group className="text-start">
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
          </Form>
        </Modal.Body>
        <Modal.Footer className="justify-content-end">
          <Button
            className="btn btn-primary"
            variant="primary"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
