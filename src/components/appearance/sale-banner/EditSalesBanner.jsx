import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { salesBannerSchema } from "../../../commondata/formvalidations";
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../../../redux/slices/allModalSlice";
import { Link } from "react-router-dom";
import { useGetSalesBannerIDQuery, useGetSalesBannerQuery, useUpdateSalesBannerMutation } from "../../../redux/features/cmsEndPoints";
import { toast } from "react-hot-toast";

const EditSalesBanner = () => {
  const dispatch = useDispatch();
  const [viewThumbnail, setViewThumbnail] = useState(true);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const { isOpen, data: salesBanner } = useSelector((state) => state.allCommonModal);
  const { data, isError, error, isLoading, isFetching, isSuccess } = useGetSalesBannerIDQuery(salesBanner?.id);
  const { refetch } = useGetSalesBannerQuery()
  const [updateSalesBanner, { isLoading: loading }] = useUpdateSalesBannerMutation();
  const bannerData = data?.data?.banner;

  const initialValues = {
    banner_image: bannerData?.banner_image || "",
    link: bannerData?.link || "",
  };

  const {
    values,
    errors,
    handleBlur,
    touched,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: salesBannerSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });
      try {
        const response = await updateSalesBanner({ formType: formData, bannerID: salesBanner.id });
        if (response?.data?.http_status_code === 200) {
          toast.success(response.data.message);
          refetch();
          // resetForm()
          dispatch(closeModal())
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  useEffect(() => {
    if (bannerData) {
      setFieldValue("banner_image", bannerData.banner_image);
      setFieldValue("link", bannerData.link);
    }
  }, [bannerData, setFieldValue]);

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];

    if (file && /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
      setFieldValue("banner_image", file);

      setViewThumbnail(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedThumbnail(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Invalid file type. Only JPG, JPEG, PNG, and WEBP files are allowed.");
      event.target.value = null;
    }
  };


  return (
    <>
      <Modal show={isOpen}>
        <Modal.Header className="justify-content-center mx-2">
          <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
            Edit Sale Banner
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
          <Form className="border p-4 rounded-2 p-2 overflow-hidden" onSubmit={handleSubmit}>
            <Form.Group md="4">
              <Form.Label> Banner Image (JPG,JPEG,PNG)<span className="required_icon">*</span></Form.Label>
              <Row>
                <Col as={Col} md={3} className="d-flex justify-content-center">
                  {viewThumbnail ? (
                    bannerData && bannerData.banner_image ? (
                      <div className="position-relative">
                        <Link to={"/view-images"}>
                          <img src={bannerData.banner_image} alt="error" width={50} height={50} />
                        </Link>
                        <span className="position-absolute">
                          <button
                            className="p-0 px-1"
                            onClick={() => {
                              setViewThumbnail(false);
                              setFieldValue("banner_image", null);
                            }}
                          >
                            <i className="icon icon-close text-danger"></i>
                          </button>
                        </span>
                      </div>
                    ) : null
                  ) : (
                    <div className="position-relative">
                      <img src={selectedThumbnail} alt="error" width={50} height={50} />
                    </div>
                  )}
                </Col>
                <Col as={Col} md={9}>
                  <Form.Control
                    type="file"
                    name="banner_image"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleThumbnailChange}
                    onBlur={handleBlur}
                  />
                  {errors.banner_image && touched.banner_image ? (
                    <p className={`error`}>{errors.banner_image}</p>
                  ) : null}
                </Col>
              </Row>
            </Form.Group>
            <Row className="pb-3">
              <Form.Label>
                Link <span className="required_icon">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="link"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.link}
              />
              {errors.link && touched.link ? (
                <p className={`error`}>{errors.link}</p>
              ) : null}
            </Row>
            <Row className="pb-3">
              <Button type="submit" className="btn ms-auto w-auto">
                Submit
              </Button>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditSalesBanner;
