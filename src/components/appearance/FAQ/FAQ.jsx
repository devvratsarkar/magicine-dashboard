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
import { TopicData } from "../../../commondata/topicData";
import { FAQData } from "../../../commondata/faqData";
import AddTopic from "../FAQ/AddTopic";
import AddFAQ from "./AddFAQ";
import { Link } from "react-router-dom";

export default function FAQ() {
  const [addDataModel, setAddDataModel] = useState(false);
  const [addFAQModel, setAddFAQModel] = useState(false);

  const handleAddDataOpen = () => {
    setAddDataModel(true);
  };

  const handleAddDataClose = () => {
    setAddDataModel(false);
  };
  const handleFAQDataOpen = () => {
    setAddFAQModel(true);
  };

  const handleFAQDataClose = () => {
    setAddFAQModel(false);
  };
  return (
    <>
      <AddTopic show={addDataModel} hide={handleAddDataClose} />
      <AddFAQ show={addFAQModel} hide={handleFAQDataClose} />
      <Row>
        <Col>
          <Row className="align-items-center">
            <Col>
              <PageHeader
                titles="Appearance"
                active="FAQs"
                items={["Home"]}
                links={["/dashboard"]}
              />
            </Col>
            <Col className="text-end">
              <button
                onClick={handleAddDataOpen}
                className="btn btn-success text-white me-3"
              >
                Add Topic
              </button>
              <Link to={`/soft-delete`} state={{ name: "Topic" }} className="btn btn-danger">Topic Trash</Link>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Row>
          <Col>
            <Card>
              <Card.Body className="data_table">
                <TopicData />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Card.Body className="data_table">
                <Row className="mt-3">
                  <Col className="text-end">
                    <button
                      className="btn btn-success text-white me-3"
                      onClick={handleFAQDataOpen}
                    >
                      Add FAQ
                    </button>
                    <Link to={`/soft-delete`} state={{ name: "FAQ" }} className="btn btn-danger">FAQ Trash</Link>
                  </Col>
                </Row>
                <FAQData />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Row>
    </>
  );
}
