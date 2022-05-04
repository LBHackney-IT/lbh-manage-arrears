import type { NextPage } from 'next'
import { useState } from 'react'
import { Typography, InputSearch, RadioButtons, PageContainer } from '@hackney/mtfh-finance-components'
import styles from './index.module.scss'
import { useRouter } from 'next/router'

const Search: NextPage = () => {
    const [itemId, setItemId] = useState('rent-accounts')
    const [input, setInput] = useState('')
    const router = useRouter()

    return (
        <PageContainer className={styles.container}>
            <Typography variant='h1' className={styles.title}>Search</Typography>
            <div className='xl-separator'/>
            <InputSearch 
            placeholder={"Search for Address, Name, RAN and more."}
            onChange={(e) => {
                setInput(e.target.value)
            }} 
            onClick={() => {
                router.push('/search/results')
            }}
            disabled={false}/>
            <div className='lg-separator'/>
            <RadioButtons className={styles.radios} options={[{
                value: 'rent-accounts',
                label: 'Rent Accounts'
            }, {
                value: "leaseholder-accounts",
                label: "Leaseholder Accounts"
            }, {
                value: "blocks",
                label: "Blocks"                
            }, {
                value: "estates",
                label: "Estates"                     
            }]} checkedItemId={itemId} onChange={(value) => {
                setItemId(value)
            }}/>
        </PageContainer>
    )
}

export default Search