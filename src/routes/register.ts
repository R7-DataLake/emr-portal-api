import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { StatusCodes } from "http-status-codes"
import _ from "lodash";
import { v4 as uuidv4 } from 'uuid';
import { RegisterModel } from "../models/register";

import registerSchema from '../schema/register';


export default async (fastify: FastifyInstance, _options: any, done: any) => {
  const db = fastify.db;
  const registerModel = new RegisterModel();

  fastify.post('/', {
    schema: registerSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;
      let {
        hospcode,
        fname,
        lname,
        cid,
        sex,
        birth,
        username,
        password } = body;

      password = await fastify.bcrypt.hash(password);

      const data: any = {
        id: uuidv4(),
        hospcode,
        fname,
        lname,
        cid,
        sex,
        birth,
        username,
        password,
        role: 'USER',
        login_type: 'LOCAL'
      };

      await registerModel.doRegister(db, data);

      reply
        .status(StatusCodes.OK)
        .send({ status: 'success' });

    } catch (error: any) {
      request.log.error(error)
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ status: 'error' })
    }
  });

  done();

} 
