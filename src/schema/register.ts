import S from 'fluent-json-schema'

const schema = S.object()
  .prop('hospcode', S.string().minLength(5).maxLength(10).required())
  .prop('fname', S.string().minLength(2).maxLength(150).required())
  .prop('lname', S.string().minLength(2).maxLength(150).required())
  .prop('cid', S.string().minLength(13).maxLength(13).required())
  .prop('sex', S.enum(['1', '2']).required())
  .prop('birth', S.string().minLength(8).maxLength(8).required())
  .prop('username', S.string().minLength(4).maxLength(50).required())
  .prop('password', S.string().minLength(4).maxLength(50).required())

export default {
  body: schema
}