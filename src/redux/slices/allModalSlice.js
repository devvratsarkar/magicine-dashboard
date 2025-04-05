import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpen: false,
    componentName: null,
    data: null,
    endPoint: null,
    previousComponent: null,
    softDelete: null,
};

const allCommonModalSlice = createSlice({
    name: "allCommonModal",
    initialState,
    reducers: {
        openModal: (state, action) => {
            state.isOpen = true;
            state.componentName = action.payload.componentName;
            state.data = action.payload.data;
            state.endPoint = action.payload.endPoint;
            state.previousComponent = action.payload.previousComponent;
            state.softDelete = action.payload.softDelete;
        },
        closeModal: (state, action) => {
            state.isOpen = false;
            state.softDelete = null;
            state.componentName = null;
            state.data = null;
            state.endPoint = null;
            state.previousComponent = null;
        }
    }
});

export const { openModal, closeModal } = allCommonModalSlice.actions;
export default allCommonModalSlice.reducer;
