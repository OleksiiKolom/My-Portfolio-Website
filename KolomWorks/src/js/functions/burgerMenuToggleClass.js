// Перемикач класу active для бургера та меню
export function burgerMenuToggleClass({
	selectorBurgerElement,      // Селектор бургер-елемента до якого застосовується клас для активації 
	selectorNavigationElement,  // Селектор елемента навігації до якого застосовується клас для активації 
	classActive = '_active',    // Клас, який буде додано до бургер-елемента та елемента навігації для їх активації, за замовчуванням — _active
	classBodyLock = '_lock',    // Клас блокування, що буде додано до елемента body, за замовчуванням — _lock
	minWidth = 0,               // Мінімальна ширина екрана для активації бургер-меню, за замовчуванням — 0px
	maxWidth = 992,             // Максимальна ширина екрана для активації бургер-меню, за замовчуванням — 992px
	classAnchorLinks,           // Клас якірних посилань, які є в елементі навігації (якщо такі є)
	classAjaxLinks,             // Клас посилань, котрі оновлюють сторінку за допомогою AJAX, які є в елементі навігації (якщо такі є)
} = {}) {
	// Отримуємо бургер-елемента до якого застосовується клас для активації
	const burgerElement = document.querySelector(selectorBurgerElement);

	// Отримуємо елемент навігації до якого застосовується клас для активації
	const navigationElement = document.querySelector(selectorNavigationElement);

	// Якщо цих елементів не існує — завершити функцію
	if (!burgerElement || !navigationElement) return;

	// Отримуємо елемент body, до якого буде додано клас для блокування скролу
	const bodyElement = document.body;

	// Визначаємо, чи існують в меню 'незвичайні' посилання (якірні посилання або AJAX-посилання)
	const hasSpecialLinks = navigationElement.querySelector(`.${classAnchorLinks}`) || navigationElement.querySelector(`.${classAjaxLinks}`);

	// Чи додано обробник події до бургер-елемента
	let isBurgerClickListenerAdded = false;

	// Чи додано обробник події до елемента навігації
	let isNavigationClickListenerAdded = false;

	// Якщо ширина екрана відповідає активації бургер-меню
	if (isScreenWithinRange()) {
		// Додаємо обробник події при кліку по бургер-елементу
		burgerElement.addEventListener('click', onBurgerClick);
		isBurgerClickListenerAdded = true;
	}

	// Якщо змінюються розміри вікна браузера — перевстановлюємо обробники подій
	window.addEventListener('resize', checkScreenSizeAndToggleListeners);

	// Функція перевіряє, чи ширина екрана відповідає активації бургер-меню (при її зміні) та оброляє клік по бургер-елементу
	function checkScreenSizeAndToggleListeners() {
		// Якщо ширина екрана відповідає активації бургер-меню
		if (isScreenWithinRange()) {
			// Якщо обробник події не було додано до бургер-елемента
			if (!isBurgerClickListenerAdded) {
				// Додаємо обробник події при кліку по бургер-елементу
				burgerElement.addEventListener('click', onBurgerClick);
				isBurgerClickListenerAdded = true;
			}
		}

		// Якщо ширина екрана не відповідає активації бургер-меню
		else {
			// Примусово закриваємо бургер-меню (видаляємо класи)
			closeMenu();

			// Якщо обробник події було додано до бургер-елемента — видаляємо його
			if (isBurgerClickListenerAdded) {
				burgerElement.removeEventListener('click', onBurgerClick);
				isBurgerClickListenerAdded = false;
			}

			// Якщо обробник події було додано до елемента навігації — видаляємо його
			if (isNavigationClickListenerAdded) {
				navigationElement.removeEventListener('click', onNavigationClick);
				isNavigationClickListenerAdded = false;
			}
		}
	}

	// Функція обробляє клік по бургер-меню
	function onBurgerClick() {
		// Перемикаємо класи бургер-меню
		toggleMenu();

		// Якщо бургер-елемент відкрито (активовано)
		if (burgerElement.classList.contains(classActive)) {
			// Якщо існують в меню 'незвичайні' посилання (якірні посилання або AJAX-посилання)
			if (hasSpecialLinks) {
				// Додаємо делегований обробник подій для цих посилань
				navigationElement.addEventListener('click', onNavigationClick);
				isNavigationClickListenerAdded = true;
			}
		}
		// Якщо бурег-меню закрито
		else {
			// Якщо делегований обробник подій для посилань було додано — видаляємо його
			if (isNavigationClickListenerAdded) {
				navigationElement.removeEventListener('click', onNavigationClick);
				isNavigationClickListenerAdded = false;
			}
		}
	}

	// Функція обробляє клік по посиланнях в навігації методом делегування
	function onNavigationClick(event) {
		// Якщо елемент по якому клікнули - 'незвичайне' посилання (якірне посилання або AJAX-посилання)
		if (isUnusualLink(event.target)) {
			// Примусово закриваємо бургер-меню (видаляємо класи)
			closeMenu();

			// Видаляємо делегований обробник подій для посилань бургер-меню
			navigationElement.removeEventListener('click', onNavigationClick);
			isNavigationClickListenerAdded = false;
		}
	}

	// Функція перевіряє, чи є елемент 'незвичайним' посиланням (якірне посилання або AJAX-посилання)
	function isUnusualLink(element) {
		return (
			element.closest('a') &&
			element.getAttribute('href') &&
			(element.classList.contains(classAnchorLinks) || element.classList.contains(classAjaxLinks))
		);
	}

	// Функція перемикає класи бургер-меню
	function toggleMenu() {
		bodyElement.classList.toggle(classBodyLock);
		burgerElement.classList.toggle(classActive);
		navigationElement.classList.toggle(classActive);
	}

	// Функція закриває бургер-меню (видаляє класи)
	function closeMenu() {
		burgerElement.classList.remove(classActive);
		navigationElement.classList.remove(classActive);
		bodyElement.classList.remove(classBodyLock);
	}

	// Функція перевіряє, чи ширина екрана відповідає активації бургер-меню
	function isScreenWithinRange() {
		// Отримуємо ширину екрана
		const widthScreen = window.innerWidth;

		// Повертаємо true, якщо ширина екрана в межах діапазону, інакше false
		return widthScreen < maxWidth && widthScreen >= minWidth;
	}
}