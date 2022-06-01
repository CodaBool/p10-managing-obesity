import { useState, useEffect } from 'react'
import KUTE from 'kute.js'
import { useSession } from 'next-auth/react'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import { useRouter } from 'next/router'
import Load from '../components/Load'
import ExampleRadarGraph from '../components/graph/ExampleRadar'
import ExampleBarGraph from '../components/graph/ExampleBar'

export default function Index(props) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    const tween1 = KUTE.fromTo(
      '#blob1',
      { path: '#blob1' },
      { path: '#blob2' },
      { duration: 3000, easing: 'easingCubicInOut', onComplete: () => tween2.start() }
    )
    const tween2 = KUTE.fromTo(
      '#blob1',
      { path: '#blob2' },
      { path: '#blob3' },
      { duration: 3000, easing: 'easingCubicInOut', onComplete: () => tween3.start() }
    )
    const tween3 = KUTE.fromTo(
      '#blob1',
      { path: '#blob3' },
      { path: '#blob1' },
      { duration: 3000, easing: 'easingCubicInOut', onComplete: () => tween1.start() }
    )
    tween1.start()
  }, [])
  
  if (session) {
    console.log('found a session in landing page')
    router.push('/track')
    // return <Load />
  }

  return (
    <div id="container">
      <div className="page first-page">
        <h1 className="intro-header my-5">
          <span style={{position: 'absolute'}}>HEALTH</span>
          <span className="rainbow">HEALTH</span>
          <span style={{opacity: '0'}}>HEALTH</span> JUST GOT
          <span id="blue"> EASIER</span>,
          <br/> MEET YOUR
          <span id="green"> ASSISTANT</span>.
        </h1>
        <ExampleRadarGraph />
      </div>
      <div className="page second-page">
        <Container>
          <h1 className='display-4'>Keep track of your health</h1>
          <h4>View your weight, exercise, or diet records all in one place. </h4>
          <h4>Get feedback on how you are performing.</h4>
          <h4>Set goals for which your health assistant will give you feedback on.</h4>
          <h4>You own the data submitted and can use it however you would like.</h4>
        </Container>
      </div>
      <div className="page third-page">
        <Container>
          <h1 className='display-4 mb-4'>Compare your health records.</h1>
          <h4 className='mb-4'>Get visual feedback on how you are progressing on your health journey. </h4>
          <ExampleBarGraph />
        </Container>
      </div>
      <div className="page fourth-page">
        <p className="blob-text">REACH<br/><span>GOALS</span></p>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 841.9 595.3">
          <g transform="translate(475.5095795422071 267.0269292920633)"><path id="blob1" d="M134.7 -121.5C184.5 -84.9 241.8 -42.4 260.3 18.6C278.9 79.5 258.8 159.1 208.9 181.9C159.1 204.8 79.5 170.9 18.9 152C-41.7 133.1 -83.4 129.1 -138.9 106.3C-194.4 83.4 -263.7 41.7 -257.8 5.9C-251.8 -29.8 -170.7 -59.7 -115.2 -96.3C-59.7 -133 -29.8 -176.5 6.3 -182.8C42.4 -189.1 84.9 -158.2 134.7 -121.5" fill="#61afef"></path></g>
          <g transform="translate(504.63731339311187 236.85721685095916)" style={{visibility: 'hidden'}}><path id="blob2" d="M165.3 -184.4C186.4 -144.2 156.5 -72.1 151.2 -5.3C145.9 61.5 165.2 123 144.1 179.3C123 235.5 61.5 286.5 -4.2 290.8C-70 295 -140 252.5 -180 196.3C-220 140 -230 70 -216.1 13.9C-202.2 -42.2 -164.4 -84.4 -124.4 -124.5C-84.4 -164.7 -42.2 -202.9 15 -217.8C72.1 -232.8 144.2 -224.6 165.3 -184.4" fill="#61afef"></path></g>
          <g transform="translate(524.774879433013 278.55728855600927)" style={{visibility: 'hidden'}}><path id="blob3" d="M167.4 -159.9C201.9 -132.9 204.5 -66.5 207.5 3.1C210.6 72.6 214.2 145.2 179.7 166.3C145.2 187.4 72.6 157 0 157C-72.6 157 -145.2 187.4 -201.4 166.3C-257.7 145.2 -297.6 72.6 -298.9 -1.3C-300.2 -75.2 -262.9 -150.4 -206.6 -177.4C-150.4 -204.4 -75.2 -183.2 -4.4 -178.8C66.5 -174.5 132.9 -186.9 167.4 -159.9" fill="#61afef"></path></g>
        </svg>
      </div>
      <div className="page sixth-page">
        <Container>
          <h1 className='display-4'>Set goals for yourself and achieve great things!</h1>
          <h4>Define a goal weight you would like to reach. </h4>
          <h4>Set daily intake for calories as well as exercise goals.</h4>
          <h4>View fitness records based on workout intensity.</h4>
          <h4>Keep a full history of your routine to improve your schedule.</h4>
          <Button onClick={() => router.push('/auth/login')} className="mt-4 w-100" size="lg" style={{backgroundColor: '#61afef', color: 'black'}}>Get started now!</Button>
          {/* <h1 className='text-center mt-4'><a href="/auth/signup" style={{textDecoration: 'none'}}>Get started now!</a></h1> */}
        </Container>
      </div>
    </div>
  )
}

// server
// import prisma from '../lib/prisma'
import json from 'superjson'

export const getServerSideProps = async ({ req }) => {
  // console.log('auth header', req.headers.AUTHORIZATION)
  // const userId = await getUserId(token)

  // await prisma.user.create({
  //   data: {
  //     name: 'Alice',
  //     email: 'alice@prisma.io',
  //     posts: {
  //       create: { title: 'Hello World' },
  //     },
  //     profile: {
  //       create: { bio: 'I like turtles' },
  //     }
  //   }
  // })
  const posts = null
  // const posts = await prisma.user.findMany({
  //   where: {
  //     email: 'alice@prisma.io'
  //   },
  //   include: {
  //     posts: true,
  //     profile: true,
  //   },
  // })
  if (!posts) return { props: {} }
  return { props: { posts: json.serialize(posts) } }
}