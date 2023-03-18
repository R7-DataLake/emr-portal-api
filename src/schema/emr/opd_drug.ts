import S from 'fluent-json-schema'

const schema = S.object()
  .prop('hospcode', S.string().required())
  .prop('seq', S.string().required())
  .prop('zoneKey', S.string().required())

export default {
  body: schema
}