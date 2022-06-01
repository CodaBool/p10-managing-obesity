import { getSession } from 'next-auth/react'
import bcrypt from 'bcryptjs'
import prisma from '../../lib/prisma'

export default async (req, res) => {
  try {
    const { method, body, query } = req
    const session = await getSession({ req })

    if (method === 'POST') {
      // console.log('session', session)
      // const valid = await verify(body.token)
      // console.log('got request with captcha', valid, 'and body', body)
      // if (!valid) throw 'Bad Captcha'

      // TODO: do a better check on password and id for providers
      if (!body.email || !body.password || !body.token) throw 'Missing data'

      const valid = await verify(body.token)
      if (!valid) throw 'Bad Captcha'

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(body.password, salt)
      const user = await prisma.user.create({
        data: {
          email: body.email.toLowerCase(),
          password: hash,
          passwordless: false
        },
      })
      if (!user) throw 'Cannot create'
      res.status(200).json({created: true})
    } else if (method === 'GET') {
      const user = await prisma.user.findUnique({
        where: {id: session.id},
        select: {
          email: true,
          name: true,
          goalWeight: true,
          goalExercise: true,
          goalCalories: true,
          age: true,
          height: true,
          emailVerified: true,
          caloricMaintain: true,
          weights: true,
          exercises: true,
          diets: true
        }
      })
      if (!user) throw 'No user found by that id'
      if (user.weights.length > 0) {
        user.weights.sort((a, b) => {
          if (a.measuredAt < b.measuredAt) return 1
          if (a.measuredAt > b.measuredAt) return -1
          return 0
        })
        user.weights = user.weights[0]
      }
      if (user.exercises.length > 0) {
        user.exercises.sort((a, b) => {
          if (a.measuredAt < b.measuredAt) return 1
          if (a.measuredAt > b.measuredAt) return -1
          return 0
        })
      }
      if (user.diets.length > 0) {
        user.diets.sort((a, b) => {
          if (a.measuredAt < b.measuredAt) return 1
          if (a.measuredAt > b.measuredAt) return -1
          return 0
        })
      }
      res.status(200).json(user)
    } else if (method === 'PUT') {
      const user = await prisma.user.findUnique({
        where: {id: session.id}
      })
      if (!user) throw 'No user found by this id'

      // validate
      if (body.id || body.email || body.emailVerified || body.password || body.passwordless || body.accounts || body.weights || body.sessions || body.exercises || body.diets || body.appointments) throw 'Unauthorized'
      if (body.name === '') {
        body.name = null
      } else {
        if (!/^[A-Za-z\s]*$/.test(body.name)) throw 'Names must be letters'
      }

      // set to null for empty string / cast to int
      if (body.goalCalories === '') {
        body.goalCalories = null
      } else {
        body.goalCalories = Number(body.goalCalories)
      }
      if (body.goalExercise === '') {
        body.goalExercise = null
      } else {
        body.goalExercise = Number(body.goalExercise)
      }
      if (body.goalWeight === '') {
        body.goalWeight = null
      } else {
        body.goalWeight = Number(body.goalWeight)
      }
      if (body.height === '') {
        body.height = null
      } else {
        body.height = Number(body.height)
      }
      if (body.caloricMaintain === '') {
        body.caloricMaintain = null
      } else {
        body.caloricMaintain = Number(body.caloricMaintain)
      }
      if (body.age === '') {
        body.age = null
      } else {
        body.age = Number(body.age)
      }
      const userRes = await prisma.user.update({
        where: { id: user.id }, data: body
      })
      res.status(200).json({created: true})
    }
  } catch (err) {
    console.log('api err', err)
    if (typeof err === 'string') {
      res.status(400).json({ msg: err })
    } else {
      res.status(500).json({ msg: (err.message || err)})
    }
  }
}

async function verify(token) {
  let valid = false
  await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${token}`, {method: 'POST'})
    .then(res => res.json())
    .then(data => valid = data.success === true)
  return valid
}