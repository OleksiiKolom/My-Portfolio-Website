// Мовний менеджер сайту
export function languageManager({
	idPopupLanguageSwitch,                						// id попапу для зміни мови
	idPopupRussianAggression,          							// id попапу з питанням, щодо агресії Росії проти України
	selectorButtonsChooseLanguage = '[data-lang]',              // Селектор елементів (кнопки/посилання), розташованих в попапі для зміни мови
	selectorAggressionButtonYes = '[data-ru-aggression="yes"]', // Селектор елементу (кнопка/посилання) 'так' попапу з питанням, щодо агресії Росії проти України
	selectorAggressionButtonNo = '[data-ru-aggression="no"]',   // Селектор елементу (кнопка/посилання) 'ні' попапу з питанням, щодо агресії Росії проти України
	defaultLanguage = 'en',                                     // Мова за замовчуванням на сайті
	supportedLanguages = ['en', 'ua', 'ru'],                    // Підтримувані мови
	popupAutoOpenDelay = 2000,                                  // Затримка перед автоматичним відкриттям попапу (мс) для зміни мови	
	selectorElementOverlay = '.block-overlay-for-ru',           // Селектор елементу, що блокує сайт
	classElementOverlayBlocked = '_blocked',                    // Клас, який буде додано до елементу, що блокує сайт для активації блокування
	welcomeAnimationAPI,                                        // API анімації початкового вітання
	popupManagerAPI	                                            // API менеджера попапів
} = {}) {
	// Ключ для зберігання та отримання згоди користувача, щодо агресії Росії проти України
	const storageKeyRussianAggression = 'ruAggressionAccepted';

	// Отримуємо збережену згоду користувача
	const savedUserOpinion = localStorage.getItem(storageKeyRussianAggression);

	// Якщо користувач раніше натиснув 'ні' (не погодився) — блокуємо сайт і весь подальший код не виконуємо
	if (savedUserOpinion === 'no') {
		// Отримуємо блок, що блокує сайт
		const elementOverlay = document.querySelector(selectorElementOverlay);

		// Якщо такий блок існує
		if (elementOverlay) {
			// Додаємо відповідний клас, що активує стилі для блокування
			elementOverlay.classList.add(classElementOverlayBlocked);

			// Весь подальший код не виконуємо
			return;
		}
	}

	// Отримуємо поточний шлях сторінки
	const { pathname } = window.location;

	// Ключ для зберігання та отримання збереженої мови
	const storageKeyLanguage = 'savedLanguage';

	// Отримуємо збережену мову
	const savedUserLanguage = localStorage.getItem(storageKeyLanguage);

	// Якщо користувач зайшов в корінь сайту ('/' або '/index.html') — переключаємо його поточну сторінку, але з відповідною мовою
	if (isRootPath(pathname)) {
		// Мова на яку буде переключено — збережена мова, якщо такої немає, то мова за замовчуванням
		const targetLanguage = savedUserLanguage || defaultLanguage;

		// Переключаємо користувача на відповідну мову
		redirectTo(`/${targetLanguage}/index.html`);

		// Далі код не виконуємо, бо все одно буде перехід і сторінка перезавантажиться
		return;
	}

	// Отримуємо попап для зміни мови
	const popupLanguageSwitch = document.getElementById(idPopupLanguageSwitch);

	// Якщо попапу не існує — весь подальший код не виконуємо
	if (!popupLanguageSwitch) return;

	// Отримуємо елементи (кнопки/посилання), що обробляють зміну мови
	const buttonsChooseLanguage = document.querySelectorAll(selectorButtonsChooseLanguage);

	// Додаємо обробник події для елементів (кнопки/посилання), що обробляють зміну мови
	addButtonsChooseLanguageHandlers();

	// Додаємо обробник події при закритті самого попапу (якщо користувач не обрав мову)
	popupLanguageSwitch.addEventListener('popupClosed', handlePopupLanguageSwitchClose);

	// Якщо передано API анімації вітання і анімація вітання була запущена
	if (welcomeAnimationAPI.hasWelcomeAnimation) {
		// Збільшуємо затримку відкриття попапу на час цієї анімації
		popupAutoOpenDelay = popupAutoOpenDelay + welcomeAnimationAPI.durationAnimation;
	}

	// Якщо збереженої мови не існує — відкриваємо попап з затримкою і пропонуємо обрати мову
	if (!savedUserLanguage) {
		setTimeout(() => {
			// Відкриваємо попап для зміни мови
			popupManagerAPI.openById(idPopupLanguageSwitch);
		}, popupAutoOpenDelay);
	}

	// Функція додає обробник події до елементів (кнопки/посилання), що обробляють зміну мови
	function addButtonsChooseLanguageHandlers() {
		// Якщо такі елементи існують — додаємо до кожного обробник події
		if (buttonsChooseLanguage.length !== 0) {
			for (const button of buttonsChooseLanguage) {
				button.addEventListener('click', handleButtonChooseLanguageClick);
			}
		}
	}

	// Функція обробляє обробник події при кліку по кнопці вибору мови
	function handleButtonChooseLanguageClick(event) {
		// Скасуємо дію для елемента за замовчуванням
		event.preventDefault();

		// Отримуємо мову, на яку необхідно переключить
		const newLanguage = event.currentTarget.getAttribute('data-lang');

		// Якщо користувач обрав російську мову
		if (newLanguage === 'ru') {
			// Викликаємо окремий обробник події
			handleRuLanguageSelected();

			// Далі код не виконуємо, бо все одно або буде перехід і сторінка перезавантажиться, або сайт буде заблоковано
			return;
		}

		// Якщо отримана мова підтримується
		if (supportedLanguages.includes(newLanguage)) {
			// Зберігаємо обрану мову для майбутніх завантажень
			localStorage.setItem(storageKeyLanguage, newLanguage);

			// Переходимо на ту ж сторінку, але з іншою мовою
			redirectToNewLanguage(newLanguage);

			// Далі код не виконуємо, бо все одно буде перехід і сторінка перезавантажиться
			return;
		}
	}

	// Функція обробляє обробник події при закритті попапу для зміни мови
	function handlePopupLanguageSwitchClose() {
		// Якщо користувач просто закрив попап не обравши мову — зберігаємо мову поточної сторінки
		const currentLanguage = getLanguageFromPath(pathname);
		localStorage.setItem(storageKeyLanguage, currentLanguage);
	}

	// Функція перевіряє та вертає значення того, чи отриманий шлях — корінь сайту ('/' або'/index.html')
	function isRootPath(path) {
		return path === '/' || path === '/index.html';
	}

	// Функція вертає мову (перший сегмент шляху) з URL (отриманого повного шляху) ('/en/about.html' --> 'en')
	function getLanguageFromPath(path) {
		// Розбиваємо весь шлях на сегменти, розділені символом '/', та прибираємо пусті сегменти
		const segments = path.split('/').filter(Boolean);

		// Отримуємо перший сегмент, який зберігає мову (['en', 'html', 'about.html'] --> 'en')
		const language = segments[0];

		// Якщо отримана мова підтримується - вертаємо її, якщо ні - вертаємо мову по замовченню
		return supportedLanguages.includes(language) ? language : defaultLanguage;
	}

	// Функція вертає сторінку (хвіст шляху) з URL (отриманого повного шляху) ('/en/about.html' --> 'about.html')
	function getPagePartFromPath(path) {
		// Розбиваємо весь шлях на сегменти, розділені символом '/', та прибираємо пусті сегменти
		const segments = path.split('/').filter(Boolean);

		// Якщо перший сегмент — мова, то сторінка починається з другого сегменту (en/about.html)
		if (supportedLanguages.includes(segments[0])) {
			// Отримуємо шлях прибираючи перший сегмент та склеюємо всі інші сегменти символом '/' (['en', 'html', 'about.html'] --> 'html/about.html')
			const pagePart = segments.slice(1).join('/');

			// Вертаємо отриману сторінку або вертаємо index.html (якщо переданий шлях не містить сторінку, наприклад: '/en')
			return pagePart || 'index.html';
		}

		// Якщо мови в URL немає, вважаємо, що це просто 'index.html' ('/' або '/index.html')
		return 'index.html';
	}

	// Функція робить редірект на інший шлях
	function redirectTo(path) {
		window.location.href = path;
	}

	// Функція змінює мову, залишившись на тій же сторінці ('/en/about.html' --> '/ua/about.html')
	function redirectToNewLanguage(newLanguage) {
		// Отримуємо поточну сторінку користувача (index.html, about.html тощо)
		const currentPage = getPagePartFromPath(pathname);

		// Розраховуємо повний шлях з відповідною мовою, враховуючи поточну сторінку
		const newPath = `/${newLanguage}/${currentPage}`;

		// Переключаємо користувача на цю сторінку
		redirectTo(newPath);
	}

	// Функція обробляє обробник події, якщо користувач обрав російську мову
	function handleRuLanguageSelected() {
		// Отримуємо попап, що буде відкритий для підтвердження агресії Росії проти України
		const popupRussianAggression = document.getElementById(idPopupRussianAggression);

		// Якщо попап не знайдений — fallback: просто перемикаємо на RU
		if (!popupRussianAggression) {
			// Встановлюємо російську мову за замовчуванням
			localStorage.setItem(storageKeyLanguage, 'ru');

			// Переходимо на ту ж сторінку, але з іншою мовою
			redirectToNewLanguage('ru');

			// Далі код не виконуємо, логіка для ru обробляється окремо
			return;
		}

		// Отримуємо кнопки 'так'/'ні'
		const buttonYes = document.querySelector(selectorAggressionButtonYes);
		const buttonNo = document.querySelector(selectorAggressionButtonNo);

		// Якщо кнопок немає — теж fallback
		if (!buttonYes || !buttonNo) {
			// Встановлюємо російську мову за замовчуванням
			localStorage.setItem(storageKeyLanguage, 'ru');

			// Переходимо на ту ж сторінку, але з іншою мовою
			redirectToNewLanguage('ru');

			// Далі код не виконуємо, логіка для ru обробляється окремо
			return;
		}

		// Відкриваємо попап
		popupManagerAPI.openById(idPopupRussianAggression);

		// Додаємо окремі обробники подій на кожну кнопку
		buttonYes.addEventListener('click', handleRuAggressionYes);
		buttonNo.addEventListener('click', handleRuAggressionNo);

		// Функція видаляє обробники події з кнопок
		function cleanupRuHandlers() {
			buttonYes.removeEventListener('click', handleRuAggressionYes);
			buttonNo.removeEventListener('click', handleRuAggressionNo);
		}

		// Функція обробляємо згоду користувача, щодо агресії Росії проти України
		function handleRuAggressionYes(event) {
			// Скасуємо дію для елемента за замовчуванням
			event.preventDefault();

			// Зберігаємо згоду користувача
			localStorage.setItem(storageKeyRussianAggression, 'yes');

			// Встановлюємо російську мову за замовчуванням
			localStorage.setItem(storageKeyLanguage, 'ru');

			// Переходимо на ту ж сторінку, але з іншою мовою
			redirectToNewLanguage('ru');

			// Далі код не виконуємо, бо все одно буде перехід і сторінка перезавантажиться
			return;
		}

		// Функція обробляємо незгоду користувача, щодо агресії Росії проти України
		function handleRuAggressionNo(event) {
			// Скасуємо дію для елемента за замовчуванням
			event.preventDefault();

			// Зберігаємо незгоду користувача
			localStorage.setItem(storageKeyRussianAggression, 'no');

			// Видаляємо попередні обробники події для кнопок
			cleanupRuHandlers();

			// Закриваємо попап
			popupManagerAPI.closeById(idPopupRussianAggression);

			// Отримуємо блок, що блокує сайт
			const elementOverlay = document.querySelector(selectorElementOverlay);

			// Якщо такий блок існує
			if (elementOverlay) {
				// Додаємо відповідний клас, що активує стилі для блокування
				elementOverlay.classList.add(classElementOverlayBlocked);
			}
		}
	}
	// Повертаємо базовий API-обʼєкт для роботи з мовами, що містить метод отримання мови з URL
	return {
		getLanguageFromPath
	};
}