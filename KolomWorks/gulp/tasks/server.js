// Завдання для запуску локального сервера BrowserSync
export const server = done => {
	app.plugins.browsersync.init({
		server: {
			baseDir: app.path.build.html,
		},

		notify: false, // Вимкнення сповіщень
		port: 3000, // Порт сервера
	},
		done
	);
};