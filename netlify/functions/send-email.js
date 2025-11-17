const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  try {
    const { name, email, phone, subject, message } = JSON.parse(event.body);

    // Hostinger SMTP setup
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER, // info@thesyndicategroup.co.uk
        pass: process.env.EMAIL_PASS, // Hostinger mailbox password
      },
    });

    // Send email to Syndicate Group
    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: "info@thesyndicategroup.co.uk",
      replyTo: email,
      subject: subject || `New enquiry from ${name}`,
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;color:#333;line-height:1.6;">
          <h2 style="color:#0d6efd;">New Contact Form Submission</h2>
          <table style="border-collapse:collapse;width:100%;max-width:600px;">
            <tr><td><strong>Name:</strong> ${name}</td></tr>
            <tr><td><strong>Email:</strong> ${email}</td></tr>
            <tr><td><strong>Phone:</strong> ${phone || "—"}</td></tr>
            <tr><td><strong>Subject:</strong> ${subject}</td></tr>
            <tr><td><strong>Message:</strong></td></tr>
            <tr><td style="padding:10px;background:#f8f9fa;border-left:4px solid #0d6efd;">
              ${message.replace(/\n/g, "<br>")}
            </td></tr>
          </table>
          <hr style="margin:25px 0;border:none;border-top:1px solid #ddd;">
          <div style="font-size:14px;color:#555;">
            <strong style="font-size:16px;color:#0d6efd;">The Syndicate Group</strong><br>
            Security & Facility Management Company<br>
            📧 <a href="mailto:info@thesyndicategroup.co.uk" style="color:#0d6efd;text-decoration:none;">info@thesyndicategroup.co.uk</a><br>
            🌐 <a href="https://www.thesyndicategroup.co.uk" style="color:#0d6efd;text-decoration:none;">www.thesyndicategroup.co.uk</a><br>
            📍 London, United Kingdom
          </div>
          <p style="margin-top:10px;font-size:12px;color:#999;">
            © ${new Date().getFullYear()} The Syndicate Group | All Rights Reserved
          </p>
        </div>
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Email sent successfully!" }),
    };
  } catch (error) {
    console.error("Email send failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
