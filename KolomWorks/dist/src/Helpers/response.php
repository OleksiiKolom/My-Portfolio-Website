<?php
// Функція відправляє JSON-відповідь клієнту і завершує скрипт
function jsonError(string $message, ?Throwable $e = null): never
{
	$config = require __DIR__ . '/../config/app.php';

	header('Content-Type: application/json; charset=utf-8');

	$response = [
		'success' => false,
		'error'   => $message
	];

	// Debug-информация (только для разработки)
	if (!empty($config['debug']) && $e !== null) {
		$response['debug'] = [
			'message' => $e->getMessage(),
			'file'    => $e->getFile(),
			'line'    => $e->getLine(),
			'code'    => $e->getCode()
		];
	}

	echo json_encode($response, JSON_UNESCAPED_UNICODE);
	exit;
}
