import React, { useEffect, useState } from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { AddNotificationValidation, AddNotificationValidationWithouSchedule } from "../../../commondata/formvalidations";
import { options_for_sunEditor } from "../../../commondata/formEditorOptions";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import Select from "react-select";
import { useEditNotificationMutation, useGetAllNotificationQuery, useGetSingleNotificationQuery } from "../../../redux/features/supportDeskEndPoint";
import Error from "../../../layouts/layoutcomponents/Error";
import { useGetUserQuery, useGetAllUserAccordingToCategoryMutation, useGetCategoriesTypeMutation } from "../../../redux/features/customerDataEndPoints";
import { getNotification } from "../../../utils/routes";
import toast from "react-hot-toast";
import Loader from "../../../layouts/layoutcomponents/loader";

function EditNotification() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const { refetch } = useGetAllNotificationQuery();
  const [editNotification, { isLoading: loading }] = useEditNotificationMutation();

  const { data, isError, error, isLoading, isFetching, isSuccess, refetch: refetchCurrent } = useGetSingleNotificationQuery(id);
  const singleNotification = data?.data;

  const [selectedProductType, setSelectedProductType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  const [SearchcategoryData, { isLoading: loadingCategory }] = useGetCategoriesTypeMutation();
  const [searchUserData, { isLoading: loadingUsers }] = useGetAllUserAccordingToCategoryMutation();

  const initialValues = {
    to: [],
    title: "",
    order_id: "",
    url: "",
    content: "",
    date: "",
    time: "",
    product_type: "",
    category: []
  };

  useEffect(() => {
    if (selectedProductType) {
      const fetchDataCategory = async () => {
        try {
          const response = await SearchcategoryData({ type: selectedProductType });
          if (response?.data?.http_status_code === 200 && Array.isArray(response.data?.data) && response.data?.data?.length > 0) {
            setCategoryData(response.data?.data);
            toast.success("Category Fetched Successfully");
          } else {
            toast.error(response.data?.message);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchDataCategory();
    }
  }, [selectedProductType]);

  useEffect(() => {
    if (Array.isArray(selectedCategory) && selectedCategory?.length > 0) {
      const fetchDataCategory = async () => {
        try {
          const response = await searchUserData({ id: selectedCategory });

          if (response?.data?.http_status_code === 200 && Array.isArray(response.data?.data) && response.data?.data?.length > 0) {
            setAllUsers(response.data?.data)
            toast.success("Users Fetched Successfully")
          } else {
            toast.error(response.data?.message)
          }
        } catch (error) {
          console.error(error);
        }
      }
      fetchDataCategory()
    }
  }, [selectedCategory]);

  const handleSave = async () => {
    const { to, title, order_id, url, content, product_type, category } = values;
    const updatedValues = { to, title, order_id, url, content, product_type, category };
    try {
      const response = await editNotification({ notificationData: updatedValues, notificationID: id });
      if (response?.data?.http_status_code === 200) {
        toast.success(response.data.message);
        refetch();
        refetchCurrent();
        navigate(`${getNotification()}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSchedule = async () => {
    const { to, title, order_id, url, content, date, time, product_type, category } = values;
    const schedule = `${date} ${time}`;
    const updatedValues = { to, title, order_id, url, content, schedule, product_type, category };
    try {
      const response = await editNotification({ notificationData: updatedValues, notificationID: id });
      if (response?.data?.http_status_code === 200) {
        toast.success(response.data.message);
        refetch();
        refetchCurrent();
        navigate(`${getNotification()}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, setFieldTouched } = useFormik({
    initialValues: initialValues,
    validationSchema: schedule ? AddNotificationValidation : AddNotificationValidationWithouSchedule,
    onSubmit: schedule ? handleSchedule : handleSave,
  });

  const productTypeOptions = [
    { label: "General Product", value: "general_product" },
    { label: "Medicine", value: "medicine" },
    { label: "Surgical Equipment", value: "equipment" }
  ];

  const categoryOptions = Array.isArray(categoryData) && categoryData?.length > 0 ? categoryData?.map((item) => ({
    value: item.id,
    label: item.category_name
  })) : [];

  const userOptions = allUsers.length > 0
    ? [{ value: "all_user", label: "Select All Users" }, ...allUsers.map(user => ({
      value: user.id,
      label: user.name
    }))]
    : [];

  const scheduleDate = singleNotification?.schedule ? new Date(singleNotification?.schedule) : null;
  const dateValue = scheduleDate ? scheduleDate.toISOString().split('T')[0] : '';
  const timeValue = scheduleDate ? scheduleDate.toISOString().split('T')[1].substring(0, 5) : '';

  useEffect(() => {
    if (isSuccess && singleNotification) {
      setFieldValue('to', singleNotification.to.map((item) => item.id));
      setFieldValue("title", singleNotification.title);
      setFieldValue("order_id", singleNotification.order_id);
      setFieldValue("url", singleNotification.url);
      setFieldValue("content", singleNotification.content);
      setFieldValue("date", dateValue);
      setFieldValue("time", timeValue);
      setFieldValue("product_type", singleNotification.product_type);
      setFieldValue("category", singleNotification.category);
      setSelectedProductType(singleNotification.product_type);
      setSelectedCategory(singleNotification.category);
    }
  }, [isSuccess, singleNotification, setFieldValue]);

  if (isError) {
    return <Error error_mes={error} />;
  }


  console.log("values.to", values.to)

  return (
    <>
      <Row>
        <Col>
          <PageHeader titles="Support Desk" active="Edit" items={["Home", "Notification List"]} links={["/dashboard", "/support-desk/notification"]} />
        </Col>
        <Col className="my-5 text-end">
          <Link to="/support-desk/notification" className="btn btn-success border-sucess">View All Notification</Link>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="py-5 px-4">
            {isLoading || isFetching || loading ? <Loader /> : null}
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col as={Col} md={6}>
                  <Form.Group>
                    <Form.Label>Product Type <span className="text-danger">*</span></Form.Label>
                    <Select
                      options={productTypeOptions}
                      name="product_type"
                      value={productTypeOptions?.find((item) => item.value === values.product_type)}
                      onChange={(selectedOption) => (
                        setFieldValue("product_type", selectedOption.value),
                        setSelectedProductType(selectedOption.value)
                      )}
                      onBlur={handleBlur}
                      isSearchable
                    />
                    {
                      errors.category && touched.category
                        ? <p className="error">{errors.category}</p>
                        : null
                    }
                  </Form.Group>
                </Col>
                {selectedProductType && (
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Category <span className="text-danger">*</span></Form.Label>
                      <Select
                        name="category"
                        options={categoryOptions}
                        value={categoryOptions.filter((item) => values.category.includes(item.value))}
                        onChange={(selectedOptions) => {
                          const selectedCategoryArray = selectedOptions.map((option) => Number(option.value));
                          setFieldValue("category", selectedCategoryArray);
                          setSelectedCategory(selectedCategoryArray);
                        }}
                        isMulti
                      />
                      {
                        errors.category && touched.category
                          ? <p className="error">{errors.category}</p>
                          : null
                      }
                    </Form.Group>
                  </Col>
                )}
              </Row>

              <Row>
                {selectedCategory?.length > 0 && allUsers?.length > 0 && (
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>
                        To <span className="text-danger">*</span>
                      </Form.Label>
                      <Select
                        options={userOptions}
                        name="to"
                        value={userOptions.filter((option) => values.to.includes(option.value))}
                        onChange={(selectedOptions) => {
                          const allUsersSelected = selectedOptions.some((option) => option.value === "all_user");
                          let selectedUserIds = [];
                          if (allUsersSelected) {
                            selectedUserIds = allUsers.filter((user) => user.value !== "all_user").map((user) => user.id);
                          } else {
                            selectedUserIds = selectedOptions.map((option) => option.value);
                          }
                          setFieldValue("to", selectedUserIds);
                        }}
                        onBlur={handleBlur}
                        isMulti
                        isSearchable
                      />
                      {errors.to && touched.to ? <p className="error">{errors.to}</p> : null}
                    </Form.Group>
                  </Col>
                )}

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Subject <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.title && touched.title ? (
                      <p className="error">{errors.title}</p>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>
                      Content <span className="text-danger">*</span>
                    </Form.Label>
                    <SunEditor
                      name="content"
                      setContents={values.content}
                      setOptions={options_for_sunEditor}
                      onChange={(content) => setFieldValue("content", content)}
                      onBlur={() => setFieldTouched("content", true)}
                    />
                    {errors.content && touched.content ? (
                      <p className="error">{errors.content}</p>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>
              {schedule && (
                <Row>
                  <p className="fw-bolder fs-4">Schedule Date And Time</p>
                  <Row>
                    <Col sm={3}>
                      <Form.Group>
                        <Form.Label>
                          Date <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          name="date"
                          type="date"
                          value={values.date}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          min={new Date().toISOString().split('T')[0]}
                        />
                        {errors.date && touched.date ? (
                          <p className="error">{errors.date}</p>
                        ) : null}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={3}>
                      <Form.Group>
                        <Form.Label>
                          Time <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          name="time"
                          type="time"
                          value={values.time}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.time && touched.time ? (
                          <p className="error">{errors.time}</p>
                        ) : null}
                      </Form.Group>
                    </Col>
                  </Row>
                </Row>
              )}
              <Row className="mt-3 justify-content-center gap-2">
                {schedule ? (
                  <Button type="submit" className="w-auto">Re-Schedule</Button>
                ) : (
                  <p className="btn btn-primary w-auto" onClick={() => setSchedule(true)}>Re-Schedule</p>
                )}
                {schedule ? (
                  <p className="btn btn-primary w-auto" onClick={() => setSchedule(false)}>Cancel</p>
                ) : (
                  <Button type="submit" className="w-auto">Update</Button>
                )}
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default EditNotification;