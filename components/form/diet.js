import { useForm } from 'react-hook-form'
import { X } from 'react-bootstrap-icons'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import style from '../../styles/form.module.css'
import DateInput from './DateInput'

export default function Diet({ addDiet, setShowForm }) {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm()

  const onSubmit = (data) => {
    if (data.calories && data.date) {
      data.date = new Date(data.date)
      addDiet(data)
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
          <input type="number" defaultValue="" {...register("calories")} />
          <span className={style.bar}></span>
          <label>Calories</label>
        </div>
        <DateInput register={register} setValue={setValue} />
        <Row>
          <Button className="mx-auto mt-5" style={{width: "97.3%"}} variant="primary" type="submit">Submit</Button>
        </Row>
      </Card>
    </Form>
  )
}
