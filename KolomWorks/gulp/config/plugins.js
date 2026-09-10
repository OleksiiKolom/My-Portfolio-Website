import plumber from 'gulp-plumber'; 	// Обробка помилок у потоці
import notify from 'gulp-notify'; 		// Повідомлення (підказки)
import browsersync from 'browser-sync'; // Локальний сервер
import { deleteAsync } from 'del'; 		// Асинхронне видалення файлів та папок
import replace from 'gulp-replace'; 	// Пошук та заміна фрагметів коду
import ifPlugin from 'gulp-if'; 		// Умовне виконання плагіна або функції

// Експортуємо об'єкт плагінів
export const plugins = {
	plumber,
	notify,
	browsersync,
	deleteAsync,
	replace,
	if: ifPlugin
};