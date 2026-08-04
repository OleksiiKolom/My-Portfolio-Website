// Анімація при скролі, додавання відповідного класу
export function animationOnScroll({
	selectorAnimationItems,                       // Селектор елементів, що анімуються при скролі
	classAnimationActive = '_active-anim-skroll', // Клас, який буде додано до елементів для активації анімації, за замовчуванням — _active-anim-skroll
	coefficientAnimationStart = 4,                // Коефіцієнт початку анімації відносно висоти елемента, за замовчуванням — 1/4 висоти елемента
	shouldAnimateAgain = false,                   // Зберігає, чи потрібно повторно анімувати елементи, за замовчуванням — ні
	delayThrottle = 50,                       	  // Затримка для throttle у мілісекундах, за замовчуванням — 100 мс
	delayForElementsInView = 300,                 // Затримка для анімації елементів, які вже в полі зору у мілісекундах, за замовчуванням — 300 мс
	welcomeAnimationAPI                           // Базове API функції анімації початкового вітання
} = {}) {
	// Отримуємо елементи, що анімуються при скролі
	const animationItems = document.querySelectorAll(selectorAnimationItems);

	// Якщо таких елементів не існує — завершити функцію
	if (!animationItems.length) return;

	// Якщо передано базове API функції анімації початкового вітання і анімації початкового вітання була запущена
	if (welcomeAnimationAPI?.hasWelcomeAnimation) {

		// Збільшуємо затримку для анімації елементів, які вже в полі зору, на тривалість анімації вітання мінус одна секунда
		delayForElementsInView = delayForElementsInView + welcomeAnimationAPI.durationAnimation - 1000;
	}

	// Функція тротлінгу для оптимізації виклику onScroll
	const throttledScroll = throttle(onScroll, delayThrottle);

	// Додаємо обробник події scroll із застосуванням тротлінгу
	window.addEventListener('scroll', throttledScroll, { passive: true });

	// Якщо змінюються розміри вікна браузера — перевіряємо елементи знову 
	window.addEventListener('resize', function () {

		// Обробляємо елементи, які вже в полі зору, щоб уникнути вимушеного скролу 
		handleElementsInView();
	});

	// Обробляємо елементи, які вже в полі зору, щоб уникнути вимушеного скролу
	handleElementsInView();

	// Функція обробляє елементи, які вже в полі зору, щоб уникнути вимушеного скролу
	function handleElementsInView() {
		// Запускаємо функцію з затримкою для анімації елементів
		setTimeout(function () {
			onScroll();
		}, delayForElementsInView);
	}

	// Функція додає/видаляє клас елемента залежно від положення скролу
	function onScroll() {
		// Отримуємо висоту вікна браузера (viewport)
		const windowHeight = window.innerHeight || document.documentElement.clientHeight;

		// Отримуємо кількість пікселів по вертикалі, на яку браузер проскролив
		const scrollOffset = window.pageYOffset || document.documentElement.scrollTop;

		// Обробляємо всі елементи, що анімуються при скролі
		animationItems.forEach(function (item) {
			// Отримуємо відстань від верхньої межі елемента до верхньої межі вікна браузера (viewport).
			const distanceToViewport = item.getBoundingClientRect().top;

			// Отримуємо відстань від верхньої межі елемента до початку сторінки
			const itemOffset = distanceToViewport + scrollOffset;

			// Отримуємо висоту елемента, що анімується
			const itemHeight = item.offsetHeight;

			// Точка початку анімації
			let itemPoint;

			// Якщо висота елемента більша за висоту окна браузера (viewport)
			if (itemHeight > windowHeight) {
				itemPoint = windowHeight - windowHeight / coefficientAnimationStart;
			} else {
				itemPoint = windowHeight - itemHeight / coefficientAnimationStart;
			}

			// Якщо елемент у полі зори — анімувати його (додати клас)
			if (scrollOffset > itemOffset - itemPoint && scrollOffset < itemOffset + itemHeight) {

				// Додаємо клас для запуску анімації
				item.classList.add(classAnimationActive);
			} else {

				// Якщо потрібно повторно анімувати елементи
				if (shouldAnimateAgain) {

					// Видаляємо клас для можливості повторної анімації елемента
					item.classList.remove(classAnimationActive);
				}
			}
		});
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