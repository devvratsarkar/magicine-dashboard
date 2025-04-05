import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../redux/slices/allModalSlice";
import Loader from "../../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";
import { useDeleteBrandMutation, useGetBrandQuery, useGetBrandsDeletedDataQuery, usePermanentDeleteBrandMutation } from "../../redux/features/catalogueEndPoints";

export default function DeleteBrand() {
    const dispatch = useDispatch();
    const [queryBrand, setQuerybrand] = useState({
        type: "",
        status: ""
    })
    const { refetch } = useGetBrandQuery(queryBrand);
    const { refetch: trashFetched } = useGetBrandsDeletedDataQuery();
    const { isOpen, data, softDelete } = useSelector((state) => state.allCommonModal);
    const [deleteBrand, { isLoading }] = useDeleteBrandMutation();
    const [permanentDeleteBrand, { isLoading: loading }] = usePermanentDeleteBrandMutation();
    const handleDelte = async () => {
        try {
            const res = softDelete ? await deleteBrand({ brandId: data.id }) : await permanentDeleteBrand({ brandId: data.id });
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
        <div>
            <Modal show={isOpen}>
                <Modal.Header className="modal_header border-0 border-bottom-0">
                    <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
                        Delete Confirmation
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {softDelete ? <p>Are Your Sure you want to delete this data?</p> : <p>Are Your Sure you want to delete this data permanently?</p>}

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
