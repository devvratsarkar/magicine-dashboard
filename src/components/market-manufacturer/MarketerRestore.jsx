import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../redux/slices/allModalSlice";
import Loader from "../../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";
import { useGetManufactutrerQuery, useGetManufactutrerDeletedDataQuery, useRestoreManufactutrerMutation } from "../../redux/features/catalogueEndPoints";

export default function Restore() {
    const { isOpen, data } = useSelector((state) => state.allCommonModal);
    const { refetch } = useGetManufactutrerQuery();
    const { refetch: refchDeleted } = useGetManufactutrerDeletedDataQuery();
    const [restoreManufactutrer, { isLoading }] = useRestoreManufactutrerMutation()
    const dispatch = useDispatch();
    const handleRestore = async () => {
        try {
            const res = await restoreManufactutrer({ manufactutrerId: data.id });
            if (res.data.http_status_code === 200) {
                dispatch(closeModal());
                refetch()
                refchDeleted()
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
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
