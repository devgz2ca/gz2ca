import { defineEventHandler, readBody, getRouterParam } from 'h3'
import { Event } from '../../../models/event.schema'
import { User } from '../../../models/user.schema'
import { verifyToken } from '../../../utils/jwt'
import { extractToken } from '../../../utils/auth'
import { handleUnauthorized, handleForbidden, handleBadRequest, handleNotFound, handleInternalError } from '../../../utils/error'
import { connectDB } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const token = extractToken(event)

  if (!token) {
    return handleUnauthorized('请先登录')
  }

  try {
    const decoded = await verifyToken(token)
    if (!decoded || !decoded._id) {
      return handleUnauthorized('用户不存在')
    }

    await connectDB()

    // Check if user is admin
    const currentUser: any = await User.findById(decoded._id)
    if (!currentUser || currentUser.role !== 'admin') {
      return handleForbidden('无权限操作')
    }

    const id = getRouterParam(event, 'id')
    if (!id) {
      return handleBadRequest('活动ID不能为空')
    }

    const eventDoc: any = await Event.findById(id)
    if (!eventDoc) {
      return handleNotFound('活动不存在')
    }

    const body = await readBody(event)
    const { approved } = body

    if (typeof approved !== 'boolean') {
      return handleBadRequest('approved 参数必须为布尔值')
    }

    eventDoc.approved = approved
    if (approved) {
      // Approved events become published if they were drafts
      if (eventDoc.status !== 'published') {
        eventDoc.status = 'published'
      }
    }
    eventDoc.mt = new Date()
    await eventDoc.save()

    const populatedEvent = await Event.findById(eventDoc._id).populate('place_id')

    return {
      success: true,
      message: approved ? '活动已通过审核并公开展示' : '活动已被拒绝审核',
      event: populatedEvent
    }
  } catch (error: any) {
    console.error('Admin approve event error:', error)
    return handleInternalError('审核活动失败')
  }
})
