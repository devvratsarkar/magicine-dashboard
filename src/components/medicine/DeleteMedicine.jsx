import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Loader from "../../layouts/layoutcomponents/loader";
import { closeModal } from "../../redux/slices/allModalSlice";
import { useDeleteMedicineMutation, useGetDeletedMedicinesQuery, useGetMedicinesQuery, usePermanentlyDeleteMedicineMutation } from "../../redux/features/productEndPoints";

export default function DeleteMedicine() {
    const dispatch = useDispatch();
    const [queryParams, setQueryParams] = useState({
        brand: '',
        marketer: '',
        status: '',
        fromDate: '',
        toDate: '',
        search: '',
        page: 1,
        limit: 10
    });
    const { refetch } = useGetMedicinesQuery(queryParams);
    const { refetch: trashFetched } = useGetDeletedMedicinesQuery();
    const { isOpen, data, softDelete } = useSelector((state) => state.allCommonModal);
    const [deleteMedicine, { isLoading }] = useDeleteMedicineMutation();
    const [permanentlyDeleteMedicine, { isLoading: loading }] = usePermanentlyDeleteMedicineMutation();
    const handleDelte = async () => {
        try {
            const res = softDelete ? await deleteMedicine({ medicineId: data.id }) : await permanentlyDeleteMedicine({ medicineId: data.id });
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
                <Modal.Header className="modal_header border-0 border-bottom-0">
                    <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
                        Delete Confirmation
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    Are Your Sure to delete this medicine?
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
