import { defineEventHandler, readBody } from 'h3'
import { News } from '../../models/news.schema'
import { verifyToken } from '../../utils/jwt'
import { extractToken } from '../../utils/auth'
import { handleUnauthorized, handleBadRequest, handleInternalError } from '../../utils/error'
import { connectDB } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const token = extractToken(event)
  if (!token) {
    return handleUnauthorized()
  }

  try {
    const user = await verifyToken(token)
    if (!user || user.role !== 'admin') {
      return handleUnauthorized('仅管理员可发布动态')
    }

    await connectDB()
    const body = await readBody(event)
    const { title, content, summary, coverImage, tags } = body

    if (!title || !content) {
      return handleBadRequest('标题和内容为必填项')
    }

    const newsItem = await News.create({
      title,
      content,
      summary: summary || content.substring(0, 200),
      coverImage,
      author: user._id,
      status: 'published',
      tags: tags || [],
      ts: new Date(),
      mt: new Date()
    })

    return {
      success: true,
      message: '动态发布成功',
      news: newsItem
    }
  } catch (error: any) {
    console.error('Create news error:', error)
    if (error.statusCode) {
      throw error
    }
    return handleInternalError('发布动态失败')
  }
})
