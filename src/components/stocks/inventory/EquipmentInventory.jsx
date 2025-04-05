import React, { useState } from 'react';
import { Nav, TabContainer, Tabs, Tab, Row, Card, Col, Form, Dropdown, Button } from "react-bootstrap";
import InventoryWithoutVariant from '../../inventory-without-variant/InventoryWithoutVariant';
import PageHeader from '../../../layouts/layoutcomponents/pageheader';
import InventoryWithVariant from '../../inventory-with-variant/InventoryWithVariant';
import { Link } from 'react-router-dom';
import { getInventoryWithVariantTrashPage, getInventoryWithoutVariantTrashPage } from '../../../utils/routes';
import { useLazyGetSearchProductMedicineQuery } from '../../../redux/features/stockInventoryEndPoint';
import Loader from '../../../layouts/layoutcomponents/loader';
import inventory from '../../../assets/images/dashboard/inventory.png';
import { openModal } from '../../../redux/slices/allModalSlice';
import { useDispatch } from 'react-redux';
import EquipmentWithoutVariant from '../../inventory-without-variant/EquipmentWithoutVariant';

export default function EquipmentInventory() {
    const dispatch = useDispatch();
    const [trigger, { data, error, isLoading, isFetching, isSuccess }] = useLazyGetSearchProductMedicineQuery();
    const [show, setShow] = useState(false);
    const searchProduct = data?.data || [];
    const handleSearch = (e) => {
        const searchValue = e.target.value;
        if (!searchValue) {
            setShow(false);
        } else {
            setShow(true);
            trigger(searchValue);
        }
    };

    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))

    const showWithVariantTrash = role === 'Admin' || (role === "Staff" && permissions.InventoryWithVarient.includes("view-trash"))
    const showWithOutVariantTrash = role === 'Admin' || (role === "Staff" && permissions.InvertoryWithoutVarient.includes("view-trash"))
    return (
        <>
            <Row className='align-items-center'>
                <Col>
                    <PageHeader titles="Inventory" active="Surgical Equipment Inventory" items={['Home']} links={["/dashboard"]} />
                </Col>
                <Col className='text-end'>
                    {
                        showWithOutVariantTrash && (

                            <Link to={`${getInventoryWithoutVariantTrashPage()}`}>
                                <Button className='btn-danger' variant=''>
                                    Inventory Without Variant Trash
                                </Button>
                            </Link>
                        )
                    }
                    {/* <Dropdown className='me-1' key={Math.random()}>
                        <Dropdown.Toggle variant={'danger'} data-bs-toggle="dropdown">Inventory Trash<span className="no-caret"></span></Dropdown.Toggle>
                        <Dropdown.Menu role="menu" as="ul">
                            {
                                showWithOutVariantTrash && (
                                    <Dropdown.Item as="li" className='p-0'><Link to={`${getInventoryWithoutVariantTrashPage()}`}>Inventory Without Variant Trash</Link></Dropdown.Item>
                                )
                            }
                            {
                                showWithVariantTrash && (
                                    <Dropdown.Item as="li" className='p-0'><Link to={`${getInventoryWithVariantTrashPage()}`}>Inventory With Variant Trash</Link></Dropdown.Item>
                                )
                            }
                        </Dropdown.Menu>
                    </Dropdown> */}
                </Col>
            </Row>

            <Row className='my-3'>
                <Form.Group as={Col}>
                    <Form.Control
                        type="text"
                        name="search"
                        onChange={handleSearch}
                        placeholder='Search A Product By its Name'
                    />
                </Form.Group>
            </Row>
            {isSuccess && show ? <Card className='p-4'>
                {
                    searchProduct && searchProduct?.length > 0 ? searchProduct?.map((item, index) => (
                        <Row className='mb-4' key={index}>
                            <Col md={7} sm={6} xs={12} className='d-flex gap-1'>
                                <div className="">
                                    <img src={item?.featured_image} alt="inventory-product" width={200} height={200} />
                                </div>
                                <div className="">
                                    <p>Product Name : {item?.product_name}</p>
                                    <p>Marketer/Manufacturer : {item?.marketer?.manufacturer_name}</p>
                                    <p>Brand: {item?.brand?.brand_name}</p>
                                </div>
                            </Col>
                            <Col md={5} sm={6} xs={12}>
                                {item?.has_variant == true ? (
                                    <Button className="btn btn-primary" variant="primary" onClick={() => dispatch(openModal({ componentName: 'EditVariant', data: item }))}>Add To Inventory With Variant</Button>) : (
                                    <Link to={`/stocks/add-inventory-without-variant/${item?.id}`} className="btn btn-primary" state={{ type: item?.type, id: item?.id }} variant="primary" >Add To Inventory Without Variant</Link>)}
                            </Col>
                        </Row>
                    )) : <p>No products found.</p>
                }
            </Card> : <p>{error}</p>
            }
            <Card>
                {isLoading && < Loader />}
                <Card.Body className="data_table">
                    <div className="panel panel-primary">
                        <div className="tab-menu-heading">
                            <div className="tabs-menu ">
                                {/* <Tabs as="ul"
                                    className=" nav panel-tabs inventory_tabs"
                                    variant="pills"
                                    defaultActiveKey="tab1"
                                > */}
                                {/* <Tab as="li" eventKey="tab1" title="Inventory without variant"> */}
                                <EquipmentWithoutVariant />
                                {/* </Tab> */}
                                {/* <Tab as="li" eventKey="tab2" title="Inventory with variant">
                                        <InventoryWithVariant />
                                    </Tab>
                                </Tabs> */}
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </>
    );
}
