import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Loader from "../../../layouts/layoutcomponents/loader";
import { closeModal } from "../../../redux/slices/allModalSlice";
import { useBlogBlukDeleteMutation, useDeleteBlogMutation, useGetAllBlogsQuery, useGetDeltedBlogsQuery, usePermanentDeleteBlogMutation } from "../../../redux/features/blogsEndPoints";

export default function BulkDelete() {
    const dispatch = useDispatch();
    const { refetch } = useGetAllBlogsQuery();
    const { isOpen, data } = useSelector((state) => state.allCommonModal);

    const [blogBulkDelete, { isLoading: loadingBulkDelete }] = useBlogBlukDeleteMutation()

    const handleDelte = async () => {
        try {
            const resp = await blogBulkDelete({ ids: data })

            if (resp?.data?.http_status_code === 200) {
                toast.success(resp?.data?.message)
                refetch()
                dispatch(closeModal())
            } else {
                toast.error(resp?.data?.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    };
    return (
        <>
            {loadingBulkDelete && <Loader />}
            <Modal show={isOpen}>
                <Modal.Header className="modal_header border-0 border-bottom-0">
                    <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
                        Delete Confirmation
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    Are Your Sure to delete this data?
                    {/* {isLoading && <Loader /> || loading && <Loader />} */}
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
        </>);
}
