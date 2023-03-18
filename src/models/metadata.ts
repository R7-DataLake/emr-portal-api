import { Knex } from 'knex'
export class MetadataModel {

  search(db: Knex, cid: any) {
    return db('metadata.person as p')
      .select(
        'p.hospcode',
        'h.hospname',
        'p.hn',
        'p.cid',
        'p.fname',
        'p.lname',
        'p.birth',
        'p.sex',
        'p.ingress_zone',
        'z.name as zone_name',
        'p.d_update'
      )
      .innerJoin('libs.hospitals as h', 'h.hospcode', 'p.hospcode')
      .innerJoin('users.zones as z', 'z.ingress_zone', 'p.ingress_zone')
      .where('p.cid', cid)
      .groupByRaw('p.hospcode, h.hospname, p.hn, p.ingress_zone, z.name')
  }

  getLastOPDVisit(db: Knex, cid: any) {
    return db('metadata.opd as o')
      .select(
        'o.hospcode',
        'h.hospname',
        'o.hn',
        'o.seq',
        'o.date_serv',
        'o.time_serv',
        'o.chiefcomp',
        'o.ingress_zone'
      )
      .innerJoin('libs.hospitals as h', 'h.hospcode', 'o.hospcode')
      .joinRaw(`
        inner join metadata.person as p on
        p.hn = o.hn
        and o.hospcode = p.hospcode
        and p.cid = ?
      `, [cid])
      .groupByRaw(`
        o.hospcode,
        h.hospname,
        o.hn,
        o.seq,
        o.date_serv,
        o.ingress_zone
      `)
      .orderByRaw(`
        o.date_serv desc,
        o.time_serv desc
      `)
      .limit(10);
  }

}
