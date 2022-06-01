import { getSession } from 'next-auth/react'
import prisma from '../../lib/prisma'

export default async (req, res) => {
  try {
    const { method, body, query } = req
    const session = await getSession({ req })

    // TODO: do testing to find if the id should always be there
    if (!session.id) throw 'Missing user id'
    
    if (method === 'POST') {
      const user = await prisma.user.findUnique({where: {id: session.id}})
      if (!user) throw 'Could not find user by that id'

      if (isNaN(Number(body.calories))) {
        throw 'Cannot cast a calories to Number'
      }

      let calories = null
      if (body.calories !== '') calories = Number(body.calories)

      const diet = await prisma.diet.create({
        data: {
          userId: user.id,
          measuredAt: body.date,
          calories
        }
      })
      // console.log('created exercise', exercise)
      if (!diet) throw 'Could not create diet record'
      res.status(200).json({created: true})
    } else if (method === 'GET') {
      const diets = await prisma.diet.findMany({
        orderBy: { measuredAt: 'desc' },
        where: {userId: session.id}
      })
      res.status(200).json(diets)
    } else if (method === 'PUT') {

      const promises = []
      for (const diet of body) {
        // validate
        if (isNaN(Number(diet.data.calories))) {
          throw 'Cannot cast a calories to Number'
        }

        // change from date String back to date obj
        diet.data.measuredAt = new Date(diet.data.measuredAt)
        if (diet.data.calories === '') {
          diet.data.calories = null
        } else {
          diet.data.calories = Number(diet.data.calories)
        }
  
        promises.push(prisma.diet.update({
          where: { id: diet.id }, data: diet.data
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