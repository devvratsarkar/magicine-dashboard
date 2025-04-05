import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    ListGroup,
    Spinner,
    Alert,
    Image,
    Button,
    Modal,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../redux/slices/allModalSlice";
import toast from "react-hot-toast";
import axios from "axios";
import { MEDIA_BASE_URL } from "../../utils/config";

export default function TrackingModel() {
    const dispatch = useDispatch();
    const { isOpen, data } = useSelector((state) => state.allCommonModal);
    const [trackingData, setTrackingData] = useState(null);
    const [isShipYaari, setShipYaari] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const shippingCountry = data?.shippping_address?.country;

    const trackingNo = data?.tracking_id;

    useEffect(() => {
        const fetchTrackingData = async () => {
            if (!trackingNo) return;

            setLoading(true);
            setError(null);

            try {
                let resp;
                if (shippingCountry === "India") {
                    resp = await axios.get(
                        `https://api-seller.shipyaari.com/api/v1/tracking/getTracking?trackingNo=${trackingNo}`
                    );

                    if (resp?.data?.statusCode === 200) {
                        setTrackingData(resp?.data?.data[0]?.trackingInfo[0]);
                        setShipYaari(true);
                    }
                } else {
                    resp = await axios.get(
                        `${MEDIA_BASE_URL}/api/user/tack-order/${trackingNo}`
                    );
                    setTrackingData(resp?.data?.data?.response?.output?.completeTrackResults[0]?.trackResults[0] || {});
                    setShipYaari(false);
                }
            } catch (err) {
                setError(err?.message || "Failed to fetch tracking data");
                toast.error(err?.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTrackingData();
    }, [shippingCountry, trackingNo]);

    // Destructure with fallback after data is loaded
    let { trackingNumberInfo, latestStatusDetail, shipperInformation, recipientInformation, scanEvents } = trackingData || {};

    return (
        <Modal show={isOpen} onHide={() => dispatch(closeModal())} centered size="lg">
            <Modal.Header className="bg-primary text-light">
                <Modal.Title>Track Order</Modal.Title>
                <Button
                    variant="link"
                    className="text-light fs-5 p-0"
                    onClick={() => dispatch(closeModal())}
                >
                    <i className="fe fe-x"></i>
                </Button>
            </Modal.Header>

            <Modal.Body>
                {loading ? (
                    <div className="text-center p-5">
                        <Spinner animation="border" />
                    </div>
                ) : error ? (
                    <Alert variant="danger" className="text-center p-5">
                        {error}
                    </Alert>
                ) : shippingCountry === "India" && isShipYaari ? (
                    <Container>
                        <h4 className="text-center mb-4">Track Your Order</h4>

                        <Card className="mb-4 shadow-sm">
                            <Card.Body>
                                <Row className="align-items-center">
                                    <Col>
                                        <Card.Text>
                                            <strong>AWB:</strong> {trackingData?.awb || "N/A"}
                                        </Card.Text>
                                        <Card.Text>
                                            <strong>Courier:</strong>{" "}
                                            {trackingData?.courierPartnerName || "N/A"}
                                        </Card.Text>
                                        <Card.Text>
                                            <strong>Status:</strong>{" "}
                                            {trackingData?.currentStatus || "N/A"}
                                        </Card.Text>
                                    </Col>
                                    <Col xs="auto">
                                        {trackingData?.logoUrl && (
                                            <Image
                                                src={trackingData.logoUrl}
                                                alt={trackingData?.courierPartnerName}
                                                height="40"
                                            />
                                        )}
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        <Card className="shadow-sm">
                            <Card.Body>
                                <h5 className="mb-3">Tracking Updates</h5>
                                {!trackingData?.processedLog?.length ? (
                                    <Alert variant="secondary">No tracking updates available.</Alert>
                                ) : (
                                    <ListGroup>
                                        {trackingData?.processedLog[0]?.Scans?.map((scan, index) => (
                                            <ListGroup.Item
                                                key={index}
                                                className="d-flex align-items-start"
                                            >
                                                <div className="me-3">
                                                    <div
                                                        className="bg-success rounded-circle"
                                                        style={{ width: 12, height: 12 }}
                                                    ></div>
                                                    {index !==
                                                        trackingData.processedLog[0].Scans.length - 1 && (
                                                            <div
                                                                className="bg-success"
                                                                style={{
                                                                    width: 2,
                                                                    height: 40,
                                                                    marginLeft: 5,
                                                                }}
                                                            ></div>
                                                        )}
                                                </div>
                                                <div>
                                                    <p className="mb-1">
                                                        <strong>{scan.status}</strong>
                                                    </p>
                                                    <p className="text-muted small mb-1">{scan.message}</p>
                                                    <p className="text-muted small mb-1">{scan.location}</p>
                                                    <p className="text-muted small">
                                                        {new Date(scan.time).toLocaleString()}
                                                    </p>
                                                </div>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )}
                            </Card.Body>
                        </Card>
                    </Container>
                ) : trackingData ? (
                    <Container className="my-5">
                        <h2 className="text-center mb-4">Track Your Order</h2>

                        <Card className="mb-4 shadow-sm">
                            <Card.Body>
                                <Card.Text>
                                    <strong>Tracking Number:</strong> {trackingNumberInfo?.trackingNumber || "N/A"}
                                </Card.Text>
                                <Card.Text>
                                    <strong>Status:</strong> {latestStatusDetail?.statusByLocale || "N/A"}
                                </Card.Text>
                            </Card.Body>
                        </Card>

                        <Card className="mb-4 shadow-sm">
                            <Card.Body>
                                <Row>
                                    <Col md={6}>
                                        <h5 className="text-secondary">Shipped From</h5>
                                        <p className="mb-0">
                                            {shipperInformation?.address?.city || "N/A"},
                                            {shipperInformation?.address?.stateOrProvinceCode || "N/A"},{" "}
                                            {shipperInformation?.address?.countryName || "N/A"}
                                        </p>
                                    </Col>
                                    <Col md={6}>
                                        <h5 className="text-secondary">Shipped To</h5>
                                        <p className="mb-0">
                                            {recipientInformation?.address?.city || "N/A"},
                                            {recipientInformation?.address?.stateOrProvinceCode || "N/A"},{" "}
                                            {recipientInformation?.address?.countryName || "N/A"}
                                        </p>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        <Card className="shadow-sm">
                            <Card.Body>
                                <h4 className="mb-3">Tracking Updates</h4>
                                {!scanEvents?.length ? (
                                    <p className="text-muted">No tracking updates available.</p>
                                ) : (
                                    <ListGroup variant="flush">
                                        {scanEvents.map((event, index) => (
                                            <ListGroup.Item key={index} className="d-flex align-items-start">
                                                <div className="me-3 text-center">
                                                    <div className="bg-primary rounded-circle" style={{ width: 12, height: 12 }}></div>
                                                    {index !== scanEvents.length - 1 && (
                                                        <div className="bg-primary" style={{ width: 2, height: 40, marginLeft: 5 }}></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="mb-1">
                                                        <strong>{event.eventDescription || "N/A"}</strong>
                                                    </p>
                                                    <p className="text-muted small mb-1">
                                                        {event.date ? new Date(event.date).toLocaleString() : "N/A"}
                                                    </p>
                                                    <p className="text-muted small">
                                                        Location: {event.scanLocation?.city || "N/A"},
                                                        {event.scanLocation?.stateOrProvinceCode || "N/A"},{" "}
                                                        {event.scanLocation?.countryName || "N/A"}
                                                    </p>
                                                </div>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )}
                            </Card.Body>
                        </Card>
                    </Container>
                ) : (
                    <Alert variant="info" className="text-center p-5">
                        No tracking information available
                    </Alert>
                )}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => dispatch(closeModal())}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}