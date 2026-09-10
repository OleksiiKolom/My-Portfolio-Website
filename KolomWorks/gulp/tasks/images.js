import newer from 'gulp-newer'; 		// Перевірка наявності новішого файлу (зображення)
import webp from 'gulp-webp'; 			// Конвертування растрових зображень у WebP
import imagemin from 'gulp-imagemin'; 	// Оптимізація зображень

// Конвертування растрових зображень у WebP
const convertToWebp = () => {
	return app.gulp

		// Читання растрових зображень з отриманого шляху
		.src(app.path.src.images, {
			encoding: false, // Читання файлів у двійковому режимі
			removeBOM: false // Вимкнення видалення BOM (перші байти файлу, які можуть містити інформацію про кодування)
		})

		// Обробка помилок під час виконання завдання
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: 'Сonvert to Webp',
				message: 'Error: <%= error.message %>',
			})
		))

		// Якщо режим збірки — обрати лише нові або змінені зображення .webp
		.pipe(app.plugins.if(app.isBuild,
			newer({
				dest: app.path.build.images,
				ext: '.webp'
			})
		))

		// Якщо режим збірки — конвертувати зображення у WebP
		.pipe(app.plugins.if(app.isBuild, webp()))

		// Якщо режим збірки — зберегти конвертовані зображення у WebP до папки build
		.pipe(app.plugins.if(app.isBuild,
			app.gulp.dest(app.path.build.images)
		));
};

// Оптимізація оригінальних растрових зображень
const optimizeImages = () => {
	return app.gulp

		// Читання растрових зображень з отриманого шляху
		.src(app.path.src.images, {
			encoding: false, // Читання файлів у двійковому режимі
			removeBOM: false // Вимкнення видалення BOM (перші байти файлу, які можуть містити інформацію про кодування)
		})

		// Обробка помилок під час виконання завдання
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: 'IMAGES',
				message: 'Error: <%= error.message %>',
			})
		))

		// Фільтр: обрати лише нові або змінені зображення
		.pipe(newer(app.path.build.images))

		// Якщо режим збірки — оптимізувати зображення
		.pipe(app.plugins.if(app.isBuild, imagemin()))

		// Зберегти зображення
		.pipe(app.gulp.dest(app.path.build.images))

		// Якщо режим розробки — оновити браузер після обробки
		.pipe(app.plugins.if(app.isDev, app.plugins.browsersync.stream()));
};

// Створення потоку для обробки SVG
const processSvg = () => {
	return app.gulp

		// Читання SVG-файлів з отриманого шляху
		.src(app.path.src.svg)

		// Обробка помилок під час виконання завдання
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: 'SVG',
				message: 'Error: <%= error.message %>',
			})
		))

		// Фільтр: обрати лише нові або змінені SVG-файли
		.pipe(newer(app.path.build.images))

		// Якщо режим збірки — оптимізувати SVG-файли
		.pipe(app.plugins.if(app.isBuild, imagemin()))

		// Зберегти оброблені SVG-файли до папки build
		.pipe(app.gulp.dest(app.path.build.images))

		// Якщо режим розробки — оновити браузер після обробки
		.pipe(app.plugins.if(app.isDev, app.plugins.browsersync.stream()));
};

// Завдання для обробки растрових зображень
const processImages = done => {
	// Виконуємо обробку зображень паралельно: оптимізацію та конвертацію у WebP
	return app.gulp.parallel(optimizeImages, convertToWebp)(done);
};

// Експортуємо завдання для обробки зображень
export const images = done => {
	// Виконуємо обробку зображень растрових зображень та SVG-зображень паралельно
	return app.gulp.parallel(processImages, processSvg)(done);
};