import React, { useState, useEffect } from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { PlusSquare, XSquare, Calendar3, ArrowClockwise, PencilFill } from 'react-bootstrap-icons'
import DateInput from '../form/DateInput'
import axios from 'axios'

export default function CustomTable({ headers, data, deleteField, mutate }) {
  const [spin, setSpin] = useState(false)
  const [edit, setEdit] = useState(false)

  useEffect(() => {
    oneSpin()
    // TODO: sort table
  }, [data])

  useEffect(() => {
    if (edit) {
      data.forEach(row => {
        const lengthInput = document.querySelector(`#in-length-${row.id}`)
        const caloriesInput = document.querySelector(`#in-calories-${row.id}`)
        const intensityInput = document.querySelector(`#in-intensity-${row.id}`)
        lengthInput.value = row.length
        caloriesInput.value = row.calories
        intensityInput.value = row.intensity
      })
    }
  }, [edit])

  function oneSpin() {
    setSpin(true)
    setTimeout(() => setSpin(false), 1000)
  }

  function save() {
    const tr =  document.getElementsByTagName('tr')
    const arr = []
    for (const row of tr) {
      let obj = {data: {}, id: ''}
      for (const col of row.childNodes) {
        if (col.childNodes[0].id) {
          if (col.childNodes[0].id.includes('in-date')) { // date
            obj.data.measuredAt = col.childNodes[0].value
          }
        }
        if (col.childNodes[0].tagName === 'INPUT') {
          const fullId = col.childNodes[0].id
          obj.id = fullId.split('-')[2]
          if (col.childNodes[0].id.includes('calories')) { // calories
            obj.data.calories = col.childNodes[0].value
          } else { // length
            obj.data.length = col.childNodes[0].value
          }
        }
        if (col.childNodes[0].tagName === 'SELECT') { // intensity
          if (col.childNodes[0].childNodes[1]) {
            obj.data.intensity = col.childNodes[0].value
          }
        }
      }
      if (obj.id) arr.push(obj)
    }
    axios.put('/api/exercise', arr)
      .then(res => {
        setEdit(false)
        mutate()
      })
      .catch(console.log)
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
        @keyframes flip { 
          100% { transform:rotate(360deg); } 
        }
        @keyframes sway { 
          0% { transform: rotate(0deg); } 
          50% { transform: rotate(-25deg); } 
          100% { transform: rotate(0deg); } 
        }
      `}</style>
      <Button variant="outline-primary" onClick={() => {mutate(); oneSpin()}} className='me-3'>
        <ArrowClockwise size={20} className={`${spin && 'spin'} sway-on-hover`} onClick={mutate} fill="#0069d9" style={{marginBottom: '2px'}} /> Refresh
      </Button>
      {!edit && <Button variant="light" className="darken-on-hover" onClick={() => setEdit(true)}><PencilFill className="ml-2 mb-1" size={14} /> Edit</Button>}
      {edit && 
        <>
          <Button variant="success" onClick={save} className='me-3'>Save</Button>
          <Button variant="secondary" onClick={() => setEdit(false)}>Cancel</Button>
        </>
      }
      <Table striped bordered hover style={{marginBottom: '15rem'}}>
        <thead>
          <tr>
            {headers.map(header => <th key={header}>{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {data && edit && data.map(row => (
            <tr key={row.id}>
              <td>
                <DateInput id={`in-date-${row.id}`} inDate={new Date(row.measuredAt)} inDateFormat={new Intl.DateTimeFormat('en-US').format(new Date(row.measuredAt))} />
              </td>
              <td><input type="number" id={`in-calories-${row.id}`} /></td>
              <td><input type="number" id={`in-length-${row.id}`} /></td>
              <td>
                <Form.Select id={`in-intensity-${row.id}`}>
                  <option value="low">low</option>
                  <option value="medium">medium</option>
                  <option value="high">high</option>
                </Form.Select>
              </td>
            </tr>
          ))}
          {data && !edit && data.map((row, index) => (
            <tr key={row.id}>
              <td>{new Intl.DateTimeFormat('en-US').format(new Date(row.measuredAt))}</td>
              <td>{row.calories}</td>
              <td>{row.length}</td>
              <td>{row.intensity}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}
