import React from "react";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Button, Card, Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { openModal } from "../../../redux/slices/allModalSlice";
import { useGetAllZonesQuery } from "../../../redux/features/shippingZoneEndPoints";
import Loader from "../../../layouts/layoutcomponents/loader";
import Error from "../../../layouts/layoutcomponents/Error";

export default function ShippingZone() {
  const dispatch = useDispatch()
  const { data, isError, error, isLoading, isFetching, isSuccess } = useGetAllZonesQuery()
  if (isError) {
    return <Error error_mes={error} />;
  }

  const role = localStorage.getItem("role")
  const permissions = JSON.parse(localStorage.getItem("permissions"))

  const showAddZone = role === "Admin" || (role === "Staff" && permissions.ShippingZone.includes("add"))
  const showEditZone = role === "Admin" || (role === "Staff" && permissions.ShippingZone.includes("edit"))
  const showDeleteZone = role === "Admin" || (role === "Staff" && permissions.ShippingZone.includes("delete"))
  return (
    <>
      <PageHeader titles="Shipping Zone" active="Shipping-Zone" items={["Home"]} links={["/dashboard"]} />
      <Card>
        {isLoading || isFetching && <Loader />}
        <Card.Header>
          <Col as={Col} xl={6} lg={6} md={6} sm={6} xs={12}>
            <div className="d-flex gap-2">
              <i className="fe fe-truck custom_icons fs-5 fw-bolder"></i>
              <p>Shipping Zone</p>
            </div>
          </Col>
          <Col as={Col} xl={6} lg={6} md={6} sm={6} xs={12}>
            <div className="d-flex justify-content-end">
              {
                showAddZone && (
                  <Button className="btn btn-success" variant="success" onClick={() => dispatch(openModal({ componentName: 'AddZone' }))} >
                    Add Zone
                  </Button>
                )
              }
            </div>
          </Col>
        </Card.Header>
        <Card.Body className="shipping_zone" >
          {data?.data?.length > 0 ? (
            data?.data?.map((item, index) => (
              <Row Row key={index} >
                <Row>
                  <Col as={Col} xl={6} lg={4} md={5} sm={2} xs={12} className="d-grid align-items-center mb-2">
                    <div className="d-flex gap-2 justify-content-between">
                      <div className="d-flex gap-2 w-100">
                        <i className="fa fa-map-marker custom_icons fs-5 fw-bolder"></i>
                        <p className="mb-0">{item?._doc?.name}</p>
                      </div>
                      <p className="text-nowrap">Status: {item?._doc?.status ? 'Active' : 'Inactive'}</p>
                    </div>
                  </Col>
                  <Col as={Col} xl={6} lg={8} md={7} sm={10} xs={12} className="d-flex flex-wrap gap-3 justify-content-sm-end" >
                    <Button type="button" className="btn btn-radius" variant="default" onClick={() => { dispatch(openModal({ componentName: 'AddRate', data: item })) }} >
                      <i className="fa fa-plus-square-o me-2"></i>Add Rate
                    </Button>
                    {
                      showEditZone && (
                        <Button type="button" className="btn btn-radius" variant="default" onClick={() => dispatch(openModal({ componentName: 'EditZone', data: item }))}>
                          <i className="fa fa-plus-square-o me-2"></i>Add Country
                        </Button>
                      )
                    }
                    {
                      showEditZone && (
                        <Button type="button" className="btn btn-radius" variant="default" onClick={() => dispatch(openModal({ componentName: 'EditZone', data: item }))}>
                          <i className="fa fa-pencil me-2"></i>Edit
                        </Button>
                      )
                    }
                    {
                      showDeleteZone && (
                        <Button type="button" className="btn btn-danger" variant="danger" onClick={() => dispatch(openModal({ componentName: 'DeleteZoneModal', data: { id: item?._doc?.id, url: 'delete-zone' } }))}>
                          <i className="fa fa-trash me-2"></i>Delete
                        </Button>
                      )
                    }
                  </Col>
                </Row>
                <Row className="my-3 pb-4">
                  <Col as={Col} xl={6} lg={6} md={6} sm={12} xs={12} className="pe-4 mb-4">
                    <p className="fw-bold">Countries</p>
                    {item?.countries?.map((country, i) => (
                      <Row className="shiping_zone_card mb-2" key={i}>
                        <Col as={Col} xl={6} lg={6} md={6} sm={6} xs={12}>
                          <p className="shippin_zone_heading">{country?._doc?.country_name}</p>
                          <p className="fw-bold">{country?._doc?.avl_states} of {country?._doc?.total_states} states</p>
                        </Col>
                        <Col as={Col} xl={6} lg={6} md={6} sm={6} xs={12} className="text-end">
                          {
                            showEditZone && (
                              <>
                                <Button type="button" className="btn rounded-circle close_btn" variant="default" onClick={() => { dispatch(openModal({ componentName: 'DeleteZoneModal', data: { id: country?._doc?.id, url: 'delete-shipping-country' } })) }}><i className="ion-close-round"></i></Button><br />
                              </>
                            )
                          }
                          {
                            showDeleteZone && (
                              <p className="color_icon mt-2 btn cursor-pointer px-0 m-0" onClick={() => { dispatch(openModal({ componentName: 'SelectStates', data: country })) }}>
                                <i className="fa fa-pencil me-2"></i>Edit
                              </p>
                            )
                          }
                        </Col>
                      </Row>
                    ))}
                  </Col>
                  <Col as={Col} xl={6} lg={6} md={6} sm={12} xs={12} className="ps-4" >
                    <p className="fw-bold">Shipping Rates</p>
                    {item?.rates?.map((rate, index) => (
                      <Row className="shiping_zone_card mb-2" key={index}>
                        <Col as={Col} xl={10} lg={9} md={9} sm={9} xs={12} className="pb-3" >
                          <p className="">
                            <span className="shippin_zone_heading">{rate.name} </span>
                            By {rate?.carrier_id?.name} and takes {rate.delivery_takes} days
                          </p>
                          <div className="d-flex gap-2 align-items-center">
                            <p className="fw-bold mb-0">{rate.mini_order}g - {rate.max_order}g</p>
                            <Button className="btn btn-pill p-0 px-4 bg-gray text-white" variant="default" >Rs. {rate.rate}</Button>
                          </div>
                        </Col>
                        <Col as={Col} xl={2} lg={3} md={3} sm={3} xs={12} className="text-end" >
                          <div>
                            {
                              showEditZone && (
                                <Button type="button" className="btn rounded-circle close_btn" variant="default" onClick={() => dispatch(openModal({ componentName: 'DeleteZoneModal', data: { id: rate?.id, url: 'delete-rate' } }))}>
                                  <i className="ion-close-round"></i>
                                </Button>
                              )
                            }
                          </div>
                          {
                            showDeleteZone && (
                              <p className="color_icon mt-2 btn cursor-pointer px-0 m-0" onClick={() => dispatch(openModal({ componentName: 'EditRate', data: { rate, item } }))}>
                                <i className="fa fa-pencil me-2"></i>Edit
                              </p>
                            )
                          }
                        </Col>
                      </Row>
                    ))}

                  </Col>
                </Row>
              </Row>))) : (
            <p>No Zones Available</p>
          )
          }
        </Card.Body >
      </Card >

    </>
  );
}
