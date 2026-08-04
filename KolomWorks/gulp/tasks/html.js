import fileInclude from 'gulp-file-include'; 	  // Підключення файлів за директивою include
import webpHtmlNosvg from 'gulp-webp-html-nosvg'; // Додавання HTML-коду підключення WebP зображень
import versionNumber from 'gulp-version-number';  // Додавання версії в version.json для посилань на CSS і JS

// Завдання для обробки HTML-файлів
export const html = (done) => {
	const copyTasks = ['en', 'ua', 'ru', 'html'].map((language) => {
		const srcPath = app.path.src[language];
		const destPath = app.path.build[language];

		return () => {
			return app.gulp.src(srcPath)
				.pipe(app.plugins.plumber(
					app.plugins.notify.onError({
						title: "HTML",
						message: "Error: <%= error.message %>"
					}))
				)
				.pipe(fileInclude())
				.pipe(app.plugins.replace(/@img\//g, "img/"))
				.pipe(
					app.plugins.if(
						app.isBuild,
						webpHtmlNosvg()
					)
				)
				.pipe(
					app.plugins.if(
						app.isBuild,
						versionNumber({
							'value': '%DT%',
							'append': {
								'key': '_v',
								'cover': 0,
								'to': [
									'css',
									'js'
								]
							},
							'output': {
								'file': 'gulp/version.json'
							}
						})
					)
				)
				.pipe(app.gulp.dest(destPath))
				.pipe(app.plugins.browsersync.stream());
		};
	});

	return app.gulp.parallel(...copyTasks, (cb) => cb())(done);
};

