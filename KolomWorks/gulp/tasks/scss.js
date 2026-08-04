import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename'; // Перейменування файлів

import cleanCss from 'gulp-clean-css'; // Стиск CSS файлу
import webpcss from 'gulp-webpcss'; // Виведення WEBP зображень
import autoPrefixer from 'gulp-autoprefixer'; // Додавання вендорних префіксів
import groupCssMediaQueries from 'gulp-group-css-media-queries'; // Групування media-запросів

const sass = gulpSass(dartSass);

export const scss = () => {
	return app.gulp.src(app.path.src.scss, { sourcemaps: app.isDev })

		// Обробка і виведення помилок в консоль
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "SCSS",
				message: "Error: <%= error.message %>"
			})))

		// Скомпілювати SCSS в CSS без стискання 
		.pipe(sass({
			outputStyle: "expanded"
		}))

		// Заміна/корегування шляхів зображень
		.pipe(app.plugins.replace(/@img\//g, "../img/"))

		// Згрупувати media-файли
		.pipe(
			app.plugins.if(
				app.isBuild,
				groupCssMediaQueries()
			)
		)

		// Додати вендорні префікси для останніх 3-х версій
		.pipe(
			app.plugins.if(
				app.isBuild,
				autoPrefixer({
					grid: true,
					overrideBrowserslist: ["last 3 versions"],
					cascade: true
				})
			)
		)

		// Вивести WEBP зображення
		.pipe(
			app.plugins.if(
				app.isBuild,
				webpcss({
					webpClass: "._webp",
					noWebpClass: "._no-webp"
				})
			)
		)

		// Зберегти звичайний (нестиснутий файл)
		.pipe(app.gulp.dest(app.path.build.css))

		// Оптимізувати файл
		.pipe(
			app.plugins.if(
				app.isBuild,
				cleanCss()
			)
		)

		// Перейменувати файл
		.pipe(rename({ extname: ".min.css" }))

		// Зберігти CSS-файли
		.pipe(app.gulp.dest(app.path.build.css))

		// Оновити браузер
		.pipe(app.plugins.browsersync.stream());
}