import React from "react";
import { Tabs, Tab, Card, Row, Col, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { useGetUserProfileQuery } from "../../redux/features/commonApiCall";
import Loader from "../../layouts/layoutcomponents/loader";
import Error from "../../layouts/layoutcomponents/Error";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/slices/allModalSlice";

export default function UserProfile() {
    const diapatch = useDispatch()
    const { data, isFetching, error, isError, isLoading, isSuccess } = useGetUserProfileQuery()
    const adminData = data?.data
    if (isFetching || isLoading) {
        return <Loader />
    }
    else if (isError) {
        return <Error error_mes={error} />;
    }
    else if (isSuccess) {
        return (
            <div>
                <PageHeader titles="Profile" active="Profile" links={['/']} items={['Home']} />
                <Row id="user-profile">
                    <Col lg={12}>
                        <Card className=" bg-transparent shadow-none border-0">
                            <Card.Body className=" bg-white">
                                <div className="wideget-user">
                                    <Row>
                                        <Col lg={12} md={12} xl={6}>
                                            <div className="wideget-user-desc d-sm-flex">
                                                <div className="wideget-user-img">
                                                    <img className="" src={`${adminData?.profile_pic}`} alt="img" />
                                                </div>
                                                <div className="user-wrap">
                                                    <h4>{adminData.name}</h4>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg={12} md={12} xl={6}>
                                            <div className="text-xl-right mt-4 mt-xl-0">
                                                <Button className="btn btn-primary" onClick={() => { diapatch(openModal({ componentName: "updateProfile" })) }}>
                                                    Edit Profile
                                                </Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Card.Body>
                            <div className="border-top ">
                                <div className="wideget-user-tab">
                                    <div className="tab-menu-heading">
                                        <div className="tabs-menu1 profiletabs">
                                            <Tabs
                                                variant="Tabs"
                                                defaultActiveKey="Profile"
                                                id=" tab-51"
                                                className="tab-content tabesbody "
                                            >
                                                <Tab eventKey="Profile" title="Profile">
                                                    <div className="tab-pane profiletab show">
                                                        <div id="profile-log-switch">
                                                            <Card>
                                                                <Card.Body className="bg-white">
                                                                    <div className="media-heading">
                                                                        <h5>
                                                                            <strong>Personal Information</strong>
                                                                        </h5>
                                                                    </div>
                                                                    <div className="table-responsive p-1">
                                                                        <Table className="table row table-borderless">
                                                                            <tbody className="col-lg-12 col-xl-6 p-0">
                                                                                <tr>
                                                                                    <td><strong>Full Name:</strong> {adminData?.name}</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td><strong>Phone:</strong> {adminData?.phone_number}</td>
                                                                                </tr>
                                                                            </tbody>
                                                                            <tbody className="col-lg-12 col-xl-6 p-0">
                                                                                <tr>
                                                                                    <td><strong>Email:</strong> {adminData?.email}</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td><strong>D.O.B:</strong> {adminData?.dob}</td>
                                                                                </tr>
                                                                            </tbody>
                                                                            <tbody className="col-lg-12 col-xl-6 p-0">
                                                                                <tr>
                                                                                    <td><strong>Designation:</strong> {adminData?.designation}</td>
                                                                                </tr>

                                                                            </tbody>
                                                                        </Table>
                                                                        <div className="mt-3">
                                                                            <p><strong>About Me</strong></p>
                                                                            <p className="w-100 border border-dark rounded-3 p-3">{adminData?.about}</p>
                                                                        </div>
                                                                        <div className="mt-3">
                                                                            <p><strong>Qualification</strong></p>
                                                                            <p className="w-100 border border-dark rounded-3 p-3">{adminData?.qualification}</p>
                                                                        </div>
                                                                    </div>

                                                                </Card.Body>
                                                            </Card>
                                                        </div>
                                                    </div>
                                                </Tab>
                                            </Tabs>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}