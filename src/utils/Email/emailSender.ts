import { template } from './templates/index'
import nodemailer from "nodemailer"


export const mailSender = async (
  type: keyof typeof template, // 👈 "welcome" | "resetPassword" | "invite"
  recipientEmail: string,
  subject: string,
  userName: string,
  linkUrl: string,
) => {
  try {
    const transport= nodemailer.createTransport({
          service:'Gmail',
           port: 465, 
           secure:true,
          auth:{
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS
          }
      })

      let html
   const htmlTemplate = template[type] as (...args: any[]) => string;
if (!htmlTemplate) throw new Error(`Template '${type}' not found`);


  html = htmlTemplate(userName, linkUrl);


  
      const options ={
          from:`Burak Insitute <${process.env.SMTP_USER}>`,
        to: recipientEmail,
          subject,
          html
      }
  
    const info =  await transport.sendMail(options)
   
    return info
  } catch (error:any) {
    throw new Error(error)
  }
    
};