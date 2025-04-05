import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { closeModal } from "../../../redux/slices/allModalSlice";
import Loader from "../../../layouts/layoutcomponents/loader";
import { useDeleteCustomFieldValuesMutation, useGetCustomFieldValueQuery, useGetCustomFieldsValueDeletedItemsQuery, usePermanentDeleteCustomFieldValuesMutation, useRestoreCustomFieldValuesMutation } from "../../../redux/features/catalogueEndPoints";

export default function CustomFieldValueRestore() {
    const dispatch = useDispatch();
    const { isOpen, data, softDelete } = useSelector((state) => state.allCommonModal);
    const { refetch } = useGetCustomFieldValueQuery(data?.id);
    const { refetch: trashFetched } = useGetCustomFieldsValueDeletedItemsQuery(data?.id);
    const [restoreCustomFieldValues, { isLoading }] = useRestoreCustomFieldValuesMutation();
    const handleRestore = async () => {
        try {
            const res = await restoreCustomFieldValues(data?.row?.id)
            if (res?.data?.http_status_code === 200) {
                dispatch(closeModal());
                refetch()
                trashFetched()
                toast.success(res.data.message)
            }
        } catch (error) {
            console.error('hh', error);
            toast.error(error.message)
        }
    };
    return (
        <div>
            <Modal show={isOpen}>
                <Modal.Header className="modal_header bg-primary border-0 border-bottom-0">
                    <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
                        Restore Confirmation
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    Are Your Sure to Restore this data?
                    {isLoading && <Loader />}
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button className="btn btn-outline-default cancel_button" variant="" onClick={() => dispatch(closeModal())} >
                        Cancel
                    </Button>
                    <Button className="btn btn-primary" variant="primary" onClick={() => handleRestore()} >Restore</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
