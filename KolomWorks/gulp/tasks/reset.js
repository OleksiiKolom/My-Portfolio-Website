// Завдання для очищення папки збірки
export const reset = () => {
	return app.plugins.deleteAsync([app.path.clean]);
};
