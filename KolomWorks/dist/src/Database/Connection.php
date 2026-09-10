<?php

function connectDatabase(): PDO
{
	$config = require __DIR__ . '/../config/database.php';

	try {
		$dsn = "mysql:host={$config['host']};dbname={$config['dbname']};charset={$config['charset']}";

		return new PDO(
			$dsn,
			$config['user'],
			$config['password'],
			[
				PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
				PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
			]
		);
	} catch (PDOException $e) {
		error_log($e->getMessage());
		jsonError('Database connection error', $e);
	}
}

function saveMessage(PDO $pdo, string $name, string $email, string $phone, string $message, string $ipAddress): void
{
	try {
		$stmt = $pdo->prepare("
            INSERT INTO contact_messages (name, email, phone, message, ip_address)
            VALUES (:name, :email, :phone, :message, :ip_address)
        ");

		$stmt->execute([
			':name'       => $name,
			':email'      => $email,
			':phone'      => $phone,
			':message'    => $message,
			':ip_address' => $ipAddress
		]);
	} catch (PDOException $e) {
		error_log($e->getMessage());
		jsonError('Failed to save data', $e);
	}
}
