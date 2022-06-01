import { ArrowLeft } from 'react-bootstrap-icons'
import Button from 'react-bootstrap/Button'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import axios from 'axios'
import Form from '../../components/form/weight'
import Table from '../../components/table/weight'
import Toast from '../../components/Toast'
import Graph from '../../components/graph/Weight'
import { useState } from 'react'

export default function weight() {
  const [showForm, setShowForm] = useState()
  const [toast, setToast] = useState({show: false})
  const { data, error, mutate } = useSWR('/api/weight', url => axios.get(url))
  const router = useRouter()
  const headers = ['Date', 'Weight', 'Unit']

  function addWeight(data) {
    setToast({show: false}) // remove error while waiting
    axios.post('/api/weight', data)
      .then(res => {
        setShowForm(false)
        setToast({show: true, msg: 'Successfully added a weight record', title: 'Weight record added', confetti: true})
        mutate()
      })
      .catch(err => {
        setToast({show: true, msg: err.response.data.msg, title: 'Error adding weight record', err: true})
      })
  }

  return (
    <>
      <Button variant="light" className="rounded-circle mb-5 border me-4 mt-4" onClick={() => router.push('/track')} style={{width: '3rem', height: '3rem'}}>
        <ArrowLeft className="mb-1" size={18} /> 
      </Button>
      <h1 className='display-4 d-inline me-5'>Weight</h1>
      <Graph data={data?.data} />
      <br /><br />
      {!showForm && <Button onClick={() => setShowForm(true)} className="me-3 my-2">Add Record</Button>}
      {showForm && <Form setShowForm={setShowForm} addWeight={addWeight} />}
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
