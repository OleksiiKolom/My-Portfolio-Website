<?php
// Функція перевіряє та повертає результат валідації імені користувача
function validateName(string $value): bool
{
	$length = mb_strlen($value);

	if ($value === '' || $length < 2 || $length  > 30) return false;

	return (bool) preg_match("/^[a-zA-Zа-яА-ЯёЁіІїЇєЄ'\-\s]+$/u", $value);
}

// Функція перевіряє та повертає результат валідації пошти користувача
function validateEmail(string $value): bool
{
	if ($value === '' || mb_strlen($value) > 100) return false;

	return filter_var($value, FILTER_VALIDATE_EMAIL) !== false;
}

// Функція перевіряє та повертає результат валідації номера телефону користувача
function validatePhone(string $value): bool
{
	return (bool) preg_match('/^[+\d][\d\s\-()]{6,20}$/', $value);
}

// Функція перевіряє та повертає результат валідації повідомлення від користувача
function validateMessage(string $value): bool
{
	$length = mb_strlen($value);

	if ($length < 3 || $length > 5000) return false;

	if (preg_match('/[<>;]/', $value)) return false;

	return true;
}
