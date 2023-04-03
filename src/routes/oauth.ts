import crypto from 'crypto';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';

const qs = require('qs');

export default async (fastify: FastifyInstance, _options: any, done: any) => {

  fastify.get('/login/dopa', {
    config: {
      rateLimit: {
        max: 50,
        timeWindow: '1 minute'
      }
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    const token = await reply.generateCsrf()

    return reply.view('/views/dopa_login.ejs', { token });

  });

  fastify.post('/login/dopa', {
    preHandler: fastify.csrfProtection,
    config: {
      rateLimit: {
        max: 50,
        timeWindow: '1 minute'
      }
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    try {
      const clientId: any = process.env.R7PLATFORM_EMR_PORTAL_API_THAID_CLIENT_ID;
      const redirectUri: any = process.env.R7PLATFORM_EMR_PORTAL_API_THAID_REDIRECT_URI;
      const scope: any = 'pid name openid';

      var str = crypto.randomBytes(20).toString('hex');

      const rndStr = `LOGIN|${str}`;
      const state = Buffer.from(rndStr, 'utf8').toString('base64')
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
