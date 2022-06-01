import { signOut } from 'next-auth/react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

export default function logout() {
  return (
    <Card className='rounded shadow p-4 m-auto my-5' style={{maxWidth: '500px'}}>
      <h4 className='text-center mb-5' style={{fontSize: '2.4rem'}}>Are you sure you would like to logout?</h4>
      <Button variant="secondary" onClick={() => signOut({ callbackUrl: '/' })}>Logout</Button>
    </Card>
  )
}
