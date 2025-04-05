import React from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap'
import PageHeader from '../../layouts/layoutcomponents/pageheader'
import { Link, useParams } from 'react-router-dom'
import { useGetAllDisputesQuery, useGetAllMessagesQuery, useUpdateStatusMutation } from '../../redux/features/disputeEndPoint'
import Loader from '../../layouts/layoutcomponents/loader'
import 'react-chat-elements/dist/main.css';
import toast from 'react-hot-toast'
import { MessageList } from 'react-chat-elements'

export default function ViewDisputeDetails() {
    const { id } = useParams()
    const { data, isLoading, refetch } = useGetAllMessagesQuery(id);
    const [updateStatus, { isloading: loading }] = useUpdateStatusMutation()
    const { refetch: alldisputes } = useGetAllDisputesQuery();

    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))

    const showWdit = role === "Admin" || (role === "Staff" && permissions.NeedHelp.includes("edit"))

    const disputeData = data?.data

    const handleStatusChange = async (newStatus) => {
        try {
            const response = await updateStatus({ disputeId: disputeData?.id, disputeBody: { status: newStatus } });
            if (response?.data?.http_status_code === 200) {
                toast.success(response.data.message);
                refetch()
                alldisputes()
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            {isLoading && <Loader /> || loading && <Loader />}
            <Row className="align-items-center">
                <Col>
                    <PageHeader titles="Service Request Against Order" active="View Service Request Against Order" items={["Home"]} links={["/dashboard"]} />
                </Col>
                <Col className="text-end d-flex justify-content-end gap-4">
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Header className="justify-content-between">
                            <Row>
                                <Col className="d-flex align-items-center">
                                    {
                                        showWdit && (

                                            <Form>
                                                <Form.Group>
                                                    <Form.Label>Dispute Status</Form.Label>

                                                    <Form.Select name='status' value={disputeData?.status} onChange={(e) => handleStatusChange(e.target.value)}>
                                                        <option value="open">Open</option>
                                                        <option value="pending">Pending</option>
                                                        <option value="closed">Closed</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Form>
                                        )
                                    }
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Link
                                        className="btn dispute-success-btn text-white"
                                        to={`/all-orders/order-details/${disputeData?.orderData?.id}`}
                                    >
                                        {" "}
                                        Order Detail
                                    </Link>
                                </Col>
                                <Col>
                                    <Link
                                        className="btn dispute-primary-btn text-white"
                                        to="/dispute"
                                    >
                                        View All Disputes
                                    </Link>
                                </Col>
                            </Row>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col>
                                    <p>
                                        <strong>Order ID : </strong> {disputeData?.orderId}
                                    </p>
                                </Col>
                                <Col>
                                    <p>
                                        <strong>Amount paid : </strong>   {disputeData?.orderData?.currency === 'USD' ? `$ ${disputeData?.orderData?.total_amount}` : `Rs. ${disputeData?.orderData?.total_amount}`}
                                    </p>
                                </Col>
                            </Row>
                            <Row className='my-4'>
                                <Col>
                                    <p>
                                        <strong>Customer Name : </strong> {disputeData?.created_by?.name}
                                    </p>
                                </Col>
                                <Col>
                                    <p>
                                        <strong>Email : </strong> {disputeData?.created_by?.email}
                                    </p>
                                </Col>
                            </Row>


                            <Row className="border border-1 py-1 px-2 rounded-3 dispute-backgroundcolor-text-parent ">
                                <Form.Group>
                                    <Form.Label>Message</Form.Label>
                                    <textarea value={disputeData?.message} className='border w-100 rounded-3' rows={5} disabled />
                                </Form.Group>
                            </Row>
                        </Card.Body>
                    </Card>
                    <Row>
                        <Col>
                            <Card>
                                <Card.Header>Dispute Messages</Card.Header>
                                <Card.Body>
                                    <div className="chat-container">
                                        <MessageList
                                            className='message-list'
                                            lockable={true}
                                            toBottomHeight={'100%'}
                                            dataSource={disputeData?.disputeMessage?.map((msg) => ({
                                                position: msg.userType === "admin" ? 'right' : 'left',
                                                type: 'text',
                                                text: msg?.message,
                                            })) ?? []}
                                        />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row >
        </>
    )
}