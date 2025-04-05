import React, { useEffect } from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { useFormik } from "formik";
import { TreeSelect } from "antd";
import { AddCustomFieldSchema } from '../../../commondata/formvalidations';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { closeModal } from '../../../redux/slices/allModalSlice';
import { useAddNewCustomFieldMutation, useEditCustomFieldMutation, useGetCategoryByParentChildQuery, useGetCustomFieldsQuery, useGetSingleCustomFieldsQuery } from '../../../redux/features/catalogueEndPoints';
import Loader from '../../../layouts/layoutcomponents/loader';
import toast from 'react-hot-toast';
import Error from '../../../layouts/layoutcomponents/Error';

export default function EditCustomField() {
  const dispatch = useDispatch();
  const { refetch } = useGetCustomFieldsQuery()
  const { isOpen, data } = useSelector((state) => state.allCommonModal);
  const { data: singleField, isError, error, isLoading: loadSingleField, isFetching, isSuccess, refetch: singleCustomField } = useGetSingleCustomFieldsQuery(data.id)
  const { data: parentChildCategory } = useGetCategoryByParentChildQuery()
  const parentChildCategoryData = parentChildCategory?.context?.data;
  const [editCustomField, { isLoading }] = useEditCustomFieldMutation()

  const initialValues = {
    attribute_type: data?.attribute_type,
    attribute_name: data?.attribute_name,
    list_order: data?.list_order,
    category_id: [],
  }
  const { values, errors, handleBlur, touched, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: initialValues,
    validationSchema: AddCustomFieldSchema,
    onSubmit: async (values) => {
      try {
        const response = await editCustomField({ customField: values, fieldId: data.id });
        if (response?.data?.http_status_code === 200) {
          refetch()
          singleCustomField()
          dispatch(closeModal())
          toast.success(response.data.message)
        }
      } catch (error) {
        console.error(error);
      }
    },
  });
  useEffect(() => {
    setFieldValue('category_id', singleField?.data?.category_id)
  }, [isSuccess])

  const handleCategoryChange = (value) => {
    setFieldValue("category_id", value);
  };

  if (isFetching || loadSingleField) {
    return <Loader />
  }
  if (isError) {
    return <Error error_mes={error} />
  }
  if (isSuccess) {
    return (
      <div>
        <Modal show={isOpen}>
          <Modal.Header className='justify-content-center mx-2'>
            <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">Edit Custom Field</Modal.Title>
          </Modal.Header>
          <Button onClick={() => dispatch(closeModal())} className="btn-close position-absolute end-0 p-3" variant="" ><i className="fe fe-x fw-bolder"></i></Button>
          <Modal.Body className='p-2'>
            {isLoading && <Loader />}
            <Form onSubmit={handleSubmit} className="border rounded-2 p-2 overflow-hidden" >
              <Row className="border-bottom pb-3">
                <Form.Group>
                  <Form.Label>
                    Attribute Type <span className="required_icon">*</span>
                  </Form.Label>
                  <Form.Select
                    type="text"
                    name="attribute_type"
                    placeholder="Select Attribute Type"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.attribute_type}
                  >
                    <option value="Select">Select</option>
                    <option value="Color">Color</option>
                  </Form.Select>

                  {errors.attribute_type && touched.attribute_type ? (
                    <p className={`error`}>{errors.attribute_type}</p>
                  ) : null}
                </Form.Group>
              </Row>
              <Row className="border-bottom pb-3">
                <Form.Group as={Col} md="6">
                  <Form.Label>
                    Attribute Name <span className="required_icon">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="attribute_name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.attribute_name}
                  />
                  {errors.attribute_name && touched.attribute_name ? (
                    <p className={`error`}>{errors.attribute_name}</p>
                  ) : null}
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Form.Label>
                    List Order <span className="required_icon">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="list_order"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.list_order}
                  />
                  {errors.list_order && touched.list_order ? (
                    <p className={`error`}>{errors.list_order}</p>
                  ) : null}
                </Form.Group>
              </Row>
              <Row className="pb-3">
                <Form.Group as={Col} md="12">
                  <Form.Label>Select Parent Category</Form.Label>
                  <TreeSelect
                    className="w-100"
                    value={values.category_id}
                    name="category_id"
                    onChange={handleCategoryChange}
                    multiple={true}
                    onBlur={handleBlur}
                    showSearch
                    // searchValue='label'
                    treeData={parentChildCategoryData}
                    filterTreeNode={(inputValue, treeNode) => {
                      console.log("treeNode", treeNode)
                      return treeNode.label.toLowerCase().includes(inputValue.toLowerCase());
                    }}
                    placeholder="Search categories"
                  />
                  {errors.category_id && touched.category_id ? (
                    <p className={`error`}>{errors.category_id}</p>
                  ) : null}
                </Form.Group>
              </Row>
              <Row className="mx-1">
                <Button type="submit" className="btn-primary ms-auto w-auto">
                  Update
                </Button>
              </Row>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    )

  }
}