import axios from 'axios'
import useSWR from 'swr'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from '../components/form/appointment' 
import Load from '../components/Load' 
import Modal from '../components/Modal'
import Toast from '../components/Toast'
import { ArrowClockwise, X } from 'react-bootstrap-icons'
import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'

export default function appointments() {
  const { data: session, status } = useSession()
  const [showForm, setShowForm] = useState()
  const [toast, setToast] = useState({show: false})
  const [showModal, setShowModal] = useState()
  const [spin, setSpin] = useState(false)
  const { data, error, mutate } = useSWR('/api/appointment', url => axios.get(url))

  useEffect(() => oneSpin(), [data])

  function oneSpin() {
    setSpin(true)
    setTimeout(() => setSpin(false), 1000)
  }

  if (!session) {
    if (status !== 'loading') {
      signIn()
    }
    return <Load />
  }

  function deleteAppointment(id) {
    setToast({show: false}) // remove error while waiting
    axios.delete('/api/appointment', { data: { id } })
      .then(res => {
        setToast({show: true, msg: 'Successfully deleted an appointment', title: 'Appointment Deleted'})
      })
      .catch(err => {
        setToast({show: true, msg: err.response.data.msg, title: 'Appointment Deletion error', err: true})
      })
      .finally(() => {
        setShowModal(false)
        mutate()
      })
  }

  function addAppointment(data) {
    setToast({show: false}) // remove error while waiting
    axios.post('/api/appointment', data)
      .then(res => {
        setShowForm(false)
        setToast({show: true, msg: 'Successfully added a new appointment', title: 'Appointment added', confetti: true})
        mutate()
      })
      .catch(err => {
        setToast({show: true, msg: err.response.data.msg, title: 'Appointment posting error', err: true})
      })
  }

  return (
    <>
      <style jsx global>{`
        .sway-on-hover:hover {
          cursor: pointer;
          animation: sway 1s infinite;
        }
        .spin {
          animation: flip 0.5s linear;
        }
        .btn-outline-primary:hover {
          background-color: rgb(199, 222, 255);
          color: rgb(22, 71, 148);
        }
        .darken-on-hover:hover {
          background-color: #d6d6d6;
        }
        .x-icon:hover {
          cursor: pointer;
          color: rgb(184, 36, 36);
          filter: drop-shadow(0 0 2px #fd9d99);
          animation: spin 0.1s linear;
        }
        @keyframes spin { 
          100% { transform:rotate(90deg); } 
        }
        @keyframes flip { 
          100% { transform:rotate(360deg); } 
        }
        @keyframes sway { 
          0% { transform: rotate(0deg); } 
          50% { transform: rotate(-25deg); } 
          100% { transform: rotate(0deg); } 
        }
      `}</style>
      <h1 className='display-4 mb-4'>Appointments</h1>
      <Button className='mx-4' variant="outline-primary" onClick={() => {mutate(); oneSpin()}}>
        <ArrowClockwise size={20} className={`${spin && 'spin'} sway-on-hover`} onClick={mutate} fill="#0069d9" style={{marginBottom: '2px'}} /> Refresh
      </Button>
      {showForm && <Form setShowForm={setShowForm} addAppointment={addAppointment} />}
      {!showForm && <Button variant="success" className='mx-4' onClick={() => setShowForm(true)}>Add New</Button>}
      {data?.data.length === 0 && !showForm && <h4 className='m-5'>📅 It's empty in here</h4>}
      {data?.data.length > 0 &&
        data.data.map(event => (
          <Card key={event.id} className="rounded shadow p-4 m-4">
            <X className="x-icon" onClick={() => setShowModal({name: event.title, id: event.id})} style={{position: 'absolute', right: '10px', top: '10px'}} size={42}/>
            <h1>{event.title}</h1>
            <h4>{new Intl.DateTimeFormat('en-US', { dateStyle: 'full'}).format(new Date(event.eventDate))}</h4>
            <p>{event.notes}</p>
          </Card>
        ))
      }
      <Modal 
        title="Delete Appointment"
        body={<p>Are you sure you would like to <strong>delete</strong> appointment <strong>{showModal?.name}</strong></p>}
        show={showModal}
        setShow={setShowModal}
        action={() => deleteAppointment(showModal?.id)}
        actionTitle="Delete Appointment"
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
