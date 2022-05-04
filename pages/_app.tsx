import type { AppProps } from "next/app";
import Head from 'next/head'
import { storeWrapper } from '../store';
import { Provider } from "react-redux";
import '@hackney/mtfh-finance-components/dist/esm/index.css'
import styles from './app.module.scss'
import { Button, LeftMenu, Typography } from '@hackney/mtfh-finance-components'
import Image from 'next/image'
import './global.css'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useGetNotificationsQuery } from 'services/income'
import { count } from "console";

function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  //Get notification here
  // const { data } = useGetNotificationsQuery(undefined);

  console.log('check value', router)

  let notificationCount = 0;

  return (
    <>
      <Head>
        <title>Hackney Worktray</title>
      </Head>
      <div className={styles.container}>
        <div className={styles["left-menu"]}>
          <LeftMenu regularLinks={[
            {
              icon: <Image src="/search-home.svg" width={20} height={20} />,
              buttonProps: {
                text: "Search",
                route: "/search"
              }
            },
            {
              id: 1
            },
            {
              icon: <Image src={(notificationCount > 0) ? "/bell-with-circle.svg" : '/bell.svg'} width={20} height={20} />,
              buttonProps: {
                text: "Notifications",
                route: "/notifications"
              },
              additionalComponent: notificationCount > 0 && (
                <span className={styles['noti-bubble']}>
                  {notificationCount}
                </span>
              )
            },
            {
              icon: <Image src="/template.svg" width={20} height={20} />,
              buttonProps: {
                text: "Communication Templates",
                route: "/communication"
              }
            },
            {
              id: 2
            },
            {
              icon: <Image src="/help.svg" width={20} height={20} />,
              buttonProps: {
                text: "Help",
                route: "/help"
              }
            },
            {
              icon: <Image src="/logout.svg" width={20} height={20} />,
              buttonProps: {
                text: "Log out",
                route: "/logout"
              }
            },
          ]}
            pageSpecificLinks={(router.pathname === "/search/results") ? (
              <Link href={"/search"}>
                <div className={styles["back-button-container"]}>
                  <Image src="/arrow-left.svg" width={16} height={16} />
                  <Typography className={styles["back-link"]} variant="body" size="m" weight={700}>Back</Typography>
                </div>
              </Link>
            ) : null}
          />
        </div>
        <main className={styles["main-content"]}>
          <Component {...pageProps} />
        </main>
      </div>
    </>
  );
}

export default storeWrapper.withRedux(App);
