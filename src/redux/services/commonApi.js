import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { API_BASE_URL } from '../../utils/config';


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
        const data = result.data.data;
        if (result.error) {
            throw new Error(result.error.message || 'Unknown error occurred');
        } else {
            return { data };
        }
    } catch (error) {
        console.log('errrr..', error);
        return { error: error.message || 'Unknown error occurred' };
    }
};


export const commonApi = createApi({
    reducerPath: 'commonApi',
    baseQuery: baseQueryWithAuth,
    endpoints: builder => ({}),
});

