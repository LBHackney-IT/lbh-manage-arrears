import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { INCOME_SERVER, DOCUMENT_ENTITY, CASE_ENTITY, NOTIFICATION_ENTITY } from '../constants'
import type { CaseActionCode, CaseCourtOutcome} from '../constants'

type CaseQuery = {
  page_number: number,
  number_per_page: number
}

export type CaseLatestAction = {
  "code": CaseActionCode,
  "date": string
}

export type Case = {
  "ref": string,
  "current_balance": {
    "value": number
    "currency_code": string
  },
  "current_arrears_agreement_status": null | 'cancelled' | 'breached',
  "latest_action": CaseLatestAction,
  "primary_contact": {
    "name": string,
    "short_address": string,
    "postcode": string,
  },
  "balance": string,
  "days_in_arrears": null,
  "days_since_last_payment": null,
  "nosp_served": boolean | null,
  "active_nosp": boolean | null,
  "courtdate": string | null,
  "court_outcome": CaseCourtOutcome,
  "eviction_date": null,
  "classification": "send_letter_one" | "check_data" | "update_court_outcome_action" | "send_informal_agreement_breach_letter" | "address_court_agreement_breach",
  "patch_code": string,
  "pause": {
    "reason": null | "Other",
    "comment": string | null
    "until": string | null
  }
}

export type CaseResponse = {
  cases: Array<Case>,
  number_of_pages: number
}

// FIXME API key could be eaten up
// https://stackoverflow.com/questions/70612229/react-redux-rtk-mutation-cors-error-in-aws-api-gateway-with-api-key
export const incomeApi = createApi({
  reducerPath: 'incomeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: INCOME_SERVER,
    prepareHeaders: (headers) => {
      headers.set('Authorization', '[Get bearer token by auth process]')
      headers.set('x-api-key', process.env.NEXT_PUBLIC_AWS_SECRET_KEY as string)
      console.log('check headers', process.env.NEXT_PUBLIC_AWS_SECRET_KEY)
      return headers
    }
  }),
  endpoints: (builder) => ({
    getCases: builder.query({
      query: (query) => ({
        url: `${CASE_ENTITY}`,
        params: {
          page_number: `${query.page_number}`,
          number_per_page: `${query.number_per_page}`
        }
      })
    }),
    getNotifications: builder.query({
      query: () => ({
        url: `${NOTIFICATION_ENTITY}`,
      })
    })
  }),
});

export const { useGetCasesQuery, useGetNotificationsQuery } = incomeApi
export const { getCases } = incomeApi.endpoints
