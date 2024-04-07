import { Resend } from "resend";
import dotenv from 'dotenv';

dotenv.config({path:'../.env'});

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (message, email) => {
    const { data, error } = await resend.emails.send({
        from: "gaikwadavishkar546@gmail.com",
        to: [email],
        subject: message
    });

    if (error) {
        return res.status(400).json({ error });
    }
}

