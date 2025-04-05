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
import { ReturnCancellationPolicyData } from "../../../commondata/returnCancellationPolicyData";
import AddReturnCancellationPolicy from "./AddReturnCancellationPolicy";
import { Link } from "react-router-dom";

export default function ReturnCancellationPOlicy() {
  const [addReturnPolicies, setAddReturnPolicies] = useState(false);

  const handleAddReturnPoliciesOpen = () => {
    setAddReturnPolicies(true);
  };

  const handleAddReturnPoliciesClose = () => {
    setAddReturnPolicies(false);
  };

  return (
    <>
      <AddReturnCancellationPolicy
        show={addReturnPolicies}
        hide={handleAddReturnPoliciesClose}
      />
      <Row>
        <Col>
          <Row className="align-items-center">
            <Col>
              <PageHeader
                titles="Settings"
                active="Retun & Cancellation Policy"
                items={["Home"]}
                links={["/dashboard"]}
              />
            </Col>
            <Col className="text-end d-flex justify-content-end gap-4">
              <button
                onClick={handleAddReturnPoliciesOpen}
                className="btn btn-success text-white me-3 fit-content"
              >
                Add Return Policy
              </button>
              <Link
                className="btn btn-danger text-white fit-content"
                to={"/soft-delete"}
                state={{ name: "Return & Cancellation" }}
              >
                Return & Cancellation Trash
              </Link>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <ReturnCancellationPolicyData />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
