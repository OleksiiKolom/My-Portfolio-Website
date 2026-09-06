// Імпорт основного модуля gulp
import gulp from 'gulp';

// Імпорт загальних плагінів
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
	gulp.watch(path.watch.files, copy);
}

// Встановлює режим розробки проєкту
function setDevMode(done) {
	app.isBuild = false;
	app.isDev = true;
	done();
}

// Встановлює режим збірки проєкту
function setBuildMode(done) {
	app.isBuild = true;
	app.isDev = false;
	done();
}

// Основні задачі
const mainTasks = gulp.series(
	fonts,
	gulp.parallel(copy, html, scss, js, images)
);

// Побудова сценаріїв виконання завдань
const dev = gulp.series(
	setDevMode,
	reset,
	mainTasks,
	gulp.parallel(watcher, server)
);

const build = gulp.series(setBuildMode, reset, mainTasks);
const deployZIP = gulp.series(setBuildMode, reset, mainTasks, zip);

// Експорт сценаріїв
export { dev, build, deployZIP };

// Виконання сценарію за замовчуванням
export default dev;