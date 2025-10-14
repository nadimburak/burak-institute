import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

export const mailHtmlTemplate = (firstName:string, message:string, Linkurl:string, subject:string)=>{
return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 6px;">
        <h2 style="color: #333;">Hi ${firstName},</h2>
        <p>${message}</p>
        <p>
          <a href="${Linkurl}" style="background: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px;">
            ${Linkurl}
          </a>
        </p>
        <p style="font-size: 12px; color: #777;">
          Thanks,<br>
          Burak Institute
        </p>
      </div>
    </body>
  </html>`;
}


export const mailSender = async (recipientsEmail:string, subject:string, userName:string,message:string,Linkurl:string)=>{

try {
    
    const mailerSend= new MailerSend({
      apiKey: process.env.MAILERSEND_API_KEY||'',
    });
    
    if(!mailerSend){
        throw new Error("Api key not find!!!")
    }
    
    const sentFrom = new Sender("sayedamanali0786@gmail.com", "Burak institute");
    
    const recipients = [
      new Recipient(recipientsEmail,userName)
    ];

    if(!recipients){
        throw new Error("Please enter Recipients mail!!!")
    }
    
    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject(subject)
      .setHtml(mailHtmlTemplate(userName,message,Linkurl,subject))
      .setText("This is the text content");
    
    await mailerSend.email.send(emailParams);

} catch (error:any) {
     console.error("❌ Failed to send email:", error.message);
    throw new Error(`Email sending failed: ${error.message}`);
}
}