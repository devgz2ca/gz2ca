import { defineEventHandler, readBody } from 'h3';
import { User } from '../../models/user.schema';
import { getLoginToken } from '../../utils/jwt';
import { handleBadRequest, handleUnauthorized, handleInternalError } from '../../utils/error';
import { connectDB } from '../../utils/db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, code } = body;

  if (!email || !code) {
    return handleBadRequest('邮箱和验证码为必填项');
  }

  try {
    await connectDB();

    const user = await User.findOne({ eml: email.toLowerCase() });
    if (!user) {
      return handleUnauthorized('用户不存在');
    }

    // Verify code
    if (user.verificationCode !== code) {
      return handleUnauthorized('验证码错误');
    }

    // Check expiry
    if (!user.verificationExpiry || new Date() > user.verificationExpiry) {
      return handleUnauthorized('验证码已过期');
    }

    // Clear verification code
    user.verificationCode = undefined;
    user.verificationExpiry = undefined;
    user.lts = new Date();
    await user.save();

    // Generate JWT token
    const token = await getLoginToken({ userId: user._id });

    return {
      success: true,
      message: '登录成功',
      token,
      user
    };
  } catch (error: any) {
    console.error('Code login error:', error);
    return handleInternalError('登录失败，请稍后重试');
  }
});
