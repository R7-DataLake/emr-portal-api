import S from 'fluent-json-schema'

const schema = S.object()
  .prop('x-csrf-token', S.string().required())

export default {
  headers: schema
}