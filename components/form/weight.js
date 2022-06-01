import { useState, useEffect, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { X } from 'react-bootstrap-icons'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import DateInput from './DateInput'
import style from '../../styles/form.module.css'

export default function weight({ addWeight, setShowForm }) {
  const unit = useRef(null)
  const { register, handleSubmit, formState: { errors }, setValue } = useForm()

  const onSubmit = (data) => {
    if (data.weight && data.date) {
      data.date = new Date(data.date)
      data.unit = unit?.current?.value
      addWeight(data)
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <style jsx global>{`
        .x-icon:hover {
          cursor: pointer;
          color: rgb(184, 36, 36);
          filter: drop-shadow(0 0 2px #fd9d99);
          animation: spin 0.1s linear;
        }
        @keyframes spin { 
          100% { transform:rotate(90deg); } 
        }
      `}</style>
      <Card className='rounded shadow p-4 my-4'>
        <X className="x-icon" onClick={() => setShowForm(false)} style={{position: 'absolute', right: '10px', top: '10px'}} size={42}/>
        <div className='my-5'></div>
        <div className={style.group}>
          <input type="number" defaultValue="" {...register("weight")} />
          <span className={style.bar}></span>
          <label>Weight</label>
        </div>
        <DateInput register={register} setValue={setValue} />
        <InputGroup className="mb-3">
          <InputGroup.Text>Unit</InputGroup.Text>
          <Form.Select ref={unit}>
            <option value="lb">pound</option>
            <option value="kg">kilogram</option>
          </Form.Select>
        </InputGroup>
        
        <Row>
          <Button className="mx-auto mt-5" style={{width: "97.3%"}} variant="primary" type="submit">Submit</Button>
        </Row>
      </Card>
    </Form>
  )
}
