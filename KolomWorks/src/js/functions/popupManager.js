// Робота з попапоми
export function popupManager({
	classPopup,                                     // Загальний клас попапів
	classPopupNoClose,                              // Класс попапів, які не можна закрити стандартними засобами
	classPopupOpened = '_popup-opened',             // Клас, який буде додано до попапу для активізації його відкриття, за замовуванням - _popup-opened
	classButtonsOpenPopup,                          // Клас елементів (кнопки/посилання), які відкривають відповідний попап
	classButtonsClosePopup,                         // Клас елементів (кнопки/посилання), які закривають відповідний попап
	animationDurationOpen = 0,                      // Тривалість анімації відкриття попапу (повинно відповідати значенню в css-властивостях), за замовуванням - 0мс
	animationDurationClose = animationDurationOpen, // Тривалість анімації закриття попапу (повинно відповідати значенню в css-властивостях), за замовуванням співпадає з тривалістю відкриття
	classElementsPositionFixed = '_lock-padding',   // Клас елементів з фіксованим позиціюванням, до них будуть додані css-властивості для коректної анімації, за замовуванням — _lock-padding
	classBodyLock = '_lock',                        // Клас блокування, що буде додано до елемента body, за замовчуванням - _lock
} = {}) {
	// Отримуємо елементи (кнопки/посилання), які відкривають відповідний попап
	const buttonsOpenPopup = document.getElementsByClassName(classButtonsOpenPopup);

	// Отримуємо елементи з фіксованим позиціюванням, до них будуть додані css-властивості для коректної анімації
	const elementsPositionFixed = document.getElementsByClassName(classElementsPositionFixed);

	// Сховище оригінальних padding-right отриманих елементів з фіксованим позиціюванням
	const originalPaddingValues = new WeakMap();

	// Отримуємо ширину полоси прокрутки (скролу) браузера
	const widthScrollBar = window.innerWidth - document.documentElement.clientWidth;

	// Отримуємо елемент body, до якого буде додано клас для блокування скролу
	const bodyElement = document.querySelector('body');

	// Зберігає, чи відбувається зараз анімація попапу. Використовується для блокування виконання деякого коду, допоки не закінчиться анімація
	let isPopupAnimating = false;

	// Якщо існують елементи (кнопки/посилання), які відкривають відповідний попап
	if (buttonsOpenPopup.length !== 0) {
		// Додаємо обробник події при кліку для кожного елемента
		for (let openButton of buttonsOpenPopup) {
			openButton.addEventListener('click', function (event) {
				// Скасуємо дію для елемента за замовчуванням
				event.preventDefault();

				// Отримуємо id попапу, що відкриває кнопка (має співпадати з атребутом 'href')
				const popupId = openButton.getAttribute('href');

				// Отримуємо об'єкт відповідного попапу
				const currentPopup = document.getElementById(popupId);

				// Відкриваємо даний попап
				popupOpen(currentPopup);
			});
		}
	}

	// Відкриває/відображає переданий попап
	function popupOpen(currentPopup) {
		// Якщо переданий попап не існує або попередні анімації не закінчились - завершуємо виконання функції
		if (!currentPopup || isPopupAnimating) return;

		// Отримуємо активний/відкритий попап
		const popupActive = document.querySelector(`.${classPopup}.${classPopupOpened}`);

		// Якщо існує активний попап
		if (popupActive) {
			// Закриваємо його
			popupClose(popupActive, false);
		} else {
			// В іншому випадку блокуємо елемент body
			screenLock();
		}

		// Відкриваємо поточний попап
		currentPopup.classList.add(classPopupOpened);

		// Якщо даний попап можна закрити стандартними засобами
		if (!currentPopup.classList.contains(classPopupNoClose)) {
			// Додаємо обробники подій тільки після закінчення анімації відкриття попапу
			setTimeout(function () {
				// Закриває попап при кліку по клавіші "Esc"
				document.addEventListener('keydown', handleClickKeydown);

				// Закриває попап при кліку по порожньому місцю (за межами тіла попапу)
				currentPopup.addEventListener('click', handleClickBG);

				// Отримуємо всі елементи (кнопки/посилання), які закривають поточний/відкритий попап
				const buttonsClosePopup = getButtonsClosePopup();

				// Якщо такі кнопки існують
				if (buttonsClosePopup.length !== 0) {
					// Додаємо обробник події для кожної кнопки
					for (const button of buttonsClosePopup) {
						// Закриває попап при кліку по кнопкці/посиланню
						button.addEventListener('click', handleClickButton);
					}
				}

				// Функція вертає всі елементи (кнопки/посилання), які закривають поточний/відкритий попап
				function getButtonsClosePopup() {
					// Отримуємо ID поточного/відкритого попапу
					const popupId = currentPopup.getAttribute('id');

					// Отримуємо всі елементи (кнопки/посилання), які закривають поточний/відкритий попап
					const buttonsClose = document.querySelectorAll('#' + popupId + ' .' + classButtonsClosePopup);

					// Вертаємо ці елементи
					return buttonsClose;
				}

				// Функція обробляє клік по клавіші 'Esc' для закриття поточного/відкритого попапу
				function handleClickKeydown(event) {
					// Якщо була натиснута клавіша "Esc"
					if (event.key === 'Escape') {
						// Закриваємо поточний/відкритий попап
						popupClose(currentPopup);

						// Видаляємо усі обробники подій поточного/відкритого попапу
						removeHandlesCurrentPopup();
					}
				}

				// Функція обробляє клік по порожньому місцю для закриття поточного/відкритого попапу
				function handleClickBG(event) {
					// Якщо клік був по порожньому місцю (за межами тіла попапа)
					if (!document.querySelector('.' + classPopup + '__content').contains(event.target)) {
						// Закриваємо поточний/відкритий попап
						popupClose(currentPopup);

						// Видаляємо усі обробники подій поточного/відкритого попапу
						removeHandlesCurrentPopup();
					}
				}

				// Функція обробляє клік по кнопці для закриття поточного/відкритого попапу
				function handleClickButton(event) {
					// Скасуємо дію для елемента за замовченням
					event.preventDefault();

					// Закриваємо поточний/відкритий попап
					popupClose(currentPopup);

					// Видаляємо усі обробники подій поточного/відкритого попапу
					removeHandlesCurrentPopup();
				}

				// Функція видаляє усі обробники подій поточного/відкритого попапу
				function removeHandlesCurrentPopup() {
					document.removeEventListener('keydown', handleClickKeydown);
					currentPopup.removeEventListener('click', handleClickBG);

					if (buttonsClosePopup.length !== 0) {
						for (let button of buttonsClosePopup) {
							button.removeEventListener('click', handleClickButton);
						}
					}
				}
			}, animationDurationOpen);
		}
	}

	// Функція закриває переданий попап
	function popupClose(popupActive, doUnlock = true) {
		// Якщо переданий попап не існує або попередні анімації не закінчились - завершуємо виконання функції
		if (!popupActive || isPopupAnimating) return;

		// Закриваємо поточний попап
		popupActive.classList.remove(classPopupOpened);

		// Генеруємо кастомну подію, що попап закрито
		const closeEvent = new CustomEvent('popupClosed', { detail: { popupId: popupActive.id }, });
		popupActive.dispatchEvent(closeEvent);

		// Якщо небхідно (за замовчуванням), вертаємо скрол
		if (doUnlock) {
			// Розблакуємо елемент body
			screenUnlock();
		}
	}

	function screenLock() {
		// Блокуємо відкриття та закриття інших попапів, допоки не закінчиться анімація відкриття поточного
		isPopupAnimating = true;

		setTimeout(function () {
			isPopupAnimating = false;
		}, animationDurationOpen);

		// Блокуємо елемент body
		bodyLock();

		// Якщо існують елементи з фіксованим позиціюванням
		if (elementsPositionFixed.length !== 0) {

			// Додаємо css-властивості для коректної анімації до елементів з фіксованим позиціюванням
			elementsPositionFixedAddStyles();
		}
	}

	function screenUnlock() {
		// Блокуємо відкриття інших попапів, допоки не закінчиться анімація закриття поточного
		isPopupAnimating = true;

		// Виконуємо розблокування тільки після закінчення анімації закриття попапу
		setTimeout(function () {
			// Розблаковуємо елемент body
			bodyUnlock();

			// Якщо існують елементи з фіксованим позиціюванням
			if (elementsPositionFixed.length !== 0) {
				// Видаляємо попередньо додані css-властивості елементів з фіксованим позиціюванням
				elementsPositionFixedDeleteStyles();
			}

			// Розблоковуємо відкриття та закриття інших попапів
			isPopupAnimating = false;
		}, animationDurationClose);
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

	// Функція блокує скорл та додає стилі до елементів для коректної анімації
	function bodyLock() {
		// Збільшуємо paddingRight елемента на значення, що дорівнює ширині полоси прокрутки (скролу) браузера
		addPaddingRight(bodyElement, widthScrollBar);

		// Блокуємо елемент body
		bodyElement.classList.add(classBodyLock);
	}

	// Функція розблоковує скрол та видаляє попередньо додані стилі
	function bodyUnlock() {
		// Відновлуємо оригінальний paddingRight елемента
		restorePaddingRight(bodyElement);

		// Розблоковуємо елемент body
		bodyElement.classList.remove(classBodyLock);
	}

	// Поліфіли
	(function () {
		if (!Element.prototype.closest) {
			Element.prototype.closest = function (css) {
				var node = this;
				while (node) {
					if (node.matches(css)) return node;
					else node = node.parentElement;
				}
				return null;
			};
		}
	})();

	(function () {
		if (!Element.prototype.matches) {
			Element.prototype.matches =
				Element.prototype.matchesSelector ||
				Element.prototype.webkitMatchesSelector ||
				Element.prototype.mozMatchesSelector ||
				Element.prototype.msMatchesSelector;
		}
	})();

	// Повертаємо базовий API-обʼєкт для роботи з попапами, що містить методи відкриття та закриття попапів за id
	return {
		openById(popupId) {
			const popupElement = document.getElementById(popupId);
			popupOpen(popupElement);
		},
		closeById(popupId) {
			const popupElement = document.getElementById(popupId);
			popupClose(popupElement);
		},
	};
}