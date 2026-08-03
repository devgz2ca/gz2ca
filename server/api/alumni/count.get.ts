import { defineEventHandler } from 'h3'
import { User } from '../../models/user.schema'
import { handleInternalError } from '../../utils/error'
import { connectDB } from '../../utils/db'

export default defineEventHandler(async () => {
  try {
    await connectDB()

    const count = await User.countDocuments({})

    return {
      success: true,
      count
    }
  } catch (error: any) {
    console.error('Get alumni count error:', error)
    return handleInternalError('获取校友数量失败')
  }
})
