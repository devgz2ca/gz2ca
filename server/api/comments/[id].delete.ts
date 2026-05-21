import { defineEventHandler, getRouterParam } from 'h3'
import { Comment } from '../../models/comment.schema'
import { verifyToken } from '../../utils/jwt'
import { extractToken } from '../../utils/auth'
import { handleUnauthorized, handleNotFound, handleForbidden, handleInternalError } from '../../utils/error'
import { connectDB } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const token = extractToken(event)

  if (!token) {
    return handleUnauthorized('请先登录')
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    return handleBadRequest('评论ID不能为空')
  }

  try {
    await connectDB()

    const user = await verifyToken(token)
    if (!user || !user._id) {
      return handleUnauthorized('用户不存在')
    }

    const comment = await Comment.findById(id)
    if (!comment) {
      return handleNotFound('评论不存在')
    }

    if (comment.user_id.toString() !== user._id.toString() && user.role !== 'admin') {
      return handleForbidden('无权删除此评论')
    }

    await Comment.findByIdAndDelete(id)

    return {
      success: true,
      message: '评论已删除'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('Delete comment error:', error)
    return handleInternalError('删除评论失败')
  }
})
