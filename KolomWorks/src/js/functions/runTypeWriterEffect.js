// Анімація оновлення тексту для ефекту 'пишучої машинки' (вивід і видалення фраз)
export function runTypeWriterEffect({
	selectorPhrases,          // Селектор фраз, що будуть виводитись по черзі
	selectorOutputElement,    // Селектор елемента, де будуть виводитись отримані фрази
	speedTyping = 120,        // Затримка між кожним введеним символом фрази (мс), за замовчуванням - 100 мс
	speedDeleting = 60,       // Затримка між кожним видаленим символом фрази (мс), за замовчуванням - 60 мс
	delayBeforeType = 1200,   // Затримка перед початком введення наступної фрази (мс), за замовчуванням - 500 мс
	delayBeforeDelete = 2000  // Затримка перед початком видалення надрукованої фрази (мс), за замовчуванням - 1000 мс
} = {}) {
	// Отримуємо елемент, де будуть виводитись отримані фрази
	const outputElement = document.querySelector(selectorOutputElement);

	// Якщо елемент не знайдено — завершити функцію
	if (!outputElement) return;

	// Отримуємо фрази, що будуть виводитись по черзі
	const phrases = Array.from(document.querySelectorAll(selectorPhrases));

	// Якщо елементи не знайдено — завершити функцію
	if (phrases.length === 0) return;

	let currentPhraseIndex = 0; 	// Поточний індекс фрази, яка виводиться, за замовчуванням — перша отримана фраза
	let currentPhraseText = ''; 	// Поточний відображений текст, за замовчуванням — пусте поле
	let isPhraseDeleting = false; 	// Чи триває зараз процес видалення поточної фрази, за замовчуванням — ні (спочатку буде процес відображення фрази)

	// Запускаємо анімацію оновлення тексту для ефекту 'пишучої машинки'
	updateText();

	// Функцяя оновлення тексту
	function updateText() {
		// Отримуємо повний текст поточної фрази
		const fullCurrentPhraseText = phrases[currentPhraseIndex].textContent.trim();

		// Таймер оновлення наступного символу фрази
		let timeout;

		// Якщо триває процес видалення фрази
		if (isPhraseDeleting) {
			// Видаляємо у поточному відображеному тексті — останній символ фрази
			currentPhraseText = fullCurrentPhraseText.substring(0, currentPhraseText.length - 1);

			// Наступне оновлення дорівнює затримці між кожним видаленим символом фрази
			timeout = speedDeleting;
		}
		// В іншому випадку
		else {
			// Додаємо у поточний відображений текст — останній символ фрази
			currentPhraseText = fullCurrentPhraseText.substring(0, currentPhraseText.length + 1);

			// Наступне оновлення дорівнює затримці між кожним введеним символом фрази
			timeout = speedTyping;
		}

		// Оновлюємо елемент, на поточний відображений текст
		outputElement.textContent = currentPhraseText;

		// Якщо поточну фразу повністю надруковано
		if (!isPhraseDeleting && currentPhraseText === fullCurrentPhraseText) {
			timeout = delayBeforeDelete; // Затримка перед початком видалення надрукованої фрази
			isPhraseDeleting = true; // Далі буде тривати процес видалення
		}

		// Якщо поточну фразу повністю стерто
		else if (isPhraseDeleting && currentPhraseText === '') {
			currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length; // Розраховуємо індекс наступної фрази
			timeout = delayBeforeType; // Затримка перед початком введення наступної фрази
			isPhraseDeleting = false; // Далі буде тривати процес додавання символів наступної фрази
		}

		// Запускаємо таймер для оновлення наступного символу фрази
		setTimeout(updateText, timeout);
	}
}