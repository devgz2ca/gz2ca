import { defineEventHandler, getRouterParam } from 'h3'
import { Event } from '../../models/event.schema'
import { User } from '../../models/user.schema'
import { Media } from '../../models/media.schema'
import { verifyToken } from '../../utils/jwt'
import { extractToken } from '../../utils/auth'
import { handleBadRequest, handleNotFound, handleInternalError } from '../../utils/error'
import { connectDB } from '../../utils/db'
import { isValidObjectId } from '../../utils/mongo'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    return handleBadRequest('活动ID不能为空')
  }

  try {
    await connectDB();

    let eventDoc: any
    if (isValidObjectId(id)) {
      eventDoc = await Event.findById(id).populate('place_id')
    } else {
      eventDoc = await Event.findOne({ url: id }).populate('place_id')
    }

    if (!eventDoc) {
      return handleNotFound('活动不存在')
    }

    // Only allow viewing unapproved events to owner or admin
    if (!eventDoc.approved) {
      let canView = false
      const token = extractToken(event)
      if (token) {
        try {
          const user = await verifyToken(token)
          if (user?._id) {
            const userDoc: any = await User.findById(user._id).lean()
            canView = userDoc?.role === 'admin' || String(eventDoc.user_id) === String(user._id)
          }
        } catch (error) {
          // Invalid token, treat as anonymous
        }
      }

      if (!canView) {
        return handleNotFound('活动不存在或等待审核中')
      }
    }

    // Increment view count
    eventDoc.views = (eventDoc.views || 0) + 1
    await eventDoc.save()

    const organizer = await User.findById(eventDoc.user_id).select('fn ln email avt')
    const mediaList = await Media.find({ event_id: eventDoc._id }).sort({ ts: -1 })

    return {
      success: true,
      event: eventDoc,
      organizer,
      medias: mediaList
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    return handleInternalError('获取活动详情失败')
  }
})
