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
    csrfProtection(): any
  }

  interface FastifyRequest {
    user: any;
    jwtVerify: jsonwebtoken
  }

  interface FastifyReply {
    view: any;
    generateCsrf(): any;
  }

}
