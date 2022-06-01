import Head from 'next/head'
import Container from 'react-bootstrap/Container'
import { SessionProvider } from 'next-auth/react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Notification from '../components/Notify'

import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function App({ Component, pageProps }) {
  const router = useRouter()

  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <title>Health Assistant</title>
        <meta name="description" content="Health Assistant" />
        <link rel="icon" href="/icon.gif" />
      </Head>
      <Navbar/>
      <Notification />
      {router.pathname === '/'
        ? <Component {...pageProps} />
        : <div id="page-container">
            <main>
              <Container>
                <Component {...pageProps} />
              </Container>
            </main>
            <Footer path={router.pathname} />
          </div>
      }
    </SessionProvider>
  )
}