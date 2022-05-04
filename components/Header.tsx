import { Typography } from '@hackney/mtfh-finance-components'
import styles from './Header.module.scss'

type HeaderProps = {
    title: string,
    subtitle: string
}

const Header = ({ title, subtitle }: HeaderProps) => {
    return (
        <>
            <Typography variant='caption' size={'l'} className={styles["subtitle"]}>
                Manage Arrears Portal
            </Typography>

            <div className='sm-separator'/>

            <Typography variant='h1'>
                {title}
            </Typography>

            <div className="sm-separator"/>

            <Typography weight={300} variant="body" size={"m"}>
                {subtitle}
            </Typography>

            <div className={'xl-separator'} />
        </>
    )
}

export default Header