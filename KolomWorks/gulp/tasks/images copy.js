import webp from 'gulp-webp'; // Конвертування растрових зображень у WebP
import imagemin from 'gulp-imagemin'; // Оптимізація зображень

// Створення потоку для обробки растрових зображень
const processImages = () => {
	const source = app.gulp.src(app.path.src.images).pipe(
		app.plugins.plumber(
			app.plugins.notify.onError({
				title: 'IMAGES',
				message: 'Error: <%= error.message %>',
			})
		)
	);

	// Режим розробки — просто копіюємо зображення
	if (app.isDev) {
		return source.pipe(app.gulp.dest(app.path.build.images));
	}

	// Оптимізація оригінальних зображень
	const optimizedImages = source
		.pipe(imagemin())
		.pipe(app.gulp.dest(app.path.build.images));

	// Конвертування зображень у WebP
	const webpImages = app.gulp
		.src(app.path.src.images)
		.pipe(
			app.plugins.plumber(
				app.plugins.notify.onError({
					title: 'WEBP',
					message: 'Error: <%= error.message %>',
				})
			)
		)
		.pipe(webp())
		.pipe(app.gulp.dest(app.path.build.images));

	return app.plugins.merge(optimizedImages, webpImages);
};

// Створення потоку для обробки SVG
const processSvg = () => {
	const source = app.gulp.src(app.path.src.svg).pipe(
		app.plugins.plumber(
			app.plugins.notify.onError({
				title: 'SVG',
				message: 'Error: <%= error.message %>',
			})
		)
	);

	// Режим розробки — просто копіюємо SVG
	if (app.isDev) {
		return source.pipe(app.gulp.dest(app.path.build.images));
	}

	// Режим збірки — оптимізуємо SVG
	return source.pipe(imagemin()).pipe(app.gulp.dest(app.path.build.images));
};

// Завдання для обробки зображень
export const images = () => {
	return app.plugins.merge(processImages(), processSvg());
};