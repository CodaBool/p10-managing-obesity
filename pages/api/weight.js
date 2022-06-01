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
      // console.log('api with data', body)
      const weight = await prisma.weight.create({
        data: {
          userId: user.id,
          measuredAt: body.date,
          unit: body.unit,
          weight: Number(body.weight)
        }
      })
      // console.log('created weight', weight)
      if (!weight) throw 'Could not create'
      res.status(200).json({created: true})
    } else if (method === 'GET') {
      const weights = await prisma.weight.findMany({
        orderBy: { measuredAt: 'desc' },
        where: {userId: session.id}
      })   
      // sort

      // console.log('weights', weights)
      res.status(200).json(weights)
    } else if (method === 'PUT') {
      // console.log('got put', body)

      const promises = []
      for (const weight of body) {
        // validate
        if (weight.data.unit !== 'lb' && weight.data.unit !== 'kg') {
          throw 'A unit other than lb or kg was found'
        }
        if (isNaN(Number(weight.data.weight))) {
          throw 'Cannot cast a weight to Number'
        }
        // change from date String back to date obj
        weight.data.measuredAt = new Date(weight.data.measuredAt)
        weight.data.weight = Number(weight.data.weight)
  
        promises.push(prisma.weight.update({
          where: { id: weight.id }, data: weight.data
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