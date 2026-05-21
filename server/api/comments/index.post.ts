import { defineEventHandler, readBody } from 'h3';
import { Comment } from '../../models/comment.schema';
import { verifyToken } from '../../utils/jwt';
import { extractToken } from '../../utils/auth';
import { handleUnauthorized, handleBadRequest, handleInternalError } from '../../utils/error';
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

    const body = await readBody(event);
    const { eventId, content } = body;

    if (!eventId) {
      return handleBadRequest('活动ID不能为空');
    }

    if (!content || !content.trim()) {
      return handleBadRequest('评论内容不能为空');
    }

    const comment = await Comment.create({
      event_id: eventId,
      user_id: user._id,
      content: content.trim(),
      ts: new Date(),
      mt: new Date()
    });

    const populatedComment = await Comment.findById(comment._id);

    return {
      success: true,
      message: '评论成功',
      comment: {
        ...populatedComment.toObject(),
        user: {
          _id: user._id,
          fn: user.fn,
          ln: user.ln,
          avt: user.avt
        }
      }
    };
  } catch (error: any) {
    console.error('Create comment error:', error);
    return handleInternalError(error.message || '发表评论失败');
  }
});
