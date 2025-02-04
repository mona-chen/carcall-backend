import nodemailer, { Transporter } from "nodemailer";
import { IUser } from "types/__models__/user";
import ejs from "ejs";
import Mail from "nodemailer/lib/mailer";
export default class Email {
  to: string;
  firstName: string;
  url?: string | Object;
  passcode?: string;
  from: string;
  transporter: Transporter;

  constructor(
    user: IUser,
    { url, passcode }: { passcode?: string; url?: string | Object }
  ) {
    this.to = user.email;
    this.firstName = user?.name.split(" ")[0];
    this.url = url;
    this.passcode = passcode;
    this.from = `Gmela Africa <${process.env.EMAIL_FROM}>`;
    this.transporter = this.newTransport();
  }

  // Create different transports for different environments
  newTransport(): Transporter {
    if (process.env.NODE_ENV === "production") {
      // Sendgrid
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USERNAME || "",
          pass: process.env.SENDGRID_PASSWORD || ""
        }
      } as any); // Specify the type as 'any'
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "",
      port: Number(process.env.EMAIL_PORT) || 0,
      auth: {
        user: process.env.EMAIL_USERNAME || "",
        pass: process.env.EMAIL_PASSWORD || ""
      }
    } as any); // Specify the type as 'any'
  }

  // Send the actual email
  async send(template: string, subject: string): Promise<void> {
    // 1) Render HTML based on a pug template
    const html = await ejs.renderFile(`${__dirname}/../views/${template}.ejs`, {
      firstName: this.firstName,
      url: this.url,
      passcode: this.passcode,
      subject
    });

    // 2) Define email options
    const mailOptions: Mail.Options = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: String(html)
    };

    // 3) Send email
    await this.transporter.sendMail(mailOptions);
  }

  async sendWelcome(): Promise<void> {
    await this.send("welcome", "Welcome to the Gmela Family!");
  }

  async sendPasswordReset(): Promise<void> {
    await this.send(
      "passwordReset",
      "Your password reset token (valid for only 10 minutes)"
    );
  }

  async sendBookingSuccesful(): Promise<void> {
    await this.send("succesfulBooking", "Yay! We Booked your seat");
  }

  async sendLoginPasscode(): Promise<void> {
    await this.send(
      "loginPasscode",
      "Your login passcode (valid for only 10 minutes)"
    );
  }
}
