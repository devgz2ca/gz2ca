import { defineEventHandler, getQuery } from 'h3'
import { Event } from '../../models/event.schema'
import { verifyToken } from '../../utils/jwt'
import { handleUnauthorized, handleForbidden, handleInternalError } from '../../utils/error'
import { connectDB } from '../../utils/db'
import { extractToken } from '~~/server/utils/auth'
import { User } from '../../models/user.schema'

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
    const currentUser = await User.findById(decoded._id)
    if (!currentUser || currentUser.role !== 'admin') {
      return handleForbidden('无权限访问')
    }
    
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 20
    const skip = (page - 1) * limit
    
    const [events, total] = await Promise.all([
      Event.find()
        .populate('place_id', 'tl')
        .sort({ ts: -1 })
        .skip(skip)
        .limit(limit),
      Event.countDocuments()
    ])
    
    // Fetch user info for each event
    const userIds = [...new Set(events.map(e => e.user_id))]
    const users = await User.find({ _id: { $in: userIds } }).select('fn ln eml')
    const userMap = new Map(users.map(u => [u._id.toString(), u]))
    
    const eventsWithUser = events.map(e => ({
      ...e.toObject(),
      user: userMap.get(e.user_id) || null
    }))
    
    return {
      success: true,
      events: eventsWithUser,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  } catch (error: any) {
    console.error('Admin get events error:', error)
    return handleInternalError('获取活动列表失败')
  }
})
