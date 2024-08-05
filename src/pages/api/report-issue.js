import connDB from '../../../middleware/connDB';
import Report from '../../../models/Report_issue'; // Assuming you have a Mongoose model for reports
import nodemailer from 'nodemailer';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const { restaurant_id, ticketNumber, issueDescription } = req.body;

    try {
      // Save to the database
      const report = new Report({ restaurant_id, ticketNumber, issueDescription });
      await report.save();

      // Send email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: '2105676@kiit.ac.in',
        subject: `New Issue Reported - ${ticketNumber}`,
        text: `An issue has been reported.\n\nTicket Number: ${ticketNumber}\nRes ID: ${restaurant_id}\nDescription: ${issueDescription}`,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ success: true, message: 'Issue reported successfully' });
    } catch (error) {
      res.status(201).json({ success: false, message: 'Server error' });
    }
  } else {
    res.status(201).json({ success: false, message: 'Method Not Allowed' });
  }
};

export default connDB(handler);
