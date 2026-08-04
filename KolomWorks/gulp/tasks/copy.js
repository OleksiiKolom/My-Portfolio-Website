/*// Завдання для копіювання файлів
export const copy = () => {
	return app.gulp.src(app.path.src.files)

		// Копіювати папку files у вихідну папку
		.pipe(app.gulp.dest(app.path.build.files))
}*/

import merge from 'merge-stream';

export const copy = () => {
	// Створюємо завдання для кожної мови
	const copyTasks = ['en', 'ua', 'ru'].map((language) => {
		const srcPath = app.path.src[language];
		const destPath = app.path.build[language];

		return app.gulp.src(srcPath)
			.pipe(app.gulp.dest(destPath));
	});

	// Завдання для копіювання загальних файлів
	const commonFilesTask = app.gulp.src(app.path.src.files)
		.pipe(app.gulp.dest(app.path.build.files));

	// Завдання для копіювання статичних файлів js
	const staticJsTask = app.gulp.src(app.path.src.staticJs)
		.pipe(app.gulp.dest(app.path.build.js));

	// Об'єднуємо всі завдання в одне
	return merge(commonFilesTask, staticJsTask, ...copyTasks);
};