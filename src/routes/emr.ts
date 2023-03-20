import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { Knex } from 'knex';
import _ from 'lodash';
import { LogModel } from '../models/log';

import ipdDiagSchema from '../schema/emr/ipd_diag';
import ipdDrugSchema from '../schema/emr/ipd_drug';
import ipdInfoSchema from '../schema/emr/ipd_info';
import ipdLastSchema from '../schema/emr/ipd_last';
import opdDiagSchema from '../schema/emr/opd_diag';
import opdDrugSchema from '../schema/emr/opd_drug';
import opdInfoSchema from '../schema/emr/opd_info';
import opdLabSchema from '../schema/emr/opd_lab';
import opdLastSchema from '../schema/emr/opd_last';
import personInfoSchema from '../schema/emr/person_info';


export default async (fastify: FastifyInstance, _options: any, done: any) => {

  const logModel = new LogModel();
  const db: Knex = fastify.db;

  fastify.post('/person/info', {
    onRequest: [fastify.authenticate],
    schema: personInfoSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;
      const { hospcode, hn, zoneKey } = body;
      const params: any = {
        hospcode,
        hn,
        zoneKey
      }

      const url: any = `/emr/person/info`;

      const results: any = await fastify.axios.post(url, params);
      const data: any = results.data;

      // save log
      const userId: any = request.user.sub;
      const log: any = {
        user_id: userId,
        hospcode,
        hn,
        zone_key: zoneKey,
        event_name: 'EMR_PERSON_INFO'
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

  fastify.post('/opd/last', {
    onRequest: [fastify.authenticate],
    schema: opdLastSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;
      const { hospcode, hn, zoneKey } = body;

      const params: any = {
        hospcode,
        hn,
        zoneKey
      }

      const url: any = `/emr/opd/last`;

      const results: any = await fastify.axios.post(url, params);
      const data: any = results.data;

      // save log
      const userId: any = request.user.sub;
      const log: any = {
        user_id: userId,
        hospcode,
        hn,
        zone_key: zoneKey,
        event_name: 'EMR_OPD_LAST'
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
      const { hospcode, hn, zoneKey } = body;

      const params: any = {
        hospcode,
        hn,
        zoneKey
      }

      const url: any = `/emr/ipd/last`;

      const results: any = await fastify.axios.post(url, params);
      const data: any = results.data;

      // save log
      const userId: any = request.user.sub;
      const log: any = {
        user_id: userId,
        hospcode,
        hn,
        zone_key: zoneKey,
        event_name: 'EMR_IPD_LAST'
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

  fastify.post('/opd/diag', {
    onRequest: [fastify.authenticate],
    schema: opdDiagSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;
      const { hospcode, seq, hn, zoneKey } = body;

      const params: any = {
        hospcode,
        hn,
        seq,
        zoneKey
      }

      const url: any = `/emr/opd/diag`;

      const results: any = await fastify.axios.post(url, params);
      const data: any = results.data;

      // save log
      const userId: any = request.user.sub;
      const log: any = {
        user_id: userId,
        hospcode,
        hn,
        seq,
        zone_key: zoneKey,
        event_name: 'EMR_OPD_DIAG'
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

  fastify.post('/ipd/diag', {
    onRequest: [fastify.authenticate],
    schema: ipdDiagSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;
      const { hospcode, an, hn, zoneKey } = body;

      const params: any = {
        hospcode,
        hn,
        an,
        zoneKey
      }

      const url: any = `/emr/ipd/diag`;

      const results: any = await fastify.axios.post(url, params);
      const data: any = results.data;

      // save log
      const userId: any = request.user.sub;
      const log: any = {
        user_id: userId,
        hospcode,
        hn,
        an,
        zone_key: zoneKey,
        event_name: 'EMR_IPD_DIAG'
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

  fastify.post('/ipd/drug', {
    onRequest: [fastify.authenticate],
    schema: ipdDrugSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;
      const { hospcode, an, hn, zoneKey } = body;

      const params: any = {
        hospcode,
        hn,
        an,
        zoneKey
      }

      const url: any = `/emr/ipd/drug`;

      const results: any = await fastify.axios.post(url, params);
      const data: any = results.data;

      // save log
      const userId: any = request.user.sub;
      const log: any = {
        user_id: userId,
        hospcode,
        hn,
        an,
        zone_key: zoneKey,
        event_name: 'EMR_IPD_DRUG'
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

  fastify.post('/opd/drug', {
    onRequest: [fastify.authenticate],
    schema: opdDrugSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;
      const { hospcode, seq, hn, zoneKey } = body;

      const params: any = {
        hospcode,
        seq,
        hn,
        zoneKey
      }

      const url: any = `/emr/opd/drug`;

      const results: any = await fastify.axios.post(url, params);
      const data: any = results.data;

      // save log
      const userId: any = request.user.sub;
      const log: any = {
        user_id: userId,
        hospcode,
        hn,
        seq,
        zone_key: zoneKey,
        event_name: 'EMR_OPD_DRUG'
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

  fastify.post('/opd/lab', {
    onRequest: [fastify.authenticate],
    schema: opdLabSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;
      const { hospcode, seq, hn, zoneKey } = body;

      const params: any = {
        hospcode,
        hn,
        seq,
        zoneKey
      }

      const url: any = `/emr/opd/lab`;

      const results: any = await fastify.axios.post(url, params);
      const data: any = results.data;

      // save log
      const userId: any = request.user.sub;
      const log: any = {
        user_id: userId,
        hospcode,
        hn,
        seq,
        zone_key: zoneKey,
        event_name: 'EMR_OPD_LAB'
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

  fastify.post('/opd/info', {
    onRequest: [fastify.authenticate],
    schema: opdInfoSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;
      const { hospcode, seq, hn, zoneKey } = body;

      const params: any = {
        hospcode,
        hn,
        seq,
        zoneKey
      }

      const url: any = `/emr/opd/info`;

      const results: any = await fastify.axios.post(url, params);
      const data: any = results.data;

      // save log
      const userId: any = request.user.sub;
      const log: any = {
        user_id: userId,
        hospcode,
        hn,
        seq,
        zone_key: zoneKey,
        event_name: 'EMR_OPD_INFO'
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

  fastify.post('/ipd/info', {
    onRequest: [fastify.authenticate],
    schema: ipdInfoSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;
      const { hospcode, an, hn, zoneKey } = body;

      const params: any = {
        hospcode,
        hn,
        an,
        zoneKey
      }

      const url: any = `/emr/ipd/info`;

      const results: any = await fastify.axios.post(url, params);
      const data: any = results.data;

      // save log
      const userId: any = request.user.sub;
      const log: any = {
        user_id: userId,
        hospcode,
        hn,
        an,
        zone_key: zoneKey,
        event_name: 'EMR_IPD_INFO'
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
