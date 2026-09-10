import * as sassPlugin from 'sass'; 								// Плагін для компіляції SCSS у CSS
import gulpSass from 'gulp-sass'; 									// Плагін для компіляції SCSS у CSS
import postcss from 'gulp-postcss'; 								// Плагін для роботи з PostCSS
import autoprefixer from 'autoprefixer'; 							// Додавання префіксів для сумісності з різними браузерами
import groupCssMediaQueries from 'gulp-group-css-media-queries'; 	// Групування media-запитів
import webpcss from 'gulp-webpcss'; 								// Виведення WEBP-зображень
import cleanCss from 'gulp-clean-css'; 								// Стиск CSS-файлу
import rename from 'gulp-rename'; 									// Перейменування .css у .min.css

// Ініціалізація плагіна для компіляції SCSS у CSS
const sass = gulpSass(sassPlugin);

// Експортуємо завдання для обробки SCSS
export const scss = () => {
	return app.gulp

		// Читання основного SCSS-файлу з отриманого шляху
		.src(app.path.src.scss, { sourcemaps: app.isDev })

		// Обробка і виведення помилок в консоль
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: 'SCSS',
				message: 'Error: <%= error.message %>'
			})
		))

		// Компіляція SCSS у CSS
		.pipe(sass({ outputStyle: 'expanded' }))

		// Заміна шляхів до зображень
		.pipe(app.plugins.replace(/@img\//g, '../img/'))

		// Якщо режим збірки — додати префікси для сумісності з різними браузерами під час збірки
		.pipe(app.plugins.if(app.isBuild, postcss([
			autoprefixer({
				grid: true,
				overrideBrowserslist: ['last 3 versions']
			}),
		])))

		// Якщо режим збірки — згрупувати media-запити
		.pipe(app.plugins.if(app.isBuild, groupCssMediaQueries()))

		// Якщо режим збірки — вивести WEBP-зображення
		.pipe(app.plugins.if(app.isBuild, webpcss({
			webpClass: '._webp',
			noWebpClass: '._no-webp'
		})))

		// Зберігання звичайного CSS-файлу
		.pipe(app.gulp.dest(app.path.build.css))

		// Якщо режим збірки — стиснути CSS-файл
		.pipe(app.plugins.if(app.isBuild, cleanCss()))

		// Перейменування у .min.css
		.pipe(rename({ extname: '.min.css' }))

		// Зберігання фінального CSS-файлу
		.pipe(app.gulp.dest(app.path.build.css))

		// Якщо режим розробки — оновити браузер після обробки
		.pipe(app.plugins.if(app.isDev, app.plugins.browsersync.stream()));
};