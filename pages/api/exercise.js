import { getSession } from 'next-auth/react'
import prisma from '../../lib/prisma'

export default async (req, res) => {
  try {
    const { method, body, query } = req
    const session = await getSession({ req })

    // console.log('session', session)

    // TODO: do testing to find if the id should always be there
    if (!session.id) throw 'Missing user id'
    
    if (method === 'POST') {
      const user = await prisma.user.findUnique({where: {id: session.id}})
      if (!user) throw 'Could not find user by that id'

      if (body.intensity !== 'low' && body.intensity !== 'medium' && body.intensity !== 'high') {
        console.log(body.intensity)
        throw 'A intensity other than low/medium/high was found'
      }

      if (isNaN(Number(body.calories))) {
        throw 'Cannot cast a calories to Number'
      }
      if (isNaN(Number(body.length))) {
        throw 'Cannot cast a length to Number'
      }

      let calories = null
      if (body.calories !== '') calories = Number(body.calories)

      const exercise = await prisma.exercise.create({
        data: {
          userId: user.id,
          measuredAt: body.date,
          length: Number(body.length),
          intensity: body.intensity,
          calories
        }
      })
      // console.log('created exercise', exercise)
      if (!exercise) throw 'Could not create'
      res.status(200).json({created: true})
    } else if (method === 'GET') {
      const exercises = await prisma.exercise.findMany({
        orderBy: { measuredAt: 'desc' },
        where: {userId: session.id}
      })
      res.status(200).json(exercises)
    } else if (method === 'PUT') {

      const promises = []
      for (const exercise of body) {
        // validate
        if (exercise.data.intensity !== 'low' && exercise.data.intensity !== 'medium' && exercise.data.intensity !== 'high') {
          throw 'A intensity other than low/medium/high was found'
        }
        if (isNaN(Number(exercise.data.calories))) {
          throw 'Cannot cast a calories to Number'
        }
        if (isNaN(Number(exercise.data.length))) {
          throw 'Cannot cast a length to Number'
        }

        // change from date String back to date obj
        exercise.data.measuredAt = new Date(exercise.data.measuredAt)
        exercise.data.length = Number(exercise.data.length)
        if (exercise.data.calories === '') {
          exercise.data.calories = null
        } else {
          exercise.data.calories = Number(exercise.data.calories)
        }
  
        promises.push(prisma.exercise.update({
          where: { id: exercise.id }, data: exercise.data
        }))
      }
      await Promise.all(promises)

      res.status(200).json({created: true})
    } else if (method === 'DELETE') {
      console.log('got delete')
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