import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Loader from "../../layouts/layoutcomponents/loader";
import { closeModal } from "../../redux/slices/allModalSlice";
import { useDeleteSubscribersMutation, useGetAllSubscribersQuery } from "../../redux/features/customerDataEndPoints";

export default function DeleteSubscribers() {
    const dispatch = useDispatch();
    const queryParams = {
        email: '',
        fromDate: '',
        toDate: '',
    }
    const { refetch } = useGetAllSubscribersQuery(queryParams);
    const { isOpen, data } = useSelector((state) => state.allCommonModal);
    const [deleteSubscribers, { isLoading }] = useDeleteSubscribersMutation();
    const handleDelte = async () => {
        try {
            const res = await deleteSubscribers(data.id);
            if (res?.data?.http_status_code === 200) {
                dispatch(closeModal());
                refetch()
                toast.success(res.data.message)
            }
        } catch (error) {
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
                    {isLoading && <Loader />}
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
