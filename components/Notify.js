import Toast from 'react-bootstrap/Toast'
import Button from 'react-bootstrap/Button'
import { useState, useEffect } from 'react'

const MS_BETWEEN_DB_CHECKS = 300000 // 300000 = 5 minutes
const NOTIFY_MIN_TIME = 2592000000 // 2592000000 = 30 days

// 86400000 = 1 day

export default function Notification() {
  const [toast, setToast] = useState({show: false})

  function snooze() {
    setToast({show: false})
    localStorage.setItem('snooze', new Date().getTime())
  }

  async function checkStore(forceDisplay) {

    // check for snooze
    const snoozeTime = localStorage.getItem('snooze')
    if (new Date().getTime() - snoozeTime < 86400000) { // 1 day
      return
    }

    // console.log('force check =', forceDisplay)
    const lastNotifyCheck = localStorage.getItem('lastNotifyCheck')

    // New storage, create a local storage item 
    if (!lastNotifyCheck) {
      // console.log('went to check store but no value found, making one now')
      localStorage.setItem('lastNotifyCheck', new Date().getTime())
      if (!forceDisplay) return
    }

    const time = new Date().getTime()
    if ((time - lastNotifyCheck > MS_BETWEEN_DB_CHECKS) || forceDisplay) { // 5 minutes
      // console.log('it has been over', Math.floor((((MS_BETWEEN_DB_CHECKS) / 1000) / 60)), 'minutes, checking DB')
      const upcoming = await getAppointments()
      if (upcoming.length > 0) {
        let closest = null
        upcoming.forEach(appoint => {
          if (!closest) {
            closest = appoint.timeMS
          } else {
            if (appoint.timeMS < closest) closest = appoint.timeMS
          }
        })
        const [value, unit] = getReadableTime(closest)
        setToast({show: true, msg: `Your next appointment is in ${value} ${unit}`, title: `You have ${upcoming.length} upcoming appointment(s)`})
      }
    } else { // DEBUG
      // console.log('too soon, it has only been', Math.floor((((time - lastNotifyCheck) / 1000) / 60)), 'minute ... I\'m not checking for notifications')
    }
  }

  async function getAppointments() {
    // update local storage to show that an appointment has been checked recently
    localStorage.setItem('lastNotifyCheck', new Date().getTime())

    // const notifications = await axios.get('/api/appointment').then(res => res.data).catch(console.log)
    if (!notifications && notifications?.length === 0) return
    const upcoming = notifications.flatMap(notify => {
      if (!notify.suppress && !notify.cancelled) {
        // check if near
        const dif = new Date(notify.eventDate) - new Date()
        if (dif > 0) {
          if (dif < NOTIFY_MIN_TIME) {
            const [time, unit] = getReadableTime(dif)
            // console.log('returned', time, unit)
            return {title: notify.title, time, unit, notes: notify.notes, timeMS: dif}
          } else { // DEBUG
            const days = Math.floor((((dif / 1000) / 60) / 60 ) / 24)
            const eventTimeCheck = Math.floor((((NOTIFY_MIN_TIME / 1000) / 60) / 60 ) / 24)
            // console.log('event', notify.title, 'is too far in the future. Only notify if less than', eventTimeCheck, 'day & Event is in', days, 'days')
          }
        } else { // DEBUG
          // console.log('DEBUG: event', notify.title, 'is in the past')
        }
      }
      return []
    })
    return upcoming
  }

  function getReadableTime(inputTime) {
    let time = Math.floor((((inputTime / 1000) / 60) / 60 ) / 24)
    let unit = 'day(s)'
    // const eventTimeCheck = Math.floor((((NOTIFY_MIN_TIME / 1000) / 60) / 60 ) / 24)
    if (time < 1) { // use hours instead
      time = Math.floor(((inputTime / 1000) / 60) / 60 )
      unit = 'hour(s)'
      if (time < 1) { // use minutes instead
        time = Math.floor((inputTime / 1000) / 60)
        unit = 'minutes'
      }
    }
    // console.log('event is less than', eventTimeCheck, 'days. Event in', time, unit)
    return [time, unit]
  }

  return (
    <>
      {toast.show &&
        <div style={{position: 'fixed', top: '80px', right: '10px', zIndex: 9}}>
          <Toast onClose={() => setToast({show: false})} show={toast.show} delay={15000} autohide>
            <Toast.Header>
              <div className="mr-auto w-100">
                <strong>{toast.title}</strong>
              </div>
            </Toast.Header>
            <Toast.Body><h5>{toast.msg}</h5><Button onClick={snooze} className="mt-2 w-100" variant="outline-secondary">Snooze for 24 hours</Button></Toast.Body>
          </Toast>
        </div>
      }
    </>
  )
}

// node express
// ard connect to node
// data -> google sheet
// tablo can read from google sheet