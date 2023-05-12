import S from 'fluent-json-schema'

const schema = S.object()
  .prop('action', S.enum(['login', 'kyc']).required())

export default {
  querystring: schema
}