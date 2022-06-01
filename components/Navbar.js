import Link from 'next/link'
import { useRouter } from 'next/router'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import Spinner from 'react-bootstrap/Spinner'

export default function Header() {
  const router = useRouter()
  const active = pathname => router.pathname === pathname

  return (
    <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
      
      <Container>
      <style jsx global>{`
        .active-link {
          color: rgb(232, 230, 227) !important;
        }
      `}</style>
      <Link href="/">
        <a className='navbar-brand'>Intro</a>
      </Link>
      <Link href="/track">
        <a className='navbar-brand'>Home</a>
      </Link>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Link href="/wiki">
            <a className={`${active('/wiki') && 'active-link'} nav-link`}>Wiki</a>
          </Link>
          <Link href="/appointments">
            <a className={`${active('/appointments') && 'active-link'} nav-link`}>Appointments</a>
          </Link>
          <Link href="/profile">
            <a className={`${active('/profile') && 'active-link'} nav-link`}>Profile</a>
          </Link>
          <Link href="/auth/login">
            <a className={`${active('/auth/login') && 'active-link'} nav-link`}>Login</a>
          </Link>
        </Nav>
      </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}