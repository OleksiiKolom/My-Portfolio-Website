<?php

declare(strict_types=1);

require __DIR__ . '/../vendor/autoload.php';

require __DIR__ . '/../src/helpers.php';
require __DIR__ . '/../src/validation.php';
require __DIR__ . '/../src/database.php';
require __DIR__ . '/../src/mailer.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	jsonError('Invalid request method');
}

$name    = trim($_POST['name'] ?? '');
$email   = trim($_POST['email'] ?? '');
$phone   = trim($_POST['phone'] ?? '');
$message = trim($_POST['message'] ?? '');

if (!validateName($name)) jsonError('Invalid name');
if (!validateEmail($email)) jsonError('Invalid email');
if (!validatePhone($phone)) jsonError('Invalid phone');
if (!validateMessage($message)) jsonError('Invalid message');

$phone = preg_replace('/\D+/', '', $phone);
$ipAddress = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

$pdo = connectDatabase();

saveMessage($pdo, $name, $email, $phone, $message, $ipAddress);
sendEmail($name, $email, $phone, $message);

echo json_encode(['success' => true], JSON_UNESCAPED_UNICODE);
