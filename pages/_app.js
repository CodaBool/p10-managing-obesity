import Head from 'next/head'
import Container from 'react-bootstrap/Container'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function App({ Component, pageProps }) {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Health Assistant</title>
        <meta name="description" content="Health Assistant" />
        <link rel="icon" href="/icon.gif" />
      </Head>
      <Navbar/>
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
    </>
  )
}