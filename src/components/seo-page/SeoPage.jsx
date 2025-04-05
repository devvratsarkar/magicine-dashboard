import React from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap'
import PageHeader from "../../layouts/layoutcomponents/pageheader"
import SeoForm from './SeoForm'

function SeoPage() {
    return (
        <>
            <Row>
                <Col>
                    <PageHeader titles="SEO Page" active="SEO Page" items={["Home"]} links={["/dashboard"]} />
                </Col>
            </Row>
            <Row>
                <Col as={Col} md={12}>
                    <Card>
                        <Card.Header>SEO</Card.Header>
                        <Card.Body>
                            <SeoForm />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default SeoPage