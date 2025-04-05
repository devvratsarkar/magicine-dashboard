import React, { useState, useRef, useEffect } from "react";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { Button, Form, Row, Col, InputGroup, Dropdown } from "react-bootstrap";
import { useFormik } from "formik";
import { AddBlogsValidation } from "../../commondata/formvalidations";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { options_for_sunEditor } from "../../commondata/formEditorOptions";
import slugify from "slugify";
import TagInput from "rsuite/TagInput";
import "rsuite/TagInput/styles/index.css";
import SeoForm from "../seo-page/SeoForm"
import { useAddNewBlogMutation, useGetAllBlogsCategoryQuery, useGetAllBlogsQuery, useGetAllBlogsTagsQuery, useGetPreviewLinkMutation } from "../../redux/features/blogsEndPoints";
import toast from "react-hot-toast";
import Loader from "../../layouts/layoutcomponents/loader";
import Select from "react-select";
import CreatableSelect from 'react-select/creatable';
import { TreeSelect } from "antd";
import { useNavigate } from "react-router-dom";
import { getBlogsPage } from "../../utils/routes";
import { MEDIA_BASE_URL, USER_BASE_URL } from "../../utils/config";


export default function AddBlogsForm() {
  const [addNewBlog, { isLoading }] = useAddNewBlogMutation()
  const [previewLink, { isLoading: loadingPreview }] = useGetPreviewLinkMutation()
  const { data: tags } = useGetAllBlogsTagsQuery()
  const { data: category } = useGetAllBlogsCategoryQuery()
  const { refetch } = useGetAllBlogsQuery()
  const tagData = tags?.data
  const categoryData = category?.data?.GetBlogCategory;
  const navigate = useNavigate()
  const initialValues = {
    title: "",
    banner_image: "",
    status: true,
    slug: "",
    tags: [],
    excerpt: "",
    category: null,
    content: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    og_tag: "",
    schema_markup: "",
  };
  const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, setFieldTouched, validateForm } = useFormik({
    initialValues: initialValues,
    validationSchema: AddBlogsValidation,
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'tags') {
          value.forEach(tag => {
            formData.append('tags', tag.label);
          })
        } else if (key === 'category') {
          value.forEach(cate => {
            formData.append('category', cate.value);
          })
        }
        else {
          formData.append(key, value);
        }
      });
      try {
        const response = await addNewBlog(formData);
        if (response?.data?.http_status_code === 200) {
          toast.success(response.data.message)
          refetch()
          navigate(`${getBlogsPage()}`)
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
  const generateSlug = (values) => {
    const slug = slugify(values, { lower: true });
    setFieldValue("slug", slug);
  };

  const handleBlogSlug = (event) => {
    handleChange(event);
    generateSlug(event.target.value);
  };


  const generateOgTag = () => {

    const ogTag = `<meta property="og:type" content="website"><meta property="og:title" content='${values.meta_title || "undefined"}'><meta property="og:description" content="${values.meta_description || "undefined"}"><meta property="og:url" content="${USER_BASE_URL}/blogs/${values.slug || "undefined"}"><meta property="og:site_name" content="Magicine Pharma"><meta property="og:image" content="${MEDIA_BASE_URL}/public/media/images/1727083604842-354890b1-3d75-4ccd-a85a-0eebc8688c16.png">`

    setFieldValue("og_tag", ogTag)
  }

  useEffect(() => {

    if (values.title) {
      setFieldValue("meta_title", values.title);
    }
    if (values.content) {
      const plainText = values.content.replace(/<[^>]+>/g, "");
      const truncatedText = plainText.substring(0, 160);
      setFieldValue("meta_description", truncatedText);
    }

    // if (values.meta_title && values.meta_description) {
    generateOgTag();
    // }
  }, [values.content, values.title]);


  const tagOptions = Array.isArray(tagData) && tagData ? tagData.map(tag => ({
    value: tag?.id,
    label: tag?.name,
  })) : [];

  const options = categoryData ? categoryData.map(category => ({
    value: category?.id,
    label: category?.name
  })) : [];


  const handlePreview = async () => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'tags') {
        value.forEach(tag => {
          formData.append('tags', tag.label);
        });
      } else if (key === 'category') {
        value.forEach(cate => {
          formData.append('category', cate.value);
        });
      } else {
        formData.append(key, value);
      }
    });

    try {
      const response = await previewLink(formData);

      console.log("response", response);
      if (response?.data?.http_status_code === 201) {
        toast.success(response?.data?.message)
        console.log("response?.data?.data", response?.data?.data);
        window.open(`${USER_BASE_URL}/blogs/${response?.data?.data}`)
      } else {
        toast.error(response?.data?.message)

      }

    } catch (error) {
      console.error("error:", error);
    }
  };


  return (
    <>
      <Form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
        handleScrollToError();
      }} className="add_category_form">
        {isLoading && <Loader />}
        <Row className="mb-4">
          <Form.Group as={Col} md="4">
            <Form.Label>
              Title <span className="required_icon">*</span>
            </Form.Label>
            <Form.Control
              title="text"
              name="title"
              onChange={handleBlogSlug}
              onBlur={handleBlur}
              value={values.title}
            />
            {errors.title && touched.title ? (
              <p className={`error`}>{errors.title}</p>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} md="4">
            <Form.Label>
              Banner Image (JPG,JPEG,PNG,2MB Size)
              <span className="required_icon">*</span>
            </Form.Label>
            <Form.Control
              type="file"
              name="banner_image"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file && /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
                  setFieldValue("banner_image", file);
                } else {
                  toast.error("Invalid file type. Only JPG, JPEG, PNG, and WEBP files are allowed.");
                  e.target.value = null;
                }
              }}
              onBlur={handleBlur}
            // value={values.banner_image}
            />
            {errors.banner_image && touched.banner_image ? (
              <p className={`error`}>{errors.banner_image}</p>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} md="4">
            <Form.Label>
              Status <span className="required_icon">*</span>
            </Form.Label>
            <Form.Select
              name="status"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.status}
            >
              <option value="">select</option>
              <option value="true">Active</option>
              <option value="false">Inavtive</option>
            </Form.Select>
            {errors.status && touched.status ? (
              <p className={`error`}>{errors.status}</p>
            ) : null}
          </Form.Group>
        </Row>
        <Row className="mb-6">
          <Form.Group as={Col} md="4">
            <Form.Label>
              Slug <span className="required_icon">*</span>
            </Form.Label>
            <Form.Control
              title="text"
              name="slug"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.slug}
            />
            {errors.slug && touched.slug ? (
              <p className={`error`}>{errors.slug}</p>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} md="4">
            <Form.Label>
              Excerpt <span className="required_icon">*</span>
            </Form.Label>
            <Form.Control
              title="text"
              name="excerpt"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.excerpt}
            />
            {errors.excerpt && touched.excerpt ? (
              <p className={`error`}>{errors.excerpt}</p>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} md="4">
            <Form.Label>Category <span className="required_icon">*</span></Form.Label>
            <Select
              options={options}
              name="category"
              value={values.category}
              onChange={(selectedOptions) =>
                setFieldValue("category", selectedOptions)
              }
              onBlur={handleBlur}
              isMulti
              className="select_box rounded-4"
              isSearchable
            // closeMenuOnSelect={false}
            />
            {errors.category && touched.category ? (
              <p className={`error`}>{errors.category}</p>
            ) : null}
          </Form.Group>
        </Row>
        <Row className="mb-6">
          <Form.Group as={Col} md="12">
            <Form.Label>Tags</Form.Label>
            <CreatableSelect
              options={tagOptions}
              name="tags"
              value={tagOptions.find(option => option.value === values.tags)}
              onChange={(selectedOption) => setFieldValue("tags", selectedOption)}
              onBlur={handleBlur}
              className="rounded-4"
              isSearchable
              placeholder="Add Tags..."
              isMulti
            />
          </Form.Group>
        </Row>


        <Row className="mb-6">
          <Form.Group as={Col} md="12">
            <Form.Label>
              Content <span className="required_icon">*</span>
            </Form.Label>
            <SunEditor
              name="content"
              onChange={(content) => setFieldValue("content", content)}
              onBlur={() => setFieldTouched("content", true)}
              setContents={values.content}
              setOptions={options_for_sunEditor}
            />
            {errors.content && touched.content ? (
              <p className={`error`}>{errors.content}</p>
            ) : null}
          </Form.Group>
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
        <Row className="mt-4">
          <Col as={Col} md={6} className="text-end">
            <Button
              type="submit"
              className="btn-primary mx-auto w-auto"
            >
              Save
            </Button>
          </Col>
          <Col as={Col} md={6}>
            <Button variant="secondary" onClick={handlePreview}>
              Preview
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
