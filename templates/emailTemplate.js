const template = (OtpCode) => `<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Anda</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            background-color: #ffffff;
            margin: 50px auto;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 600px;
        }
        .header {
            color: #ffffff;
            text-align: left;
            padding: 10px 20px;
            background-color: hsla(221, 100%, 59%, 0.9);
            border-bottom: 1px solid #dddddd;
        }
        .header img {
            max-width: 100px;
        }
        .content {
            padding: 20px;
            text-align: left;
        }
        .otp {
            font-size: 24px;
            font-weight: bold;
            color: #333333;
            letter-spacing: 5px;
        }
        .footer {
            text-align: center;
            padding: 10px;
            color: #777777;
            font-size: 12px;
            border-top: 1px solid #dddddd;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Kode OTP Anda</h1>
        </div>
        <div class="content">
            <p>Gunakan kode OTP di bawah ini untuk melanjutkan proses verifikasi akun Anda. Kode ini akan berlaku selama 5 menit.</p>
            <p class="otp">${OtpCode}</p>
            <p>Jika Anda tidak meminta kode OTP ini, silakan abaikan email ini.</p>
        </div>
    </div>
</body>
</html>`;

module.exports = template;
