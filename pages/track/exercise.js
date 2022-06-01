import Button from 'react-bootstrap/Button'
import { ArrowLeft } from 'react-bootstrap-icons'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import axios from 'axios'
import Form from '../../components/form/exercise'
import Table from '../../components/table/exercise'
import Graph from '../../components/graph/Exercise'
import Toast from '../../components/Toast'
import { useState } from 'react'

export default function exercise() {
  const [showForm, setShowForm] = useState()
  const [toast, setToast] = useState({show: false})
  const { data, error, mutate } = useSWR('/api/exercise', url => axios.get(url))
  const headers = ['Date', 'Calories', 'Length', 'Intensity']
  const router = useRouter()

  function addExercise(data) {
    setToast({show: false}) // remove error while waiting
    axios.post('/api/exercise', data)
      .then(res => {
        setShowForm(false)
        setToast({show: true, msg: 'Successfully added a exercise record', title: 'Exercise record added', confetti: true})
        mutate()
      })
      .catch(err => {
        setToast({show: true, msg: err.response.data.msg, title: 'Exercise record posting error', err: true})
      })
  }

  return (
    <>
      <Button variant="light" className="rounded-circle mb-5 border me-4 mt-4" onClick={() => router.push('/track')} style={{width: '3rem', height: '3rem'}}>
        <ArrowLeft className="mb-1" size={18} /> 
      </Button>
      <h1 className='display-4 w-50 d-inline me-5'>Exercise</h1>
      <Graph data={data?.data} />
      <br /><br />
      {!showForm && <Button onClick={() => setShowForm(true)} className="me-3 my-2">Add Record</Button>}
      {showForm && <Form setShowForm={setShowForm} addExercise={addExercise} />}
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
