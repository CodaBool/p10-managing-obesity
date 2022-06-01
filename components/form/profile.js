import { useForm, Controller } from 'react-hook-form'
import { X } from 'react-bootstrap-icons'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import Toast from '../Toast'
import { useState, useEffect } from 'react'
import style from '../../styles/form.module.css'
import { PersonFill, EnvelopeCheckFill, EnvelopeFill, ClipboardCheck, ClipboardData, ClipboardPlus, At, Calendar2DateFill, Clipboard2HeartFill, ClipboardFill, Activity, EggFill, Rulers, EggFried, PatchCheckFill, PencilFill } from 'react-bootstrap-icons'
import axios from 'axios'

export default function Profile({ d, mutate }) {
  const [edit, setEdit] = useState()
  const [toast, setToast] = useState({show: false})
  const { register, handleSubmit, control, formState: { errors }, setValue } = useForm()

  const onSubmit = data => {
    axios.put('/api/user', data)
      .then(res => {
        setEdit(false)
        setToast({show: true, msg: 'Successfully updated profile', title: 'Profile Updated', confetti: true})
        mutate()
      })
      .catch(err => {
        setToast({show: true, msg: err.response.data.msg, title: 'Profile update error', err: true})
      })
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="mt-2">
        {edit 
          ? <div className={style.group}>
              <input defaultValue={d.name} {...register("name")} />
              <label>Name</label>
              <span className={style.bar}></span>
            </div>
          : <h1 className='display-1 mb-3 p-2'>
              <PersonFill className="mb-1 me-3" size={70}/> 
              {d.name ? d.name : <span className='text-muted'></span>}
            </h1>
        }
        {edit 
          ? <div className={style.group}>
              <input defaultValue={d.goalCalories} {...register("goalCalories")} />
              <label>Goal for Daily Calorie Intake</label>
              <span className={style.bar}></span>
            </div>
          : <h4 className='my-2'>
              <EggFill className="mb-1 me-2" size={16}/> Goal Daily Calories: 
              {d.goalCalories ? ` ${d.goalCalories} calories` : <span className='text-muted'> Unknown</span>}
            </h4>
        }
        {edit 
          ? <div className={style.group}>
              <input defaultValue={d.goalExercise} {...register("goalExercise")} />
              <label>Goal for Weekly Exercise Length (in minutes)</label>
              <span className={style.bar}></span>
            </div>
          : <h4 className='my-2'>
              <Activity className="mb-1 me-2" size={16}/> Goal Exercise Length: 
              {d.goalExercise ? ` ${d.goalExercise} minutes` : <span className='text-muted'> Unknown</span>}
            </h4>
        }
        {edit 
          ? <div className={style.group}>
              <input defaultValue={d.goalWeight} {...register("goalWeight")} />
              <label>Goal Weight (in pounds)</label>
              <span className={style.bar}></span>
            </div>
          : <h4 className='my-2'>
              <ClipboardFill className="mb-1 me-2" size={16}/> Goal Weight: 
              {d.goalWeight ? ` ${d.goalWeight} lb` : <span className='text-muted'> Unknown</span>}
            </h4>
        }
        {edit 
          ? <div className={style.group}>
              <input defaultValue={d.height} {...register("height")} />
              <label>Height (in inches)</label>
              <span className={style.bar}></span>
            </div>
          : <h4 className='my-2'>
              <Rulers className="mb-1 me-2" size={16}/> Height: 
              {d.height ? ` ${d.height} inches` : <span className='text-muted'> Unknown</span>}
            </h4>
        }
        {edit 
          ? <div className={style.group}>
              <input defaultValue={d.caloricMaintain} {...register("caloricMaintain")} />
              <label>Daily Calories to Maintain Weight</label>
              <span className={style.bar}></span>
            </div>
          : <h4 className='my-2'>
              <EggFried className="mb-1 me-2" size={16}/> Maintenance Calories: 
              {d.caloricMaintain ? ` ${d.caloricMaintain} calories` : <span className='text-muted'> Unknown</span>}
            </h4>
        }
        {edit 
          ? <div className={style.group}>
              <input defaultValue={d.age} {...register("age")} />
              <label>Age</label>
              <span className={style.bar}></span>
            </div>
          : <h4 className='my-2'>
              <Calendar2DateFill className="mb-1 me-2" size={16}/> Age: 
              {d.age ? ` ${d.age}` : <span className='text-muted'> Unknown</span>}
            </h4>
        }
        <h4 className='mt-2'><EnvelopeFill className="mb-1 me-2" size={16}/> Email: {d.email}</h4>
        <h4 className='my-2'>
          <PatchCheckFill className="mb-1 me-2" size={16}/> 
          <span className='text-muted'>{d.emailVerified ? ' Verified email' : ' Unverified email'}</span>
        </h4>
        <h4 className='my-2'>
          <ClipboardFill className="mb-1 me-2" size={16}/> Weight: 
          {d.weights?.weight ? ` ${d.weights?.weight} ${d.weights?.unit}` : <span className='text-muted'> Unknown</span>}
        </h4>
        {!edit && <Button variant="outline-secondary" className="my-2 w-25" onClick={() => setEdit(true)}><PencilFill className="ml-2 mb-1" size={14}/> Edit</Button>}
        {edit && 
          <>
            <Button variant="success" type="submit" className='me-3 mt-4'>Save</Button>
            <Button variant="secondary" className="mt-4" onClick={() => setEdit(false)}>Cancel</Button>
          </>
        }
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
    </Form>
  )
}