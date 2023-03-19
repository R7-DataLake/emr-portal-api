import { Knex } from 'knex';

export class LoginModel {

  getInfo(db: Knex, username: any) {
    return db('emr_portal.users')
      .where('username', username)
      .first();
  }

}
