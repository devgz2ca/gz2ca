const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

interface EmailOptions {
  to: string
  subject: string
  htmlContent: string
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const { to, subject, htmlContent } = options

  const data = {
    sender: {
      name: '广州人在加拿大',
      email: 'noreply@gz2ca.com'
    },
    to: [{ email: to }],
    subject,
    htmlContent
  }

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(data)
    })
    console.log(response);
    return response.ok
  } catch (error) {
    console.error('Brevo API error:', error)
    return false
  }
}

export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function sendVerificationEmail(toEmail: string, code: string): Promise<boolean> {
  return sendEmail({
    to: toEmail,
    subject: '您的登录验证码',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #11817b 0%, #0d6b64 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">广州人在加拿大</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333; margin-top: 0;">您的验证码</h2>
          <div style="background: white; border: 2px dashed #11817b; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #11817b;">${code}</span>
          </div>
          <p style="color: #666; font-size: 14px;">验证码将在 10 分钟后过期，请尽快使用。</p>
          <p style="color: #999; font-size: 12px;">如果您没有请求此验证码，请忽略此邮件。</p>
        </div>
      </div>
    `
  })
}
