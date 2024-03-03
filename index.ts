import Fastify from 'fastify'
import fileMultipart, { type FastifyMultipartAttachFieldsToBodyOptions, type MultipartFile } from '@fastify/multipart'
import util from 'util'
import stream from 'stream'
import path from 'path'
import { v4 } from 'uuid'
import fs from 'fs'

const fastify = Fastify({
  logger: true
})

declare module '@fastify/multipart' {
    interface MultipartFile {
      value: string
    }
  }

const config: FastifyMultipartAttachFieldsToBodyOptions = {
    attachFieldsToBody: 'keyValues',
    onFile: async (part: MultipartFile) => {
        const buff = await part.toBuffer()
        const decoded = Buffer.from(buff.toString(), 'base64').toString()
        part.value = decoded
    }
  }

fastify.register(fileMultipart, config)

fastify.post('/', function ({body }, reply) {
    console.log(body)
    reply.send({ hello: "world" })
})

fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})