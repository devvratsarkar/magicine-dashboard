import React, { useState } from "react";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import {
  Nav,
  TabContainer,
  Tabs,
  Tab,
  Row,
  Card,
  Col,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { ClientDataTable } from "../../../commondata/clientDataTable";
import AddClient from "./AddClient";

export default function Clients() {
  const [addClient, setAddClient] = useState(false);

  const handleAddClientOpen = () => {
    setAddClient(true);
  };

  const handleAddClientClose = () => {
    setAddClient(false);
  };
  return (
    <>
      <AddClient show={addClient} hide={handleAddClientClose} />
      <Row>
        <Col>
          <Row className="align-items-center">
            <Col>
              <PageHeader
                titles="Settings"
                active="Clients"
                items={["Home", "Settings"]}
                links={["/dashboard"]}
              />
            </Col>
            <Col className="d-flex justify-content-end">
              <Button
                onClick={handleAddClientOpen}
                variant=""
                className="btn btn-success text-white me-3"
              >
                Add Client
              </Button>
              <Link to={`/soft-delete`} state={{ name: "Client" }} className="btn btn-danger">Client Trash</Link>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <ClientDataTable />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
