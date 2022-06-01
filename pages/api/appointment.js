import { getSession } from 'next-auth/react'
import prisma from '../../lib/prisma'

export default async (req, res) => {
  try {
    const { method, body, query } = req
    const session = await getSession({ req })

    // TODO: do testing to find if the id should always be there
    if (!session) throw 'No session'
    
    if (method === 'POST') {
      const user = await prisma.user.findUnique({where: {id: session.id}})
      if (!user) throw 'Could not find user by that id'
      const appointment = await prisma.appointment.create({
        data: {
          userId: user.id,
          eventDate: body.date,
          title: body.title,
          notes: body.notes
        }
      })
      res.status(200).json(appointment)
    } else if (method === 'GET') {
      const appointments = await prisma.appointment.findMany({
        where: { userId: session.id }
      })
      // console.log('appointments', appointments)
      res.status(200).json(appointments)
    } else if (method === 'PUT') {
      console.log('got put')
      res.status(200).json({created: true})
    } else if (method === 'DELETE') {

      const user = await prisma.user.findUnique({where: {id: session.id}})
      if (!user) throw 'Could not find user by that id'

      const appointment = await prisma.appointment.findUnique({
        where: { id: body.id }
      })
      if (!appointment) throw 'No appointment found by that id'
      // console.log('found app')
      if (appointment.userId !== user.id) throw 'Unauthorized'
      // console.log('authorized')
      // console.log('got delete', body.id)
      const deleteAppointment = await prisma.appointment.delete({
        where: {
          id: appointment.id,
        },
      })
      res.status(200).json(deleteAppointment)
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