import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useGetAllTrashUsesQuery, useGetAllUsesQuery, useRestoreTrashUsesMutation } from "../../../redux/features/catalogueEndPoints";
import { closeModal } from "../../../redux/slices/allModalSlice";
import Loader from "../../../layouts/layoutcomponents/loader";

export default function UsesRestore() {
    const { isOpen, data, } = useSelector((state) => state.allCommonModal);
    const [brandRestore, { isLoading }] = useRestoreTrashUsesMutation()
    const { refetch } = useGetAllUsesQuery();
    const { refetch: refchDeleted } = useGetAllTrashUsesQuery();

    const dispatch = useDispatch();
    const handleRestore = async () => {
        try {
            const response = await brandRestore(data.id);
            if (response?.data?.http_status_code === 200) {
                toast.success(response.data.message)
                refetch()
                refchDeleted()
                dispatch(closeModal())
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message)
        }

    };
    return (
        <>
            {isLoading && <Loader />}
            <Modal show={isOpen}>
                <Modal.Header className="modal_header bg-primary border-0 border-bottom-0">
                    <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
                        Restore Confirmation
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    Are Your Sure to Restore this data?
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button className="btn btn-outline-default cancel_button" variant="" onClick={() => dispatch(closeModal())} >
                        Cancel
                    </Button>
                    <Button className="btn btn-primary" variant="primary" onClick={() => handleRestore()} >Restore</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
