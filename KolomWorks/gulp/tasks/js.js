import webpack from 'webpack-stream'; // Модуль webpack для збірки файлів .js

// Обробка основного JavaScript
const appJS = () => {
	return app.gulp
		// Читання основного JS-файлу з отриманого шляху
		.src(app.path.src.js, { sourcemaps: app.isDev })

		// Обробка помилок під час виконання завдання
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: 'JS',
				message: 'Error: <%= error.message %>',
			})
		))

		// Застосування webpack для обробки JS-файлів
		.pipe(webpack({
			mode: app.isBuild ? 'production' : 'development',
			output: {
				filename: 'app.min.js',
			},
		}))

		// Збереження обробленого JS-файлу до папки build
		.pipe(app.gulp.dest(app.path.build.js));
};

// Копіювання JavaScript-бібліотек і плагінів
const libsJS = () => {
	return app.gulp
		// Читання JS-бібліотек з отриманного шляху
		.src(app.path.src.jsLibs, {
			encoding: false, // Читання файлів у двійковому режимі
			removeBOM: false // Вимкнення видалення BOM (перші байти файлу, які можуть містити інформацію про кодування)
		})

		// Обробка помилок під час виконання завдання
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: 'Copy libsJS',
				message: 'Error: <%= error.message %>',
			})
		))

		// Збереження JS-бібліотек до папки build
		.pipe(app.gulp.dest(app.path.build.jsLibs));
};

// Завдання для обробки JS-файлів
export const js = done => {
	// Виконуємо обробку основного JS та копіювання бібліотек паралельно
	return app.gulp.parallel(appJS, libsJS)(done);
};