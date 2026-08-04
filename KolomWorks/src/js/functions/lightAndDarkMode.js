// Світла та темна тема, додавання відповідного класу до елемента 'html'
export function lightAndDarkMode({
	classLightMode = '_light-mode',     // Клас, що буде додано до елемента 'html' для активації світлої теми, за замовчуванням — '_light-mode'
	classDarkMode = '_dark-mode',       // Клас, що буде додано до елемента 'html' для активації темної теми, за замовчуванням — '_dark-mode'
	defaultMode,                        // Тема, яка буде встановлена за замовчуванням, за замовчуванням — відсутня
	selectorThemeSwitcher,              // Селектор елемента для зміни теми
	hourStartOfDay = 7,                 // Час (година) початку світлої доби, за замовчуванням — 7 година
	hourStartOfNight = 20,              // Час (година) початку темної доби, за замовчуванням — 20 година
	durationAnimationThemeSwitch = 0,   // Тривалість анімації зміни теми (мс), за замовчуванням — 0 мс
	classThemeSwitchActive              // Клас, що буде додано до елемента 'html' під час зміни теми, за замовчуванням — відсутній
} = {}) {
	// Отримуємо елемент 'html' до якого буде додано клас для активації відповідної теми
	const htmlElement = document.documentElement;

	// Ключ для зберігання та отримання теми користувача в localStorage
	const storageKey = 'lightOrDarkMode';

	// Отримуємо збережену тему
	const savedUserTheme = localStorage.getItem(storageKey);

	// Допустимі значення збереженої теми
	const validValues = [classLightMode, classDarkMode];

	// Отримуємо кнопку перемикання теми
	const themeSwitcher = document.querySelector(selectorThemeSwitcher);

	// Зберігає таймер-ID для можливості для його майбутнього видалення при виникнені подій
	let timerID;

	// Зберігає, чи додано оброник події при зміні теми OS користувача
	let isOSThemeListenerActive = false;

	// Зберігає запрос, для отримання теми OS користувача
	let mediaQueryOS;

	// Якщо збережена тема існує
	if (validValues.includes(savedUserTheme)) {
		// Встановлюємо збережену тему
		setThemeTo(savedUserTheme);
	}

	// Якщо було передано параметр теми, яка буде встановлена за замовчуванням
	else if (validValues.includes(defaultMode)) {
		// Встановлюємо тему передану за замовчуванням
		setThemeTo(defaultMode);
	}

	// Якщо не існує збереженої теми та не передано параметр теми, яка буде встановлена за замовчуванням
	else {
		// Якщо підтримується властивість matchMedia — встановлюємо тему залежно від поточної теми OS користувача
		if (window.matchMedia) {
			// Отримуємо тему залежно від поточної теми OS користувача
			mediaQueryOS = window.matchMedia('(prefers-color-scheme: dark)');
			const currentThemeOS = mediaQueryOS.matches ? classDarkMode : classLightMode;

			// Встановлюєму тему відповодіну до поточної теми OS користувача
			setThemeTo(currentThemeOS);

			// Додаємо обробник подіїї — при зміні теми OS користувача, змінити тему і на сайті
			mediaQueryOS.addEventListener('change', handleOSThemeChange);
			isOSThemeListenerActive = true;
		}

		// Якщо не підтримується властивість matchMedia — встановлюємо тему залежно від поточного часу доби користувача
		else {
			// Встановлюємо тему залежно від поточного часу доби користувача
			setThemeByUserTime();

			// Якщо змінюється час доби користу — змінити тему і на сайті
			startTimer();

			// Якщо користувач повертається на сторінку/вкладку — оновити тему та таймер
			window.addEventListener('focus', handleOnWindowFocus);

			// Якщо користувач покидає сторінку/вкладку — видалити таймер
			window.addEventListener('blur', handleOnWindowBlur);
		}
	}

	// Якщо кнопка перемикання теми існує
	if (themeSwitcher) {
		// Змінюємо тему при кліку і зберігаємо її
		themeSwitcher.addEventListener('click', function () {
			changeTheme(true);

			// Якщо було додано обробник події при зміні теми OS користувача — видаляємо його
			if (isOSThemeListenerActive) {
				mediaQueryOS.removeEventListener('change', handleOSThemeChange);
				isOSThemeListenerActive = false;
			}

			// Якщо було активовано таймер для зміни теми
			else if (timerID) {
				// Видаляємо таймер
				clearTimeout(timerID);

				// Видаляємо обробники подій, що пов'язані з таймером
				window.removeEventListener('focus', handleOnWindowFocus);
				window.removeEventListener('blur', handleOnWindowBlur);
			}
		});
	}

	// Функція встановлює передану тему
	function setThemeTo(newTheme) {
		// Отримуємо поточну тему (клас)
		const currentTheme = newTheme === classLightMode ? classDarkMode : classLightMode;

		// Видаляємо поточну тему (видаляємо відповіднй клас)
		htmlElement.classList.remove(currentTheme);

		// Встановлюємо нову тему (додаємо відповідний клас)
		htmlElement.classList.add(newTheme);
	}

	// Функція змінює тему на протилежну
	function changeTheme(saveTheme = false) {
		// Отримуємо поточну тему (клас)
		const currentTheme = htmlElement.classList.contains(classLightMode) ? classLightMode : classDarkMode;

		// Тема, на яку потрібно перейти
		const newTheme = currentTheme === classLightMode ? classDarkMode : classLightMode;

		// Змінюємо тему на протилежну
		htmlElement.classList.replace(currentTheme, newTheme);

		// Запускаємо анімацію зміни теми
		runThemeTransition()

		// Якщо необхідно — зберігаємо тему для наступного завантаження
		if (saveTheme) localStorage.setItem(storageKey, newTheme);
	}

	// Функція встановлює тему залежно від часу доби користувача
	function setThemeByUserTime() {
		// Отримуємо поточний час (година) користувача
		const currentHour = new Date().getHours();

		// Визначаємо час доби користувача (день або ніч)
		const timesOfDay = currentHour >= hourStartOfDay && currentHour < hourStartOfNight ? classLightMode : classDarkMode;

		// Встановлюємо тему залежно від часу доби користувача
		setThemeTo(timesOfDay);
	}

	// Запускає таймер для зміни теми в найближчу зміну доби
	function startTimer() {
		// Час до наступної зміни теми (кількість мілісекунд)
		const timeUntilNextChange = (function () {
			const now = new Date(); // Поточний час
			const currentHour = now.getHours(); // Поточний час (кількість годин)

			let timeTo; // Час до наступної зміни теми
			let nextChangeHour; // Найближчий час, коли необхідно змінити тему

			// Якщо у користувача день, то найближча зміна теми буде на початку ночі
			nextChangeHour = currentHour >= hourStartOfDay && currentHour < hourStartOfNight ? hourStartOfNight : hourStartOfDay;

			// Обчислюємо різницю мілісекунд до наступної години
			timeTo = nextChangeHour > currentHour ? nextChangeHour - currentHour : 24 - currentHour + nextChangeHour;

			timeTo *=
				60 * 60 * 1000 -
				now.getMinutes() * 60 * 1000 -
				now.getSeconds() * 1000 -
				now.getMilliseconds();

			// Вертаємо обчислене значення
			return timeTo;
		})();

		// Активізуємо таймер
		timerID = setTimeout(function () {
			setThemeByUserTime(); // Оновлюємо тему
			startTimer(); // Рекурсивно активізуємо таймер
		}, timeUntilNextChange);
	}

	// Функція оновлює тему та таймер, коли користувач повертається на сторінку/вкладку
	function handleOnWindowFocus() {
		// Одразу оновлюємо тему
		setThemeByUserTime();

		// Якщо таймер активовано — видаляємо його
		if (timerID) clearTimeout(timerID);

		// Заново активізуємо таймер для запуску зміни теми
		startTimer();
	}

	// Функція видаляє таймер, коли користувач покидає сторінку/вкладку
	function handleOnWindowBlur() {
		// Якщо таймер активовано — видаляємо його
		if (timerID) clearTimeout(timerID);
	}

	// Функція оновлює тему, коли оновлюється тема OS користувача
	function handleOSThemeChange(event) {
		// Розраховуємо тему, на яку потрібно змінити
		const newTheme = event.matches ? classDarkMode : classLightMode;

		// Встановлюєму тему відповодіну до поточної теми OS користувача
		setThemeTo(newTheme);
	}

	// Функція додає тимчасовий клас до елемента 'html' для анімації зміни теми
	function runThemeTransition() {
		// Якщо тривалість анімації зміни теми або клас, що буде додано до елемента 'html' під час зміни теми не було передано — завершити функцію
		if (!classThemeSwitchActive || !durationAnimationThemeSwitch) return;

		// Додаємо тимчасовий клас до елемента 'html' для анімації зміни теми
		htmlElement.classList.add(classThemeSwitchActive);

		// Видаляємо тимчасовий клас через передану тривалість анімації зміни теми
		setTimeout(() => {
			htmlElement.classList.remove(classThemeSwitchActive);
		}, durationAnimationThemeSwitch);
	}
}