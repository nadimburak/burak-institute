export const verificationTemplate = (firstName: string,linkUrl:string) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Email Verification</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f9f9fb; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: center;">
      
      <h2 style="color: #4a148c;">Verify Your Email Address</h2>

      <p style="font-size: 16px; color: #555;">
        Hi ${firstName},<br><br>
        Welcome to <strong>Burak Institute!</strong>  
        To activate your account, please verify your email address by clicking the button below.
      </p>

      <p style="margin-top: 30px;">
        <a href="${linkUrl}"
          style="background: linear-gradient(90deg,#8500e4,#a855f7); color: black; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">
          Verify Email
        </a>
      </p>

      <p style="font-size: 14px; color: #777; margin-top: 25px;">
        If you didn’t create this account, you can safely ignore this message.
      </p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="font-size: 12px; color: #999;">
        &copy; ${new Date().getFullYear()} Burak Institute. All rights reserved.
      </p>
    </div>
  </body>
</html>
`;
