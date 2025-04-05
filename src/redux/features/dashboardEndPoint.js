import { catalogueSlice } from "../services/catalogueSlice";

export const dashboardEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardData: builder.query({
            query: () => `/dashboard-data`
        }),
        getIncomeData: builder.query({
            query: ({ period }) => `/get-income-data?period=${period}`
        }),
        getOrderData: builder.query({
            query: () => `get-order-data`
        }),
        getCompleteDashBoardData: builder.query({
            query: ({ period, fromDate, toDate }) => `/get-dashboard-data?period=${period}&fromDate=${fromDate}&toDate=${toDate}`
        })

    }),
});

export const { useGetDashboardDataQuery, useGetIncomeDataQuery, useGetOrderDataQuery ,useGetCompleteDashBoardDataQuery} = dashboardEndPoint;
