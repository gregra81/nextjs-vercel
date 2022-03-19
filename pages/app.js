import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { getContactsCached, getContactCached } from '../util/bizzaboClient'

export default function AppPage({ data }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Ice Breaker</title>
        <meta name="description" content="Meet new people and break the ice" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Break that Ice!
        </h1>
        <div>
        { JSON.stringify(data.content)}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export async function getServerSideProps({ query }) {
    const contacts = await getContactsCached(parseInt(query.accountId), parseInt(query.eventId));
    const contact = await getContactCached(parseInt(query.accountId), parseInt(query.eventId), parseInt(query.userId));

    return { props: { data: contacts } }
}
