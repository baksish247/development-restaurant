import connDB from "../../../middleware/connDB";
import Waiter_credentials from "../../../models/Waiter_credentials";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

// Function to generate a password based on the specified pattern
const generatePassword = (username, age, profession) => {
  const firstTwoLetters = username.substring(0, 4).toLowerCase();
  const professionChar = profession.toLowerCase() === "waiter" ? "w" : "c";
  return `${firstTwoLetters}${age}@${professionChar}`;
};

// Function to send email with Nodemailer
const sendEmail = async (email, username, password) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.NODEMAILER_API_KEY,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your New Account Details',
    text: `Hello ${username},\n\nYour account has been created. Here are your login details:\n\nUsername: ${username}\nPassword: ${password}\n\nBest regards,\nRestaurant Management`,
  };

  try {
    await transporter.sendMail(mailOptions);
    //console.log("Email sent successfully");
  } catch (error) {
    //console.error("Error sending email:", error);
  }
};

const handler = async (req, res) => {
  try {
    if (req.method === "POST") {
      const { formData, id ,waiterId} = req.body;
      //console.log(formData);
      if(waiterId){
        const update=await Waiter_credentials.findByIdAndUpdate(waiterId,{username: formData.name,
          phoneNo: formData.phoneno,
          email: formData.email,
          restaurant_id: id,
          age: formData.age,
          image: formData.image,
          gender: formData.gender,
          profession: formData.profession})
          if(update){
            res.status(200).json({ success: true, data: update });
          }
          else{
            res.status(201).json({ success: false, error: "Could not update waiter" });
          }
      }
      else{if(formData.profession=="Waiter"){
      const password = generatePassword(formData.name, formData.age, formData.profession);
      //console.log(password);
      const passwordHashed = await bcrypt.hash(password, 10);

      const newWaiter = new Waiter_credentials({
        username: formData.name,
        phoneNo: formData.phoneno,
        email: formData.email,
        restaurant_id: id,
        age: formData.age,
        image: formData.image,
        gender: formData.gender,
        profession: formData.profession,
        password: passwordHashed,
      });

      const result = await newWaiter.save();
      if (result) {
        await sendEmail(formData.email, formData.name, password);
        res.status(200).json({ success: true, data: result });
      } else {
        res.status(201).json({ success: false, error: "Could not save waiter" });
      }}
      else{
        // console.log(formData.profession)
        const newChef = new Waiter_credentials({
          username: formData.name,
          phoneNo: formData.phoneno,
          email: formData.email,
          restaurant_id: id,
          age: formData.age,
          image: formData.image,
          gender: formData.gender,
          profession: formData.profession,
        });
        const result = await newChef.save();
      if (result) {
        res.status(200).json({ success: true, data: result });
      } else {
        res.status(201).json({ success: false, error: "Could not save waiter" });
      }
      }}
    } else {
      res.status(405).json({ success: false, error: "Method not allowed" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Error occurred while adding waiter" });
  }
};

export default connDB(handler);
