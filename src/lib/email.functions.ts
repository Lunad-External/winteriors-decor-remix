import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { executeDbQuery } from "@/lib/db.server";

const SMTP2GO_API_KEY = "api-D59F13BD53EE4E488CB11DAE1C2CC961";
const VERIFIED_SENDER = "website@winteriorsdecor.com";
const RECIPIENT_EMAIL = "info@winteriorsdecor.com";

const attachmentSchema = z.object({
  filename: z.string(),
  fileblob: z.string(), // base64 string
  mimetype: z.string(),
});

const submitFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  company: z.string().optional(),
  message: z.string().min(1),
  type: z.enum(["Enquiry", "Contact"]),
  attachments: z.array(attachmentSchema).optional(),
});

export const submitFormFn = createServerFn({ method: "POST" })
  .validator((input) => submitFormSchema.parse(input))
  .handler(async ({ data }) => {
    const { name, email, phone, company, message, type, attachments } = data;

    // 1. Insert into database
    const enquiryId = crypto.randomUUID();

    const { error: dbError } = await executeDbQuery({
      table: "enquiries",
      action: "insert",
      data: {
        id: enquiryId,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        company: company?.trim() || null,
        message: `${type}: ${message.trim()}`,
        status: "new",
      },
    });

    if (dbError) {
      console.error("Database insert failed:", dbError);
      throw new Error(`Failed to save submission: ${dbError.message}`);
    }

    // 2. Prepare text & HTML bodies for the notification email (Admin notification)
    const textBody = `
New ${type} Received:
---------------------
Type: ${type}
Name: ${name}
Email: ${email}
Phone: ${phone}
Company: ${company || "N/A"}

Message:
${message}
`;

    const htmlBody = `
<div style="font-family: sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #6b21a8;">New ${type} Received</h2>
    <p><strong>Type:</strong> ${type}</p>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Company:</strong> ${company || "N/A"}</p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
    <p><strong>Message:</strong></p>
    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
        ${message.replace(/\n/g, "<br />")}
    </div>
</div>
`;

    // 3. Send notification email to admin via SMTP2GO API
    const smtpApiKey = process.env.SMTP2GO_API_KEY || SMTP2GO_API_KEY;
    const notifyResponse = await fetch("https://api.smtp2go.com/v3/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Smtp2go-Api-Key": smtpApiKey,
      },
      body: JSON.stringify({
        sender: VERIFIED_SENDER,
        to: [RECIPIENT_EMAIL],
        reply_to: email,
        subject: `New ${type} from ${name}`,
        text_body: textBody,
        html_body: htmlBody,
        attachments: attachments || [],
      }),
    });

    if (!notifyResponse.ok) {
      const errText = await notifyResponse.text();
      console.error("SMTP2GO admin notification failed:", errText);
      throw new Error(`Notification failed to send: ${errText}`);
    }

    // 4. Send acknowledgment email to user (Thank you email)
    const ackTextBody = `
Dear ${name},

Thank you for contacting Winteriors Decor. We have received your ${type.toLowerCase()} and our team will get back to you within one business day.

Best regards,
Winteriors Decor LLC
`;

    const ackHtmlBody = `
<div style="font-family: sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #6b21a8;">Thank you for contacting Winteriors Decor</h2>
    <p>Dear ${name},</p>
    <p>We have received your ${type.toLowerCase()} and our team will get back to you within one business day.</p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
    <p>Best regards,</p>
    <p><strong>Winteriors Decor LLC</strong></p>
</div>
`;

    const ackResponse = await fetch("https://api.smtp2go.com/v3/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Smtp2go-Api-Key": smtpApiKey,
      },
      body: JSON.stringify({
        sender: VERIFIED_SENDER,
        to: [email],
        subject: `Thank you for your ${type.toLowerCase()} — Winteriors Decor`,
        text_body: ackTextBody,
        html_body: ackHtmlBody,
      }),
    });

    if (!ackResponse.ok) {
      const errText = await ackResponse.text();
      console.warn("SMTP2GO user acknowledgment failed:", errText);
    }

    return { success: true, id: enquiryId };
  });
