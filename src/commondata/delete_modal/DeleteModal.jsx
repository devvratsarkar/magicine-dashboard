import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../redux/slices/allModalSlice";
import Loader from "../../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";
import { publicRequest } from "../../utils/baseApi";
import { useGetManufactutrerQuery, useGetTagsQuery, useGetManufactutrerDeletedDataQuery, useGetBrandQuery, useGetBrandsDeletedDataQuery } from "../../redux/features/catalogueEndPoints";

export default function DeleteModal() {
  const { isOpen, data, softDelete, previousComponent, endPoint } = useSelector((state) => state.allCommonModal);
  const { refetch } = previousComponent === 'tagDataTable' && useGetTagsQuery();
  const [loader, setLoader] = useState(false)
  const dispatch = useDispatch();
  // console.log('',softDelete);
  const token = useSelector((state) => state.auth.token);
  const handleDelte = async () => {
    try {
      setLoader(true)
      const res = softDelete ? await publicRequest.put(`${endPoint}/${data.id}`, {},
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        }
      ) : await publicRequest.delete(`${endPoint}/${data.id}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        }
      );
      if (res.data.http_status_code === 200) {
        dispatch(closeModal());
        refetch()
        refetchDeleted()
        toast.success(res.data.message)
        setLoader(false)
      }
    } catch (error) {
      setLoader(false)
      console.log('hh', error);
      toast.error(error.message)
    }

  };
  return (
    <div>
      <Modal show={isOpen}>
        <Modal.Header className="modal_header border-0 border-bottom-0">
          <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
            Delete Confirmation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          Are Your Sure to delete this data?
          {loader && <Loader />}
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button className="btn btn-outline-default cancel_button" variant="" onClick={() => dispatch(closeModal())} >
            Cancel
          </Button>
          <Button className="btn btn-danger" variant="danger" onClick={() => handleDelte()} >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
