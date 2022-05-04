import type { NextPage } from 'next'
import type { ReactNode } from 'react'
import { Tabs, useTabs, Typography, Sorts, useSorts, Table, Button, PageContainer, Link, Select } from '@hackney/mtfh-finance-components'
import styles from './index.module.scss';
import { useRouter } from 'next/router';
import { useGetCasesQuery, getCases, incomeApi } from '../services/income';
import type { CaseResponse, CaseLatestAction, Case } from '../services/income'
import type { CaseActionCode, CaseCourtOutcome } from '../constants'
import { COURT_OUTCOME_CODE_DICT, ACTION_CODE_UI_TEXT_DICT } from '../constants'
import { format } from 'date-fns'
import { storeWrapper } from '../store';
import { usePagination } from '../hooks/index'
import { mockData } from '../mock';
import Header from 'components/Header'

// REF https://github.com/LBHackney-IT/LBH-IncomeCollection_Pre/blob/761098c8368054db3cf5c9022d7332629625dabe/lib/hackney/income/use_case_factory.rb#L95
const Home: NextPage = () => {
  const { data, isLoading, error } = useGetCasesQuery({
    page_number: 1,
    number_per_page: 50
  })

  const router = useRouter()

  type TableTabBuilderOptions = {
    action?: boolean,
    sort?: boolean,
    pagination?: boolean,
    excludeColumns?: Array<string>
  }

  type TableTabBuilder = (data: CaseResponse, options?: TableTabBuilderOptions) => ReactNode

  const handleSendNoSp = (ref: string) => () => {
  
  }

  const handleUnpause = (ref: string) => () => {

  }

  const mkTableTab: TableTabBuilder = (data, options) => {
    options = {
      action: false,
      sort: false,
      excludeColumns: [],
      pagination: false,
      ...options
    }

    const { selectedOptions, onChange } = useSorts()

    const { currentPage, onPageChange } = usePagination();

    console.log('check currentPage', currentPage)

    // Handle sorting logic here
    console.log('check value', selectedOptions)

    const columns = [
      {
        Header: 'Account',
        accessor: 'ref',
        className: styles.column,
        Cell: ({ row }) => {
          const isPaused = !!row.original.pause.reason;

          return (
            <div className={styles['account-container']}>
              <Link className={styles.link} href={`${row.original.ref}`}>
                {row.original.ref}
              </Link>

              {options?.action ?
                (isPaused ? (
                  <Button onClick={handleUnpause(row.original.ref)} className={styles['action-button']}>Unpause</Button>
                ) : (
                  <Button onClick={handleSendNoSp(row.original.ref)} className={styles['action-button']}>Send NoSP</Button>
                )) : null}

            </div>
          )
        }
      },
      {
        Header: 'Tenant',
        accessor: 'primary_contact.name',
        className: styles.column,
      },
      {
        Header: 'Address',
        accessor: 'primary_contact.short_address',
        className: styles.column,
      },
      {
        Header: 'Balance',
        accessor: 'balance',
        className: styles.column,
        Cell: ({ row }) => {
          return (
            <div>
              £{row.original.balance}
            </div>
          )
        }
      },
      {
        Header: 'Agreement',
        accessor: 'current_arrears_agreement_status',
        className: `${styles.column} ${styles.capitalize}`,
      },
      {
        Header: 'Last',
        accessor: 'state',
        className: styles.column,
        Cell: ({ row }) => {
          const latest_action: CaseLatestAction = row.original.latest_action
          const pause = row.original.pause

          const actionDate = Date.parse(latest_action.date)
          const pauseUntilDate = Date.parse(pause.until);

          return (
            <div>
              {(pause.reason) ? (
                <>
                  {/* Cannot show paused as the design? */}
                  <p>{ACTION_CODE_UI_TEXT_DICT[latest_action.code]}</p>
                  <p>Until {format(pauseUntilDate, "dd/MM/yyyy")}</p>
                  <p>Reason: {pause.reason}</p>
                </>
              ) : (
                <>
                  <p>{ACTION_CODE_UI_TEXT_DICT[latest_action.code]}</p>
                  <p>Sent {format(
                    actionDate
                    , "HH:mm")}</p>
                  <p>{format(actionDate, "dd/MM/yyyy")}</p>
                </>
              )}
            </div>
          )
        }
      },
      {
        Header: 'Court Date',
        accessor: 'courtdate',
        className: styles.column,
        Cell: ({ row }) => {
          return (
            <div className={styles['account-container']}>
              {row.original.courtdate && format(Date.parse(row.original.courtdate), "dd/MM/yyyy")}
            </div>
          )
        }
      },
      {
        Header: 'Court Outcome',
        accessor: 'court_outcome',
        className: styles.column,
        Cell: ({ row }) => {
          const court_outcome: CaseCourtOutcome = row.original.court_outcome;

          return (
            <div className={styles['account-container']}>
              {court_outcome && COURT_OUTCOME_CODE_DICT[court_outcome]}
            </div>
          )
        }
      },
    ]

    const filteredColumns = columns.filter((x) => {
      return !options?.excludeColumns?.includes(x.Header)
    })

    return (
      <>
        {options.sort && (
          <Sorts selectedOptions={selectedOptions} onChange={onChange} options={[
            {
              id: 'check-case-data',
              label: 'Check case data',
            },
            {
              id: 'send-nosp',
              label: 'Send NOSP',
            },
            {
              id: 'send-text-message',
              label: 'Send text message',
            },
            {
              id: 'start-court-case',
              label: 'Start court case',
            }
          ]} />
        )}

        <div className={'xl-separator'} />

          <Table columns={filteredColumns}
            data={data.cases}
            // Fix upstream render more hook issue
            pagination={{
              pageCount: 5,
              totalCount: data.number_of_pages,
              currentPage,
              onPageChange
            }}
          />
      </>
    )
  }

  const tabs = {
    "Immediate Actions": mkTableTab(mockData, {
      sort: true,
      action: true,
      excludeColumns: ['Court Date', 'Court Outcome']
    }),
    "Paused": mkTableTab({
      ...mockData,
      cases: mockData.cases.filter(x => {
        return !!x.pause.reason
      })
    }, {
      action: true,
      excludeColumns: ['Agreement', 'Court Date', 'Court Outcome']
    }),
    "Full Patch": mkTableTab(mockData, {
      excludeColumns: ['Court Date', 'Court Outcome']
    }),
    // TODO: Which code for court outcome will map to Eviction?
    "Evictions": mkTableTab({
      ...mockData,
      cases: mockData.cases.filter(x => x.courtdate)
    }, {
      pagination: true,
      excludeColumns: ['Agreement', 'Last', 'Balance']
    }),
    "Court dates": mkTableTab({
      ...mockData,
      cases: mockData.cases.filter(x => x.courtdate)
    }, {
      pagination: true,
      excludeColumns: ['Agreement', 'Last', 'Balance']
    })
  }

  const { tabsProps, tabContent } = useTabs(tabs);

  return (
    <PageContainer>
      <Header title={'Welcome John'} subtitle={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque molestie molestie ultrices. Suspendisse nec gravida dolor, et iaculis massa.'}/>

      {/* TODO: Handle options correctly for select component */}
      <Select label={"Select Patch"} name="patch" options={[{
        value: "all",
        label: "All"
      }]} className={styles['select-container']} />

      <div className={'xl-separator'} />

      <Tabs {...tabsProps} />

      <div className={styles['max-width']}>
        {tabContent}
      </div>
    </PageContainer>
  )
}

export const getServerSideProps = storeWrapper.getServerSideProps(store => async (opts) => {
  store.dispatch(getCases.initiate({
    page_number: 1,
    number_per_page: 100
  }));

  await Promise.all(incomeApi.util.getRunningOperationPromises())

  return {
    props: {}
  }
});

export default Home
