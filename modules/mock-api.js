(function(global){
    const KEY = 'nlv_mock_v1';

    function seed(){
        if (!localStorage.getItem(KEY)){
            const sample = {
                user: null, 
                users: (window.APP_CONFIG && window.APP_CONFIG.defaultUsers) ? window.APP_CONFIG.defaultUsers : [],
                auditLog: [], // Нове поле для HIPAA аудиту
                cases: [
                    { id: 'C-4412-1', title: 'Александр — Личные границы', status: 'analysis', updated: Date.now() - 1000*60*60 },
                    { id: 'C-4412-2', title: 'Мария — Работа с тревогой', status: 'active', updated: Date.now() - 1000*60*30 },
                    { id: 'C-4412-3', title: 'Иван — Саморегуляция', status: 'closing', updated: Date.now() - 1000*60*60*24 }
                ],
                programs: [
                    { id: 'P-101', title: 'Марафон: Путь героя', price: 199, seats: 120 },
                    { id: 'P-102', title: 'Тематический цикл: Границы', price: 99, seats: 40 }
                ],
                finances: { balance: 1240.50, transactions: [ {id:'T1', amount: -49.99, desc:'Оплата: Марафон', date: Date.now()-86400000 } ] },
                schedule: [ { id:'S1', title:'Core Session', time: Date.now() + 3600000 } ],
                chat: [ { id:'M1', from:'client', text:'Здравствуйте', time: Date.now()-60000 } ],
                heroPath: [
                    { id: 'step1', labelKey: 'hero_step_start', descriptionKey: 'hero_step_start_desc', icon: '✅', status: 'completed' },
                    { id: 'step2', labelKey: 'hero_step_boundaries', descriptionKey: 'hero_step_boundaries_desc', icon: '🎯', status: 'active' },
                    { id: 'step3', labelKey: 'hero_step_integration', descriptionKey: 'hero_step_integration_desc', icon: '⏳', status: 'pending' }
                ],
                achievements: [
                    { id: 'ach1', icon: '🏆', titleKey: 'ach_first_step_title', descKey: 'ach_first_step_desc', unlocked: true },
                    { id: 'ach2', icon: '🤝', titleKey: 'ach_first_session_title', descKey: 'ach_first_session_desc', unlocked: true },
                    { id: 'ach3', icon: '✍️', titleKey: 'ach_first_note_title', descKey: 'ach_first_note_desc', unlocked: false }
                ]
            };
            localStorage.setItem(KEY, JSON.stringify(sample));
        }
    }

    function read(){ return JSON.parse(localStorage.getItem(KEY)); }
    function write(data){ localStorage.setItem(KEY, JSON.stringify(data)); }

    // Приватна функція для запису аудиту (HIPAA requirements)
    function _logAction(action, userId, details = {}) {
        const d = read();
        if (!d.auditLog) d.auditLog = [];
        d.auditLog.push({
            id: 'AUD-' + Date.now(),
            timestamp: new Date().toISOString(),
            action,
            userId: userId || 'anonymous',
            details
        });
        write(d);
    }

    const api = {
        init: seed,
        getLoggedInUser(){ return read().user; },
        getCases(){ return read().cases.slice(); },
        getPrograms(){ return read().programs.slice(); },
        getFinance(){ return read().finances; },
        getSchedule(){ return read().schedule.slice(); },
        getChat(){ return read().chat.slice(); },
        getHeroPath(){ return read().heroPath ? read().heroPath.slice() : []; },
        getAchievements() { return read().achievements ? read().achievements.slice() : []; },
        getSpecialists() { return read().users.filter(u => u.role === 'admin'); },

        registerUser(role, name, email, pass, profileData) {
            const d = read();
            
            // 1. Валідація Email та Пароля (10+ символів)
            if (pass.length < 10) {
                _logAction('REGISTER_FAILED_SHORT_PASS', null, { email });
                return { error: 'password_too_short' };
            }

            // 2. Перевірка чи зайнятий Email
            if (d.users.find(u => u.email === email)) {
                _logAction('REGISTER_FAILED_DUPLICATE', null, { email });
                return null; 
            }

            // 3. Створення користувача з хешованим паролем та прапором онбордингу
            const newUser = { 
                id: 'U-' + Math.random().toString(36).substr(2, 9), 
                email: email,
                name: name, 
                role: role, 
                pass: 'hash_' + btoa(pass), // Симуляція хешування
                onboardingComplete: role !== 'admin' // Спеціаліст має пройти wizard
            };

            if (role === 'admin' && profileData) {
                newUser.profile = profileData;
            }

            d.users.push(newUser);
            write(d);
            _logAction('REGISTER_SUCCESS', newUser.id, { role });
            return newUser;
        },

        loginUser(email, pass) {
            const d = read();
            const hashedPass = 'hash_' + btoa(pass);
            const user = d.users.find(u => u.email === email && u.pass === hashedPass);
            
            if (user) {
                d.user = user;
                write(d);
                _logAction('LOGIN_SUCCESS', user.id);
                return user;
            }
            _logAction('LOGIN_FAILED', null, { attempted_email: email });
            return null;
        },

        logoutUser() {
            const d = read();
            if (d.user) _logAction('LOGOUT', d.user.id);
            d.user = null;
            write(d);
        },

        // Решта твоїх методів залишаються без змін для сумісності
        deleteUser(userId) {
            if (!userId) return;
            const d = read();
            d.users = d.users.filter(u => u.id !== userId);
            if (d.user && d.user.id === userId) d.user = null;
            write(d);
            _logAction('USER_DELETED', userId);
        },

        addMessage(msg){ 
            const d = read(); 
            d.chat.push(Object.assign({ id: 'M-'+Date.now(), time: Date.now(), from: 'system' }, msg)); 
            write(d); 
        },

        addCase(c){ const d = read(); d.cases.unshift(c); write(d); },
        addSchedule(item){ 
            const d = read();
            const sched = Object.assign({ id: 'S-'+(Date.now()), title: item.title || 'Встреча', time: item.time || Date.now() }, item);
            d.schedule.unshift(sched); write(d); return sched;
        },
        deleteSchedule(id){ const d = read(); d.schedule = d.schedule.filter(s=> s.id !== id); write(d); },
        updateCase(id, patch){ const d = read(); d.cases = d.cases.map(cs=> cs.id===id ? Object.assign({}, cs, patch) : cs); write(d); }
    };

    global.MockAPI = api;
})(window);