import crypto from 'crypto';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { Knex } from 'knex';
import _ from 'lodash';

import verifySchema from '../schema/oauth/verify';

const qs = require('qs');

export default async (fastify: FastifyInstance, _options: any, done: any) => {

  const db: Knex = fastify.db;

  fastify.get('/dopa/verify', {
    config: {
      rateLimit: {
        max: 50,
        timeWindow: '1 minute',
        keyGenerator: (request: any) => {
          return request.headers['x-real-ip'];
        },
      }
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const query: any = request.query;

    const token = await reply.generateCsrf()
    return reply.view('/views/dopa_verify.ejs', { token });

  });

  fastify.post('/dopa/verify', {
    schema: verifySchema,
    preHandler: fastify.csrfProtection,
    config: {
      rateLimit: {
        max: 50,
        timeWindow: '1 minute',
        keyGenerator: (request: any) => {
          return request.headers['x-real-ip'];
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    try {

      const body: any = request.body;
      const { action } = body;

      const prefix = action === 'login' ? '1' : '2'; // 1 = Login, 2 = KYC

      var str = crypto.randomBytes(20).toString('hex');

      const rndStr = `${prefix}${str}`;
      const state = Buffer.from(rndStr, 'utf8').toString('base64');

      const clientId: any = process.env.R7PLATFORM_EMR_PORTAL_API_THAID_CLIENT_ID;
      const redirectUri: any = process.env.R7PLATFORM_EMR_PORTAL_API_THAID_REDIRECT_URI;

      const scope: any = 'pid';

      // save state
      const obj: any = {};
      obj.type = 'LOGIN';
      obj.state = state;

      const params: any = {
        redirect_uri: redirectUri,
        response_type: 'code',
        client_id: clientId,
        scope,
        state
      }

      const endPoint = process.env.R7PLATFORM_EMR_PORTAL_API_THAID_ENDPOINT;

      const url = `${endPoint}/?${qs.stringify(params)}`;

      reply.redirect(url);

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
