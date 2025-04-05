import React from 'react'
import { ProductEnquiriesData } from '../../../commondata/productEnquiriesData'
import { Card, Col, Row } from 'react-bootstrap'
import PageHeader from '../../../layouts/layoutcomponents/pageheader'

export default function ProductsEnquiries() {
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <PageHeader
            titles="Products Enquiries"
            active="products enquiries"
            items={["Home"]}
            links={['/dashboard']}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <ProductEnquiriesData />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
