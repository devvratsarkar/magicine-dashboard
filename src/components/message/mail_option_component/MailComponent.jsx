import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const MailComponent = () => {
  return (
    <>
      <div className="mt-4 mb-4 text-center">
        <Link className="btn btn-lg d-grid custum-new-message text-white">
          Compose New Message
        </Link>
      </div>
      <Card>
        <div className="list-group list-group-transparent mb-0 mail-inbox pb-3">
          <Card.Header>
            <h2 className="fw-normal mb-0 fs-5">Folder</h2>
          </Card.Header>
          <Card.Body className="p-1 mt-3">
            <div>
              <Link
                to="/message/messages-inbox"
                className="list-group-item d-flex align-items-center active mx-4 custum_folder_border"
              >
                <span className="icons">
                  <i className="ri-mail-line"></i>
                </span>
                Inbox
              </Link>
              <Link
                to="/message/message-sent"
                className="list-group-item d-flex align-items-center active mx-4 custum_folder_border"
              >
                <span className="icons">
                  <i className="ri-mail-send-line"></i>
                </span>
                Sent
              </Link>
              <Link
                to="/message/message-draft"
                className="list-group-item d-flex align-items-center active mx-4 custum_folder_border"
              >
                <span className="icons">
                  <i className="ri-mail-open-line"></i>
                </span>
                Draft
              </Link>
              <Link
                to="/message/message-spam"
                className="list-group-item d-flex align-items-center active mx-4 custum_folder_border"
              >
                <span className="icons">
                  <i className="ri-star-line"></i>
                </span>
                Spam
              </Link>
              <Link
                to="/message/message-trash"
                className="list-group-item d-flex align-items-center active mx-4 custum_folder_border"
              >
                <span className="icons">
                  <i className="ri-delete-bin-line"></i>
                </span>
                Trash
              </Link>
            </div>
          </Card.Body>
        </div>
      </Card>
    </>
  );
};

export default MailComponent;
