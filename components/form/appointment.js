import { useForm } from 'react-hook-form'
import { X } from 'react-bootstrap-icons'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import style from '../../styles/form.module.css'
import DateInput from './DateInput'

export default function appointment({ setShowForm, addAppointment }) {
  const { register, handleSubmit, control, formState: { errors }, setValue } = useForm()

  const onSubmit = (data) => {
    if (data.title && data.date) {
      data.date = new Date(data.date)
      addAppointment(data)
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="mt-5">
      <Card className='rounded shadow p-4 m-4'>
        <X className="x-icon" onClick={() => setShowForm(false)} style={{position: 'absolute', right: '10px', top: '10px'}} size={42}/>
        <div className='my-5'></div>
        <div className={style.group}>
          <input defaultValue="" {...register("title")} />
          <span className={style.bar}></span>
          <label>Title</label>
        </div>
        <div className={style.group}>
          <textarea defaultValue="" rows="3"  className='w-100' placeholder='Notes' {...register("notes")} />
          <span className={style.bar}></span>
        </div>
        <DateInput register={register} setValue={setValue} />
        <Row>
          <Button className="mx-auto mt-5" style={{width: "97.3%"}} variant="primary" type="submit">Submit</Button>
        </Row>
      </Card>
    </Form>
  )
}
