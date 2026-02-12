const translations = {
    ru: {
        nav_dashboard: 'Мой Дашборд',
        nav_home: 'На главную',
        logout: 'Выйти из аккаунта',
        hero_path_progress_map: 'Карта прогресса',
        hero_path_achievements: 'Достижения',
        hero_path_title: 'Путь героя: Карта прогресса',
        hero_step_start: 'Начало пути',
        hero_step_boundaries: 'Работа с границами',
        hero_step_integration: 'Интеграция',
        achievements_title: 'Мои достижения',
        achievements_placeholder: 'Здесь будут отображаться ваши награды и достижения.',
        ach_first_step_title: 'Первый шаг',
        ach_first_step_desc: 'Вы начали свой путь героя. Это важное решение!',
        ach_first_session_title: 'Первая сессия',
        ach_first_session_desc: 'Вы успешно провели первую сессию со специалистом.',
        ach_first_note_title: 'Первая заметка',
        ach_first_note_desc: 'Вы сделали первую запись в своем дневнике размышлений.',
        hero_path_title_sidebar: 'Путь Героя',
        hero_step_start_desc: 'Это первый и самый важный шаг. Вы приняли решение изменить свою жизнь. Поздравляем!',
        hero_step_boundaries_desc: 'На этом этапе мы учимся распознавать и защищать свои личные границы. Это ключ к здоровым отношениям.',
        hero_step_integration_desc: 'Будущий этап, на котором вы будете интегрировать полученные навыки в повседневную жизнь.',
        modal_close_button: 'Понятно',
    },
    ua: {
        nav_dashboard: 'Моя Панель',
        nav_home: 'На головну',
        logout: 'Вийти з акаунту',
        hero_path_progress_map: 'Мапа прогресу',
        hero_path_achievements: 'Досягнення',
        hero_path_title: 'Шлях героя: Мапа прогресу',
        hero_step_start: 'Початок шляху',
        hero_step_boundaries: 'Робота з кордонами',
        hero_step_integration: 'Інтеграція',
        achievements_title: 'Мої досягнення',
        achievements_placeholder: 'Тут будуть відображатися ваші нагороди та досягнення.',
        ach_first_step_title: 'Перший крок',
        ach_first_step_desc: 'Ви розпочали свій шлях героя. Це важливе рішення!',
        ach_first_session_title: 'Перша сесія',
        ach_first_session_desc: 'Ви успішно провели першу сесію з фахівцем.',
        ach_first_note_title: 'Перший запис',
        ach_first_note_desc: 'Ви зробили перший запис у своєму щоденнику роздумів.',
        hero_path_title_sidebar: 'Шлях Героя',
        hero_step_start_desc: 'Це перший і найважливіший крок. Ви прийняли рішення змінити своє життя. Вітаємо!',
        hero_step_boundaries_desc: 'На цьому етапі ми вчимося розпізнавати та захищати свої особисті кордони. Це ключ до здорових стосунків.',
        hero_step_integration_desc: 'Майбутній етап, на якому ви будете інтегрувати отримані навички у повсякденне життя.',
        modal_close_button: 'Зрозуміло',
    },
    en: {
        nav_dashboard: 'My Dashboard',
        nav_home: 'To Main Page',
        logout: 'Log out',
        hero_path_progress_map: 'Progress Map',
        hero_path_achievements: 'Achievements',
        hero_path_title: 'Hero\'s Journey: Progress Map',
        hero_step_start: 'The Beginning',
        hero_step_boundaries: 'Working with Boundaries',
        hero_step_integration: 'Integration',
        achievements_title: 'My Achievements',
        achievements_placeholder: 'Your awards and achievements will be displayed here.',
        ach_first_step_title: 'First Step',
        ach_first_step_desc: 'You have started your hero\'s journey. This is an important decision!',
        ach_first_session_title: 'First Session',
        ach_first_session_desc: 'You have successfully completed your first session with a specialist.',
        ach_first_note_title: 'First Note',
        ach_first_note_desc: 'You made the first entry in your reflection journal.',
        hero_path_title_sidebar: 'Hero\'s Journey',
        hero_step_start_desc: 'This is the first and most important step. You have made the decision to change your life. Congratulations!',
        hero_step_boundaries_desc: 'At this stage, we learn to recognize and protect our personal boundaries. This is the key to healthy relationships.',
        hero_step_integration_desc: 'A future stage where you will integrate the acquired skills into everyday life.',
        modal_close_button: 'Got it',
    }
};

document.addEventListener('DOMContentLoaded', () => {
    MockAPI.init();
    const user = MockAPI.getLoggedInUser();
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    const savedTheme = localStorage.getItem('appTheme');
    if (savedTheme) setTheme(savedTheme);
    
    const savedLang = localStorage.getItem('appLang');
    if (savedLang) {
        const radio = document.querySelector(`input[name="lang"][value="${savedLang}"]`);
        if (radio) radio.checked = true;
    }
    
    showView('hero-path-view');
    applyTranslations();
});

function showView(viewId) {
    document.querySelectorAll('.content-area > section').forEach(section => {
        section.classList.add('hidden');
    });

    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.remove('hidden');
    }

    document.querySelectorAll('#hero-path-submenu .sidebar-link').forEach(l => l.classList.remove('active'));
    if (viewId === 'hero-path-view') {
        document.getElementById('subnav-hero-map').classList.add('active');
        renderHeroPath();
    } else if (viewId === 'achievements-view') {
        document.getElementById('subnav-hero-achievements').classList.add('active');
        renderAchievements();
    }
}

function renderHeroPath() {
    const container = document.querySelector('#hero-path-view .hero-path-container');
    if (!container) return;

    const steps = MockAPI.getHeroPath() || [];

    container.innerHTML = steps.map((step, index) => {
        const stepHtml = `
            <div class="hero-step ${step.status || ''} cursor-pointer" onclick="showStepDetails('${step.id}')">
                <div class="step-icon">${step.icon}</div>
                <div class="step-label" data-translate-key="${step.labelKey}"></div>
            </div>
        `;
        const lineHtml = index < steps.length - 1 ? '<div class="hero-step-line"></div>' : '';
        return stepHtml + lineHtml;
    }).join('');

    applyTranslations();
}

function renderAchievements() {
    const container = document.getElementById('achievements-list');
    if (!container) return;

    const achievements = MockAPI.getAchievements() || [];
    const lang = localStorage.getItem('appLang') || 'ru';
    const dict = translations[lang];

    if (!achievements.length) {
        container.innerHTML = `<p>${dict.achievements_placeholder}</p>`;
        return;
    }

    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${achievements.map(ach => `
                <div class="achievement-card ${ach.unlocked ? 'unlocked' : ''}">
                    <div class="ach-icon">${ach.unlocked ? ach.icon : '❓'}</div>
                    <div class="ach-text">
                        <h4 class="ach-title" data-translate-key="${ach.titleKey}"></h4>
                        <p class="ach-desc" data-translate-key="${ach.descKey}"></p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    applyTranslations();
}

function showStepDetails(stepId) {
    const steps = MockAPI.getHeroPath();
    const step = steps.find(s => s.id === stepId);
    if (!step) return;

    const modal = document.getElementById('step-details-modal');
    const titleEl = document.getElementById('step-modal-title');
    const descEl = document.getElementById('step-modal-desc');
    const iconEl = document.getElementById('step-modal-icon');
    if (!modal || !titleEl || !descEl || !iconEl) return;

    const lang = localStorage.getItem('appLang') || 'ru';
    const dict = translations[lang];

    iconEl.innerText = step.icon;
    titleEl.innerText = dict[step.labelKey] || 'Детали шага';
    descEl.innerText = dict[step.descriptionKey] || 'Описание отсутствует.';

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    applyTranslations(); // To translate the button
}

function closeStepDetails() {
    const modal = document.getElementById('step-details-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function applyTranslations() {
    const lang = localStorage.getItem('appLang') || 'ru';
    const dict = translations[lang];
    if (!dict) return;

    document.querySelectorAll('[data-translate-key]').forEach(el => {
        const key = el.getAttribute('data-translate-key');
        const translation = dict[key];
        if (translation !== undefined) {
            if (el.matches('input[placeholder]')) {
                el.placeholder = translation;
            } else {
                // Using textContent is safer as it doesn't parse HTML and is not affected by CSS display properties.
                el.textContent = translation;
            }
        }
    });
}

function setTheme(theme) {
    if (theme === 'dark') document.body.classList.add('dark-theme');
    else document.body.classList.remove('dark-theme');
    localStorage.setItem('appTheme', theme);
}

function logout() {
    MockAPI.logoutUser();
    window.location.href = 'index.html';
}