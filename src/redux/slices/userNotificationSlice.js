import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: null
};
const userNotificationSlice = createSlice({
    name: 'userNotification',
    initialState,
    reducers: {
        userDetails: (state, action) => {
            state.data = action.payload.data;
        }
    },
})
export const { userDetails } = userNotificationSlice.actions
export default userNotificationSlice.reducer;