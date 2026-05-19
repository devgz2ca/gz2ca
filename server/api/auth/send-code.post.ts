import { defineEventHandler, readBody } from 'h3';
import { User } from '../../models/user.schema';
import { handleBadRequest, handleInternalError } from '../../utils/error';
import { connectDB } from '../../utils/db';
import { generateCode, sendVerificationEmail } from '../../utils/email';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email } = body;

  if (!email) {
    return handleBadRequest('邮箱为必填项');
  }

  try {
    await connectDB();

    const user = await User.findOne({ eml: email.toLowerCase() });
    if (!user) {
      return handleBadRequest('用户不存在');
    }

    const code = generateCode();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationCode = code;
    user.verificationExpiry = expiry;
    await user.save();

    const sent = await sendVerificationEmail(email, code);
    if (!sent) {
      return handleInternalError('发送验证码失败，请稍后重试');
    }

    return {
      success: true,
      message: '验证码已发送'
    };
  } catch (error: any) {
    console.error('Send verification code error:', error);
    return handleInternalError('发送验证码失败，请稍后重试');
  }
});
