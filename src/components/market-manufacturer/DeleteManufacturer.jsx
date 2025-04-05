import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../redux/slices/allModalSlice";
import Loader from "../../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";
import { useGetManufactutrerQuery, useDeleteManufactutrerMutation, usePermanentDeleteManufactutrerMutation, useGetManufactutrerDeletedDataQuery } from "../../redux/features/catalogueEndPoints";

export default function DeleteManufacturer() {
    const { refetch } = useGetManufactutrerQuery();
    const { refetch: refetchDeleted } = useGetManufactutrerDeletedDataQuery();
    const { isOpen, data, softDelete } = useSelector((state) => state.allCommonModal);
    const [deleteManufactutrer, { isLoading }] = useDeleteManufactutrerMutation();
    const [permanentDeleteManufactutrer, { isLoading: loading }] = usePermanentDeleteManufactutrerMutation();
    const dispatch = useDispatch();
    const handleDelte = async () => {
        try {
            const res = softDelete ? await deleteManufactutrer({ manufactutrerId: data.id }) : await permanentDeleteManufactutrer({ manufactutrerId: data.id });
            console.log("res", res)
            if (res.data.http_status_code === 200) {
                dispatch(closeModal());
                refetch()
                refetchDeleted()
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
                    {isLoading && <Loader /> || loading && <Loader />}
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
