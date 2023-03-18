import S from 'fluent-json-schema'

const schema = S.object()
  .prop('zone', S.string().required())

export default {
  body: schema
}