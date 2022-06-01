import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Envelope, Key, ArrowReturnRight, ArrowLeft } from 'react-bootstrap-icons'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import { useRouter } from 'next/router'
import Load from '../../components/Load'
import Toast from '../../components/Toast'
import useScreen from '../../constants/useScreen'
import style from '../../styles/form.module.css'

export default function Login() {
  const screen = useScreen()
  const [error, setError] = useState()
  const [submitting, setSubmitting] = useState()
  const { register, handleSubmit, control, formState: { errors } } = useForm()
  const router = useRouter()

  const onSubmit = (data) => {
    if (data.password !== data.passwordConfirm) return
    if (data.email && data.password) {
      const callbackUrl = router.query.callbackUrl || ''
      window.alert('This is a sample, authentication is unecessary.')
    }
  }
  
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="my-4 display-3 text-center">Sign Up</h1>
      <Col>
        <Card className="my-5 shadow p-4 rounded"
          style={{ 
            maxWidth: `${screen.includes('m') ? '100%' : '40%'}`,
            margin: 'auto'
          }}
        >
          <Button variant="light" className="rounded-circle mb-5 border" onClick={() => router.push('/auth/login')} style={{width: '3rem', height: '3rem'}}>
            <ArrowLeft className="mb-1" size={18} /> 
          </Button>
          {errors.email && <p className="text-danger text-center">Please provide a valid email</p>}
          <div className={style.group}>
            <input
              required
              defaultValue=""
              {...register("email", { pattern: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i })}
            />
            <span className={style.bar}></span>
            <label><Envelope className="me-2 mb-1" size={20} />Email</label>
          </div>
          {errors.password && <p className="text-danger mt-4 mx-auto">Your password must be at least 8 characters</p>}
          <div className={style.group}>
            <input 
              required
              defaultValue=""
              type="password"
              {...register("password", { minLength: 8 })}
            />
            <span className={style.bar}></span>
            <label><Key className="me-2 mb-1" size={20} />Password</label>
          </div>
          <div className={style.group}>
            <input 
              required
              defaultValue=""
              type="password"
              {...register("passwordConfirm", { minLength: 8 })}
            />
            <span className={style.bar}></span>
            <label><Key className="me-2 mb-1" size={20} />Retype Password</label>
          </div>
          <Row>
            {submitting 
              ? <Load />
              : <Button
                  className="mx-auto my-5"
                  style={{ width: '92%' }}
                  type="submit"
                >
                  Sign Up
                </Button>
            }
          </Row>
        </Card>
      </Col>
      <div style={{position: 'fixed', top: '80px', right: '10px'}}>
        <Toast
          show={!!error}
          close={() => setError(false)}
          title='Account Creation Error'
          error
          msg={error}
        />
      </div>
    </Form>
  )
}
