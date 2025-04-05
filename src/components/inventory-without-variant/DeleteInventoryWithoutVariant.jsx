import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Loader from "../../layouts/layoutcomponents/loader";
import { closeModal } from "../../redux/slices/allModalSlice";
import { useDeleteInventoryWithoutVariantMutation, useGetAllInventoryWithoutVariantQuery, useGetDeletedInventoryWithoutVariantQuery, usePermanentDeleteInventoryWithoutVariantMutation } from "../../redux/features/stockInventoryEndPoint";

export default function DeleteInventoryWithoutVariant() {
    const dispatch = useDispatch();
    const [queryParam, setQueryParam] = useState({
        medicinepage: "" || 1,
        medicinelimit: "" || 10,
        medicinesearch: "",
        productpage: "" || 1,
        productlimit: "" || 10,
        productsearch: "",
        equipmentpage: "" || 1,
        equipmentlimit: "" || 10,
        equipmentsearch: "",
    })

    const { isOpen, data, softDelete } = useSelector((state) => state.allCommonModal);
    const [deleteInventoryWithoutVariant, { isLoading }] = useDeleteInventoryWithoutVariantMutation();
    const [permanentDeleteInventoryWithoutVariant, { isLoading: loading }] = usePermanentDeleteInventoryWithoutVariantMutation();
    const { refetch } = useGetAllInventoryWithoutVariantQuery(queryParam);
    const { refetch: trashFetched } = useGetDeletedInventoryWithoutVariantQuery();
    const handleDelte = async () => {
        try {
            const res = softDelete ? await deleteInventoryWithoutVariant({ inventoryWithoutVarientId: data.id }) : await permanentDeleteInventoryWithoutVariant({ inventoryWithoutVarientId: data.id });
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
    );
}
