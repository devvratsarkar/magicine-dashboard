import React from "react";
import { Button, Modal } from "react-bootstrap";

export default function DeclineConfermation({ show, hide, ReturnID }) {
  const handleDelte = () => {
    // alert(`Decline ${ReturnID} return`);
    hide(false);
  };
  return (
    <div>
      <Modal show={show}>
        <Modal.Header className="modal_header-cancellation">
          <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
            Decline Confermation
          </Modal.Title>
          {/* <Button
            onClick={() => hide(false)}
            className="btn-close text-white"
            variant=""
          >
            x
          </Button> */}
        </Modal.Header>
        <Modal.Body className="text-center">
          are you sure you want to do this ?
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            className="btn btn-outline-default cancel_button"
            variant=""
            onClick={() => hide(false)}
          >
            Cancel
          </Button>
          <Button
            className="btn btn-primary"
            variant="approve"
            onClick={() => handleDelte()}
          >
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
