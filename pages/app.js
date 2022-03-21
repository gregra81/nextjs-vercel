import Head from 'next/head'
import Image from 'next/image'
import MuiTable from '../components/MuiTable';
import { getContactsCached } from '../util/bizzaboClient'

export default function AppPage({ items, cells }) {
  return (
    <div>
      <Head>
        <title>Ice Breaker</title>
        <meta name="description" content="Meet new people and break the ice" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container">
        {items.length > 0 ? (
          <MuiTable cells={cells} items={items} />
        ) : (<Image src='https://img.mako.co.il/2015/06/11/la_09_i.jpg' layout='fill' />)}
      </div>
    </div>
  )
}

export async function getServerSideProps({ query }) {
  const cells = ['Name', 'Company / Title', 'Summary'];
  let props = { items: [], cells };
  if (query && query.accountId && query.eventId && query.userEmail) {
    const contactsData = await getContactsCached(parseInt(query.accountId), parseInt(query.eventId));
    const contactsWithProps = contactsData.content.map(contact => ({ id: contact.id, eventId: contact.eventId, ...contact.properties }));

    const currentUser = extractContact(contactsWithProps, query.userEmail);
    console.log(currentUser);
    let attendees = [];
    if (currentUser && false) {
      attendees = matches(currentUser, contactsWithProps);
    } else {
      attendees = pickRandom(contactsWithProps);
    }

    props.items = attendees;

  }
  return { props }
}

function extractContact(contacts, userEmail) {
  return contacts.filter(contact => contact.email === userEmail).pop()
}

function matcher(user, otherUsers, amount = 10) {

}

function pickRandom(otherUsers, amount = 10) {
  const shuffled = otherUsers.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, amount);
}
