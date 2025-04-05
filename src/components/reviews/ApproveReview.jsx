import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { closeModal } from '../../redux/slices/allModalSlice';
import { useGetReviewsDataQuery, useGetSelectedReviewsQuery, useReviewStatusTrueMutation } from '../../redux/features/catalogueEndPoints';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function ApproveReview() {
    const { isOpen, data } = useSelector((state) => state.allCommonModal)
    const navigate = useNavigate()

    const dispatch = useDispatch()
    const [statusTrue, isLoading] = useReviewStatusTrueMutation()
    const { refetch } = useGetReviewsDataQuery()
    const { refetch: refetchSingleReviewPage } = useGetSelectedReviewsQuery({ modelType: data?.modelType, productId: data?.product });
    const statusChange = async () => {
        try {
            const response = await statusTrue(data?.id);

            if (response?.data?.http_status_code === 200) {
                refetch();
                refetchSingleReviewPage()
                navigate("/reviews")
                dispatch(closeModal())
                toast.success(response.data.message);
            }
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <>
            <Modal show={isOpen}>
                <Modal.Header className="modal_header-cancellation border-0 border-bottom-0 pb-0">
                    <Modal.Title>Approve</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='text-center'>Are you sure you want to Approve this review?</div>
                </Modal.Body>
                <Modal.Footer className='p-1'>
                    <Button className="btn-light border border-dark" variant="" onClick={() => dispatch(closeModal())}>Cancel</Button>
                    <Button className="btn-primary" variant="" onClick={() => statusChange()}>Approve</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ApproveReview