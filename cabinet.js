/**
 * ЛОГИКА ЛИЧНОГО КАБИНЕТА
 */

let clientLastReadTime = parseInt(localStorage.getItem('clientLastReadTime') || '0');

const translations = {
    ru: {
        nav_dashboard: 'Мой Дашборд',
        nav_home: 'На главную',
        nav_settings: 'Настройки страницы',
        logout: 'Выйти из аккаунта',
        welcome_greeting: 'Добро пожаловать,',
        active_tasks_title: 'Ваши активные задачи:',
        no_active_tasks: 'Нет активных задач на сегодня.',
        enter_activity_hub: 'Войти в Activity Hub',
        task_description: 'Запланированная сессия. Подготовьтесь к встрече.',
        chat_back_to_tasks: 'Назад к задачам',
        chat_title: 'Activity Hub: Чат со специалистом',
        chat_placeholder: 'Напишите сообщение...',
        settings_title: 'Настройки страницы',
        settings_appearance: 'Внешний вид',
        settings_theme_light: 'Светлая',
        settings_theme_dark: 'Темная',
        settings_language: 'Язык интерфейса',
        lang_ru: 'Русский',
        lang_ua: 'Українська',
        lang_en: 'English',
        hub_chat: 'Чат',
        hub_current_session: 'Текущая сессия',
        hub_tasks: 'Задания',
        marketplace_workshops: 'Найти воркшоп',
        marketplace_materials: 'Материалы',
        marketplace_specialists: 'Специалисты',
        specialists_title: 'Наши специалисты',
        no_specialists_found: 'Специалисты не найдены.',
        contact_specialist: 'Связаться',
        settings_delete_account_title: 'Удаление аккаунта',
        settings_delete_account_desc: 'Это действие необратимо. Все ваши данные будут удалены.',
        settings_delete_account_btn: 'Удалить аккаунт',
        settings_delete_account_confirm: 'Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо.',
        hero_path_title: 'Путь героя',
        hero_step_title_1: 'Начало пути',
        hero_step_desc_1: 'Вы сделали первый шаг, записавшись на программу. Это начало больших перемен.',
        hero_step_title_2: 'Работа с личными границами',
        hero_step_desc_2: 'Активный этап, на котором мы исследуем и выстраиваем ваши личные границы в отношениях и работе.',
        hero_step_title_3: 'Интеграция навыков',
        hero_step_desc_3: 'Будущий этап, на котором вы будете учиться применять новые навыки в повседневной жизни.',
    },
    ua: {
        nav_dashboard: 'Моя Панель',
        nav_home: 'На головну',
        nav_settings: 'Налаштування сторінки',
        logout: 'Вийти з акаунту',
        welcome_greeting: 'Ласкаво просимо,',
        active_tasks_title: 'Ваші активні задачі:',
        no_active_tasks: 'Немає активних задач на сьогодні.',
        enter_activity_hub: 'Увійти в Activity Hub',
        task_description: 'Запланована сесія. Підготуйтеся до зустрічі.',
        chat_back_to_tasks: 'Назад до задач',
        chat_title: 'Activity Hub: Чат з фахівцем',
        chat_placeholder: 'Напишіть повідомлення...',
        settings_title: 'Налаштування сторінки',
        settings_appearance: 'Зовнішній вигляд',
        settings_theme_light: 'Світла',
        settings_theme_dark: 'Темна',
        settings_language: 'Мова інтерфейсу',
        lang_ru: 'Русский',
        lang_ua: 'Українська',
        lang_en: 'English',
        hub_chat: 'Чат',
        hub_current_session: 'Поточна сесія',
        hub_tasks: 'Завдання',
        marketplace_workshops: 'Знайти воркшоп',
        marketplace_materials: 'Матеріали',
        marketplace_specialists: 'Фахівці',
        specialists_title: 'Наші фахівці',
        no_specialists_found: 'Фахівців не знайдено.',
        contact_specialist: 'Зв\'язатися',
        settings_delete_account_title: 'Видалення акаунту',
        settings_delete_account_desc: 'Ця дія є незворотною. Всі ваші дані буде видалено.',
        settings_delete_account_btn: 'Видалити акаунт',
        settings_delete_account_confirm: 'Ви впевнені, що хочете видалити свій акаунт? Ця дія є незворотною.',
        hero_path_title: 'Шлях героя',
        hero_step_title_1: 'Початок шляху',
        hero_step_desc_1: 'Ви зробили перший крок, записавшись на програму. Це початок великих змін.',
        hero_step_title_2: 'Робота з особистими кордонами',
        hero_step_desc_2: 'Активний етап, на якому ми досліджуємо та вибудовуємо ваші особисті кордони у стосунках та роботі.',
        hero_step_title_3: 'Інтеграція навичок',
        hero_step_desc_3: 'Майбутній етап, на якому ви будете вчитися застосовувати нові навички в повсякденному житті.',
    },
    en: {
        nav_dashboard: 'My Dashboard',
        nav_home: 'To Main Page',
        nav_settings: 'Page Settings',
        logout: 'Log out',
        welcome_greeting: 'Welcome,',
        active_tasks_title: 'Your active tasks:',
        no_active_tasks: 'No active tasks for today.',
        enter_activity_hub: 'Enter Activity Hub',
        task_description: 'Scheduled session. Prepare for the meeting.',
        chat_back_to_tasks: 'Back to tasks',
        chat_title: 'Activity Hub: Chat with specialist',
        chat_placeholder: 'Write a message...',
        settings_title: 'Page Settings',
        settings_appearance: 'Appearance',
        settings_theme_light: 'Light',
        settings_theme_dark: 'Dark',
        settings_language: 'Interface Language',
        lang_ru: 'Русский',
        lang_ua: 'Українська',
        lang_en: 'English',
        hub_chat: 'Chat',
        hub_current_session: 'Current session',
        hub_tasks: 'Tasks',
        marketplace_workshops: 'Find Workshop',
        marketplace_materials: 'Materials',
        marketplace_specialists: 'Specialists',
        specialists_title: 'Our Specialists',
        no_specialists_found: 'No specialists found.',
        contact_specialist: 'Contact',
        settings_delete_account_title: 'Delete Account',
        settings_delete_account_desc: 'This action is irreversible. All your data will be deleted.',
        settings_delete_account_btn: 'Delete Account',
        settings_delete_account_confirm: 'Are you sure you want to delete your account? This action is irreversible.',
        hero_path_title: 'Hero\'s Journey',
        hero_step_title_1: 'The First Step',
        hero_step_desc_1: 'You have taken the first step by enrolling in the program. This is the beginning of great changes.',
        hero_step_title_2: 'Working with Personal Boundaries',
        hero_step_desc_2: 'An active stage where we explore and build your personal boundaries in relationships and work.',
        hero_step_title_3: 'Skills Integration',
        hero_step_desc_3: 'A future stage where you will learn to apply new skills in everyday life.',
    }
};

const heroPathData = [
    {
        id: 'step1',
        titleKey: 'hero_step_title_1',
        descKey: 'hero_step_desc_1',
        status: 'completed',
        date: '15 января 2026'
    },
    {
        id: 'step2',
        titleKey: 'hero_step_title_2',
        descKey: 'hero_step_desc_2',
        status: 'active',
        date: '5 февраля 2026'
    },
    {
        id: 'step3',
        titleKey: 'hero_step_title_3',
        descKey: 'hero_step_desc_3',
        status: 'locked',
        date: 'Март 2026'
    }
];

const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', () => {
    // 1. Инициализируем API и проверяем авторизацию
    MockAPI.init();
    const user = MockAPI.getLoggedInUser();
    if (!user) {
        window.location.href = 'index.html';
        return; // Прерываем выполнение, если пользователь не авторизован
    }

    // 2. Заполняем данные пользователя
    const span = document.getElementById('user-name-display');
    if (span) span.innerText = user.name || 'Клиент';
    const avatar = document.querySelector('.avatar');
    if (avatar) avatar.innerText = user.name ? user.name.charAt(0).toUpperCase() : 'К';

    // 3. Инициализируем контент страницы
    initDashboard();
    updateNavIndicators();

    // 4. Применяем сохраненные настройки
    const savedTheme = localStorage.getItem('appTheme');
    if (savedTheme) setTheme(savedTheme);
    
    const savedLang = localStorage.getItem('appLang');
    if (savedLang) setLanguageUI(savedLang);
    applyTranslations();

    // Observe static elements that are already in the DOM
    document.querySelectorAll('.scroll-animate').forEach(el => scrollObserver.observe(el));
});

function initDashboard() {
    // Отрисовка активных задач (встреч) из MockAPI
    const container = document.getElementById('dashboard-tasks');
    if (!container) return;

    const schedule = MockAPI.getSchedule();
    // Сортируем: сначала ближайшие
    schedule.sort((a, b) => a.time - b.time);

    const messages = MockAPI.getChat();
    const lastMsg = messages.length > 0 ? messages[messages.length - 1] : null;
    const hasUnread = lastMsg && (lastMsg.from === 'admin' || lastMsg.from === 'system') && lastMsg.time > clientLastReadTime;

    const lang = localStorage.getItem('appLang') || 'ru';
    const dict = translations[lang];

    if (schedule.length === 0) {
        container.innerHTML = `<p class="text-slate-400">${dict.no_active_tasks}</p>`;
        return;
    }

    container.innerHTML = schedule.map(item => {
        const dateObj = new Date(item.time);
        const dateStr = dateObj.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
        const timeStr = dateObj.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        
        return `
        <div class="activity-card scroll-animate">
            <div class="card-col meta">
                <div class="badge badge-blue">SESSION</div>
                <div class="date mt-2">${dateStr}, ${timeStr}</div>
            </div>
            <div class="card-col title">
                <h3 class="mb-0">${item.title}</h3>
            </div>
            <div class="card-col desc">
                <p class="mb-0 text-slate-500">${dict.task_description}</p>
            </div>
            <div class="card-col actions">
                <div onclick="openActivityHub()" class="card-link cursor-pointer hover:text-blue-700 flex items-center gap-2 justify-end">
                    ${dict.enter_activity_hub} 
                    ${hasUnread ? '<span class="w-2 h-2 bg-red-500 rounded-full"></span>' : ''}
                    <span>→</span>
                </div>
            </div>
        </div>`;
    }).join('');

    // Observe newly created dynamic elements
    container.querySelectorAll('.scroll-animate').forEach(el => scrollObserver.observe(el));
}

// --- Логика Чата (Activity Hub) ---

function showView(viewId) {
    document.querySelectorAll('.content-area > section').forEach(section => {
        section.classList.add('hidden');
    });

    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.remove('hidden');
    }

    // Handle sidebar active state
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    const dashboardLink = document.getElementById('nav-dashboard');
    const settingsLink = document.getElementById('nav-settings');

    if (viewId === 'settings-view') {
        if(settingsLink) settingsLink.classList.add('active');
    } else { // Default to dashboard
        if(dashboardLink) dashboardLink.classList.add('active');
    }
}

function openActivityHub() {
    showView('activity-hub-view');
        // Mark as read
        clientLastReadTime = Date.now();
        localStorage.setItem('clientLastReadTime', clientLastReadTime);
        updateNavIndicators();
        renderChat();
}

function closeActivityHub() {
    showView('task-section');
}

function openHeroPath() {
    showView('hero-path-view');
    renderHeroPath();
}

function openSpecialists() {
    showView('specialists-view');
    renderSpecialists();
}

function renderSpecialists() {
    const container = document.getElementById('specialists-list');
    if (!container) return;

    const specialists = MockAPI.getSpecialists();
    const lang = localStorage.getItem('appLang') || 'ru';
    const dict = translations[lang];
    
    if (!specialists.length) {
        container.innerHTML = `<p class="text-slate-400 col-span-full">${dict.no_specialists_found}</p>`;
        return;
    }

    container.innerHTML = specialists.map(spec => `
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center scroll-animate">
            <div class="w-20 h-20 bg-slate-800 dark:bg-slate-700 text-white rounded-full flex items-center justify-center text-3xl font-bold mb-4">
                ${spec.name.charAt(0).toUpperCase()}
            </div>
            <h3 class="text-xl font-bold">${spec.name}</h3>
            <p class="text-slate-500 text-sm mb-4">${spec.id}</p>
            <button class="mt-auto bg-blue-100 text-blue-700 font-bold px-6 py-2 rounded-full text-sm hover:bg-blue-200 transition">
                ${dict.contact_specialist}
            </button>
        </div>
    `).join('');

    container.querySelectorAll('.scroll-animate').forEach(el => scrollObserver.observe(el));
}

function renderHeroPath() {
    const container = document.getElementById('hero-steps-container');
    if (!container) return;

    container.innerHTML = heroPathData.map(step => `
        <div class="hero-step-card ${step.status} scroll-animate" id="${step.id}">
            <div class="step-marker"></div>
            <div class="card-inner">
                <p class="text-sm font-bold text-blue-500 mb-1">${step.date}</p>
                <h3 class="text-2xl font-bold mb-2" data-translate-key="${step.titleKey}"></h3>
                <p class="text-slate-500" data-translate-key="${step.descKey}"></p>
            </div>
        </div>
    `).join('');

    applyTranslations();

    container.querySelectorAll('.scroll-animate').forEach(el => scrollObserver.observe(el));

    // Calculate and animate progress line
    const progressLine = document.getElementById('hero-progress-line');
    const activeStepIndex = heroPathData.findIndex(step => step.status === 'active');
    
    let targetStepIndex = -1;
    if (activeStepIndex !== -1) {
        targetStepIndex = activeStepIndex;
    } else {
        // If no active, find last completed
        targetStepIndex = findLastIndex(heroPathData, step => step.status === 'completed');
    }

    if (targetStepIndex !== -1 && progressLine) {
        setTimeout(() => {
            const targetStepElement = document.getElementById(heroPathData[targetStepIndex].id);
            if (targetStepElement) {
                const markerHeight = 24; // as per CSS
                const height = targetStepElement.offsetTop + (markerHeight / 2);
                progressLine.style.height = `${height}px`;
            }
        }, 100); // Small delay for rendering
    } else {
        if (progressLine) progressLine.style.height = '0px';
    }
}

function findLastIndex(array, predicate) {
    for (let i = array.length - 1; i >= 0; i--) {
        if (predicate(array[i])) return i;
    }
    return -1;
}

function requestAccountDeletion() {
    const lang = localStorage.getItem('appLang') || 'ru';
    const dict = translations[lang];
    const confirmationMessage = dict.settings_delete_account_confirm || 'Are you sure you want to delete your account? This action is irreversible.';

    if (confirm(confirmationMessage)) {
        const user = MockAPI.getLoggedInUser();
        if (user) {
            MockAPI.deleteUser(user.id);
            // Redirect to home page after deletion
            window.location.href = 'index.html';
        }
    }
}

function setTheme(theme) {
    if (theme === 'dark') document.body.classList.add('dark-theme');
    else document.body.classList.remove('dark-theme');
    localStorage.setItem('appTheme', theme);

    // Update button styles to show selection
    const lightBtn = document.getElementById('theme-btn-light');
    const darkBtn = document.getElementById('theme-btn-dark');

    if (lightBtn && darkBtn) {
        if (theme === 'dark') {
            darkBtn.classList.add('border-blue-500');
            lightBtn.classList.remove('border-blue-500');
        } else {
            lightBtn.classList.add('border-blue-500');
            darkBtn.classList.remove('border-blue-500');
        }
    }
}

function setLanguage(lang) {
    localStorage.setItem('appLang', lang);
    applyTranslations();
    // Перерисовываем динамические части, чтобы применить перевод
    initDashboard();
    if (!document.getElementById('activity-hub-view').classList.contains('hidden')) {
        renderChat();
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
                el.innerText = translation;
            }
        }
    });
}

function setLanguageUI(lang) {
    const radio = document.querySelector(`input[name="lang"][value="${lang}"]`);
    if (radio) radio.checked = true;
}

function updateNavIndicators() {
    const messages = MockAPI.getChat();
    const lastMsg = messages.length > 0 ? messages[messages.length - 1] : null;
    const hasUnread = lastMsg && (lastMsg.from === 'admin' || lastMsg.from === 'system') && lastMsg.time > clientLastReadTime;

    // Activity Hub tab is the 2nd one (index 1)
    const tabs = document.querySelectorAll('.nav-tab');
    if (tabs.length > 1) {
        const hubTab = tabs[1];
        // Ищем точку именно на вкладке (исключая выпадающее меню)
        let tabDot = hubTab.querySelector('.tab-dot');
        
        if (hasUnread) {
            if (!tabDot) {
                const dot = document.createElement('span');
                dot.className = 'dot-indicator tab-dot inline-block w-2 h-2 bg-red-500 rounded-full mb-0.5 ml-1';
                // Вставляем перед dropdown, чтобы не ломать структуру
                const dropdown = hubTab.querySelector('.dropdown');
                if (dropdown) hubTab.insertBefore(dot, dropdown);
                else hubTab.appendChild(dot);
            }
        } else {
            if (tabDot) tabDot.remove();
        }

        const chatLink = document.getElementById('nav-chat-link');
        if (chatLink) {
            let linkDot = chatLink.querySelector('.dot-indicator');
            if (hasUnread) {
                if (!linkDot) {
                    const dot = document.createElement('span');
                    dot.className = 'dot-indicator inline-block w-2 h-2 bg-red-500 rounded-full';
                    chatLink.appendChild(dot);
                }
            } else {
                if (linkDot) linkDot.remove();
            }
        }
    }
}

function playNotification() {
    const audio = document.getElementById('notification-sound');
    if (audio) {
        audio.muted = false; // На всякий случай убираем mute
        audio.currentTime = 0;
        const p = audio.play();
        if (p !== undefined) {
            p.catch(e => console.error('Audio play failed (check autoplay):', e));
        }
    }
}

// Разблокировка аудио при первом взаимодействии (Autoplay Policy fix)
function unlockAudio() {
    const audio = document.getElementById('notification-sound');
    if (audio) {
        // Запускаем и сразу ставим на паузу, чтобы браузер разрешил дальнейшее воспроизведение
        audio.play().then(() => { audio.pause(); audio.currentTime = 0; }).catch(() => {});
    }
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('keydown', unlockAudio);
}
document.addEventListener('click', unlockAudio);
document.addEventListener('keydown', unlockAudio);

window.addEventListener('storage', (e) => {
    if (e.key === 'nlv_mock_v1') {
        // If chat is open, update read time immediately
        if (!document.getElementById('activity-hub-view').classList.contains('hidden')) {
            clientLastReadTime = Date.now();
            localStorage.setItem('clientLastReadTime', clientLastReadTime);
        }

        initDashboard();
        updateNavIndicators();
        if (!document.getElementById('activity-hub-view').classList.contains('hidden')) {
            // Re-render the currently active hub tab
            const activeBtn = document.querySelector('.hub-tab-btn.active');
            if (activeBtn) {
                const tabName = activeBtn.id.replace('tab-btn-', '');
                switchHubTab(tabName);
            }
        }
        
        const oldVal = e.oldValue ? JSON.parse(e.oldValue) : null;
        const newVal = e.newValue ? JSON.parse(e.newValue) : null;
        if (oldVal && newVal && newVal.chat.length > oldVal.chat.length) {
            const last = newVal.chat[newVal.chat.length - 1];
            if (last.from === 'admin' || last.from === 'system') playNotification();
        }
    }
});

function logout() {
    MockAPI.logoutUser();
    window.location.href = 'index.html'; // Выкидываем на главную
}