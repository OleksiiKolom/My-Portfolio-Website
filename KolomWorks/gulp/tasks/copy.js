// Завдання для копіювання загальних файлів
export const copy = () => {
	return app.gulp
		// Читання загальних файлів з отриманого шляху
		.src(app.path.src.files, {
			encoding: false, // Читання файлів у двійковому режимі
			removeBOM: false // Вимкнення видалення BOM (перші байти файлу, які можуть містити інформацію про кодування)
		})

		// Обробка помилок під час виконання завдання
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: 'Copy',
				message: 'Error: <%= error.message %>',
			})
		))

		// Збереження загальних файлів до папки build
		.pipe(app.gulp.dest(app.path.build.files));
};