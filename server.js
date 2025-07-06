const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors'); // ✅ Use this instead of manual CORS headers

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const ALLOWED_ORIGIN = 'https://aris070103.github.io';

// ✅ Middleware
app.use(cors({
  origin: ALLOWED_ORIGIN,
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ POST /send-email endpoint
app.post('/send-email', async (req, res) => {
  const { response } = req.body;

  if (!response) {
    return res.status(400).json({ success: false, message: 'Missing response data.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    });

    const mailOptions = {
      from: EMAIL_USER,
      to: EMAIL_USER,
      subject: 'Answer',
      text: `She said: ${response}`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.response);
    res.status(200).json({ success: true, message: 'Email sent successfully!' });

  } catch (error) {
    console.error('❌ Email send error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email.', error: error.message });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
