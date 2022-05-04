import type { NextPage } from 'next'
import { useState } from 'react'
import { Typography, Tabs, InputSearch, PageContainer, useTabs, Table } from '@hackney/mtfh-finance-components'
import { usePagination } from 'hooks'
import styles from './index.module.scss'
import Header from 'components/Header'

type Address = {
    ref: string,
    tenure_type: string,
    prn: string,
    balance: number
}

type AddressResponse = {
    address: Array<Address>,
    number_of_pages: number
}

const mkTable = () => {
    const columns = [
        {
            Header: 'Account',
            accessor: 'ref',
        }, {
            Header: 'Tenure Type',
            accessor: 'tenure_type',
        }, {
            Header: 'PRN',
            accessor: 'prn',
        }, {
            Header: 'Total balance',
            accessor: 'balance',     
        }
    ]

    const data: AddressResponse = {
        address: [{
            ref: 'sdfa',
            tenure_type: 'TA',
            prn: '34143',
            balance: 200
        }],
        number_of_pages: 10
    }

    const { currentPage, onPageChange } = usePagination();

    return (
        <Table columns={columns}
        data={data.address}
        // Fix upstream render more hook issue
        pagination={{
          pageCount: 5,
          totalCount: data.number_of_pages,
          currentPage,
          onPageChange
        }}
      />
    )
}

const SearchResult: NextPage = () => {
    const tabs = {
        "Rent Accounts": mkTable(),
        "Leaseholder Accounts": null,
        "Blocks": null,
        "Estates": null
    }

    const { tabsProps, tabContent } = useTabs(tabs);

    const [input, setInput] = useState('')

    return (
        <PageContainer>
            <Header title={'Search'} subtitle={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque molestie molestie ultrices. Suspendisse nec gravida dolor, et iaculis massa.'} />

            <InputSearch 
            placeholder={"Search for Address, Name, RAN and more."}
            onChange={(e) => {
                setInput(e.target.value)
            }} 
            onClick={() => {
                console.log('searching')
            }}/>

            <div className={'xl-separator'} />

            <Tabs {...tabsProps} />

            {tabContent}
        </PageContainer>

    )
}

export default SearchResult