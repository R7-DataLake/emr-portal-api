import S from 'fluent-json-schema'

const schema = S.object()
  .prop('cid', S.string().maxLength(13).minLength(13).required())

export default {
  body: schema
}