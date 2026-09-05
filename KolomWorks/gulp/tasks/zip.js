import zipPlugin from 'gulp-zip'; // Створення архіву

// Завдання для створення ZIP-архіву
export const zip = async () => {
	// Видалення вже існуючого ZIP-архіву
	await app.plugins.deleteAsync(`./${app.path.rootFolder}.zip`);

	return (
		app.gulp
			.src(`${app.path.buildFolder}/**/*.*`)

			// Обробка і виведення помилок в консоль
			.pipe(
				app.plugins.plumber(
					app.plugins.notify.onError({
						title: 'ZIP',
						message: 'Error: <%= error.message %>',
					})
				)
			)

			// Створити архів
			.pipe(zipPlugin(`${app.path.rootFolder}.zip`))

			// Зберегти ZIP-архів
			.pipe(app.gulp.dest('./'))
	);
};
