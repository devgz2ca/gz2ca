import { defineEventHandler, getQuery } from 'h3'
import { User } from '../../models/user.schema'
import { verifyToken } from '../../utils/jwt'
import { handleUnauthorized, handleForbidden, handleInternalError } from '../../utils/error'
import { connectDB } from '../../utils/db'
import { extractToken } from '~~/server/utils/auth'

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
    
    const [users, total] = await Promise.all([
      User.find()
        .select('fn ln eml role avt graduationYear location bio lts ts')
        .sort({ ts: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments()
    ])
    
    return {
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  } catch (error: any) {
    console.error('Admin get users error:', error)
    return handleInternalError('获取用户列表失败')
  }
})
