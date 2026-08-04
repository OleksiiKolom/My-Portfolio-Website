import fonter from 'gulp-fonter-fix';
import ttf2woff2 from 'gulp-ttf2woff2';

export const otfToTtf = () => {
	// Шукаємо файли шрифтів .otf
	return app.gulp.src(`${app.path.srcFolder}/fonts/*.otf`, {})
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "FONTS",
				message: "Error: <%= error.message %>"
			}))
		)
		// Конвертуємо в .ttf
		.pipe(fonter({
			formats: ['ttf']
		}))
		// Вивантажуємо у вихідну папку
		.pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`))
}

export const ttfToWoff = () => {
	// Шукаємо файли шрифтів .ttf
	return app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`, {})
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "FONTS",
				message: "Error: <%= error.message %>"
			}))
		)
		// Конвертуємо в .woff
		.pipe(fonter({
			formats: ['woff']
		}))
		// Вивантажуємо до папки з результатом
		.pipe(app.gulp.dest(`${app.path.build.fonts}`))
		// Шукаємо файли шрифтів .ttf
		.pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`))
		// Конвертуємо в .woff2
		.pipe(ttf2woff2())
		// Вивантажуємо до папки з результатом
		.pipe(app.gulp.dest(`${app.path.build.fonts}`))
		// Шукаємо файли шрифтів .woff и woff2
		.pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.{woff,woff2}`))
		// Вивантажуємо до папки з результатом
		.pipe(app.gulp.dest(`${app.path.build.fonts}`));
}