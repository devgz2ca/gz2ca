import { defineEventHandler, getQuery } from 'h3'
import { User } from '../../models/user.schema'
import { handleInternalError } from '../../utils/error'
import { connectDB } from '../../utils/db'

export default defineEventHandler(async (event) => {
  try {
    await connectDB()

    const queryParams = getQuery(event)
    const page = parseInt(queryParams.page as string) || 1
    const limit = parseInt(queryParams.limit as string) || 24
    const skip = (page - 1) * limit

    const filter: any = {}

    // Search by name
    if (queryParams.search) {
      const searchStr = queryParams.search as string
      filter.$or = [
        { fn: { $regex: searchStr, $options: 'i' } },
        { ln: { $regex: searchStr, $options: 'i' } }
      ]
    }

    // Filter by graduation year
    if (queryParams.graduationYear) {
      filter.graduationYear = parseInt(queryParams.graduationYear as string)
    }

    // Filter by location
    if (queryParams.location) {
      filter.location = { $regex: queryParams.location as string, $options: 'i' }
    }

    const total = await User.countDocuments(filter)

    const alumni = await User.find(filter)
      .select('fn ln graduationYear location bio avt ts')
      .sort({ graduationYear: -1, fn: 1 })
      .skip(skip)
      .limit(limit)
      .lean()

    // Group by graduation year
    const grouped: Record<string, any[]> = {}
    alumni.forEach((a: any) => {
      const year = a.graduationYear ? `${a.graduationYear}届` : '未填写届别'
      if (!grouped[year]) grouped[year] = []
      grouped[year].push(a)
    })

    return {
      success: true,
      alumni,
      grouped,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  } catch (error: any) {
    console.error('Get alumni error:', error)
    return handleInternalError('获取校友列表失败')
  }
})
