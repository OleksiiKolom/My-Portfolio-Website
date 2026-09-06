import * as sassPlugin from 'sass'; 								// Плагін для компіляції SCSS у CSS
import gulpSass from 'gulp-sass'; 									// Плагін для компіляції SCSS у CSS
import postcss from 'gulp-postcss'; 								// Плагін для роботи з PostCSS
import autoprefixer from 'autoprefixer'; 							// Додавання префіксів для сумісності з різними браузерами
import rename from 'gulp-rename'; 									// Перейменування .css у .min.css
import cleanCss from 'gulp-clean-css'; 								// Стиск CSS-файлу
import webpcss from 'gulp-webpcss'; 								// Виведення WEBP-зображень
import groupCssMediaQueries from 'gulp-group-css-media-queries'; 	// Групування media-запитів

const sass = gulpSass(sassPlugin);

// Завдання для обробки SCSS
export const scss = () => {
	return (app.gulp
		// Читання основного SCSS-файлу з отриманого шляху
		.src(app.path.src.scss, { sourcemaps: app.isDev })

		// Обробка і виведення помилок в консоль
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: 'SCSS',
				message: 'Error: <%= error.message %>',
			})
		))

		// Компіляція SCSS у CSS
		.pipe(sass({ outputStyle: 'expanded' }))

		// Заміна шляхів до зображень
		.pipe(app.plugins.replace(/@img\//g, '../img/'))

		// Додавання префіксів для сумісності з різними браузерами під час збірки
		.pipe(app.plugins.if(app.isBuild, postcss([
			autoprefixer({
				grid: true,
				overrideBrowserslist: ['last 3 versions'],
			}),
		])))

		// Групування media-запитів під час збірки
		.pipe(app.plugins.if(app.isBuild, groupCssMediaQueries()))

		// Виведення WEBP-зображень у CSS під час збірки
		.pipe(app.plugins.if(app.isBuild, webpcss({
			webpClass: '._webp',
			noWebpClass: '._no-webp',
		})))

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
