import { catalogueSlice } from "../services/catalogueSlice";

export const settingsEndPoings = catalogueSlice.injectEndpoints({
  endpoints: (builder) => ({
    addUpdateGloablSettings: builder.mutation({
      query: (globalSettingData) => ({
        url: `/update-global-setting`,
        method: "POST",
        body: globalSettingData,
      }),
    }),
    getGlobalSetting: builder.query({
      query: () => `/get-global`,
    }),
    addUpdateCurrency: builder.mutation({
      query: (currencyData) => ({
        url: `add-update-currency`,
        method: 'POST',
        body: currencyData,
      }),
    }),
    getCurrency: builder.query({
      query: () => '/get-currency'
    })
  }),
});

export const { useAddUpdateGloablSettingsMutation, useGetGlobalSettingQuery, useAddUpdateCurrencyMutation, useGetCurrencyQuery } =
  settingsEndPoings;
