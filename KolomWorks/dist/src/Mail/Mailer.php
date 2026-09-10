<?php

use PHPMailer\PHPMailer\PHPMailer;

function sendEmail(string $name, string $email, string $phone, string $message): void
{
	$config = require __DIR__ . '/../config/mail.php';

	$mail = new PHPMailer(true);

	$mail->isSMTP();
	$mail->Host = $config['host'];
	$mail->SMTPAuth = true;
	$mail->Username = $config['username'];
	$mail->Password = $config['password'];
	$mail->Port = $config['port'];
	$mail->isHTML(true);

	$mail->setFrom($config['from_email'], $config['from_name']);
	$mail->addAddress($config['to_email']);

	$mail->Subject = 'New contact form message';
	$mail->addReplyTo($email, $name);

	$safeMessage = nl2br(htmlspecialchars($message));

	$mail->Body = <<<HTML
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:30px;font-family:Arial,sans-serif;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;padding:30px;border:1px solid #e5e7eb;">

<tr>
<td style="text-align:center;padding-bottom:20px;">
<h2 style="margin:0;color:#1f2937;">Нова заявка</h2>
</td>
</tr>

<tr>
<td style="color:#374151;font-size:15px;line-height:1.6;padding-bottom:20px;">
На сайті <strong>KolomWorks.com</strong> було створено нову заявку.
</td>
</tr>

<tr>
<td style="color:#374151;font-size:15px;line-height:1.6;padding-bottom:20px;">
Користувач залишив свої контактні дані та повідомлення.
</td>
</tr>

<tr>
<td style="padding-bottom:10px;">
<strong style="color:#1f2937;">Повідомлення</strong>
</td>
</tr>

<tr>
<td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:15px;color:#111827;font-size:15px;">
"{$safeMessage}"
</td>
</tr>

<tr>
<td style="padding-top:30px;">
<strong style="color:#1f2937;">Контактні дані</strong>
</td>
</tr>

<tr>
<td style="font-size:15px;color:#374151;line-height:1.8;padding-top:10px;">
<strong>Ім'я:</strong> {$name}<br>
<strong>Email:</strong> {$email}<br>
<strong>Телефон:</strong> {$phone}
</td>
</tr>

</table>

</td>
</tr>
</table>
HTML;

	$mail->send();
}
