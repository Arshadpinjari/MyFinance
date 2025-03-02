import { apiSlice } from "../apiSlice";
import { INCOMES_URL } from "../endpoints";

export const incomeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllIncomes: builder.query({
      query: () => ({
        url: `${INCOMES_URL}/all`,
        method: "GET",
        credentials: "include", // ✅ Fix: Cookies अब Send होंगी
      }),
    }),
    addIncome: builder.mutation({
      query: (data) => ({
        url: `${INCOMES_URL}`,
        method: "POST",
        body: data,
        credentials: "include", // ✅ Fix: Authentication issue resolve
      }),
    }),
    updateIncome: builder.mutation({
      query: ({ _id, data }) => ({
        url: `${INCOMES_URL}/${_id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    deleteIncome: builder.mutation({
      query: (_id) => ({
        url: `${INCOMES_URL}/${_id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
    getIncome: builder.query({
      query: ({ page = 1, pageSize = 10 }) => ({
        url: `${INCOMES_URL}?page=${page}&pageSize=${pageSize}`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetAllIncomesQuery,
  useUpdateIncomeMutation,
  useDeleteIncomeMutation,
  useGetIncomeQuery,
  useAddIncomeMutation,
} = incomeApiSlice;
