import { initParticles } from "./modules/particles.js";
import { checkWebpSupport } from './functions/checkWebpSupport.js';
import { updateHeaderOnScroll } from './functions/updateHeaderOnScroll.js';
import { burgerMenuToggleClass } from './functions/burgerMenuToggleClass.js';
import { lightAndDarkMode } from './functions/lightAndDarkMode.js';
import { runTypeWriterEffect } from './functions/runTypeWriterEffect.js';
import { animationOnScroll } from './functions/animationOnScroll.js';
import { runWelcomeAnimation } from './functions/runWelcomeAnimation.js';
import { popupManager } from './functions/popupManager.js';
import { languageManager } from './functions/languageManager.js';
import { contactForm } from './functions/contactForm.js';

document.addEventListener("DOMContentLoaded", function () {
	initParticles();
	checkWebpSupport({
		classWebpSupport: '_webp',									// Клас, який буде додано для підтримки WebP
		classWebpNoSupport: '_no-webp' 								// Клас, який буде додано для відсутності підтримки WebP
	});
	updateHeaderOnScroll({
		selectorElement: 'header',              					// Селектор елемента до якого буде додано клас під час скролу
		classScrollActive: '_scroll-active', 						// Клас, який буде додано до елемента під час скролу
		delayThrottle: 20                   						// Затримка для throttle у мілісекундах
	});
	burgerMenuToggleClass({
		selectorBurgerElement: '.header__burger',      				// Селектор бургер-елемента до якого застосовується клас для активації 
		selectorNavigationElement: '.header__menu',  				// Селектор елемента навігації до якого застосовується клас для активації 
		classActive: '_active',    									// Клас, який буде додано до бургер-елемента та елемента навігації для їх активації
		classBodyLock: '_lock',    									// Клас блокування, що буде додано до елемента body
		minWidth: 0,               									// Мінімальна ширина екрана для активації бургер-меню
		maxWidth: 992             									// Максимальна ширина екрана для активації бургер-меню
	});
	runTypeWriterEffect({
		selectorPhrases: '.introduction__item',          			// Селектор фраз, що будуть виводитись по черзі
		selectorOutputElement: '.introduction__typing',  			// Селектор елемента, де будуть виводитись отримані фрази
		speedTyping: 120,        						 			// Затримка між кожним введеним символом фрази (мс)
		speedDeleting: 60,       									// Затримка між кожним видаленим символом фрази (мс)
		delayBeforeType: 1200,    									// Затримка перед початком введення наступної фрази (мс)
		delayBeforeDelete: 2000  									// Затримка перед початком видалення надрукованої фрази (мс)
	});
	lightAndDarkMode({
		classLightMode: '_light-mode',     							// Клас, що буде додано до елемента 'html' для активації світлої теми
		classDarkMode: '_dark-mode',       							// Клас, що буде додано до елемента 'html' для активації темної теми
		defaultMode: '_light-mode',                       		 	// Тема, яка буде встановлена за замовчуванням
		selectorThemeSwitcher: '.theme-switcher',         			// Селектор елемента для зміни теми
		hourStartOfDay: 7,                 							// Час (година) початку світлої доби
		hourStartOfNight: 20,              							// Час (година) початку темної доби
		durationAnimationThemeSwitch: 2000,   						// Тривалість анімації зміни теми (мс)
		classThemeSwitchActive: '_theme-animating'        			// Клас, що буде додано до елемента 'html' під час зміни теми
	});
	const welcomeAnimationAPI = runWelcomeAnimation({
		selectorBlockAnimation: '.welcome-screen',   				// Селектор загального блоку анімації
		selectorTitle: '.welcome-screen__title',					// Селектор основного заголовка загального блоку анімації
		selectorSubtitle: '.welcome-screen__subtitle',				// Селектор підзаголовка загального блоку анімації (блок з відображенням відсотків)
		durationFirstPartAnimation: 3500,                			// Тривалість першої частини анімації (анімація заповнення основного заголовка + відображення відсотків)
		delayBeforeSecondPartAnimation: 500,           				// Затримка перед початком другої частини анімації
		durationSecondPartAnimation: 1500,                			// Тривалість другої частини анімації (3Д збільшення основного заголовка)
		classAnimationActive: '_welcome-anim-active',  				// Клас, що буде додано до загального блоку для активації анімації
		classBodyLock: '_lock',                        				// Клас блокування, що буде додано до елемента body
		classElementsPositionFixed: '_lock-padding' 				// Клас елементів з фіксованим позиціюванням, до них будуть додані css-властивості для коректної анімації
	});
	animationOnScroll({
		selectorAnimationItems: '._anim-on-scroll',					// Селектор елементів, що анімуються при скролі
		classAnimationActive: '_active-anim-skroll', 				// Клас, який буде додано до елементів для активації анімації
		coefficientAnimationStart: 4,                				// Коефіцієнт початку анімації відносно висоти елемента
		shouldAnimateAgain: false,                   				// Зберігає, чи потрібно повторно анімувати елементи
		delayThrottle: 50,                          				// Затримка для throttle у мілісекундах
		delayForElementsInView: 300,                 				// Затримка для анімації елементів, які вже в полі зору у мілісекундах
		welcomeAnimationAPI                           				// Базове API функції анімації початкового вітання
	});
	const popupManagerAPI = popupManager({
		classPopup: 'popup',                            			// Загальний клас попапів
		classPopupNoClose: '_no-close-popup',						// Класс попапів, які не можна закрити стандартними засобами
		classPopupOpened: '_popup-opened',             				// Клас, який буде додано до попапу для активізації його відкриття
		classButtonsOpenPopup: '_open-popup-button',				// Клас елементів (кнопки/посилання), які відкривають відповідний попап
		classButtonsClosePopup: '_close-popup-button',				// Клас елементів (кнопки/посилання), які закривають відповідний попап
		animationDurationOpen: 700,                      			// Тривалість анімації відкриття попапу (повинно відповідати значенню в css-властивостях)
		animationDurationClose: 700, 								// Тривалість анімації закриття попапу (повинно відповідати значенню в css-властивостях)
		classElementsPositionFixed: '_lock-padding',   				// Клас елементів з фіксованим позиціюванням, до них будуть додані css-властивості для коректної анімації
		classBodyLock: '_lock',                        				// Клас блокування, що буде додано до елемента body
	});
	const languageManagerAPI = languageManager({
		idPopupLanguageSwitch: 'popup-lang-switch',               	// id попапу для зміни мови
		idPopupRussianAggression: 'popup-ru-aggression',           	// id попапу з питанням, щодо агресії Росії проти України
		selectorButtonsChooseLanguage: '[data-lang]',              	// Селектор елементів (кнопки/посилання), розташованих в попапі для зміни мови
		selectorAggressionButtonYes: '[data-ru-aggression="yes"]', 	// Селектор елементу (кнопка/посилання) 'так' попапу з питанням, щодо агресії Росії проти України
		selectorAggressionButtonNo: '[data-ru-aggression="no"]',   	// Селектор елементу (кнопка/посилання) 'ні' попапу з питанням, щодо агресії Росії проти України
		defaultLanguage: 'en',                                     	// Мова за замовчуванням на сайті
		supportedLanguages: ['en', 'ua', 'ru'],                   	// Підтримувані мови
		popupAutoOpenDelay: 4000,                                  	// Затримка перед автоматичним відкриттям попапу (мс) для зміни мови	
		selectorElementOverlay: '.overlay-patriotic',           	// Селектор елементу, що блокує сайт
		classElementOverlayBlocked: '_blocked',                    	// Клас, який буде додано до елементу, що блокує сайт для активації блокування
		welcomeAnimationAPI,                                        // API анімації початкового вітання
		popupManagerAPI	                                            // API менеджера попапів
	});
	contactForm({
		selectorForm: '.form-contact',             					// Селектор елемента форми
		selectorInputName: '#contact-name',        					// Селектор елемента для введеня ім'я
		selectorInputEmail: '#contact-email',       				// Селектор елемента для введення пошти
		selectorInputPhone: '#contact-phone',       				// Селектор елемента для введення номера телефону
		selectorInputMessage: '#contact-message',    				// Селектор елемента для введення повідомлення
		selectorElementHoneypot: '#contact-honeypot',  				// Селектор елемента 'Honeypot' (для перевірки антиспаму)
		selectorElementError: '.form-contact__error',     			// Селектор елемента для виведення помилки під полем введення
		classElementShowLoader: '_load-active',   					// Клас, що буде додано до елемента анімації завантаження
		minDurationShowLoader: 2000,    							// Мінімальна тривалість анімації завантаження
		maxDurationShowLoader: 6000,    							// Максимальна тривалість анімації завантаження
		languageManagerAPI: languageManagerAPI        				// Базове API функції мовного менеджера
	});
});