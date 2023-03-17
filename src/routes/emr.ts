import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import personInfoSchema from '../schema/emr/person_info';
import { EmrModel } from '../models/emr';
import { ZoneModel } from '../models/zone';
import _ from 'lodash';

export default async (fastify: FastifyInstance, _options: any, done: any) => {

  const emrModel = new EmrModel();
  const zoneModel = new ZoneModel();
  const dbzone = fastify.dbzone;

  fastify.post('/person/info', {
    onRequest: [fastify.authenticate],
    schema: personInfoSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;
      const { hospcode, hn, zone } = body;
      const params: any = {
        hospcode,
        hn
      }

      // TODO: Get zones
      const resZone: any = await zoneModel.getZone(dbzone, zone);

      if (_.isEmpty(resZone)) {
        return reply.status(StatusCodes.NOT_FOUND)
          .send({
            status: 'error',
            error: 'Zone info not found'
          })
      }

      const zoneEndpoint = resZone.endpoint || 'localhost:50052';
      const apiKey = resZone.apikey || '';

      const key = `${hospcode}_${hn}`;

      // read from cache
      const cacheResult: any = await fastify.redis.get(key);
      if (cacheResult) {
        const results: any = JSON.parse(cacheResult);
        reply.headers({ 'cache': true })
          .status(StatusCodes.OK)
          .send(results);
      } else {
        const results: any = await emrModel.getPersonInfo(params, apiKey, zoneEndpoint);
        // save to cache
        await fastify.redis.set(key, JSON.stringify(results), 'EX', 3600); // expire in 1hr

        reply.headers({ 'cache': false })
          .status(StatusCodes.OK)
          .send(results);
      }

    } catch (error: any) {
      request.log.error(error)
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          status: 'error'
        })
    }
  })

  done()

} 
