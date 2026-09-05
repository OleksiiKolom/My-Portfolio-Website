import ttf2Woff from 'gulp-ttf2woff'; // Конвертація ttf --> woff
import ttf2Woff2 from 'gulp-ttf2woff2'; // Конвертація ttf --> woff2

// Конвертація ttf --> woff
const ttfToWoff = () => {
	return app.gulp
		.src(`${app.path.srcFolder}/fonts/*.ttf`, {
			encoding: false, // Читання файлів у двійковому режимі
			removeBOM: false // Вимкнення видалення BOM (перші байти файлу, які можуть містити інформацію про кодування)
		})
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: 'FONTS TTF to WOFF',
				message: 'Error: <%= error.message %>',
			})
		))
		.pipe(ttf2Woff())
		.pipe(app.gulp.dest(app.path.build.fonts));
};

// Конвертація ttf --> woff2
const ttfToWoff2 = () => {
	return app.gulp
		.src(`${app.path.srcFolder}/fonts/*.ttf`, {
			encoding: false, // Читання файлів у двійковому режимі
			removeBOM: false // Вимкнення видалення BOM (перші байти файлу, які можуть містити інформацію про кодування)
		})
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: 'FONTS TTF to WOFF2',
				message: 'Error: <%= error.message %>',
			})
		))
		.pipe(ttf2Woff2())
		.pipe(app.gulp.dest(app.path.build.fonts));
};

// Копіювання woff
const copyWoff = () => {
	return app.gulp
		.src(`${app.path.srcFolder}/fonts/*.woff`)
		.pipe(app.gulp.dest(app.path.build.fonts));
};

// Копіювання woff2
const copyWoff2 = () => {
	return app.gulp
		.src(`${app.path.srcFolder}/fonts/*.woff2`)
		.pipe(app.gulp.dest(app.path.build.fonts));
};

// Завдання для обробки шрифтів
export const fonts = done => {
	return app.gulp.series(ttfToWoff, ttfToWoff2, copyWoff, copyWoff2)(done);
};
