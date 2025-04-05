import React from "react";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Row, Col, Card } from "react-bootstrap";
import { CartData } from "../../commondata/cartData";
import { Link } from "react-router-dom";

export default function Cart() {
  return (
    <>
      <Row>
        <Col>
          <Row className="align-items-center">
            <Col>
              <PageHeader
                titles="Cart"
                active="Cart"
                items={["Home"]}
                links={["/dashboard"]}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <CartData />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
