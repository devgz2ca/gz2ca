import { defineEventHandler, getRouterParam, getQuery } from 'h3'
import { Comment } from '../../../models/comment.schema'
import { Event } from '../../../models/event.schema'
import { User } from '../../../models/user.schema'
import { handleBadRequest, handleNotFound, handleInternalError } from '../../../utils/error'
import { connectDB } from '../../../utils/db'
import { isValidObjectId } from '../../../utils/mongo'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    return handleBadRequest('活动ID不能为空')
  }

  try {
    await connectDB();

    let eventDoc
    if (isValidObjectId(id)) {
      eventDoc = await Event.findById(id)
    } else {
      eventDoc = await Event.findOne({ url: id })
    }

    if (!eventDoc) {
      return handleNotFound('活动不存在')
    }

    const eventId = eventDoc._id.toString()

    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 20
    const skip = (page - 1) * limit

    const total = await Comment.countDocuments({ event_id: eventId })
    const totalPages = Math.ceil(total / limit)

    const comments = await Comment.find({ event_id: eventId })
      .sort({ ts: -1 })
      .skip(skip)
      .limit(limit)

    const userIds = [...new Set(comments.map(c => c.user_id))]
    const users = await User.find({ _id: { $in: userIds } }).select('fn ln avt')
    const userMap = new Map(users.map(u => [u._id.toString(), u]))

    const commentsWithUser = comments.map(c => ({
      ...c.toObject(),
      user: userMap.get(c.user_id.toString()) || null
    }))

    return {
      success: true,
      comments: commentsWithUser,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('Get comments error:', error);
    return handleInternalError('获取评论失败');
  }
})
