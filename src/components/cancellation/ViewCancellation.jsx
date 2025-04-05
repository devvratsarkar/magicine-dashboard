import React from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import PageHeader from '../../layouts/layoutcomponents/pageheader'
import inventoryImage from "../../assets/images/dashboard/inventory.png";
import { openModal } from '../../redux/slices/allModalSlice';
import { useDispatch } from 'react-redux';

export default function ViewCancellation() {
    const dispatch = useDispatch();
    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <PageHeader titles="View Cancellation" active="view cancellation" items={["Home"]} links={["/dashboard"]} />
                </Col>
            </Row>
            <Row>
                <Card>
                    <Card.Header>
                        <Row className='w-100'>
                            <Col as={Col}>Order ID - #19282982</Col>
                            <Col as={Col} className='text-end'>Status - <span className='text-primary'>New</span></Col>
                        </Row>
                    </Card.Header>
                    <Card.Body>
                        <Row className='custom_border_bottom_color py-4'>
                            <p>Customer Name - Rahul Sharma</p>
                            <p>Country - India</p>
                            <p>Email - rahulSharma123@gmail.com</p>
                            <p>Member Since - Jan 2023</p>
                        </Row>
                        <Row className='custom_border_bottom_color py-4'>
                            <p>Items For Cancellation - 2/5</p>
                            <p>Requested At - 20.04.204 at 9:15 AM</p>
                        </Row>
                        <Row className='custom_border_bottom_color py-4 px-3'>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Image</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Dabur chawanprash</td>
                                        <td><img src={inventoryImage} alt="Product Image" className={`inventory_product_image`} /></td>
                                        <td>01</td>
                                        <td>Rs. 300.00</td>
                                        <td>Rs. 300.00</td>
                                    </tr>
                                    <tr>
                                        <td>Dabur chawanprash</td>
                                        <td><img src={inventoryImage} alt="Product Image" className={`inventory_product_image`} /></td>
                                        <td>01</td>
                                        <td>Rs. 200.00</td>
                                        <td>Rs. 200.00</td>
                                    </tr>
                                </tbody>
                            </table>
                        </Row>
                        <Row className='custom_border_bottom_color py-4'>
                            <p>Grand Total - Rs. 500</p>
                            <p>Payment Status - Successful</p>
                        </Row>
                        <Row className='py-4'>
                            <p className='fw-bold'>Cancellation reason</p>
                            <p>The product is no longer required as doctor has changed my medicines on urgent basis. Kindly cancel the medicines and refund my money.</p>
                        </Row>
                    </Card.Body>
                    <Card.Footer>
                        <Row className='justify-content-center gap-1'>
                            <Button className="btn btn-success w-auto" variant="success" onClick={() => { dispatch(openModal({ componentName: 'ApproveCancellation', data: 'test' })) }}>Approve</Button>
                            <Button className="btn btn-danger w-auto" variant="danger" onClick={() => { dispatch(openModal({ componentName: 'DeclineCancellation', data: 'test' })) }}>Reject</Button>
                        </Row>
                    </Card.Footer>
                </Card>
            </Row>
        </>
    )
}
