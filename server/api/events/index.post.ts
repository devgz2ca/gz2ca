import { defineEventHandler, readBody } from 'h3';
import { Event } from '../../models/event.schema';
import { User } from '../../models/user.schema';
import { verifyToken } from '../../utils/jwt';
import { upsertPlace } from '../../utils/place';
import { extractToken } from '../../utils/auth';
import { handleUnauthorized, handleInternalError } from '../../utils/error';
import { connectDB } from '../../utils/db';

export default defineEventHandler(async (event) => {
  const token = extractToken(event);

  if (!token) {
    return handleUnauthorized('请先登录');
  }

  try {
    await connectDB();

    const user = await verifyToken(token);
    if (!user || !user._id) {
      return handleUnauthorized('用户不存在');
    }

    // Check if creator is admin (admin-created events are auto-approved)
    const userDoc = await User.findById(user._id).lean() as any;
    const isAdmin = userDoc?.role === 'admin';

    const body = await readBody(event);
    const { tl, desc, date, place, status, url, category } = body;

    const place_id = await upsertPlace(place);

    const newEvent = await Event.create({
      tl,
      desc,
      user_id: user._id,
      date,
      place_id,
      url,
      category: category || 'event',
      status: status || 'draft',
      approved: isAdmin ? true : false,
      ts: new Date(),
      mt: new Date()
    });

    const populatedEvent = await Event.findById(newEvent._id).populate('place_id');

    return {
      success: true,
      message: isAdmin ? '活动创建成功' : '活动已提交，等待管理员审核通过后公开展示',
      event: populatedEvent
    };
  } catch (error: any) {
    console.error('Create event error:', error);
    return handleInternalError(error.message || '创建活动失败');
  }
});
