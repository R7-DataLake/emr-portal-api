import { Knex } from 'knex';

export class LogModel {

  saveEmrViewLog(db: Knex, data: any) {
    return db('emr_portal.emr_view_logs')
      .insert(data);
  }

}
