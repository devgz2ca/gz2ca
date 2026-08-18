import { defineEventHandler, readBody, getRouterParam } from 'h3';
import { Event } from '../../models/event.schema';
import { User } from '../../models/user.schema';
import { verifyToken } from '../../utils/jwt';
import { upsertPlace } from '../../utils/place';
import { extractToken } from '../../utils/auth';
import { handleUnauthorized, handleBadRequest, handleNotFound, handleForbidden, handleInternalError } from '../../utils/error';
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

    const userDoc: any = await User.findById(user._id).lean();
    const isAdmin = userDoc?.role === 'admin';

    const eventId = getRouterParam(event, 'id');
    if (!eventId) {
      return handleBadRequest('活动ID不能为空');
    }

    const existingEvent: any = await Event.findById(eventId);
    if (!existingEvent) {
      return handleNotFound('活动不存在');
    }

    const isOwner = existingEvent.user_id.toString() === user._id.toString();
    if (!isOwner && !isAdmin) {
      return handleForbidden('无权修改此活动');
    }

    const body = await readBody(event);
    const { tl, desc, date, place, status,url, category } = body;

    const place_id = place ? await upsertPlace(place) : existingEvent.place_id;

    // Admin edits keep the event visible; owner edits reset approval to pending review
    const approved = isAdmin ? true : false;

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        tl,
        desc,
        date,
        place_id,
        status,
        url,
        category,
        approved,
        mt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return handleNotFound('活动更新失败');
    }

    const populatedEvent = await Event.findById(updatedEvent._id).populate('place_id');
    return {
      success: true,
      message: isAdmin ? '活动更新成功' : '活动已更新，需重新等待管理员审核',
      event: populatedEvent
    };
  } catch (error: any) {
    console.error('Update event error:', error);
    return handleInternalError(error.message || '更新活动失败');
  }
});
