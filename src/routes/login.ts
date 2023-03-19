import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { StatusCodes } from "http-status-codes"
import _ from "lodash";
import { v4 as uuidv4 } from 'uuid';
import { LoginModel } from "../models/login";

import loginSchema from '../schema/login';


export default async (fastify: FastifyInstance, _options: any, done: any) => {
  const db = fastify.db;
  const loginModel = new LoginModel();

  fastify.post('/', {
    schema: loginSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;
      let { username, password } = body;

      const response: any = await loginModel.getInfo(db, username);

      if (_.isEmpty(response)) {
        return reply
          .status(StatusCodes.NOT_FOUND)
          .send({ status: 'error', error: 'User not found' });
      }

      const hash = response.password;
      const match = await fastify.bcrypt.compare(password, hash)

      if (!match) {
        return reply
          .status(StatusCodes.UNAUTHORIZED)
          .send({ status: 'error', error: 'Invalid password' });
      }

      const payload: any = {
        sub: response.id,
        hospcode: response.hospcode,
        role: response.role,
      }
      const accessToken: any = fastify.jwt.sign(payload);
      reply
        .status(StatusCodes.OK)
        .send({ status: 'success', accessToken });

    } catch (error: any) {
      request.log.error(error)
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ status: 'error' })
    }
  });

  done();

} 
