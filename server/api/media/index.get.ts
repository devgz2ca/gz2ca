import { defineEventHandler } from 'h3'
import { Event } from '../../models/event.schema'
import { Media } from '../../models/media.schema'
import { handleInternalError } from '../../utils/error'
import { connectDB } from '../../utils/db'

export default defineEventHandler(async () => {
  try {
    await connectDB()

    const events = await Event.find({ status: 'published', approved: true })
      .select('_id tl')
      .lean()
    const eventIds = events.map(event => event._id.toString())
    const eventNames = new Map(events.map(event => [event._id.toString(), event.tl]))
    const mediaList = await Media.find({ event_id: { $in: eventIds } })
      .sort({ ts: -1 })
      .lean()
    const media = mediaList.map(item => ({
      ...item,
      event_name: eventNames.get(String(item.event_id)) || ''
    }))

    return {
      success: true,
      media
    }
  } catch (error) {
    console.error('Get media error:', error)
    return handleInternalError('获取媒体列表失败')
  }
})
