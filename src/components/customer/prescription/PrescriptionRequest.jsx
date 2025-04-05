import React from 'react'
import { Row, Col, Card } from "react-bootstrap";
import { PrescriptionRequestData } from '../../../commondata/prescriptionRequestData';
import PageHeader from '../../../layouts/layoutcomponents/pageheader';

export default function PrescriptionRequest() {
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <PageHeader
            titles="Prescription Request"
            active="prescription request"
            items={["Home"]}
            links={['/dashboard']}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <PrescriptionRequestData />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
