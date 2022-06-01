import Button from 'react-bootstrap/Button'
import { ArrowLeft } from 'react-bootstrap-icons'
import { useRouter } from 'next/router'
import Form from '../../components/form/exercise'
import Table from '../../components/table/exercise'
import Graph from '../../components/graph/Exercise'
import Toast from '../../components/Toast'
import { useState } from 'react'
import { exercise } from '../../constants/data'

export default function exercisePage() {
  const [showForm, setShowForm] = useState()
  const [toast, setToast] = useState({show: false})
  const headers = ['Date', 'Calories', 'Length', 'Intensity']
  const router = useRouter()

  function addExercise(data) {
    setToast({show: false}) // remove error while waiting
  }

  function mutate() {
  }

  return (
    <>
      <Button variant="light" className="rounded-circle mb-5 border me-4 mt-4" onClick={() => router.push('/track')} style={{width: '3rem', height: '3rem'}}>
        <ArrowLeft className="mb-1" size={18} /> 
      </Button>
      <h1 className='display-4 w-50 d-inline me-5'>Exercise</h1>
      <Graph data={exercise} />
      <br /><br />
      {!showForm && <Button onClick={() => setShowForm(true)} className="me-3 my-2">Add Record</Button>}
      {showForm && <Form setShowForm={setShowForm} addExercise={addExercise} />}
      <Table
        headers={headers}
        data={exercise}
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
