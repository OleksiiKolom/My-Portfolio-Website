// Імпортуємо модуль webpack для збірки файлів .js
import webpack from 'webpack-stream';

// Обробка основного JavaScript
const appJS = () => {
	return app.gulp
		.src(app.path.src.js, { sourcemaps: app.isDev })

		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: 'JS',
				message: 'Error: <%= error.message %>',
			})
		))

		.pipe(webpack({
			mode: app.isBuild ? 'production' : 'development',
			output: {
				filename: 'app.min.js',
			},
		}))

		.pipe(app.gulp.dest(app.path.build.js));
};

// Копіювання JavaScript-бібліотек
const libsJS = () => {
	return app.gulp
		.src(app.path.src.jsLibs)
		.pipe(app.gulp.dest(app.path.build.jsLibs));
};

// Експортуємо завдання для обробки JS-файлів
export const js = done => {
	return app.gulp.parallel(appJS, libsJS)(done);
};