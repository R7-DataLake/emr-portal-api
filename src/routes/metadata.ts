import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';
const qs = require('qs');

import ipdLastSchema from '../schema/metadata/ipd_last';
import opdLastSchema from '../schema/metadata/opd_last';
import searchSchema from '../schema/metadata/search';
import patientListSchema from '../schema/metadata/patient_list';
import { Knex } from 'knex';
import { LogModel } from '../models/log';

export default async (fastify: FastifyInstance, _options: any, done: any) => {

  const db: Knex = fastify.db;
  const logModel = new LogModel();

  fastify.post('/opd/last', {
    onRequest: [fastify.authenticate],
    schema: opdLastSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;
      const { cid } = body;

      const params: any = { cid }

      const url: any = `/metadata/opd/last`;

      const results: any = await fastify.axios.post(url, params);
      const data: any = results.data;

      // save log
      const userId: any = request.user.sub;
      const hospcode: any = request.user.hospcode;

      const log: any = {
        user_id: userId,
        hospcode,
        patient_cid: cid,
        event_name: 'METADATA_OPD_LAST'
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

  fastify.post('/ipd/last', {
    onRequest: [fastify.authenticate],
    schema: ipdLastSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;
      const { cid } = body;

      const params: any = { cid }

      const url: any = `/metadata/ipd/last`;

      const results: any = await fastify.axios.post(url, params);
      const data: any = results.data;

      // save log
      const userId: any = request.user.sub;
      const hospcode: any = request.user.hospcode;

      const log: any = {
        user_id: userId,
        hospcode,
        patient_cid: cid,
        event_name: 'METADATA_IPD_LAST'
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

  fastify.post('/search', {
    onRequest: [fastify.authenticate],
    schema: searchSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;
      const { cid } = body;

      const params: any = { cid }

      const url: any = `/metadata/search`;

      const results: any = await fastify.axios.post(url, params);
      const data: any = results.data;

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

  fastify.get('/patient/list', {
    onRequest: [fastify.authenticate],
    schema: patientListSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const _query: any = request.query;
      let query: any = {};
      query.limit = _query.limit;
      query.offset = _query.offset;

      if (_query.query) {
        query.query = _query.query;
      }

      const strQuery = qs.stringify(query);

      const url: any = `/metadata/patient/list?${strQuery}&`;

      const results: any = await fastify.axios.get(url);
      const data: any = results.data;
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

}