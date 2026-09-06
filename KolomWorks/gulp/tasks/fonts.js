import ttf2Woff from 'gulp-ttf2woff';   // Конвертація ttf --> woff
import ttf2Woff2 from 'gulp-ttf2woff2'; // Конвертація ttf --> woff2

// Конвертація ttf --> woff
const ttfToWoff = () => {
	return app.gulp

		// Шлях до вихідних шрифтів формату .ttf
		.src(`${app.path.srcFolder}/fonts/*.ttf`, {
			encoding: false, // Читання файлів у двійковому режимі
			removeBOM: false // Вимкнення видалення BOM (перші байти файлу, які можуть містити інформацію про кодування)
		})

		// Обробка помилок під час конвертації
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: 'FONTS TTF to WOFF',
				message: 'Error: <%= error.message %>',
			})
		))

		// Конвертація шрифтів у формат woff
		.pipe(ttf2Woff())

		// Збереження конвертованих шрифтів до папки build
		.pipe(app.gulp.dest(app.path.build.fonts));
};

// Конвертація ttf --> woff2
const ttfToWoff2 = () => {
	return app.gulp

		// Шлях до вихідних шрифтів формату .ttf
		.src(`${app.path.srcFolder}/fonts/*.ttf`, {
			encoding: false, // Читання файлів у двійковому режимі
			removeBOM: false // Вимкнення видалення BOM (перші байти файлу, які можуть містити інформацію про кодування)
		})

		// Обробка помилок під час конвертації
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: 'FONTS TTF to WOFF2',
				message: 'Error: <%= error.message %>',
			})
		))

		// Конвертація шрифтів у формат woff2
		.pipe(ttf2Woff2())

		// Збереження конвертованих шрифтів до папки build
		.pipe(app.gulp.dest(app.path.build.fonts));
};

// Копіювання woff
const copyWoff = () => {
	return app.gulp

		// Шлях до вихідних шрифтів формату .woff
		.src(`${app.path.srcFolder}/fonts/*.woff`, {
			encoding: false, // Читання файлів у двійковому режимі
			removeBOM: false // Вимкнення видалення BOM (перші байти файлу, які можуть містити інформацію про кодування)
		})

		// Обробка помилок під час виконання завдання
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: 'Сopy Woff',
				message: 'Error: <%= error.message %>',
			})
		))

		// Збереження шрифтів до папки build
		.pipe(app.gulp.dest(app.path.build.fonts));
};

// Копіювання woff2
const copyWoff2 = () => {
	return app.gulp

		// Шлях до вихідних шрифтів формату .woff2
		.src(`${app.path.srcFolder}/fonts/*.woff2`, {
			encoding: false, // Читання файлів у двійковому режимі
			removeBOM: false // Вимкнення видалення BOM (перші байти файлу, які можуть містити інформацію про кодування)
		})

		// Обробка помилок під час виконання завдання
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: 'Сopy Woff2',
				message: 'Error: <%= error.message %>',
			})
		))

		// Збереження шрифтів до папки build
		.pipe(app.gulp.dest(app.path.build.fonts));
};

// Завдання для обробки шрифтів
export const fonts = done => {
	// Виконуємо послідовно конвертацію та копіювання шрифтів
	return app.gulp.series(ttfToWoff, ttfToWoff2, copyWoff, copyWoff2)(done);
};