/**
 * YIELD TRACK - Official Script 2026
 * Функционал: Навигация, GSAP анимации, Формы, Cookies
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. ИНИЦИАЛИЗАЦИЯ ИКОНОК (LUCIDE)
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. РЕГИСТРАЦИЯ GSAP ПЛАГИНОВ
    gsap.registerPlugin(ScrollTrigger);

    // 3. МОБИЛЬНОЕ МЕНЮ (БУРГЕР + OVERLAY)
    const burger = document.getElementById('burger-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body;
    const mobileLinks = document.querySelectorAll('.mobile-menu__link, .mobile-menu__btn');

    const toggleMenu = (forceClose = false) => {
        if (!burger || !mobileMenu) return;

        const isOpen = mobileMenu.classList.contains('active');
        const shouldOpen = forceClose ? false : !isOpen;

        burger.classList.toggle('active', shouldOpen);
        mobileMenu.classList.toggle('active', shouldOpen);
        
        // Блокировка скролла при открытом меню
        body.style.overflow = shouldOpen ? 'hidden' : '';
    };

    if (burger) {
        burger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }

    // Закрытие при клике на пункты меню
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(true));
    });

    // 4. ЭФФЕКТ ХЕДЕРА ПРИ СКРОЛЛЕ
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (!header) return;
        if (window.scrollY > 50) {
            header.style.background = 'rgba(15, 17, 21, 0.98)';
            header.style.height = '70px';
        } else {
            header.style.background = 'rgba(15, 17, 21, 0.9)';
            header.style.height = '90px';
        }
    });

    // 5. АНИМАЦИЯ HERO (БЕЗ РАЗРЫВА СЛОВ)
    const initHero = () => {
        const title = document.querySelector('#hero-title');
        if (!title) return;

        // Принудительно показываем заголовок перед анимацией
        gsap.set(title, { opacity: 1, visibility: 'visible' });

        // SplitType: разделяем на слова и символы для корректного переноса
        const splitText = new SplitType(title, { types: 'words, chars' });

        const tl = gsap.timeline();
        tl.from(splitText.chars, {
            opacity: 0,
            y: 30,
            stagger: 0.02,
            duration: 0.8,
            ease: "power3.out",
            delay: 0.3,
            onComplete: () => {
                // Очистка стилей после анимации для стабильности
                gsap.set(splitText.chars, { clearProps: "all" });
            }
        })
        .from('.hero__tag', { opacity: 0, x: -20, duration: 0.6 }, "-=0.6")
        .from('.hero__text', { opacity: 0, y: 20, duration: 0.6 }, "-=0.4")
        .from('.hero__btns', { opacity: 0, y: 20, duration: 0.6 }, "-=0.4")
        .from('.hero__visual', { opacity: 0, scale: 0.95, duration: 1, ease: "power2.out" }, "-=0.8");
    };

    // 6. УНИВЕРСАЛЬНАЯ ПОДГРУЗКА ЭЛЕМЕНТОВ ПРИ СКРОЛЛЕ
    const setupScrollReveal = () => {
        // Список селекторов для анимации
        const itemsToReveal = [
            '.strategy-card', 
            '.experience__item', 
            '.bento__item', 
            '.contact__info', 
            '.contact__form',
            '.policy-section' // Для юридических страниц
        ];

        itemsToReveal.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((el) => {
                gsap.from(el, {
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%', // Срабатывает, когда элемент входит в зону видимости
                        toggleActions: 'play none none none'
                    },
                    opacity: 0,
                    y: 40,
                    duration: 0.8,
                    ease: "power2.out"
                });
            });
        });

        // Анимация прогресс-бара в секции Experience
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            gsap.to(progressFill, {
                scrollTrigger: {
                    trigger: '.experience',
                    start: 'top 70%',
                },
                width: '85%',
                duration: 2,
                ease: "power4.out"
            });
        }
    };

    // 7. ВАЛИДАЦИЯ ТЕЛЕФОНА (ТОЛЬКО ЦИФРЫ И +)
    const phoneInput = document.getElementById('phone-input');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9+]/g, '');
        });
    }

    // 8. КАПЧА И ФОРМА ОБРАТНОЙ СВЯЗИ
    const contactForm = document.getElementById('main-form');
    if (contactForm) {
        const n1 = Math.floor(Math.random() * 10);
        const n2 = Math.floor(Math.random() * 5);
        const correctAnswer = n1 + n2;
        const captchaLabel = document.getElementById('captcha-label');

        if (captchaLabel) {
            captchaLabel.innerText = `Решите пример: ${n1} + ${n2} = ?`;
        }

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const captchaInput = document.getElementById('captcha-input');
            const successMsg = document.getElementById('form-success');
            const errorMsg = document.getElementById('form-error');

            if (parseInt(captchaInput.value) === correctAnswer) {
                successMsg.style.display = 'block';
                errorMsg.style.display = 'none';
                contactForm.reset();
                contactForm.style.opacity = '0.5';
                contactForm.style.pointerEvents = 'none';
            } else {
                errorMsg.style.display = 'block';
                successMsg.style.display = 'none';
                // Визуальный эффект ошибки (тряска)
                gsap.to(captchaInput, { x: 10, repeat: 3, yoyo: true, duration: 0.1 });
            }
        });
    }

    // 9. COOKIE POPUP (C СОХРАНЕНИЕМ В LOCALSTORAGE)
    const cookiePopup = document.getElementById('cookie-popup');
    const acceptBtn = document.getElementById('accept-cookies');

    if (cookiePopup && !localStorage.getItem('yt_cookies_accepted')) {
        setTimeout(() => {
            cookiePopup.classList.add('active');
            gsap.fromTo(cookiePopup, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
        }, 2000);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('yt_cookies_accepted', 'true');
            cookiePopup.classList.remove('active');
        });
    }

    // 10. ЗАПУСК ВСЕХ МОДУЛЕЙ
    initHero();
    setupScrollReveal();
});