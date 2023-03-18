import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { StatusCodes } from "http-status-codes"
import _ from "lodash";

import searchSchema from '../schema/metadata/search';
import lastOpdSchema from '../schema/metadata/opd_last';
import { MetadataModel } from "../models/metadata";

export default async (fastify: FastifyInstance, _options: any, done: any) => {

  const metdataModel = new MetadataModel();
  const db = fastify.dbmetadata;

  fastify.post('/search', {
    schema: searchSchema,
    onRequest: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {

      const body: any = request.body;
      const { cid } = body;

      const key = `r7platform_emr_api_metada_person_search_${cid}`;

      // read from cache
      const cacheResult: any = await fastify.redis.get(key);
      if (cacheResult) {
        const results: any = JSON.parse(cacheResult);
        return reply.headers({ 'x-cache': true })
          .status(StatusCodes.OK)
          .send(results);
      }

      const results: any = await metdataModel.search(db, cid);
      await fastify.redis.set(key, JSON.stringify(results), 'EX', 2 * 60 * 60); // expire in 2hr

      reply.headers({ 'x-cache': false })
        .status(StatusCodes.OK)
        .send(results);

    } catch (error: any) {
      request.log.error(error)
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ status: 'error' })
    }
  });

  fastify.post('/opd/last', {
    schema: lastOpdSchema,
    onRequest: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {

      const body: any = request.body;
      const { cid } = body;

      const key = `r7platform_emr_api_metada_opd_last_${cid}`;

      // read from cache
      const cacheResult: any = await fastify.redis.get(key);
      if (cacheResult) {
        const results: any = JSON.parse(cacheResult);
        return reply.headers({ 'x-cache': true })
          .status(StatusCodes.OK)
          .send(results);
      }

      const results: any = await metdataModel.getLastOPDVisit(db, cid);
      await fastify.redis.set(key, JSON.stringify(results), 'EX', 2 * 60 * 60); // expire in 2hr

      reply.headers({ 'x-cache': false })
        .status(StatusCodes.OK)
        .send(results);
    } catch (error: any) {
      request.log.error(error)
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ status: 'error' })
    }
  });

  done()

} 
