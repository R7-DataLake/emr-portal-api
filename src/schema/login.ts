import S from 'fluent-json-schema'

const schema = S.object()
  .prop('username', S.string().minLength(4).maxLength(50).required())
  .prop('password', S.string().minLength(4).maxLength(50).required())

export default {
  body: schema
}