// Отримати ім'я папки нашого проєкту
import * as nodePath from "path";
const rootFolder = nodePath.basename(nodePath.resolve());

// Визначення шляхів для папок build та src
const buildFolder = `./dist`;
const srcFolder = `./src`;

export const path = {
	build: {
		html: `${buildFolder}/`,
		css: `${buildFolder}/css/`,
		js: `${buildFolder}/js/`,
		images: `${buildFolder}/img/`,
		fonts: `${buildFolder}/fonts/`,
		files: `${buildFolder}/projects/`,
		en: `${buildFolder}/en/`,
		ua: `${buildFolder}/ua/`,
		ru: `${buildFolder}/ru/`
	},
	src: {
		html: `${srcFolder}/*.html`,
		scss: `${srcFolder}/scss/style.scss`,
		js: `${srcFolder}/js/app.js`,
		staticJs: `${srcFolder}/js/static/**/*.js`,
		images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,ico,webp,webmanifest}`,
		svg: `${srcFolder}/img/**/*.svg`,
		svgicons: `${srcFolder}/svgicons/*.svg`,
		files: `${srcFolder}/projects/**/*.*`,
		en: `${srcFolder}/en/*.html`,
		ua: `${srcFolder}/ua/*.html`,
		ru: `${srcFolder}/ru/*.html`
	},
	watch: {
		html: `${srcFolder}/**/*.{htm,html}`,
		scss: `${srcFolder}/scss/**/*.scss`,
		js: `${srcFolder}/js/**/*.js`,
		images: `${srcFolder}/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp,webmanifest}`,
		files: `${srcFolder}/projects/**/*.*`,
		en: `${srcFolder}/en/**/*.*`,
		ua: `${srcFolder}/ua/**/*.*`,
		ru: `${srcFolder}/ru/**/*.*`
	},
	clean: buildFolder,
	buildFolder: buildFolder,
	srcFolder: srcFolder,
	rootFolder: rootFolder,
	ftp: ''
}