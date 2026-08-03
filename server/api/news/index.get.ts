import { defineEventHandler, getQuery } from 'h3'
import { News } from '../../models/news.schema'
import { handleInternalError } from '../../utils/error'
import { connectDB } from '../../utils/db'

export default defineEventHandler(async (event) => {
  try {
    await connectDB()

    const queryParams = getQuery(event)
    const page = parseInt(queryParams.page as string) || 1
    const limit = parseInt(queryParams.limit as string) || 10
    const skip = (page - 1) * limit

    const filter: any = { status: 'published' }

    if (queryParams.tag) {
      filter.tags = queryParams.tag as string
    }

    const total = await News.countDocuments(filter)
    const news = await News.find(filter)
      .populate('author', 'fn ln avt')
      .sort({ ts: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    return {
      success: true,
      news,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  } catch (error: any) {
    console.error('Get news error:', error)
    return handleInternalError('获取动态失败')
  }
})
