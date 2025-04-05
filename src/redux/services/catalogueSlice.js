import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../utils/config';
import toast from 'react-hot-toast';


const selectToken = state => state.auth.token;
const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: async (headers, { getState }) => {
        const token = selectToken(getState());
        headers.set('client-id', '');
        headers.set('client-key', '');
        headers.set('Authorization', `Bearer ${token}`);
        return headers;
    },
});

const baseQueryWithAuth = async (args, api, extraOptions) => {
    try {
        const result = await baseQuery(args, api, extraOptions);
        if (result.error) {
            toast.error(result?.error?.data?.message)
            throw new Error(result?.error?.data?.message || result?.error?.error);
        } else {
            return { data: result.data };
        }
    } catch (error) {
        return { error: error.message || 'error2' };
    }
};


export const catalogueSlice = createApi({
    reducerPath: 'catalogueSlice',
    baseQuery: baseQueryWithAuth,
    endpoints: builder => ({}),
});

