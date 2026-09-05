import * as sassPlugin from 'sass';
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import rename from 'gulp-rename';

import cleanCss from 'gulp-clean-css'; // Стиск CSS-файлу
import webpcss from 'gulp-webpcss'; // Виведення WEBP-зображень
import groupCssMediaQueries from 'gulp-group-css-media-queries'; // Групування media-запитів

const sass = gulpSass(sassPlugin);

// Завдання для обробки SCSS
export const scss = () => {
	return (
		app.gulp
			.src(app.path.src.scss, { sourcemaps: app.isDev })

			// Обробка і виведення помилок в консоль
			.pipe(
				app.plugins.plumber(
					app.plugins.notify.onError({
						title: 'SCSS',
						message: 'Error: <%= error.message %>',
					})
				)
			)

			// Компіляція SCSS у CSS
			.pipe(
				sass({
					outputStyle: 'expanded',
				})
			)

			// Заміна шляхів до зображень
			.pipe(app.plugins.replace(/@img\//g, '../img/'))

			// Додавання вендорних префіксів
			.pipe(
				postcss([
					autoprefixer({
						grid: true,
						overrideBrowserslist: ['last 3 versions'],
					}),
				])
			)

			// Групування media-запитів під час збірки
			.pipe(app.plugins.if(app.isBuild, groupCssMediaQueries()))

			// Виведення WEBP-зображень у CSS під час збірки
			.pipe(
				app.plugins.if(
					app.isBuild,
					webpcss({
						webpClass: '._webp',
						noWebpClass: '._no-webp',
					})
				)
			)

			// Зберігання звичайного CSS-файлу
			.pipe(app.gulp.dest(app.path.build.css))

			// Стиск CSS під час збірки
			.pipe(app.plugins.if(app.isBuild, cleanCss()))

			// Перейменування у .min.css
			.pipe(rename({ extname: '.min.css' }))

			// Зберігання фінального CSS-файлу
			.pipe(app.gulp.dest(app.path.build.css))

			// Оновлення браузера
			.pipe(app.plugins.browsersync.stream())
	);
};
