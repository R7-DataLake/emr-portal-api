import * as jsonwebtoken from 'jsonwebtoken';
import { AxiosInstance } from 'axios';
import Knex from 'knex';
import bcrypt from 'bcrypt';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any;
    axios: AxiosInstance;
    db: Knex;
    jwt: any;
    bcrypt: bcrypt;
  }

  interface FastifyRequest {
    user: any;
    jwtVerify: jsonwebtoken
  }

}
