import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { Knex } from 'knex';
import _ from 'lodash';
import { LogModel } from '../models/log';

import cidSchema from '../schema/cid_search';


export default async (fastify: FastifyInstance, _options: any, done: any) => {

  const logModel = new LogModel();
  const db: Knex = fastify.db;

  fastify.post('/bp', {
    onRequest: [fastify.authenticate],
    schema: cidSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;
      const { cid } = body;
      const params: any = {
        cid
      }

      const url: any = `/profile/bp`;

      const results: any = await fastify.axios.post(url, params);
      const data: any = results.data;

      // save log
      const userId: any = request.user.sub;
      const log: any = {
        user_id: userId,
        patient_cid: cid,
        event_name: 'PROFILE_BP'
      };
      await logModel.saveEmrViewLog(db, log);

      reply
        .status(StatusCodes.OK)
        .send(data);

    } catch (error: any) {
      request.log.error(error)
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          status: 'error',
          error: error.message
        })
    }
  });

  fastify.post('/pulse', {
    onRequest: [fastify.authenticate],
    schema: cidSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;
      const { cid } = body;
      const params: any = {
        cid
      }

      const url: any = `/profile/pulse`;

      const results: any = await fastify.axios.post(url, params);
      const data: any = results.data;

      // save log
      const userId: any = request.user.sub;
      const log: any = {
        user_id: userId,
        patient_cid: cid,
        event_name: 'PROFILE_PULSE'
      };
      await logModel.saveEmrViewLog(db, log);

      reply
        .status(StatusCodes.OK)
        .send(data);

    } catch (error: any) {
      request.log.error(error)
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          status: 'error',
          error: error.message
        })
    }
  });

  fastify.post('/bmi', {
    onRequest: [fastify.authenticate],
    schema: cidSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;
      const { cid } = body;
      const params: any = {
        cid
      }

      const url: any = `/profile/bmi`;

      const results: any = await fastify.axios.post(url, params);
      const data: any = results.data;

      // save log
      const userId: any = request.user.sub;
      const log: any = {
        user_id: userId,
        patient_cid: cid,
        event_name: 'PROFILE_BMI'
      };
      await logModel.saveEmrViewLog(db, log);

      reply
        .status(StatusCodes.OK)
        .send(data);

    } catch (error: any) {
      request.log.error(error)
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          status: 'error',
          error: error.message
        })
    }
  });

  fastify.post('/last/appoint', {
    onRequest: [fastify.authenticate],
    schema: cidSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;
      const { cid } = body;
      const params: any = {
        cid
      }

      const url: any = `/profile/last/appoint`;

      const results: any = await fastify.axios.post(url, params);
      const data: any = results.data;

      // save log
      const userId: any = request.user.sub;
      const log: any = {
        user_id: userId,
        patient_cid: cid,
        event_name: 'PROFILE_LAST_APPOINT'
      };
      await logModel.saveEmrViewLog(db, log);

      reply
        .status(StatusCodes.OK)
        .send(data);

    } catch (error: any) {
      request.log.error(error)
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          status: 'error',
          error: error.message
        })
    }
  });

  done();

} 
