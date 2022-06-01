import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from '../components/form/appointment' 
import Load from '../components/Load' 
import Modal from '../components/Modal'
import Toast from '../components/Toast'
import { ArrowClockwise, X } from 'react-bootstrap-icons'
import { useState, useEffect } from 'react'
import { appointments } from '../constants/data'

export default function appointmentsPage() {
  const [showForm, setShowForm] = useState()
  const [toast, setToast] = useState({show: false})
  const [showModal, setShowModal] = useState()
  const [spin, setSpin] = useState(false)

  // useEffect(() => oneSpin(), [data])

  function oneSpin() {
    setSpin(true)
    setTimeout(() => setSpin(false), 1000)
  }

  function deleteAppointment(id) {

    setToast({show: false}) // remove error while waiting

  }

  function addAppointment(data) {
    window.alert('This is a sample, no data can be altered.')
    setToast({show: false}) // remove error while waiting
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
      <Button className='mx-4' variant="outline-primary" onClick={oneSpin}>
        <ArrowClockwise size={20} className={`${spin && 'spin'} sway-on-hover`} fill="#0069d9" style={{marginBottom: '2px'}} /> Refresh
      </Button>
      {showForm && <Form setShowForm={setShowForm} addAppointment={addAppointment} />}
      {!showForm && <Button variant="success" className='mx-4' onClick={() => setShowForm(true)}>Add New</Button>}
      {appointments.map(event => (
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
        action={() => setShowModal(null)}
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
