import React from 'react'
import Card from 'react-bootstrap/Card'
import Form from '../components/form/profile'
import { profile } from '../constants/data'

export default function profilePage() {
  return (
    <Card className='shadow p-4 my-5' style={{borderRadius: '15px'}}>
      <Form d={profile} />
    </Card>
  )
}
