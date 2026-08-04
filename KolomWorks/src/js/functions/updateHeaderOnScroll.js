// Додає відповідний клас елементу header під час скролу
export function updateHeaderOnScroll({
	selectorElement,                      // Селектор елемента до якого буде додано клас під час скролу
	classScrollActive = '_scroll-active', // Клас, який буде додано до елемента під час скролу, за замовчуванням — _scroll-active
	delayThrottle = 100                   // Затримка для throttle у мілісекундах, за замовчуванням — 100 мс
} = {}) {
	// Оримуємо елемент до якого буде додано клас під час скролу
	const headerElement = document.querySelector(selectorElement);

	// Якщо такого елемента не існує — завершити функцію
	if (!headerElement) return;

	// Розраховуємо початок спрацювання скролу (половина висоти елемента header)
	const startPoint = headerElement.offsetHeight / 2 || 0;

	// Функція тротлінгу для оптимізації виклику onScroll
	const throttledScroll = throttle(onScroll, delayThrottle);

	// Додаємо обробник події scroll із застосуванням тротлінгу
	window.addEventListener('scroll', throttledScroll, { passive: true });

	// Викликаємо одразу для початкового стану
	onScroll();

	// Функція додає/видаляє клас елемента залежно від положення скролу
	function onScroll() {
		// Отримуємо поточне значеня скролу
		const scrollY = window.scrollY || document.documentElement.scrollTop;

		// Розраховуємо, чи потрібно додати клас (якщо скрол більше за startPoint)
		const shouldActivate = scrollY > startPoint;

		// Додаємо або видаляємо клас елемента залежно від положення скролу
		headerElement.classList.toggle(classScrollActive, shouldActivate);
	}

	// Функція тротлінгу для обмеження частоти виклику обробника події
	function throttle(callback, delay) {

		// Зберігає час останнього виклику функції throttle
		let lastCall = 0;

		return () => {

			// Отримуємо поточний час
			const timeNow = performance.now();

			// Якщо пройшов час більше або рівний затримці з моменту останнього виклику функції
			if (timeNow - lastCall >= delay) {

				// Оновлюємо час останнього виклики на поточний
				lastCall = timeNow;

				// Викликаємо функцію зворотнього виклику
				callback();
			}
		};
	}
}