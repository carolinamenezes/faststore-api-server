import { ApolloServer, gql } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import http from 'http'
import express from 'express'
import cors from 'cors'
import { getTypeDefs, getContextFactory, getResolvers } from '@faststore/api'

const app = express()
app.use(cors())
app.use(express.json())
const httpServer = http.createServer(app)

const apiOptions = {
  platform: 'vtex',
  account: 'faststore101',
  environment: 'vtexcommercestable',
  channel: '{"salesChannel":"1"}',
}

const typeDefs = getTypeDefs()
const resolvers = getResolvers(apiOptions)
const context = getContextFactory(apiOptions)

const startApolloServer = async (app, httpServer) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })

  await server.start()
  server.applyMiddleware({ app })
}

startApolloServer(app, httpServer)

export default httpServer
