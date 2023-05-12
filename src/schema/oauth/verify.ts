import S from 'fluent-json-schema'

const schema = S.object()
  .prop('_csrf', S.string().required())
  .prop('action', S.enum(['login', 'kyc']).required())

export default {
  body: schema
}