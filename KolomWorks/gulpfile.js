// Імпорт основного модуля gulp
import gulp from 'gulp';

// Імпорт загальних/спільних плагінів
import { plugins } from './gulp/config/plugins.js';

// Імпорт шляхів
import { path } from './gulp/config/path.js';

// Імпорт налаштувань для поточного проєкту
import { settings } from './gulp/config/settings.js';

// Передаємо значення в глобальну змінну
global.app = {
	gulp,
	plugins,
	path,
	settings,
	isMultilingual: settings.isMultilingual
};

// Імпорт завдань
import { html } from './gulp/tasks/html.js';
import { scss } from './gulp/tasks/scss.js';
import { js } from './gulp/tasks/js.js';
import { fonts } from './gulp/tasks/fonts.js';
import { images } from './gulp/tasks/images.js';
import { copy } from './gulp/tasks/copy.js';
import { reset } from './gulp/tasks/reset.js';
import { server } from './gulp/tasks/server.js';
import { zip } from './gulp/tasks/zip.js';

// Спостерігач за змінами у файлах
function watcher() {
	gulp.watch(path.watch.html, html);
	gulp.watch(path.watch.scss, scss);
	gulp.watch(path.watch.js, js);
	gulp.watch(path.watch.images, images);
}

// Функція встановлює режим розробки/збірки проєкту
function setMode(mode) {
	return function (done) {
		app.isDev = mode === 'dev';
		app.isBuild = mode === 'build';

		done();
	};
}

// Основні задачі
const mainTasks = gulp.series(
	fonts,
	gulp.parallel(html, scss, js, images, copy)
);

// Побудова сценарія виконання завдання під час розробки проєкту
const dev = gulp.series(
	setMode('dev'),
	reset,
	mainTasks,
	gulp.parallel(watcher, server)
);

// Побудова сценарія виконання завдання під час збірки проєкту
const build = gulp.series(setMode('build'), reset, mainTasks);

// Побудова сценарія виконання завдання під час архівації
const deployZIP = gulp.series(setMode('build'), reset, mainTasks, zip);

// Експорт сценаріїв
export { dev, build, deployZIP };

// Виконання сценарію за замовчуванням
export default dev;