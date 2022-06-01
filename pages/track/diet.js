import { ArrowLeft } from 'react-bootstrap-icons'
import Button from 'react-bootstrap/Button'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import axios from 'axios'
import Form from '../../components/form/diet'
import Table from '../../components/table/diet'
import Toast from '../../components/Toast'
import Graph from '../../components/graph/Diet'
import { useState } from 'react'

export default function weight() {
  const [showForm, setShowForm] = useState()
  const [toast, setToast] = useState({show: false})
  const { data, error, mutate } = useSWR('/api/diet', url => axios.get(url))
  const router = useRouter()
  const headers = ['Date', 'Calories']

  function addDiet(data) {
    setToast({show: false}) // remove error while waiting
    axios.post('/api/diet', data)
      .then(res => {
        setShowForm(false)
        setToast({show: true, msg: 'Successfully added a diet record', title: 'Diet record added', confetti: true})
        mutate()
      })
      .catch(err => {
        setToast({show: true, msg: err.response.data.msg, title: 'Error adding diet record', err: true})
      })
  }

  return (
    <>
      <Button variant="light" className="rounded-circle mb-5 border me-4 mt-4" onClick={() => router.push('/track')} style={{width: '3rem', height: '3rem'}}>
        <ArrowLeft className="mb-1" size={18} /> 
      </Button>
      <h1 className='display-4 d-inline me-5'>Diet</h1>
      <Graph data={data?.data} />
      <br /><br />
      {!showForm && <Button onClick={() => setShowForm(true)} className="me-3 my-2">Add Record</Button>}
      {showForm && <Form setShowForm={setShowForm} addDiet={addDiet} />}
      <Table
        headers={headers}
        data={data?.data}
        mutate={mutate}
      />
      <div style={{position: 'fixed', top: '80px', right: '10px'}}>
        <Toast
          show={toast.show}
          close={() => setToast({...toast, show: false})}
          title={toast.title}
          error={toast.err}
          msg={toast.msg}
          confetti={toast.confetti}
        />
      </div>
    </>
  )
}
