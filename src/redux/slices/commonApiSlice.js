import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { API_BASE_URL } from '../../utils/config';


const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    // prepareHeaders: async (headers) => {
    //     const accessToken = localStorage.getItem('green_spark_token');
    //     if (accessToken) {
    //         headers.set("Authorization", `Bearer ${accessToken}`);
    //     }
    //     headers.set('client-id', clientId);
    //     headers.set('client-key', clientKey);
    //     return headers;
    // },
});

const baseQueryWithAuth = async (args, api, extraOptions) => {
    await mutex.waitForUnlock();
    const data = await baseQuery(args, api, extraOptions);
    if (data) {
        if (data && data.meta.response.status === 200) {
            return data;
        } else {
            throw new Error(data.context?.error || 'Unknown error occurred');
        }
    } else {
        const errorData = result.error?.data;
        if (result.error) {
            const errorMessage = errorData?.context?.error || 'Unknown error occurred';
            throw new Error(errorMessage);
        }
        throw new Error('Network error occurred');
    }
};

export const commonDataSlice = createApi({
    reducerPath: 'commonDataSlice',
    baseQuery: baseQueryWithAuth,
    endpoints: builder => ({}),
});

