import React, { useEffect, useState } from "react";
import "react-multiple-select-dropdown-lite/dist/index.css";
import {
  Button,
  Form,
  Row,
  Col,
  InputGroup,
  Card,
  Dropdown,
} from "react-bootstrap";
import { useFormik } from "formik";
import { GlobalSettingsValidation } from "../../../commondata/formvalidations";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import SeoForm from "../../seo-page/SeoForm";
import { useAddUpdateGloablSettingsMutation, useGetGlobalSettingQuery } from "../../../redux/features/globalSettingEndPoints";
import toast from "react-hot-toast";
import SunEditor from "suneditor-react";
import { options_for_sunEditor } from "../../../commondata/formEditorOptions";

const initialValues = {
  google_analytics_id: "",
  logo: "",
  icon_image: "",
  facebook_pixel: "",
  marketplace_name: "",
  search_console: "",
  google_tag_manager: "",
  android_app_url: "",
  iphone_app_url: "",
  whatsapp_link: "",
  phone: "",
  alt_phone: "",
  email: "",
  copy_right_text: "",
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  og_tag: "",
  schema_markup: "",
  checkout_status: true,
  instagram_logo: "",
  facebook_logo: "",
  x_logo: "",
  youtube_logo: "",
  linkdin_logo: "",
  pinterest_logo: "",
  instagram_link: "",
  facebook_link: "",
  x_link: "",
  youtube_link: "",
  linkdin_link: "",
  pinterest_link: "",
  microsoft_clarity: "",
  bing_tracking_code: "",
  id: '',
  address: "",
  header_text: "",
  header_text_status: ""
};

export default function GlobalSettings() {
  const { data, isError, error, isLoading, isFetching, isSuccess, refetch } = useGetGlobalSettingQuery()
  const [addGlobalSettings, { isLoading: loading }] = useAddUpdateGloablSettingsMutation()

  const role = localStorage.getItem("role")


  const showAddAndUpdate = role === "Admin"


  const {
    values,
    errors,
    handleBlur,
    touched,
    handleChange,
    handleSubmit,
    setFieldValue,
    validateForm
  } = useFormik({
    initialValues: initialValues,
    validationSchema: GlobalSettingsValidation,
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(file => {
            formData.append(key, file);
          });
        } else {
          formData.append(key, value);
        }
      });

      try {
        const response = await addGlobalSettings(formData);
        if (response?.data?.http_status_code === 201 || response?.data?.http_status_code === 200) {
          toast.success(response?.data?.message);
          refetch();
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  const handleScrollToError = async () => {
    const formErrors = await validateForm();
    const errorFields = Object.keys(formErrors);

    if (errorFields.length > 0) {
      const errorElement = document.getElementsByName(errorFields[0])[0];
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth' });
        errorElement.focus();
      }
    }
  };

  const singleGloablSettings = data?.data || []

  useEffect(() => {
    setFieldValue("google_analytics_id", singleGloablSettings?.google_analytics_id || "")
    setFieldValue("logo", singleGloablSettings?.logo || "")
    setFieldValue("icon_image", singleGloablSettings?.icon_image || "")
    setFieldValue("facebook_pixel", singleGloablSettings?.facebook_pixel || "")
    setFieldValue("marketplace_name", singleGloablSettings?.marketplace_name || "")
    setFieldValue("search_console", singleGloablSettings?.search_console || "")
    setFieldValue("google_tag_manager", singleGloablSettings?.google_tag_manager || "")
    setFieldValue("android_app_url", singleGloablSettings?.android_app_url || "")
    setFieldValue("iphone_app_url", singleGloablSettings?.iphone_app_url || "")
    setFieldValue("whatsapp_link", singleGloablSettings?.whatsapp_link || "")
    setFieldValue("phone", singleGloablSettings?.phone || "")
    setFieldValue("alt_phone", singleGloablSettings?.alt_phone || "")
    setFieldValue("email", singleGloablSettings?.email || "")
    setFieldValue("copy_right_text", singleGloablSettings?.copy_right_text || "")
    setFieldValue("meta_title", singleGloablSettings?.meta_title || "")
    setFieldValue("meta_description", singleGloablSettings?.meta_description || "")
    setFieldValue("meta_keywords", singleGloablSettings?.meta_keywords || "")
    setFieldValue("og_tag", singleGloablSettings?.og_tag || "")
    setFieldValue("schema_markup", singleGloablSettings?.schema_markup || "")
    setFieldValue("checkout_status", singleGloablSettings?.checkout_status || "")
    setFieldValue("instagram_logo", singleGloablSettings?.instagram_logo || "")
    setFieldValue("facebook_logo", singleGloablSettings?.facebook_logo || "")
    setFieldValue("x_logo", singleGloablSettings?.x_logo || "")
    setFieldValue("youtube_logo", singleGloablSettings?.youtube_logo || "")
    setFieldValue("linkdin_logo", singleGloablSettings?.linkdin_logo || "")
    setFieldValue("pinterest_logo", singleGloablSettings?.pinterest_logo || "")
    setFieldValue("instagram_link", singleGloablSettings?.instagram_logo || "")
    setFieldValue("facebook_link", singleGloablSettings?.facebook_link || "")
    setFieldValue("x_link", singleGloablSettings?.x_link || "")
    setFieldValue("youtube_link", singleGloablSettings?.youtube_link || "")
    setFieldValue("linkdin_link", singleGloablSettings?.linkdin_link || "")
    setFieldValue("pinterest_link", singleGloablSettings?.pinterest_link || "")
    setFieldValue("bing_tracking_code", singleGloablSettings?.bing_tracking_code || "")
    setFieldValue("microsoft_clarity", singleGloablSettings?.microsoft_clarity || "")
    setFieldValue("id", singleGloablSettings?.id)
    setFieldValue("address", singleGloablSettings?.address)
    setFieldValue("header_text", singleGloablSettings?.header_text)
    setFieldValue("header_text_status", singleGloablSettings?.header_text_status)
  }, [isSuccess])

  return (
    <>
      <PageHeader
        titles="Settings"
        active="Global Settings"
        items={["Home"]}
        links={["/dashboard"]}
      />
      <Row>
        <Col>
          <Card>
            <Card.Body className="edit_product">
              <Form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
                handleScrollToError();
              }} className="add_category_form">
                <Row className="mb-4">
                  <Form.Group as={Col} md="6">
                    <Form.Label>
                      Google analytic ID
                      <span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="google_analytics_id"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.google_analytics_id}
                    />
                    {errors.google_analytics_id &&
                      touched.google_analytics_id ? (
                      <p className="text-danger">{errors.google_analytics_id}</p>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label>
                      Google Tag Manager
                      <span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="google_tag_manager"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.google_tag_manager}
                    />
                    {errors.google_tag_manager && touched.google_tag_manager ? (
                      <p className="text-danger">{errors.google_tag_manager}</p>
                    ) : null}
                  </Form.Group>
                </Row>

                <Row className="mb-4">
                  <Form.Group as={Col} md="6">
                    <Form.Label>
                      Google Search Console <span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="search_console"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.search_console}
                    />
                    {errors.search_console && touched.search_console ? (
                      <p className="text-danger">{errors.search_console}</p>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label>
                      Facebook Pixel <span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="facebook_pixel"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.facebook_pixel}
                    />
                    {errors.facebook_pixel && touched.facebook_pixel ? (
                      <p className="text-danger">{errors.facebook_pixel}</p>
                    ) : null}
                  </Form.Group>
                </Row>

                <Row className="mb-4">
                  <Form.Group as={Col} md="6">
                    <Form.Label>
                      Microsoft clarity <span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="microsoft_clarity"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.microsoft_clarity}
                    />
                    {errors.microsoft_clarity && touched.microsoft_clarity ? (
                      <p className="text-danger">{errors.microsoft_clarity}</p>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label>
                      Bing tracking code <span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="bing_tracking_code"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.bing_tracking_code}
                    />
                    {errors.bing_tracking_code && touched.bing_tracking_code ? (
                      <p className="text-danger">{errors.bing_tracking_code}</p>
                    ) : null}
                  </Form.Group>
                </Row>

                <Row>
                  <Form.Group as={Col} md="6">
                    <Form.Label>
                      Marketplace Name <span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="marketplace_name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.marketplace_name}
                    />
                    {errors.marketplace_name && touched.marketplace_name ? (
                      <p className="text-danger">{errors.marketplace_name}</p>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label>
                      Copyright Text
                      <span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="copy_right_text"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.copy_right_text}
                    />
                    {errors.copy_right_text && touched.copy_right_text ? (
                      <p className="text-danger">{errors.copy_right_text}</p>
                    ) : null}
                  </Form.Group>
                </Row>

                <Row className="mb-4">
                  <Form.Group as={Col} md="6">
                    <Form.Label>
                      Email
                      <span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                    />
                    {errors.email && touched.email ? (
                      <p className="text-danger">{errors.email}</p>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label>
                      Phone
                      <span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.phone}
                    />
                    {errors.phone && touched.phone ? (
                      <p className="text-danger">{errors.phone}</p>
                    ) : null}
                  </Form.Group>
                </Row>
                <Row className="mb-4">
                  <Form.Group as={Col} md="6">
                    <Form.Label>Alternate Phone</Form.Label>
                    <Form.Control
                      type="text"
                      name="alt_phone"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.alt_phone}
                    />
                    {errors.alt_phone && touched.alt_phone ? (
                      <p className="text-danger">{errors.alt_phone}</p>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>
                      WhatsApp Link<span className="text-danger">*</span>
                    </Form.Label>

                    <Form.Control
                      type="text"
                      name="whatsapp_link"
                      value={values.whatsapp_link}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.whatsapp_link && touched.whatsapp_link ? (
                      <p className="text-danger">{errors.whatsapp_link}</p>
                    ) : null}
                  </Form.Group>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>
                        Address <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        as={"textarea"}
                        name="address"
                        value={values?.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        rows={3}
                      />
                      {
                        errors?.address && touched?.address && (
                          <p className="text-danger">{errors?.address}</p>
                        )
                      }

                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Form.Group as={Col} md="6">
                    <Form.Label>Android App URL</Form.Label>
                    <Form.Control
                      type="text"
                      name="android_app_url"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.android_app_url}
                    />
                    {errors.android_app_url && touched.android_app_url ? (
                      <p className="text-danger">{errors.android_app_url}</p>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label>Iphone App URL</Form.Label>
                    <Form.Control
                      type="text"
                      name="iphone_app_url"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.iphone_app_url}
                    />
                    {errors.iphone_app_url && touched.iphone_app_url ? (
                      <p className="text-danger">{errors.iphone_app_url}</p>
                    ) : null}
                  </Form.Group>
                </Row>
                <Row className="mb-4">
                  <Form.Group as={Col} md="6">
                    <Form.Label>
                      Brand Logo
                      <span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control
                      type="file"
                      name="logo"
                      onChange={(event) => setFieldValue("logo", event.target.files[0])}
                      onBlur={handleBlur}
                    />
                    {errors.logo && touched.logo ? (
                      <p className="text-danger">{errors.logo}</p>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label>
                      Icon Image
                      <span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control
                      type="file"
                      name="icon_image"
                      onChange={(event) => setFieldValue("icon_image", event.target.files[0])}
                      onBlur={handleBlur}
                    />
                    {errors.icon_image && touched.icon_image ? (
                      <p className="text-danger">{errors.icon_image}</p>
                    ) : null}
                  </Form.Group>

                </Row>
                <Row>
                  <h4 className="my-2 fw-bold fs-5">Social Media</h4>
                  <Row>
                    <Form.Group as={Col} md="4">
                      <Form.Label>Media Name</Form.Label>
                      <Form.Control
                        type="text"
                        defaultValue={"Instagram"}
                        readOnly
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>Logo</Form.Label>
                      <Form.Control
                        type="file"
                        name="instagram_logo"
                        // value={values.instagram_logo}
                        onChange={(event) => setFieldValue("instagram_logo", event.target.files[0])}
                        onBlur={handleBlur}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>Links</Form.Label>
                      <Form.Control
                        type="text"
                        name="instagram_link"
                        value={values.instagram_link}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group as={Col} md="4">
                      <Form.Label>Media Name</Form.Label>
                      <Form.Control
                        type="text"
                        defaultValue={"Facebook"}
                        readOnly
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>Logo</Form.Label>
                      <Form.Control
                        type="file"
                        name="facebook_logo"
                        // value={values.facebook_logo}
                        onChange={(event) => setFieldValue("facebook_logo", event.target.files[0])}
                        onBlur={handleBlur}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>Links</Form.Label>
                      <Form.Control
                        type="text"
                        name="facebook_link"
                        value={values.facebook_link}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group as={Col} md="4">
                      <Form.Label>Media Name</Form.Label>
                      <Form.Control
                        type="text"
                        defaultValue={"X"}
                        readOnly
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>Logo</Form.Label>
                      <Form.Control
                        type="file"
                        name="x_logo"
                        // value={values.x_logo}
                        onChange={(event) => setFieldValue("x_logo", event.target.files[0])}
                        onBlur={handleBlur}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>Links</Form.Label>
                      <Form.Control
                        type="text"
                        name="x_link"
                        value={values.x_link}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group as={Col} md="4">
                      <Form.Label>Media Name</Form.Label>
                      <Form.Control
                        type="text"
                        defaultValue={"YouTube"}
                        readOnly
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>Logo</Form.Label>
                      <Form.Control
                        type="file"
                        name="youtube_logo"
                        // value={values.youtube_logo}
                        onChange={(event) => setFieldValue("youtube_logo", event.target.files[0])}
                        onBlur={handleBlur}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>Links</Form.Label>
                      <Form.Control
                        type="text"
                        name="youtube_link"
                        value={values.youtube_link}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group as={Col} md="4">
                      <Form.Label>Media Name</Form.Label>
                      <Form.Control
                        type="text"
                        defaultValue={"LinkedIn"}
                        readOnly
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>Logo</Form.Label>
                      <Form.Control
                        type="file"
                        name="linkdin_logo"
                        // value={values.linkdin_logo}
                        onChange={(event) => setFieldValue("linkdin_logo", event.target.files[0])}
                        onBlur={handleBlur}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>Links</Form.Label>
                      <Form.Control
                        type="text"
                        name="linkdin_link"
                        value={values.linkdin_link}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group as={Col} md="4">
                      <Form.Label>Media Name</Form.Label>
                      <Form.Control
                        type="text"
                        defaultValue={"Pinterest"}
                        readOnly
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>Logo</Form.Label>
                      <Form.Control
                        type="file"
                        name="pinterest_logo"
                        // value={values.pinterest_logo}
                        onChange={(event) => setFieldValue("pinterest_logo", event.target.files[0])}
                        onBlur={handleBlur}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>Links</Form.Label>
                      <Form.Control
                        type="text"
                        name="pinterest_link"
                        value={values.pinterest_link}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Form.Group>
                  </Row>
                  <Row className="mt-3">
                    <Col as={Col} md={12}>
                      <Form.Group>
                        <Row>
                          <Col as={Col} md={10}>
                            <Form.Label>Header Text</Form.Label>
                          </Col>
                          <Col as={Col} md={62}>
                            <label className="custom-switch">
                              <input
                                type="checkbox"
                                className="custom-switch-input"
                                name="header_text_status"
                                onChange={handleChange}
                                checked={values?.header_text_status ? true : false}
                              />
                              <span className="custom-switch-indicator custum-green-btn"></span>
                            </label>
                          </Col>
                        </Row>
                        <SunEditor
                          setOptions={options_for_sunEditor}
                          name="header_text"
                          setContents={values?.header_text}
                          // onChange={handleChange}
                          onChange={(content) => setFieldValue("header_text", content)}
                          onBlur={handleBlur}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                </Row>
                <Row>
                  <SeoForm
                    handleChange={handleChange}
                    values={values}
                    errors={errors}
                    handleBlur={handleBlur}
                    touched={touched}
                    readOnlyStatus={false}
                  />
                </Row>

                <Row>
                  <Col as={Col} md={6} className="mt-5 ms-5">
                    <Form.Group className="mb-0">
                      <Form.Check
                        type="checkbox"
                        id="checkout_status"
                        name="checkout_status"
                        value={values.checkout_status}
                        onChange={(e) =>
                          setFieldValue("checkout_status", e.target.checked)
                        }
                        onBlur={handleBlur}
                        className="mb-0"
                        checked={values.checkout_status}
                      />
                      <Form.Label htmlFor="checkout_status" className="mt-0">
                        Is Payable
                      </Form.Label>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-5">
                  {
                    showAddAndUpdate && (
                      <Button type="submit" className="btn-primary mx-auto w-auto">
                        Submit
                      </Button>
                    )
                  }
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row >
    </>
  );
}
