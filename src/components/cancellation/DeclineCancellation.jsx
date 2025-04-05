import React from "react";
import { Button, Form, Modal, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { closeModal } from "../../redux/slices/allModalSlice";
import { useFormik } from "formik";
const initialValues = {
  reasons: ''
}
export default function DeclineCancellation() {
  const { isOpen, data } = useSelector((state) => state.allCommonModal)
  const dispatch = useDispatch()
  console.log(data);
  const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm } = useFormik({
    initialValues: initialValues,
    validationSchema: '',
    onSubmit: async (values) => {
      console.log(values);
      dispatch(closeModal())
    },
  });
  return (
    <div>
      <Modal show={isOpen}>
        <Modal.Header className="modal_header-cancellation border-0 border-bottom-0">
          <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
            Rejection Confirmation
          </Modal.Title>
          {/* <Button onClick={() => hide(false)} className="btn-close" variant=""> x</Button> */}
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-4">
              <Form.Group>
                <Form.Label>Reason For Rejection</Form.Label>
                <Form.Control
                  as="textarea"
                  name='reasons'
                  value={values.reasons}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={4}
                />
              </Form.Group>
            </Row>
            <Row className="justify-content-center gap-2">
              <Button className="btn btn-outline-default cancel_button w-auto" variant="" onClick={() => dispatch(closeModal())} >Cancel</Button>
              <Button type="submit" className="btn btn-primary w-auto" variant="primary">Proceed</Button>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
