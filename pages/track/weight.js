import { ArrowLeft } from 'react-bootstrap-icons'
import Button from 'react-bootstrap/Button'
import { useRouter } from 'next/router'
import Form from '../../components/form/weight'
import Table from '../../components/table/weight'
import Toast from '../../components/Toast'
import Graph from '../../components/graph/Weight'
import { useState } from 'react'
import { weight } from '../../constants/data'

export default function weightPage() {
  const [showForm, setShowForm] = useState()
  const [toast, setToast] = useState({show: false})
  const router = useRouter()
  const headers = ['Date', 'Weight', 'Unit']

  function addWeight(data) {
    setToast({show: false}) // remove error while waiting
  }
  function mutate() {
  }

  return (
    <>
      <Button variant="light" className="rounded-circle mb-5 border me-4 mt-4" onClick={() => router.push('/track')} style={{width: '3rem', height: '3rem'}}>
        <ArrowLeft className="mb-1" size={18} /> 
      </Button>
      <h1 className='display-4 d-inline me-5'>Weight</h1>
      <Graph data={weight} />
      <br /><br />
      {!showForm && <Button onClick={() => setShowForm(true)} className="me-3 my-2">Add Record</Button>}
      {showForm && <Form setShowForm={setShowForm} addWeight={addWeight} />}
      <Table
        headers={headers}
        data={weight}
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
