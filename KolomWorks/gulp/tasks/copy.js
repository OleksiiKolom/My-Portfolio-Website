// Експортуємо завдання для копіювання специфічних файлів проєкту, визначених у налаштуваннях
export const copy = done => {

	// Створюємо масив завдань для копіювання специфічних файлів проєкту
	const tasks = app.settings.copyFiles.map(file => {

		return () => app.gulp

			// Читання файлу або папки з вихідної директорії проєкту
			.src(`${app.path.srcFolder}/${file.src}`, {
				encoding: false,
				removeBOM: false
			})

			// Обробка помилок під час виконання завдання
			.pipe(app.plugins.plumber(
				app.plugins.notify.onError({
					title: 'Copy',
					message: 'Error: <%= error.message %>',
				})
			))

			// Збереження до папки build
			.pipe(app.gulp.dest(`${app.path.buildFolder}/${file.dest}`));
	});

	// Виконуємо всі завдання копіювання специфічних файлів паралельно
	return app.gulp.parallel(...tasks)(done);
};