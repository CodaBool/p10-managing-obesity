import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Envelope, Key, ArrowReturnRight, ArrowLeft } from 'react-bootstrap-icons'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import { useRouter } from 'next/router'
import { getCsrfToken, signIn, useSession, getProviders } from 'next-auth/react'
import useScreen from '../../constants/useScreen'
import Toast from '../../components/Toast'
import Load from '../../components/Load'
import style from '../../styles/form.module.css'

export default function Login({ csrfToken, providers }) {
  const screen = useScreen()
  const { data: session, status } = useSession()
  const [option, setOption] = useState('')
  const [error, setError] = useState()
  const { register, handleSubmit, control, formState: { errors }, setValue } = useForm()
  const router = useRouter()

  useEffect(() => {
    if (router.query.option) setOption('password')
    if (router.query.email) setOption('password')
    if (router.query.error === 'invalid') setError('Invalid login')
    if (router.query.error === 'unknown') setError('Something went wrong')
    if (router.query.error === 'nonexistant') setError('No user found by that email')
    if (router.query.error === 'passwordless' || router.query.error ==='OAuthAccountNotLinked') setError('To confirm your identity, sign in with the same account you used originally.')
  }, [router.query.error])

  useEffect(() => {
    if (option === 'password' && router.query.error === 'invalid') {
      setValue('email', router.query.email)
      try {
        control._fields.password._f.ref.focus()
      } catch (err) {
        console.log('password input focus error', err)
      }
    }
    if (option === 'password' && router.query.option) {
      try {
        control.fieldsRef.current.email._f.ref.focus()
      } catch (err) {
        console.log('email input focus error', err)
      }
    }
  }, [option])
  
  const onSubmit = (data) => {
    if (data.email && data.password && data.csrfToken) {
      const callbackUrl = router.query.callbackUrl || '/track'
      signIn('credentials', { email: data.email, password: data.password, callbackUrl }) //callbackUrl
    }
  }

  function devLogin() {
    setOption('password')
    setValue('email', 'test@user.com')
    setValue('password', 'testuser')
    signIn('credentials', {
      email: 'test@user.com',
      password: 'testuser',
      callbackUrl: router.query.callbackUrl || '/track'
    })
  }

  if (session) {
    router.push('/track')
    return <Load />
  }
  
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="my-4 display-3 text-center">Login</h1>
      <Col>
        <Card className="my-5 shadow p-4 rounded"
          style={{ 
            maxWidth: `${screen.includes('m') ? '100%' : '40%'}`,
            margin: 'auto'
          }}
        >
          {!option &&
            <>
              <Button className="mx-auto my-2 w-100" onClick={() => setOption('password')}>
                Password
              </Button>
              <div className="border w-100 my-3"></div>
              <div className="d-flex" style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
                {Object.values(providers).map(provider => (
                  <Button 
                    onClick={() => signIn(provider.id, {callbackUrl: router.query.callbackUrl || '/track'})} 
                    key={provider.name}
                    className="my-1 w-100"
                  >
                      {provider.name}
                  </Button>
                ))} 
              </div>
            </>
          }
          {option && 
            <>
              <Button variant="light" className="rounded-circle mb-4 border" onClick={() => setOption(null)} style={{width: '3rem', height: '3rem'}}>
                <ArrowLeft className="mb-1" size={18} /> 
              </Button>
              <input type='hidden' defaultValue={csrfToken} {...register('csrfToken')} />
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
              <Button
                className="w-100"
                type="submit"
              >
                Login
              </Button>
              <Row className="mt-4">
                <Button 
                  variant="light" 
                  onClick={() => router.push(`/auth/request`)} 
                  className="mx-auto mb-2 darken-on-hover"
                >
                  Forgot Password?
                </Button>
                <Button 
                  variant="light" 
                  onClick={() => router.push(`/auth/signup`)} 
                  className="mx-auto darken-on-hover"
                >
                  Signup
                </Button>
              </Row>
            </>
          }
        </Card>
      </Col>
      <Row>
        <Button
          className="mx-auto my-2"
          variant="light"
          style={{width: '10em'}}
          onClick={devLogin}
        >
          Skip <ArrowReturnRight className="ml-2" size={18} />
        </Button>
      </Row>
      <div style={{position: 'fixed', top: '80px', right: '10px'}}>
        <Toast
          show={!!error}
          close={() => setError(false)}
          title='Could not Sign you in'
          error
          msg={error}
        />
      </div>
    </Form>
  )
}

export async function getServerSideProps(context) {
  const providers = await getProviders()
  const csrfToken = await getCsrfToken(context)
  delete providers.credentials
  if (!csrfToken) return {props: {}}
  return {
    props: { csrfToken, providers }
  }
}