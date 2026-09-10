// Експортуємо об'єкт налаштування для поточного проєкту
export const settings = {
	// Чи є сайт мультимовним
	isMultilingual: true,

	// Зберігає підтримані мови сайту, які будуть використані у шляхах
	languages: ['en', 'ru', 'ua'],

	/// Шляхи до нетипових ресурсів проєкту для копіювання
	copyFiles: [
		{ src: 'projects/**/*', dest: 'projects' },
		{ src: 'config/**/*', dest: 'config' },
		{ src: 'public/**/*', dest: 'public' },
		{ src: 'src/**/*', dest: 'src' },
		{ src: 'vendor/**/*', dest: 'vendor' },
		{ src: 'composer.json', dest: '.' },
		{ src: 'composer.lock', dest: '.' },
		{ src: 'robots.txt', dest: '.' },
		{ src: 'sitemap.xml', dest: '.' }
	]
};