import { defineMongooseModel } from '#nuxt/mongoose'

export const News = defineMongooseModel('News', {
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    trim: true
  },
  coverImage: {
    type: String,
    required: false
  },
  author: {
    type: String,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
  },
  tags: {
    type: [String],
    default: []
  },
  ts: {
    type: Date,
  },
  mt: {
    type: Date,
  }
})
