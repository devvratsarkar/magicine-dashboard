import { configureStore } from "@reduxjs/toolkit";
import { commonDataSlice } from "./slices/commonApiSlice";
import allModalSlice from "./slices/allModalSlice";
import userNotificationSlice from "./slices/userNotificationSlice";
import authSlice from './slices/authSlice'
import { commonApi } from "./services/commonApi";
import { catalogueSlice } from "./services/catalogueSlice";
export const store = configureStore({
    reducer: {
        [commonApi.reducerPath]: commonApi.reducer,
        [catalogueSlice.reducerPath]: catalogueSlice.reducer,
        auth: authSlice,
        allCommonModal: allModalSlice,
        userNotification: userNotificationSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(commonApi.middleware, catalogueSlice.middleware),
    devTools: true
})