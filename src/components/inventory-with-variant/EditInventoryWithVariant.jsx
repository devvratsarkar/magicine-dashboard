import React, { useEffect, useState } from "react";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Row, Col, Card, Table, Button, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useUpdateInventoryWithVariantMutation, useGetInventoryVariantsQuery, useGetAllInventoryWithVariantQuery, useGetAllInventoryWithoutVariantQuery } from "../../redux/features/stockInventoryEndPoint";
import toast from "react-hot-toast";
import Loader from "../../layouts/layoutcomponents/loader";
import { AddInventoryWithVariantSchema } from "../../commondata/formvalidations";
import { useUpdateCartPriceMutation } from "../../redux/features/productEndPoints";

const initialValues = {
    modelType: [],
    modelId: [],
    variant: [],
    image: [],
    sku: [],
    stock_quantity: [],
    mrp: [],
    selling_price: [],
    discount_percent: [],
    attribute: [],
    attribute_value: [],
    isOutOfStock: []
};

function EditInventoryWithVariant() {
    const navigate = useNavigate();

    const location = useLocation();

    const [queryParam, setQueryParam] = useState({
        medicinepage: "" || 1,
        medicinelimit: "" || 10,
        medicinesearch: "",
        productpage: "" || 1,
        productlimit: "" || 10,
        productsearch: "",
        equipmentpage: "" || 1,
        equipmentlimit: "" || 10,
        equipmentsearch: "",
    })

    const ProductData = location?.state?.productData;
    const [updateInventoryWithVariant, { isLoading: loading }] = useUpdateInventoryWithVariantMutation();
    const { data: inventoryDataWithVariant, refetch: inventoryWithVariantRefetch } = useGetInventoryVariantsQuery({ modelType: ProductData.modelType, modelId: ProductData.modelId.id });
    const { data: getInventoryWithVariant, refetch } = useGetAllInventoryWithVariantQuery();
    const { data: getInventoryWithoutVariant, refetch: inventoryWithoutFetch } = useGetAllInventoryWithoutVariantQuery(queryParam);
    const allVariants = inventoryDataWithVariant ? inventoryDataWithVariant?.data : [];
    const [updateCartPrice, { isSuccess: updateCartPriceSuccess }] = useUpdateCartPriceMutation()


    const formData = location.state.values || null;


    const allAttributes = location.state.attribute;


    const [combinations, setCombinations] = useState([]);

    const [attributeValuesCombinations, setAttributeValuesCombinations] = useState([]);

    const attributesArray = Object.keys(formData);
    const selectedAttributesIds = attributesArray.map((attributeName) => {
        const attribute = allAttributes.find((attr) => attr.attribute_name === attributeName);
        return attribute ? attribute.id : null;
    });



    const attributeValuesArray = attributesArray.map(key => formData[key].map(item => item.id));


    const generateCombinations = (arrays, prefix = []) => {
        if (!arrays.length) {
            return [prefix];
        }

        const [firstArray, ...remainingArrays] = arrays;
        const combinations = [];

        firstArray.forEach(id => {
            const newPrefix = [...prefix, id];
            combinations.push(...generateCombinations(remainingArrays, newPrefix));
        });

        return combinations;
    };

    useEffect(() => {
        if (attributeValuesArray.length > 0) {
            const newCombinations = generateCombinations(attributeValuesArray);
            setAttributeValuesCombinations(newCombinations);
        }
    }, [attributeValuesArray]);


    useEffect(() => {
        if (formData) {
            const keys = Object.keys(formData);
            if (keys.length > 0) {
                let newCombinations = [];

                const [firstKey, ...remainingKeys] = keys;
                formData[firstKey].forEach((value) => {
                    newCombinations.push({ [firstKey]: value.name });
                });

                remainingKeys.forEach((key) => {
                    const currentValues = formData[key];

                    if (currentValues.length > 0) {
                        const tempCombinations = [];

                        newCombinations.forEach((item) => {
                            currentValues.forEach((value) => {

                                tempCombinations.push({ ...item, [key]: value.name });
                            });
                        });

                        newCombinations = tempCombinations;
                    }
                });

                setCombinations(newCombinations);
            }
        }
    }, [JSON.stringify(formData)]);



    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: AddInventoryWithVariantSchema,
        onSubmit: async (values) => {
            const formType = new FormData();
            combinations.forEach((items, index) => {
                const inventoryName = Object.values(items).join(" ");
                formType.append(`inventoryData[${index}][modelType]`, ProductData.modelType);
                formType.append(`inventoryData[${index}][modelId]`, ProductData.modelId.id);
                formType.append(`inventoryData[${index}][variant]`, inventoryName);
                formType.append(`inventoryData[${index}][isOutOfStock]`, values.isOutOfStock[index] || "");
                formType.append(`inventoryData[${index}][sku]`, values.sku[index] || "");
                formType.append(`inventoryData[${index}][mrp]`, values.mrp[index] || 0);
                formType.append(`inventoryData[${index}][selling_price]`, values.selling_price[index] || 0);
                formType.append(`inventoryData[${index}][stock_quantity]`, values.stock_quantity[index] || 0);
                formType.append(`inventoryData[${index}][image]`, values.image[index] || 0);
                formType.append(`inventoryData[${index}][discount_percent]`, values.discount_percent[index] || 0);
                attributeValuesCombinations[index]?.forEach((attrValue, attrIndex) => {
                    formType.append(`inventoryData[${index}][attribute_value][${attrIndex}]`, attrValue);
                });
                selectedAttributesIds.forEach(attributeId => {
                    formType.append(`inventoryData[${index}][attribute]`, attributeId);
                });
            });

            try {
                const response = await updateInventoryWithVariant({ modelType: ProductData.modelType, modelId: ProductData.modelId.id, formData: formType });
                if (response?.data?.http_status_code === 200) {
                    toast.success(response.data.message);
                    refetch();
                    inventoryWithoutFetch();
                    inventoryWithVariantRefetch();
                    const cartData = {
                        product_id: ProductData.modelId.id,
                        type: ProductData.modelType
                    }
                    // navigate(`/stocks/inventory`);
                    navigate(-1)
                    await updateCartPrice(cartData)
                }
            } catch (error) {
                console.error(error);
            }
        },
    });
    useEffect(() => {


        if (allVariants.length > 0) {

            const updatedValues = { ...initialValues };
            allVariants.forEach((variant, index) => {
                updatedValues.modelType[index] = variant.modelType;
                updatedValues.modelId[index] = variant.modelId;
                updatedValues.variant[index] = variant.variant;
                updatedValues.sku[index] = variant.sku;
                updatedValues.isOutOfStock[index] = variant.isOutOfStock;
                updatedValues.mrp[index] = variant.mrp ?? 0;
                updatedValues.selling_price[index] = variant.selling_price ?? 0;
                updatedValues.stock_quantity[index] = variant.stock_quantity;
                updatedValues.image[index] = variant.image;
                updatedValues.discount_percent[index] = variant.discount_percent ?? 0;
                updatedValues.attribute[index] = variant.attribute;
                updatedValues.attribute_value[index] = variant.attribute_value;
            });

            formik.setValues(updatedValues);
        }
    }, [allVariants]);

    const handleIsOutOfStockChange = (e, index) => {
        const isChecked = e.target.checked;
        formik.setFieldValue(`isOutOfStock[${index}]`, isChecked);
        if (isChecked) {
            formik.setFieldValue(`stock_quantity[${index}]`, 0);
            formik.setFieldValue(`mrp[${index}]`, 0);
            formik.setFieldValue(`selling_price[${index}]`, 0);
            formik.setFieldValue(`discount_percent[${index}]`, 0);
            formik.setFieldTouched(`stock_quantity[${index}]`, false, false);
            formik.setFieldTouched(`mrp[${index}]`, false, false);
            formik.setFieldTouched(`selling_price[${index}]`, false, false);
            formik.setFieldTouched(`discount_percent[${index}]`, false, false);
            formik.setFieldError(`stock_quantity[${index}]`, '');
            formik.setFieldError(`mrp[${index}]`, '');
            formik.setFieldError(`selling_price[${index}]`, '');
            formik.setFieldError(`discount_percent[${index}]`, '');
        }
    };

    const calculateDiscountPercentage = (mrp, selling_price) => {
        if (!isNaN(mrp) && !isNaN(selling_price)) {
            const discountPercentage = 100 - (selling_price * 100) / mrp;
            return Number(discountPercentage.toFixed(2));
        }
        return '';
    };

    const calculateOfferPrice = (mrp, discountPercent) => {
        if (!isNaN(mrp) && !isNaN(discountPercent)) {
            const selling_price = mrp - (mrp * discountPercent) / 100;
            return Number(selling_price.toFixed(2));
        }
        return '';
    };

    const handleMRPChange = (e, index) => {
        const inputValue = e.target.value;
        formik.setFieldValue(`mrp[${index}]`, inputValue);

        if (inputValue === '') {
            formik.setFieldValue(`selling_price[${index}]`, '');
            formik.setFieldValue(`discount_percent[${index}]`, '');
            return;
        }

        const mrp = parseFloat(inputValue);
        if (isNaN(mrp)) {
            formik.setFieldValue(`selling_price[${index}]`, '');
            formik.setFieldValue(`discount_percent[${index}]`, '');
            return;
        }

        const selling_price = calculateOfferPrice(mrp, formik.values.discount_percent[index] || 0);
        formik.setFieldValue(`selling_price[${index}]`, "");
        formik.setFieldValue(`discount_percent[${index}]`, calculateDiscountPercentage(mrp, selling_price));
    };

    const handleOfferPriceChange = (e, index) => {
        const inputValue = e.target.value;

        if (inputValue === '') {
            formik.setFieldValue(`selling_price[${index}]`, '');
            formik.setFieldValue(`discount_percent[${index}]`, '');
            return;
        }

        const numericValue = parseFloat(inputValue);
        if (isNaN(numericValue)) {
            return;
        }

        const mrp = parseFloat(formik.values.mrp[index]);
        if (isNaN(mrp)) {
            formik.setFieldValue(`selling_price[${index}]`, '');
            formik.setFieldValue(`discount_percent[${index}]`, '');
            return;
        }

        const validSellingPrice = Math.min(Math.max(numericValue, 0), mrp);
        const discountPercent = calculateDiscountPercentage(mrp, validSellingPrice);

        formik.setFieldValue(`selling_price[${index}]`, validSellingPrice);
        formik.setFieldValue(`discount_percent[${index}]`, discountPercent);
    };

    const handleDiscountChange = (e, index) => {
        const inputValue = e.target.value;

        if (inputValue === '') {
            formik.setFieldValue(`discount_percent[${index}]`, '');
            formik.setFieldValue(`selling_price[${index}]`, '');
            return;
        }

        const numericValue = parseFloat(inputValue);
        if (isNaN(numericValue)) {
            return;
        }

        const validDiscountPercent = Math.min(Math.max(numericValue, 0), 100);
        const mrp = parseFloat(formik.values.mrp[index]);
        if (isNaN(mrp)) {
            formik.setFieldValue(`discount_percent[${index}]`, '');
            formik.setFieldValue(`selling_price[${index}]`, '');
            return;
        }

        const selling_price = calculateOfferPrice(mrp, validDiscountPercent);
        formik.setFieldValue(`discount_percent[${index}]`, validDiscountPercent);
        formik.setFieldValue(`selling_price[${index}]`, selling_price);
    };

    return (
        <>
            {loading && <Loader />}
            <PageHeader titles="Stock-Inventory" active="Edit" items={['Home', 'Inventory List']} links={["/dashboard", "/stocks/inventory"]} />

            <Row>
                <Col xl={12} lg={12}>
                    <Card>
                        <Card.Header>
                            <h4 className="card-title mb-0">Edit Inventory</h4>
                        </Card.Header>
                        <Card.Body>
                            <div className="table-responsive">
                                <Form onSubmit={formik.handleSubmit} encType="multipart/form-data" className="form-custom-width">
                                    <Table className="variant_form">
                                        <thead className="border-bottom">
                                            <tr>
                                                <th>Variant<span className="text-danger">*</span></th>
                                                <th>Image<span className="text-danger">*</span></th>
                                                <th>isOutOfStock<span className="text-danger">*</span></th>
                                                <th>Sku</th>
                                                <th>Stock<span className="text-danger">*</span></th>
                                                <th>MRP</th>
                                                <th>Selling Price</th>
                                                <th>Discount (%)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {combinations.map((combination, index) => (
                                                <tr key={index} className="border-bottom">
                                                    <td className="variant_field">
                                                        <input
                                                            type="text"
                                                            value={Object.values(combination).join(" ")}
                                                            name={`variant[${index}]`}
                                                            readOnly
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Control
                                                            type="file"
                                                            name={`image[${index}]`}
                                                            onChange={(e) => formik.setFieldValue(`image[${index}]`, e.target.files[0])}
                                                            readOnly={formik.values.isOutOfStock[index] ? true : false}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Check
                                                            type="checkbox"
                                                            name={`isOutOfStock[${index}]`}
                                                            checked={formik.values.isOutOfStock[index]}
                                                            onChange={(e) => handleIsOutOfStockChange(e, index)}
                                                            onBlur={formik.handleBlur}
                                                            className="d-flex justify-content-start ps-5 rounded-1"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Control
                                                            type="text"
                                                            name={`sku[${index}]`}
                                                            value={formik.values.sku[index] || ''}
                                                            onChange={formik.handleChange}
                                                            readOnly={formik.values.isOutOfStock[index] ? true : false}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Control
                                                            type="number"
                                                            name={`stock_quantity[${index}]`}
                                                            value={formik.values.stock_quantity[index]}
                                                            onChange={formik.handleChange}
                                                            readOnly={formik.values.isOutOfStock[index] ? true : false}
                                                            min={0}
                                                        />
                                                        {
                                                            formik.values.stock_quantity[index] === "" ? (<p className="text-danger">This Field is required</p>) : null
                                                        }
                                                    </td>
                                                    <td>
                                                        <Form.Control
                                                            type="number"
                                                            name={`mrp[${index}]`}
                                                            value={formik.values.mrp[index]}
                                                            onChange={(e) => handleMRPChange(e, index)}
                                                            onBlur={formik.handleBlur}
                                                            readOnly={formik.values.isOutOfStock[index] ? true : false}
                                                            min={0}
                                                        />
                                                        {
                                                            formik.values.mrp[index] === "" ? (<p className="text-danger">This Field is required</p>) : null
                                                        }
                                                    </td>
                                                    <td>
                                                        <Form.Control
                                                            type="number"
                                                            name={`selling_price[${index}]`}
                                                            value={formik.values.selling_price[index]}
                                                            onChange={(e) => handleOfferPriceChange(e, index)}
                                                            min={0}
                                                            readOnly={formik.values.isOutOfStock[index] ? true : false}
                                                        />
                                                        {
                                                            formik.values.selling_price[index] === "" ? (<p className="text-danger">This Field is required</p>) : null
                                                        }
                                                    </td>
                                                    <td>
                                                        <Form.Control
                                                            type="number"
                                                            name={`discount_percent[${index}]`}
                                                            value={formik.values.discount_percent[index]}
                                                            onChange={(e) => handleDiscountChange(e, index)}
                                                            readOnly={formik.values.isOutOfStock[index] ? true : false}
                                                            min={0}
                                                        />
                                                        {
                                                            formik.values.discount_percent[index] === "" ? (<p className="text-danger">This Field is required</p>) : null
                                                        }
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                    <Row className="justify-content-center mb-4">
                                        <Button variant="primary" type="submit" className="w-auto">Submit</Button>
                                    </Row>
                                </Form>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default EditInventoryWithVariant;
