import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { closeModal } from "../../redux/slices/allModalSlice";
import { useGetInventoryAttributesQuery, useGetInventoryVariantsQuery } from "../../redux/features/stockInventoryEndPoint";

export default function AddVariant() {
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState({});
    const dispatch = useDispatch();
    const { isOpen, data } = useSelector((state) => state.allCommonModal);
    const { data: inventoryDataWithVariant } = useGetInventoryVariantsQuery({ modelType: data.modelType, modelId: data.modelId.id });
    const { data: getAttributeData } = useGetInventoryAttributesQuery({ modelType: data.modelType, modelId: data.modelId.id });
    const selectedAttributes = getAttributeData?.data?.customFields || [];

    useEffect(() => {
        if (selectedAttributes.length > 0) {
            const initValues = selectedAttributes.reduce((acc, attribute) => {
                acc[attribute.attribute_name] = [];
                return acc;
            }, {});

            inventoryDataWithVariant?.data?.forEach(variant => {
                variant.attribute.forEach((attr, index) => {
                    const attributeName = selectedAttributes.find(attribute => attribute.id === parseInt(attr))?.attribute_name;
                    if (attributeName) {
                        const existingValues = initValues[attributeName] || [];
                        const valueId = variant.attribute_value[index];
                        const valueName = selectedAttributes.find(attribute => attribute.id === parseInt(attr))?.values.find(val => val.id === parseInt(valueId))?.attribute_name || '';
                        if (!existingValues.some(val => val.id === valueId)) {
                            initValues[attributeName].push({ id: valueId, name: valueName });
                        }
                    }
                });
            });

            setInitialValues(initValues);
        }
    }, [selectedAttributes, inventoryDataWithVariant]);

    const getUniqueValues = (arrayOfArrays) => {
        const uniqueSet = new Set();
        arrayOfArrays.forEach(array => {
            array.forEach(value => {
                uniqueSet.add(value);
            });
        });
        return Array.from(uniqueSet);
    };

    const [uniqueAttributeValue, setUniqueAttributeValue] = useState([]);

    useEffect(() => {
        const attributeArrays = inventoryDataWithVariant?.data?.map(item => item.attribute_value) || [];
        const uniqueValues = getUniqueValues(attributeArrays);
        setUniqueAttributeValue(uniqueValues);
    }, [inventoryDataWithVariant]);

    const {
        values,
        handleBlur,
        handleSubmit,
        resetForm,
        setFieldValue,
        handleChange,
    } = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema: null,
        onSubmit: async (values) => {
            const formattedValues = selectedAttributes.reduce((acc, attribute) => {
                acc[attribute.attribute_name] = values[attribute.attribute_name].map((val) => ({
                    id: val.id,
                    name: val.name,
                }));
                return acc;
            }, {});

            resetForm();
            dispatch(closeModal());
            navigate(`/inventor/edit-invertory-with-varient/${data.modelType}/${data.modelId.id}`, { state: { values: formattedValues, productData: data, attribute: selectedAttributes } });
        },
    });

    return (
        <>
            <Modal show={isOpen}>
                <Modal.Header className="justify-content-center mx-2">
                    <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
                        Edit Variant
                    </Modal.Title>
                </Modal.Header>
                <Button
                    onClick={() => dispatch(closeModal())}
                    className="btn-close position-absolute end-0 p-3"
                    variant=""
                >
                    <i className="fe fe-x fw-bolder"></i>
                </Button>
                <Modal.Body className="p-2">
                    <Form className="border rounded-2 p-2" onSubmit={handleSubmit}>
                        {selectedAttributes.length > 0 ? (
                            selectedAttributes.map((attribute, index) => {
                                const defaultValues = uniqueAttributeValue
                                    .map((val) => {
                                        const matchedValue = attribute.values.find(item => item.id === parseInt(val));
                                        return matchedValue ? { value: matchedValue.id, label: matchedValue.attribute_name } : null;
                                    })
                                    .filter(Boolean);

                                return (
                                    <div key={index}>
                                        <Form.Label>{attribute.attribute_name}</Form.Label>
                                        <Select
                                            options={attribute.values.map((value) => ({
                                                value: value.id,
                                                label: value.attribute_name,
                                            }))}
                                            value={(values[attribute.attribute_name] || []).map(val => ({
                                                value: val.id,
                                                label: attribute.values.find(item => item.id === parseInt(val.id))?.attribute_name
                                            }))}
                                            onChange={(selectedOptions) => {
                                                const selectedValues = selectedOptions ? selectedOptions.map((option) => ({
                                                    id: option.value,
                                                    name: option.label,
                                                })) : [];
                                                setFieldValue(attribute.attribute_name, selectedValues);
                                            }}
                                            onBlur={handleBlur}
                                            isSearchable={true}
                                            isClearable={true}
                                            classNamePrefix="background"
                                            isMulti
                                            defaultValue={defaultValues}
                                        />
                                    </div>
                                );
                            })
                        ) : (
                            <div>No attributes available</div>
                        )}
                        <Button type="submit" className="mt-3">Submit</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}
