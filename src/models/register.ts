import { Knex } from 'knex';

export class RegisterModel {

  doRegister(db: Knex, data: any) {
    return db('emr_portal.users')
      .insert(data);
  }

}
