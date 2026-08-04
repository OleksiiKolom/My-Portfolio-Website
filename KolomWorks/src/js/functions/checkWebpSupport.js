// Перевірка підтримки WebP, додавання класу webp або no-webp до елемента 'html'
export function checkWebpSupport({
	classWebpSupport = '_webp',     // Клас, який буде додано для підтримки WebP, за замовчуванням — _webp
	classWebpNoSupport = '_no-webp' // Клас, який буде додано для відсутності підтримки WebP, за замовчуванням — _no-webp
} = {}) {
	// Ключ для зберігання та отримання можливості підтримки WebP з localStorage
	const storageKey = 'isWebpSupport';

	// Допустимі значення ключа в localStorage
	const validValues = ['true', 'false'];

	// Отримуємо збережений результат
	const cachedResult = localStorage.getItem(storageKey);

	// Якщо збережений результат має допустиме значення — використовуємо його
	if (validValues.includes(cachedResult)) {
		// Розраховуємо клас, що буде додано до елемента 'html'
		const className = cachedResult === 'true' ? classWebpSupport : classWebpNoSupport;

		// Додаємо розрахований клас до елемента 'html'
		document.documentElement.classList.add(className);

		// Завершуємо функцію — подальший код не виконуємо
		return;
	}

	// Створюємо мінімальне тестове WebP-зображення для перевірки підтримки формату
	const img = new Image();
	img.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';

	// Якщо зображення завантажиться або виникне помилка — викликати функцію
	img.onload = img.onerror = () => {
		// Перевірка підтримки WebP зображення
		const isWebpSupport = img.width > 0 && img.height > 0;

		// Розраховуємо клас, що буде додано до елемента 'html'
		const className = isWebpSupport ? classWebpSupport : classWebpNoSupport;

		// Додаємо розрахований клас до елемента 'html'
		document.documentElement.classList.add(className);

		// Зберігаємо результат у локальну змінну
		localStorage.setItem(storageKey, isWebpSupport);
	};
}