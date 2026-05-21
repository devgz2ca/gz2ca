import { defineMongooseModel } from '#nuxt/mongoose';

export const Comment = defineMongooseModel('Comment', {
  event_id: {
    type: String,
    required: true,
    index: true
  },
  user_id: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  ts: {
    type: Date,
    default: Date.now
  },
  mt: {
    type: Date,
    default: Date.now
  }
})
