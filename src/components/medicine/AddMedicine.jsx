import React from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap'
import PageHeader from '../../layouts/layoutcomponents/pageheader'
import AddNewMedicineForm from '../form/AddNewMedicineForm'

export default function AddMedicine() {
    return (
        <>
            <Row>
                <PageHeader titles="Medicines" active="Add Medicine" items={["Home", "Medicine List"]} links={["/dashboard", "/catalogue/medicines/"]} />
            </Row>
            <Card>
                <Card.Header>
                    <h3 className="card-title">Add Medicines</h3>
                </Card.Header>
                <Card.Body className="add_new_product">
                    <AddNewMedicineForm />
                </Card.Body>
            </Card>
        </>
    )
}
