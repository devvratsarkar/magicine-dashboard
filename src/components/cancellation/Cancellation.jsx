import React, { useState } from "react";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Row, Col, Card } from "react-bootstrap";
import { CancellationDatas } from "../../commondata/cancellationDatas";

export default function Cancellation() {
  return (
    <>

      <Row className="align-items-center">
        <Col>
          <PageHeader titles="Cancellation" active="Cancellation" items={["Home"]} links={["/dashboard"]} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <CancellationDatas />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
