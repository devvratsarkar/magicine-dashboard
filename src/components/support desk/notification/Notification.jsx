import React from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
Link;
import "suneditor/dist/css/suneditor.min.css";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Link } from "react-router-dom";
import { NotificationDataTable } from "../../../commondata/notificationData";
import { getNotificationTrash } from "../../../utils/routes";

function Notification() {
  const role = localStorage.getItem("role")
  const permissions = JSON.parse(localStorage.getItem("permissions"))

  const showAdd = role === "Admin" || (role === "Staff" && permissions.Notification.includes("add"))
  const showTrash = role === "Admin" || (role === "Staff" && permissions.Notification.includes("view-trash"))
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <PageHeader titles="Support Desk" active="Email Notification List" items={["Home"]} links={["/dashboard"]} />
        </Col>
        <Col className="text-end d-flex justify-content-end gap-4">
          {
            showAdd && (
              <Link className="btn btn-success border-success fit-content" to="/notification/add-notification" > Add New Notification </Link>
            )
          }
          {
            showTrash && (
              <Link className="btn btn-danger text-white fit-content" to={`${getNotificationTrash()}`}>Notification Trashed</Link>
            )
          }
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <NotificationDataTable />
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Notification;
