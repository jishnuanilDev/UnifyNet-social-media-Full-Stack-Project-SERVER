import nodemailer, { SendMailOptions, SentMessageInfo } from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jishnuanil255@gmail.com",
    pass: "ytdi bmwq kals piha",
  },
});

export function sendMail(email: string, text: string) {
  const mailOptions: SendMailOptions = {
    from: "UnifyNet media",
    to: email,
    subject: "Your OTP for verification",
    text: text,
  };

  transporter.sendMail(
    mailOptions,
    (error: Error | null, info: SentMessageInfo) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent successfully:", info.response);
      }
    }
  );
}
