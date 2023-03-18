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

  getLastOPDvisit(db: Knex, cid: any) {
    return db('metadata.opd as o')
      .select(
        'o.hospcode',
        'h.hospname',
        'o.hn',
        'o.seq',
        'o.date_serv',
        'o.time_serv',
        'o.chiefcomp',
        'o.ingress_zone',
        'o.d_update'
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

  getLastIPDvisit(db: Knex, cid: any) {
    return db('metadata.ipd as i')
      .select(
        'i.hospcode',
        'h.hospname',
        'i.hn',
        'i.an',
        'i.dateadm',
        'i.datedsc',
        'i.timeadm',
        'i.timedsc',
        'ds.name as dischs',
        'dt.name as discht',
        'i.ingress_zone',
        'i.d_update'
      )
      .innerJoin('libs.hospitals as h', 'h.hospcode', 'i.hospcode')
      .joinRaw(`
        inner join metadata.person as p on
        p.hn = i.hn
        and i.hospcode = p.hospcode
        and p.cid = ?
      `, [cid])
      .leftJoin('libs.dischs as ds', 'ds.code', 'i.dischs')
      .leftJoin('libs.discht as dt', 'dt.code', 'i.discht')
      .groupByRaw(`
        i.hospcode,
        h.hospname,
        i.hn,
        i.an,
        i.datedsc,
        ds.name,
        dt.name,
        i.ingress_zone
      `)
      .orderByRaw(`
        i.datedsc desc,
        i.timedsc desc
      `)
      .limit(10);
  }

  getPersonList(db: Knex, hospcode: any, query: any, limit: number, offset: number) {
    const sql = db('metadata.person as p')
      .select(
        'p.hospcode',
        'p.hn',
        'p.cid',
        'p.fname',
        'p.lname',
        'p.birth',
        'p.sex',
        'p.d_update'
      )
      .where('p.hospcode', hospcode);

    if (query) {
      const _query = `%${query}%`;
      sql.where(w => {
        w.orWhere('p.hn', query)
          .orWhere('p.cid', query)
          .orWhere('p.fname', 'like', _query)
          .orWhere('p.lname', 'like', _query)
      })
    }

    return sql.limit(limit).offset(offset);
  }

}
