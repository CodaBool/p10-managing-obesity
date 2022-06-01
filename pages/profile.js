import React, { useEffect } from 'react'
import useSWR from 'swr'
import axios from 'axios'
import Card from 'react-bootstrap/Card'
import Load from '../components/Load'
import { PencilFill } from 'react-bootstrap-icons'
import Form from '../components/form/profile'

export default function profile() {
  const { data, error, mutate } = useSWR('/api/user', url => axios.get(url))

  if (!data) return <Load />

  return (
    <Card className='shadow p-4 my-5' style={{borderRadius: '15px'}}>
      <Form d={data?.data} mutate={mutate} />
    </Card>
  )
}
