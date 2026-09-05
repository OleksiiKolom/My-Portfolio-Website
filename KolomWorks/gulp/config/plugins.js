import browsersync from 'browser-sync'; // Локальний сервер
import { deleteAsync } from 'del'; // Асинхронне видалення файлів та папок
import merge from 'merge-stream'; // Об'єднання потоків
import replace from 'gulp-replace'; // Пошук та заміна фрагметів коду
import plumber from 'gulp-plumber'; // Обробка помилок у потоці
import notify from 'gulp-notify'; // Повідомлення (підказки)
import newer from 'gulp-newer'; // Перевірка наявності новішого файлу
import ifPlugin from 'gulp-if'; // Умовне виконання плагіна або функції

// Експортуємо об'єкт плагінів
export const plugins = {
	browsersync,
	deleteAsync,
	merge,
	replace,
	plumber,
	notify,
	newer,
	if: ifPlugin,
};
