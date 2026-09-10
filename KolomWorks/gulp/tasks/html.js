import fileInclude from 'gulp-file-include'; 		// Підключення файлів за директивою include
import webpHtmlNosvg from 'gulp-webp-html-nosvg';   // Додавання HTML-коду підключення WebP зображень
import versionNumber from 'gulp-version-number';   	// Версіонування CSS та JS файлів для уникнення кешування
import merge from 'merge-stream'; 					// Об'єднання потоків

// Створення потоку обробки HTML
const processHtml = (srcPath, destPath) => {
	return app.gulp

		// Читання HTML-файлів з отриманного шляху
		.src(srcPath)

		// Обробка помилок під час виконання завдання
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: 'HTML',
				message: 'Error: <%= error.message %>',
			})
		))

		// Підключення файлів за директивою include
		.pipe(fileInclude())

		// Заміна шляху до зображень у HTML-коді
		.pipe(app.plugins.replace(/@img\//g, 'img/'))

		// Якщо режим збірки — додати HTML-код підключення WebP зображень
		.pipe(app.plugins.if(app.isBuild, webpHtmlNosvg()))

		// Якщо режим збірки — додати версіонування CSS та JS файлів
		.pipe(app.plugins.if(app.isBuild, versionNumber({
			value: '%DT%',
			append: {
				key: '_v',
				cover: 0,
				to: ['css', 'js'],
			}
		})))

		// Збереження оброблених HTML-файлів до папки build
		.pipe(app.gulp.dest(destPath))

		// Оновлення браузера після обробки HTML
		.pipe(app.plugins.browsersync.stream());
};

// Експортуємо завдання для обробки HTML-файлів
export const html = () => {
	// Масив для зберігання завдань обробки HTML
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

	// Повертаємо об'єднаний потік для виконання всіх завдань
	return merge(...tasks);
};