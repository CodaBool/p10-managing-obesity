import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { DayPicker } from 'react-day-picker'
import style from '../../styles/form.module.css'
import "react-day-picker/dist/style.css"

export default function TestingInput({ register, setValue, inDate, id, inDateFormat }) {
  const [selected, setSelected] = useState(inDate || new Date())
  const [inputDate, setInputDate] = useState(inDateFormat)
  const [showCal, setShowCal] = useState()
  const [err, setErr] = useState()

  const handleInputChange = e => {
    try {
      const input = e.currentTarget.value
      const [month, day, year] = input.split('/')
      const genDate = new Date(year, month-1, day)
      if (isNaN(genDate.getTime())) {
        // reset
        if (setValue) {
          setSelected(new Date())
        } else {
          setSelected(inDate)
          setInputDate(inDateFormat)
        }
        setErr('Invalid Date')
        console.log('Invalid Date')
      } else {
        setSelected(genDate)
        // split for simple / adv
        if (setValue) {
          setValue('date', e.currentTarget.value)
        } else {
          setInputDate(e.currentTarget.value)
        }
      }
    } catch (error) {
      console.log(error)
      setErr('Invalid Date')
      // reset
      if (setValue) {
        setSelected(new Date())
      } else {
        setSelected(inDate)
        setInputDate(inDateFormat)
      }
    }
  }

  const handleDaySelect = date => {
    setSelected(date)
    if (date) {
      setErr(null)
      if (setValue) {
        setValue('date', new Intl.DateTimeFormat('en-US').format(date))
      } else {
        setInputDate(new Intl.DateTimeFormat('en-US').format(date))
      }
      setShowCal(false)
    }
  }

  return (
    <>
      {id
        ? <input
            id={id}
            placeholder="Date"
            value={inputDate}
            onChange={handleInputChange}
            className="input-reset pa2 ma2 bg-white black ba"
            onClick={() => setShowCal(true)}
          />
        : <div className={style.group}>
            <input
              placeholder="Date"
              defaultValue={new Intl.DateTimeFormat('en-US').format(new Date())}
              onChange={handleInputChange}
              className="input-reset pa2 ma2 bg-white black ba"
              onClick={() => setShowCal(true)}
              {...register("date")}
            />
            <span className={style.bar}></span>
            <label>Measured At</label>
          </div>
      }
      {err && <p className='text-danger'>{err}</p>}
      {showCal &&
        <Modal show={!!showCal} onHide={() => setShowCal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>What day was this measured?</Modal.Title>
          </Modal.Header>
          <Modal.Body className='mx-auto'>
            <DayPicker
              mode="single"
              defaultMonth={selected}
              selected={selected}
              onSelect={handleDaySelect}
            />
          </Modal.Body>
        </Modal>
      }
    </>
  )
}