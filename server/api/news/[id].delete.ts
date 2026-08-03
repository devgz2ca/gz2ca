import { defineEventHandler } from 'h3'
import { News } from '../../models/news.schema'
import { verifyToken } from '../../utils/jwt'
import { extractToken } from '../../utils/auth'
import { handleUnauthorized, handleNotFound, handleInternalError } from '../../utils/error'
import { connectDB } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const token = extractToken(event)
  if (!token) {
    return handleUnauthorized()
  }

  try {
    const user = await verifyToken(token)
    if (!user || user.role !== 'admin') {
      return handleUnauthorized('仅管理员可删除动态')
    }

    await connectDB()
    const id = getRouterParam(event, 'id')

    const newsItem = await News.findByIdAndDelete(id)
    if (!newsItem) {
      return handleNotFound('动态不存在')
    }

    return {
      success: true,
      message: '删除成功'
    }
  } catch (error: any) {
    console.error('Delete news error:', error)
    return handleInternalError('删除动态失败')
  }
})
