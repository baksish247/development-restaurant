import connDB from "../../../middleware/connDB";
import Restaurant_credentials from "../../../models/Restaurant_credentials";
import nodemailer from "nodemailer"
var jwt = require("jsonwebtoken");

const handler = async (req, res) => {
  if (req.method == "POST") {
    try {
        const u = await Restaurant_credentials.findOne({ email: req.body.email });
        if(u)
          {
            
            const token = jwt.sign(
              { email: req.body.email, time: Date.now().toString() },
              process.env.JWT_SECRET_KEY
            );
            // Configure Nodemailer
            const transporter = nodemailer.createTransport({
            service: 'gmail', // You can use any email service
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          });
  
          const signupUrl = `${process.env.NEXT_PUBLIC_VERCEL_URL}/ForgotPassword?token=${token}`;
          // Email options
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: req.body.email,
            subject: 'Reset password for Baksish',
            html: `
              <div style="background-color: #fff9ea; padding: 20px; font-family: Arial, sans-serif; color: #441029;">
                <div style="max-width: 600px; margin: auto; border: 1px solid #441029; border-radius: 10px; overflow: hidden;">
                  <div style="background-color: #441029; padding: 10px; text-align: center;">
                    <h1 style="color: #fff9ea;">Baksish Signup</h1>
                  </div>
                  <div style="padding: 20px; text-align: center;">
                    <p style="font-size: 18px;">We recieved a forgot password request.</p>
                    <p style="font-size: 16px;">Please click the button below to reset your password:</p>
                    <a href="${signupUrl}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: #fff9ea; background-color: #441029; border-radius: 5px; text-decoration: none;">
                      Reset Password
                    </a>
                    <p style="font-size: 14px; color: #441029;">The link is valid only for the next 15 minutes.</p>
                    <p style="font-size: 14px; color: #441029;">If you did not request this signup, please ignore this email.</p>
                  </div>
                  <div style="background-color: #fff9ea; padding: 10px; text-align: center; border-top: 1px solid #441029;">
                    <p style="font-size: 12px; color: #441029;">&copy; 2024 Baksish. All rights reserved.</p>
                  </div>
                </div>
              </div>
            `
          };
  
          // Send email and update request status concurrently
          await transporter.sendMail(mailOptions)
          
  
          res.status(200).json({ success: true, message: 'Reset password link sent.'});     
          }
          else
          {
            res.status(201).json({success:false, error:"email not registered"})
          }
    } catch (e) {
      console.log(e)
      res.status(201).json({ success: false, error: "error occured" });
    }
  } else {
    res.status(201).send({ success: false, error: "error method" });
  }
};
export default connDB(handler);
