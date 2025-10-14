export const welcomeTemplate = (firstName: string, linkUrl: string) => `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif;">
  <h1>Hello, ${firstName}!</h1>
  <h2> Welcome to Burak Insitute</h2>
  <p>We’re excited to have you join our community of learners and achievers.</p>
  <p>At Burak Insitute, we’re committed to helping you grow through quality education, expert guidance, and hands-on experience. You can now explore your dashboard, access course materials, and stay updated on the latest events and opportunities.</p>
  <p>If you have any questions or need help, feel free to reach out to us at sayedamanali0786@gemail.com.</p>
  <p><a href="${linkUrl}" style="background:#4CAF50;color:#fff;padding:8px 12px;border-radius:4px;text-decoration:none;">
    Get Started
  </a></p>
</body>
</html>
`;