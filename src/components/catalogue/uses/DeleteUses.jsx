import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useAddTrashUsesMutation, useDeleteTrashUsesMutation, useGetAllTrashUsesQuery, useGetAllUsesQuery } from "../../../redux/features/catalogueEndPoints";
import { closeModal } from "../../../redux/slices/allModalSlice";
import Loader from "../../../layouts/layoutcomponents/loader";

export default function DeleteUses() {
    const dispatch = useDispatch();
    const { refetch } = useGetAllUsesQuery();
    const { refetch: trashFetched } = useGetAllTrashUsesQuery();
    const { isOpen, data, softDelete } = useSelector((state) => state.allCommonModal);
    const [addTrashUses, { isLoading }] = useAddTrashUsesMutation();
    const [deleteTrashUses, { isLoading: loading }] = useDeleteTrashUsesMutation();
    const handleDelte = async () => {
        try {
            const res = softDelete ? await addTrashUses(data?.id) : await deleteTrashUses(data?.id);
            if (res?.data?.http_status_code === 200) {
                dispatch(closeModal());
                refetch()
                trashFetched()
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    };

    return (
        <>
            {isLoading && <Loader /> || loading && <Loader />}
            <Modal show={isOpen}>
                <Modal.Header className="modal_header border-0 border-bottom-0">
                    <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
                        Delete Confirmation
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {softDelete ? <p>Are Your Sure you want to delete this data?</p> : <p>Are Your Sure you want to delete this data permanently?</p>}

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
        </>
    );
}
