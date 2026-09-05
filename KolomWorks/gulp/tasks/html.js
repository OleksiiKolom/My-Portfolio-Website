import fileInclude from 'gulp-file-include'; // Підключення файлів за директивою include
import webpHtmlNosvg from 'gulp-webp-html-nosvg'; // Додавання HTML-коду підключення WebP зображень
import versionNumber from 'gulp-version-number'; // Версіонування посилань на CSS і JS та створення version.json

// Створення потоку обробки HTML
const processHtml = (srcPath, destPath) => {
	return app.gulp
		.src(srcPath)
		.pipe(
			app.plugins.plumber(
				app.plugins.notify.onError({
					title: 'HTML',
					message: 'Error: <%= error.message %>',
				})
			)
		)
		.pipe(fileInclude())
		.pipe(app.plugins.replace(/@img\//g, 'img/'))
		.pipe(app.plugins.if(app.isBuild, webpHtmlNosvg()))
		.pipe(
			app.plugins.if(
				app.isBuild,
				versionNumber({
					value: '%DT%',
					append: {
						key: '_v',
						cover: 0,
						to: ['css', 'js'],
					}
				})
			)
		)
		.pipe(app.gulp.dest(destPath))
		.pipe(app.plugins.browsersync.stream());
};

// Завдання для обробки HTML-файлів
export const html = () => {
	const tasks = [];

	// Обробка основних HTML-файлів
	tasks.push(processHtml(app.path.src.html, app.path.build.html));

	// Якщо сайт є багатомовним
	if (app.isMultilingual) {
		// Додати завдання для кожної мови
		Object.values(app.path.languages).forEach(language => {
			tasks.push(processHtml(language.src, language.build));
		});
	}

	return app.plugins.merge(...tasks);
};
