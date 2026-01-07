document.addEventListener('DOMContentLoaded', () => {
    // 1. Инициализация иконок
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // 2. Мобильное меню (Полный цикл)
    const burger = document.getElementById('burger-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const links = document.querySelectorAll('.mobile-menu__link');

    const toggleMenu = () => {
        const isOpen = mobileMenu.classList.toggle('active');
        burger.classList.toggle('active');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    if (burger) {
        burger.addEventListener('click', toggleMenu);
    }

    links.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            burger.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // 3. Анимация заголовка без разрыва слов
    const initHero = () => {
        const title = document.querySelector('#hero-title');
        if (!title) return;

        // Важно: разделяем и на слова, и на символы
        const text = new SplitType(title, { types: 'words, chars' });

        const tl = gsap.timeline();
        tl.from(text.chars, {
            opacity: 0,
            y: 30,
            stagger: 0.02,
            duration: 0.8,
            ease: "power3.out",
            delay: 0.3
        })
        .from('.hero__tag', { opacity: 0, x: -20, duration: 0.6 }, "-=0.6")
        .from('.hero__text', { opacity: 0, y: 20, duration: 0.6 }, "-=0.4")
        .from('.hero__btns', { opacity: 0, y: 20, duration: 0.6 }, "-=0.4");
    };

    // 4. Подгрузка остальных секций
    gsap.registerPlugin(ScrollTrigger);
    
    const revealOnScroll = (selector) => {
        document.querySelectorAll(selector).forEach(el => {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                },
                opacity: 0,
                y: 30,
                duration: 0.8
            });
        });
    };

    revealOnScroll('.strategy-card');
    revealOnScroll('.bento__item');
    
    initHero();
});