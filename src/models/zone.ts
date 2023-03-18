import { Knex } from 'knex'
export class ZoneModel {

  getZone(db: Knex, zone: any) {
    return db('users.zones')
      .select('endpoint', 'apikey')
      .where('ingress_zone', zone)
      .first()
  }

}
