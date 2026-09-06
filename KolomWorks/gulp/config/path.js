// Імпорт стандартного модуля Node.js для роботи з файловими шляхами
import * as nodePath from 'path';

// Імпорт налаштувань для поточного проєкту
import { settings } from './settings.js';

// Отримуємо ім'я кореневої папки проєкту
const rootFolder = nodePath.basename(nodePath.resolve());

// Визначення шляхів для папок build та src
const buildFolder = `./dist`;
const srcFolder = `./src`;

// Шляхи для мов (мультимовний сайт)
const languages = Object.fromEntries(
	settings.languages.map(language => [
		language,
		{
			build: `${buildFolder}/${language}/`,
			src: `${srcFolder}/${language}/**/*.html`,
			watch: `${srcFolder}/${language}/**/*.html`
		},
	])
);

// Експортуємо шляхи
export const path = {
	build: {
		html: `${buildFolder}/`,
		css: `${buildFolder}/css/`,
		js: `${buildFolder}/js/`,
		jsLibs: `${buildFolder}/js/libs/`,
		images: `${buildFolder}/img/`,
		fonts: `${buildFolder}/fonts/`,
		files: `${buildFolder}/projects/`
	},
	src: {
		html: `${srcFolder}/*.html`,
		scss: `${srcFolder}/scss/style.scss`,
		js: `${srcFolder}/js/app.js`,
		jsLibs: `${srcFolder}/js/libs/**/*.*`,
		fonts: `${srcFolder}/fonts/**/*.*`,
		images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,ico,webp,webmanifest}`,
		svg: `${srcFolder}/img/**/*.svg`,
		files: `${srcFolder}/projects/**/*.*`
	},
	watch: {
		html: `${srcFolder}/**/*.{htm,html}`,
		scss: `${srcFolder}/scss/**/*.scss`,
		js: `${srcFolder}/js/**/*.js`,
		images: `${srcFolder}/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp,webmanifest}`,
		files: `${srcFolder}/projects/**/*.*`
	},
	clean: buildFolder,
	buildFolder,
	srcFolder,
	rootFolder,
	languages
};
