import React from "react";
import { Button, Card, Col, Modal, Row } from "react-bootstrap";
import profilePhoto from "../../assets/images/dashboard/image 150.png";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Link, useParams } from "react-router-dom";
import { useGetSingleUserQuery } from "../../redux/features/customerDataEndPoints";
import Loader from "../../layouts/layoutcomponents/loader";
import Error from "../../layouts/layoutcomponents/Error";
export default function ViewCustomer() {
  const { id } = useParams()
  const { data, isError, error, isLoading, isFetching, isSuccess } = useGetSingleUserQuery(id);
  const singleUser = data?.data?.user
  const singleUserAddress = data?.data?.user_address
  if (isLoading || isFetching) {
    return <Loader />;
  }
  if (isError) {
    return <Error error_mes={error} />;
  }

  if (isSuccess) {
    return (
      <>
        <Row className="align-items-center">
          <Col>
            <PageHeader titles="View Customer" active="view customer" items={["Home"]} links={['/dashboard']} />
          </Col>
          <Col className="text-end">
            <Link to={`/customer`} className="btn btn-success text-white">Vew All Customer</Link>
          </Col>
        </Row>
        <Row>
          <Card>
            <Card.Header>
              <h3 className="card-title">View Customer Details</h3>
            </Card.Header>
            <Card.Body className="edit_product">
              <Row className="flex-wrap-reverse">
                <Col as={Col} xl={10} lg={10} md={10} sm={8} xs={12}>
                  <div className="customer_profile_card">
                    <h1 className="card-title text-sm-start fs-5 mb-2">
                      CUSTOMER PROFILE
                    </h1>
                    <p className="card-text text-sm-start">
                      Full Name - {singleUser?.name}
                    </p>
                    <p className="card-text text-sm-start">
                      Phone Number - {singleUser?.phone_number}
                    </p>
                    <p className="card-text text-sm-start">
                      Email ID - {singleUser?.email}
                    </p>
                    <p className="card-text text-sm-start">Address - {singleUserAddress?.address_line_one}</p>
                    <p className="card-text text-sm-start">
                      Member since - {singleUser?.member_since}
                    </p>
                  </div>
                </Col>
                <Col as={Col} xl={2} lg={2} md={2} sm={4} xs={12} className="mb-3 mb-sm-0" >
                  <img
                    src={singleUser?.profile_pic}
                    className="card-img-top col-6 col-sm-12"
                    alt="profile photo"
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Row>
      </>

    );
  }
}
