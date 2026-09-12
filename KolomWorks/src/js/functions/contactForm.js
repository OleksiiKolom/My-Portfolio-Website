// Функція валідує дані форми та відправляє їх на сервер
export function contactForm({
	selectorForm,             // Селектор елемента форми
	selectorInputName,        // Селектор елемента для введеня ім'я
	selectorInputEmail,       // Селектор елемента для введення пошти
	selectorInputPhone,       // Селектор елемента для введення номера телефону
	selectorInputMessage,     // Селектор елемента для введення повідомлення
	selectorElementHoneypot,  // Селектор елемента 'Honeypot' (для перевірки антиспаму)
	selectorElementError,     // Селектор елемента для виведення помилки під полем введення
	classElementShowLoader,   // Клас, що буде додано до елемента анімації завантаження
	minDurationShowLoader,    // Мінімальна тривалість анімації завантаження
	maxDurationShowLoader,    // Максимальна тривалість анімації завантаження
	languageManagerAPI        // Базове API функції мовного менеджера
} = {}) {

	// Отримуємо елемент форми
	const form = document.querySelector(selectorForm);

	// Якщо такого елемента не існує — завершити функцію
	if (!form) return;

	// Отримуємо всі елементи форми для введення відповідних даних
	const inputName = form.querySelector(selectorInputName);
	const inputEmail = form.querySelector(selectorInputEmail);
	const inputPhone = form.querySelector(selectorInputPhone);
	const inputMessage = form.querySelector(selectorInputMessage);

	// Якщо якогось з елементів не існє — завершити функцію
	if (!inputName || !inputEmail || !inputPhone || !inputMessage) return;

	// Зберігає чи додано обробники подій до елементів форми для Live валідації, за замовчуванням — ні
	let liveValidationAdded = false;

	// Зберігає чи триває процес відправки форми, за замовчуванням — ні
	let isSubmitting = false;

	// Отримуємо поточну мову сайту/сторінки
	const currentLanguage = getLanguage();

	// Об'єк зберігає повідомлення, що будуть відображені, враховуючи мову сайту/сторінки
	const messages = {
		en: {
			nameInvalid: "Invalid name",
			emailInvalid: "Invalid email address",
			phoneInvalid: "Invalid phone number",
			messageInvalid: "Invalid message",
			success: {
				firstMessage: "Thank you! Your message has been sent",
				secondMessage: "You will be contacted within 24 hours"
			},
			error: {
				firstMessage: "Something went wrong",
				secondMessage: "Please try submitting the form again later"
			},
			reload: "Try again"
		},
		ua: {
			nameInvalid: "Некоректне імʼя",
			emailInvalid: "Некоректна електронна пошта",
			phoneInvalid: "Некоректний телефон",
			messageInvalid: "Некоректне повідомлення",
			success: {
				firstMessage: "Дякуємо! Повідомлення успішно надіслано",
				secondMessage: "З вами зв'яжуться протягом 24 годин"
			},
			error: {
				firstMessage: "Щось пішло не так",
				secondMessage: "Спробуйте надіслати форму пізніше"
			},
			reload: "Спробувати ще раз"
		},
		ru: {
			nameInvalid: "Некорректное имя",
			emailInvalid: "Некорректный email-адрес",
			phoneInvalid: "Некорректный телефон",
			messageInvalid: "Некорректное сообщение",
			success: {
				firstMessage: "Спасибо! Сообщение успешно отправлено",
				secondMessage: "С вами свяжутся в течение 24 часов"
			},
			error: {
				firstMessage: "Что-то пошло не так",
				secondMessage: "Попробуйте отправить форму позже"
			},
			reload: "Попробовать снова"
		}
	};

	// Додаємо обробник події при відправки форми
	form.addEventListener('submit', async (e) => {
		// Скасуємо відправку форми за замовчуванням
		e.preventDefault();

		// Якщо вже триває процес відправки форми — завершити функцію
		if (isSubmitting) return;

		// Отримуємо результат валідації
		const isValid = isFieldsValid();

		// Якщо всі введені дані валідні
		if (isValid) {
			// Відправляємо форму на сервер
			await sendFormToServer();
		}

		// Якщо введені дані не валідні ТА не додано обробники подій до елементів форми для Live валідації
		else if (!isValid && !liveValidationAdded) {
			// Додаємо обробники подій до елементів форми для Live валідації
			addLiveValidation();
			liveValidationAdded = true;
		}

		// В іншому випадку примусово завершуємо функцію
		else {
			return;
		}
	});

	// Функція перевіряє та повертає результат валідації введеного імені користувача
	function validateName(value) {
		if (value === '' || value.length < 2 || value.length > 30) return false;
		const regex = /^[a-zA-Zа-яА-ЯёЁіІїЇєЄ'\-\s]+$/;
		return regex.test(value.trim());
	}

	// Функція перевіряє та повертає результат валідації введеної пошти користувача
	function validateEmail(value) {
		if (value === '' || value.length > 100) return false;
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
		return regex.test(value.trim());
	}

	// Функція перевіряє та повертає результат валідації введеного номера телефону користувача
	function validatePhone(value) {
		const regex = /^[+\d][\d\s\-()]{6,20}$/;
		return regex.test(value.trim());
	}

	// Функція перевіряє та повертає результат валідації введеного повідомлення від користувача
	function validateMessage(value) {
		if (value.length < 3 || value.length > 5000) return false;
		const forbidden = /[<>;]/g;
		return !forbidden.test(value);
	}

	// Функція валідуює отримане поле та показує або видаляє помилку
	function validateField(input, validator, messageKey) {
		// Якщо поле не пройшло валідацію
		if (!validator(input.value)) {
			// Виводимо помилку
			showError(input, messages[currentLanguage][messageKey]);
			return false;
		} else {
			// В іншому випадку видаляєсо помилку
			clearError(input);
			return true;
		}
	}

	// Функція вертає загальний результат валідації (всіх елементві форми)
	function isFieldsValid() {
		// Зберігаємо результат валідності всіх елементів форми
		const isValid =
			validateField(inputName, validateName, 'nameInvalid') &&
			validateField(inputEmail, validateEmail, 'emailInvalid') &&
			validateField(inputPhone, validatePhone, 'phoneInvalid') &&
			validateField(inputMessage, validateMessage, 'messageInvalid');

		// Вертаємо результат валідації
		return isValid;
	}

	// Функія додає обробники подій до елементві форми для Live валідації
	function addLiveValidation() {
		// Додає обробник події до поля введення ім'я користувача 
		inputName.addEventListener('input', () =>
			validateField(inputName, validateName, 'nameInvalid')
		);

		// Додає обробник події до поля введення пошти користувача 
		inputEmail.addEventListener('input', () =>
			validateField(inputEmail, validateEmail, 'emailInvalid')
		);

		// Додає обробник події до поля введення номера телефону користувача 
		inputPhone.addEventListener('input', () =>
			validateField(inputPhone, validatePhone, 'phoneInvalid')
		);

		// Додає обробник події до поля введення повідомлення користувача 
		inputMessage.addEventListener('input', () =>
			validateField(inputMessage, validateMessage, 'messageInvalid')
		);
	}

	// Функція виводить помилку у отриманого елемента
	function showError(inputElement, errorText) {
		// Отримуємо елемент для виведення помилки у отриманого елемента
		const elementError = inputElement.parentElement.querySelector(selectorElementError);

		// Якщо такий елемент існує — додаємо до нього текст помилки
		if (elementError) elementError.textContent = errorText;
	}

	// Функція очищає елемент для виведення помилки у отриманого елемента
	function clearError(inputElement) {
		// Отримуємо елемент для виведення помилки у отриманого елемента
		const elementError = inputElement.parentElement.querySelector(selectorElementError);

		// Якщо такий елемент існує — очищаємо його вміст
		if (elementError) elementError.textContent = '';
	}

	// Функція додає анімацію завантаження (додає відповідний класу елементу form)
	function showLoader() {
		form.classList.add(classElementShowLoader);
	}

	// Функція видаляє анімацію завантаження (видаляє відповідний класу елемента form)
	function hideLoader() {
		form.classList.remove(classElementShowLoader);
	}

	// Функція показує фінальне повідомлення після відправки форми на сервер
	function showFinalMessage(isSuccess = false) {
		const lang = messages[currentLanguage];
		const state = isSuccess ? "success" : "error";

		const iconClass = isSuccess ? "_icon-success" : "_icon-error";
		const { firstMessage, secondMessage } = lang[state];

		form.innerHTML = `
      <div class="form__result result-form">
        <div class="result-form__icon ${iconClass} aria-hidden="true"></div>
		<h4 class="result-form__title">${firstMessage}</h4>
		<p class="result-form__description">${secondMessage}</p>
      </div>
    `;
	}

	// Функція вертає мову сайту/сторінки
	function getLanguage() {
		return languageManagerAPI?.getLanguageFromPath?.(window.location.pathname) || "en";
	}

	// Функція обробляє відправку форми на сервер
	async function sendFormToServer() {
		// Триває процес відправки
		isSubmitting = true;

		// Отримуємо кнопку для відправки форми
		const submitButton = form.querySelector('[type="submit"]');

		// Якщо кнопка для відправки форми існує — блокуємо її
		if (submitButton) submitButton.disabled = true;

		// Додаємо анімацію завантаження
		showLoader();

		// Створюємо контроллер для обмеження часу відправки форми на сервер
		const controller = new AbortController();

		// Створюємо мінімальну затримку часу відправки форми на сервер
		const minDelay = new Promise(r => setTimeout(r, minDurationShowLoader));

		// Створюємо таймер для максимального часу очікування відправки форми на сервер
		const timeoutId = setTimeout(() => controller.abort(), maxDurationShowLoader);

		try {
			// Отримуємо елемент 'Honeypot' (для перевірки антиспаму)
			const honeypot = form.querySelector(selectorElementHoneypot);

			// Якщо такий елемент існує і він не пустий
			if (honeypot && honeypot.value.trim() !== '') {
				// Виводимо помилку відправки форми
				showFinalMessage(false);

				// Подальший код не виконуємо (відбувається спам)
				return;
			}

			// Зберігаємо всі введені значення форми
			const formData = new FormData(form);

			// Робимо запрос на сервер
			const fetchPromise = fetch('/public/contact.php', {
				method: 'POST',
				body: formData,
				signal: controller.signal
			});

			const response = await Promise.all([
				fetchPromise,
				minDelay
			]).then(([res]) => res);

			// Якщо сервер верне помилку — генеруємо помилку для користувача
			if (!response.ok) throw new Error('Server error');

			// Отрмуємо результат обробки на сервері
			const result = await response.json();

			// Виводимо результат відправки форми
			showFinalMessage(result.success ? true : false);
		}

		// Якщо на одному з етапів виникла помилка - виводимо результат про помилку відправки або обробки форми
		catch (error) {
			showFinalMessage(false);
		}

		finally {
			// Видаляємо таймер для максимального часу очікування відправки форми на сервер
			clearTimeout(timeoutId);

			// Видаляємо анімацію завантаження
			hideLoader();

			// Завершуємо процес відправки
			isSubmitting = false;

			// Якщо існує кнопка для відправки форми - активуємо її
			if (submitButton) submitButton.disabled = false;
		}
	}
}