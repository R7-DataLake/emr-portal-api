import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { StatusCodes } from "http-status-codes"
import _ from "lodash";

export default async (fastify: FastifyInstance, _options: any, done: any) => {

  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {

      const response: any = await fastify.axios.get('/status');
      reply.send(response.data);

    } catch (error: any) {
      request.log.error(error)
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ status: 'error' })
    }
  });

  done();

} 
