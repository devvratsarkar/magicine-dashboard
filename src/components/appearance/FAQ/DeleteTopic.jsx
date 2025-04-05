import React from "react";
import { Button, Modal } from "react-bootstrap";

export default function DeleteTopics({ show, hide, TopicID }) {
  const handleDelte = () => {
    alert(`Topic ${TopicID} deleted successfully`);
    hide(false);
  };
  return (
    <div>
      <Modal show={show}>
        <Modal.Header className="modal_header border-0 border-bottom-0">
          <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
            Delete Confermation
          </Modal.Title>
          {/* <Button onClick={() => hide(false)} className="btn-close" variant=""> x</Button> */}
        </Modal.Header>
        <Modal.Body className="text-center">
          Are Your Sure to delete this Topic?
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
            className="btn btn-danger"
            variant="danger"
            onClick={() => handleDelte()}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
