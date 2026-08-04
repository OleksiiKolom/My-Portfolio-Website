// Анімації початкового вітання
export function runWelcomeAnimation({
	selectorBlockAnimation,                         // Селектор загального блоку анімації
	selectorTitle,                                  // Селектор основного заголовка загального блоку анімації
	selectorSubtitle,                               // Селектор підзаголовка загального блоку анімації (блок з відображенням відсотків)
	durationFirstPartAnimation = 0,                 // Тривалість першої частини анімації (анімація заповнення основного заголовка + відображення відсотків), за замовчуванням — 0ms
	delayBeforeSecondPartAnimation = 0,             // Затримка перед початком другої частини анімації, за замовчуванням — 0ms
	durationSecondPartAnimation = 0,                // Тривалість другої частини анімації (3Д збільшення основного заголовка), за замовчуванням — 0ms
	classAnimationActive = '_welcome-anim-active',  // Клас, що буде додано до загального блоку для активації анімації, за замовчуванням — _welcome-anim-active
	classBodyLock = '_lock',                        // Клас блокування, що буде додано до елемента body, за замовчуванням — _lock
	classElementsPositionFixed = '_lock-padding' 	// Клас елементів з фіксованим позиціюванням, до них будуть додані css-властивості для коректної анімації, за замовуванням — _lock-padding
} = {}) {
	// Загальна тривалість анімації
	const durationTotalAnimation = durationFirstPartAnimation + delayBeforeSecondPartAnimation + durationSecondPartAnimation;

	// Ключ для зберігання та отримання стану чи була анімація вже показана на сайті в поточній сесії
	const storageKey = 'welcomeScreenShown';

	// Отримуємо значення чи була анімація вже показана на сайті в поточній сесії
	const isWelcomeAnimationPlayed = sessionStorage.getItem(storageKey) === 'true';

	// Базовий API-обʼєкт, що вертає функція
	const api = {
		hasWelcomeAnimation: !isWelcomeAnimationPlayed,
		durationAnimation: durationTotalAnimation
	};

	// Якщо анімація вже була показана - завершити функцію
	if (isWelcomeAnimationPlayed) return api;

	// Якщо загальна тривалість анімації дорівнює нулю
	if (durationTotalAnimation === 0) {
		// Завершити функцію, по факту анімації немає
		return {
			hasWelcomeAnimation: false,
			durationAnimation: 0,
		};
	}

	// Отримуємо загальний блок анімації
	const blockAnimation = document.querySelector(selectorBlockAnimation);

	// Якщо такого блоку не існує
	if (!blockAnimation) {
		// Завершити функцію, по факту анімації немає
		return {
			hasWelcomeAnimation: false,
			durationAnimation: 0,
		};
	}

	// Отримуємо основний заголовок загального блоку анімації
	const title = blockAnimation.querySelector(selectorTitle);

	// Отримуємо підзаголовок загального блоку анімації (блок з відображенням відсотків)
	const subtitle = blockAnimation.querySelector(selectorSubtitle);

	// Якщо цих блоків не існує
	if (!title || !subtitle) {
		// Завершити функцію, по факту анімації немає
		return {
			hasWelcomeAnimation: false,
			durationAnimation: 0,
		};
	}

	// Отримуємо елемент body, до якого буде додано клас для блокування скролу
	const bodyElement = document.body;

	// Отримуємо елементи з фіксованим позиціюванням, до них будуть додані css-властивості для коректної анімації
	const elementsPositionFixed = document.getElementsByClassName(classElementsPositionFixed);

	// Сховище оригінальних padding-right отриманих елементів з фіксованим позиціюванням
	const originalPaddingValues = new WeakMap();

	// Отримуємо ширину полоси прокрутки (скролу) браузера
	const widthScrollBar = window.innerWidth - document.documentElement.clientWidth;

	// Запукскаємо анімацію початкового вітання
	startAnimation();

	// Зупиняємо анімацію початкового вітання після загальної тривалості анімації
	setTimeout(() => {
		// Зупиняємо саму анімацію
		stopAnimation();

		// Зберігаємо, що анімація вже була показана в цій сессії
		sessionStorage.setItem(storageKey, 'true');
	}, durationTotalAnimation);

	// Функція запускає анімацію початкового вітання
	function startAnimation() {

		// Запукскаємо анімацію додаванням класу до загального блоку анімації
		blockAnimation.classList.add(classAnimationActive);

		// Блокуємо елемент body
		bodyLock();

		// Якщо існують елементи з фіксованим позиціюванням
		if (elementsPositionFixed.length !== 0) {

			// Додаємо css-властивості для коректної анімації до елементів з фіксованим позиціюванням
			elementsPositionFixedAddStyles();
		}

		// Активуємо імітацію завантаження сторінки додаванням відсотків
		addPercentage();
	}

	// Функція зупиняє анімацію початкового вітання
	function stopAnimation() {

		// Вимикаємо анімацію видаленням класу з загального блоку анімації
		blockAnimation.classList.remove(classAnimationActive);

		// Розблаковуємо елемент body
		bodyUnlock();

		// Якщо існують елементи з фіксованим позиціюванням
		if (elementsPositionFixed.length !== 0) {

			// Видаляємо попередньо додані css-властивості елементів з фіксованим позиціюванням
			elementsPositionFixedDeleteStyles();
		}
	}

	// Функція додає css-властивості для коректної анімації до елементів з фіксованим позиціюванням
	function elementsPositionFixedAddStyles() {
		// Додаємо стилі до кожного елемента
		for (const element of elementsPositionFixed) {
			// Збільшуємо paddingRight елемента на значення, що дорівнює ширині полоси прокрутки (скролу) браузера
			addPaddingRight(element, widthScrollBar);
		}
	}

	// Функція видаляє попередньо додані css-властивості елементів з фіксованим позиціюванням
	function elementsPositionFixedDeleteStyles() {
		// Видаляємо попередньо додані стилі в кожного елемента
		for (const element of elementsPositionFixed) {
			// Відновлуємо оригінальний paddingRight елемента
			restorePaddingRight(element);
		}
	}

	// Функція блокує скорл
	function bodyLock() {

		// Збільшуємо paddingRight елемента на значення, що дорівнює ширині полоси прокрутки (скролу) браузера
		addPaddingRight(bodyElement, widthScrollBar);

		// Блокуємо елемент body
		bodyElement.classList.add(classBodyLock);
	}

	// Функція розблоковує скрол
	function bodyUnlock() {

		// Відновлуємо оригінальний paddingRight елемента
		restorePaddingRight(bodyElement);

		// Розблоковуємо елемент body
		bodyElement.classList.remove(classBodyLock);
	}

	// Функція збільшує paddingRight елемента на значення, що дорівнює ширині полоси прокрутки (скролу) браузера
	function addPaddingRight(element, extraValuePaddingRight) {

		// Отримуємо поточне значення paddingRight отриманого елемента
		const currentValuePaddingRight = parseFloat(getComputedStyle(element).paddingRight) || 0;

		// Якщо значеня не було збережено попередньо
		if (!originalPaddingValues.has(element)) {

			// Зберігаємо поточне значення paddingRight отриманого елемента
			originalPaddingValues.set(element, currentValuePaddingRight);
		}

		// Збільшуємо paddingRight елемента на значення, що дорівнює ширині полоси прокрутки (скролу) браузера
		element.style.paddingRight = (currentValuePaddingRight + extraValuePaddingRight) + 'px';
	}

	// Функція відновлуємо оригінальний paddingRight елемента
	function restorePaddingRight(element) {

		// Якщо значеня було збережено попередньо
		if (originalPaddingValues.has(element)) {

			// Отримуємо оригінальне значення paddingRight отриманого елемента
			const originalValuePaddingRight = originalPaddingValues.get(element);

			// Встановлюємо попередньо збережене значення PaddingRight отриманого елемента
			element.style.paddingRight = originalValuePaddingRight + 'px';

			// Для уникнення дублювання — видаляємо елемент отриманий елемент із сховища
			originalPaddingValues.delete(element);
		}
	}

	// Функція додає відсотки завантаження сторінки
	function addPercentage() {

		// Якщо тривалість першої частини анімації менше або дорівнює нулю — завершити функцію
		if (durationFirstPartAnimation <= 0) return;

		// Отримуємо текст, до якого будуть додані відсотки
		const baseText = subtitle.textContent.trim();

		// Час початку анімації
		const startTime = performance.now();

		// Запускаємо оновлення першого кадру/відсотка
		requestAnimationFrame(updateProgress);

		// Функція розраховує та оновлює відсотки покадрово
		function updateProgress(now) {
			// Пройдений час з моменту початку анімації
			const elapsed = now - startTime;

			// Розраховуємо поточний відсоток (от 0 до 100)
			const progress = Math.min(100, Math.floor((elapsed / durationFirstPartAnimation) * 100));

			// Оновлюємо елемент HTML на поточний відсоток
			subtitle.textContent = `${baseText} ${progress}%...`;

			// Якщо анімація не завершена
			if (progress < 100) {
				// Викликаємо наступний кадр
				requestAnimationFrame(updateProgress);
			}
		}
	}

	// Повертаємо базовий API-обʼєкт
	return api;
}