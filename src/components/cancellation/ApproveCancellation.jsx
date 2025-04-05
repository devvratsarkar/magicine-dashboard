import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { closeModal } from "../../redux/slices/allModalSlice";

export default function ApproveCancellation() {
  const { isOpen, data } = useSelector((state) => state.allCommonModal)
  const dispatch = useDispatch()
  console.log(data);
  return (
    <div>
      <Modal show={isOpen}>
        <Modal.Header className="modal_header-cancellation border-0 border-bottom-0">
          <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
            Approval Confirmation
          </Modal.Title>
          {/* <Button onClick={() => hide(false)} className="btn-close" variant=""> x</Button> */}
        </Modal.Header>
        <Modal.Body className="text-center">
          Are you sure you want to do this?
        </Modal.Body>
        <Modal.Footer className="justify-content-center p-1">
          <Button className="btn btn-outline-default cancel_button" variant="" onClick={() => dispatch(closeModal())} >Cancel </Button>
          <Button className="btn btn-primary" variant="primary" onClick={() => dispatch(closeModal())} >Proceed</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
