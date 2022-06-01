import NextAuth from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { compareSync } from 'bcryptjs'
import prisma from '../../../lib/prisma'

export default (req, res) => (
  NextAuth(req, res, {
    providers: [
      GitHubProvider({
        clientId: process.env.NODE_ENV === 'production' ? process.env.GITHUB_ID : process.env.LOCAL_GITHUB_ID,
        clientSecret: process.env.NODE_ENV === 'production' ? process.env.GITHUB_SECRET : process.env.LOCAL_GITHUB_SECRET
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET
      }),
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials, req) {
          const user = await prisma.user.findUnique({ 
            where: { email: credentials.email.toLowerCase() } 
          })

          // no user by that email
          if (!user) throw { message: 'nonexistant'}
        
          if (!user.password) {
            // crendtial when an account exists
            console.log('likely originally signed up with oauth but is trying credentials')
            // TODO: might be necessary to throw a OAuthAccountNotLinked and let the user know they have an account
            throw { message: 'passwordless'}
          }

          const correctPassword = compareSync(credentials.password, user.password)

          // incorrect password
          if (!correctPassword) throw { message: `invalid&email=${encodeURIComponent(credentials.email)}`}

          // successful login
          return { id: user.id, name: 'user', email: user.email }
        }
      })
    ],
    pages: {
      signIn: '/auth/login',
      signOut: '/auth/logout',
      newUser: '/auth/signup',
      error: '/auth/login', // Error code passed in query string as ?error=
    },
    // debug: true,
    session: {
      strategy: 'jwt',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
      async session({ session, token, user }) {
        session.id = token.sub
        return session
      }
    },
    adapter: PrismaAdapter(prisma)
  })
)