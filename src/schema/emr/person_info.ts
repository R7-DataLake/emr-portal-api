import S from 'fluent-json-schema'

const schema = S.object()
  .prop('hospcode', S.string().required())
  .prop('hn', S.string().required())
  .prop('zone', S.string().required())

export default {
  body: schema
}