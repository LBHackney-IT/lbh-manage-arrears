import type { NextPage } from 'next'
import { Typography, InputSearch, RadioButtons, PageContainer, GrayBox, Button } from '@hackney/mtfh-finance-components'
import styles from './index.module.scss'
import Header from 'components/Header'
import Image from 'next/image'

type NotificationAction = {
    label: string
    onClick?: () => void
}

type NotificationBlockProps = {
    message: string,
    action: NotificationAction
}

const handleRemove = () => () => {}

const NotificationBlock = ({ message, action }: NotificationBlockProps) => {
    return (
        <>
        <GrayBox className={styles.notifications}>
            <Typography size={'m'}>{message}</Typography>
            <div className={styles['button-container']}>
            <Button className={styles['notifications-button']}>{action.label}</Button>
            <div className='lg-v-separator'/>
            <button className={styles['remove-button']} type="button" onClick={handleRemove()}>
                <Image src="/cross.svg" width={20} height={20} />
            </button>
            </div>
        </GrayBox>
        <div className='lg-separator' />
        </>
    )
}

const Notification: NextPage = () => {

    const newNotifications = [{
        id: 1,
        message: "New message",
    }]

    const notifications = [{
        id: 2,
        message: "Lorem Ipsum dolor Sit amet  - 12/12/12"
    }, {
        id: 3,
        message: "Lorem Ipsum dolor Sit amet  - 12/12/12"
    }]

    return (
        <PageContainer>
            <Header title={'Notifications'} subtitle={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque molestie molestie ultrices. Suspendisse nec gravida dolor, et iaculis massa.'} />
            <section className={styles['notifications-section']}>
                <Typography variant='h2'>New</Typography>
                <div className='lg-separator' />
                {newNotifications.map(({ id, message }) => (
                    <NotificationBlock key={id} message={message} action={{
                        label: "View worktray"
                    }}/>
                ))}
            </section>
            <div className='xl-separator' />
            <section className={styles['notifications-section']}>
                <Typography variant='h2'>Old</Typography>
                <div className='lg-separator' />
                {notifications.map(({ id ,message }) => (
                    <NotificationBlock key={id} message={message} action={{
                        label: "Action"
                    }}/>
                ))}
            </section>
        </PageContainer>
    )
}

export default Notification