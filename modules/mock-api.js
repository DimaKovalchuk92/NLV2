/*
  MockAPI - lightweight localStorage-backed mock used for development.
  - KEY: localStorage key where the dataset is kept
  - seed(): populates initial sample data (only when empty)
  - read/write: helpers to read/write the full dataset
  - Methods mirror simple CRUD operations used by admin/cabinet pages

  NOTES for customization:
  - Change `KEY` to avoid collisions with other projects
  - Modify `seed()` to add realistic sample items (cases, schedule, users)
  - Replace with real fetch/XHR when backend is available.
*/
(function(global){
    const KEY = 'nlv_mock_v1'; // change if you want a separate dev dataset

    // Seed sample data on first run. Edit contents to suit your testing needs.
    function seed(){
        if (!localStorage.getItem(KEY)){
            const sample = {
                user: null, // currently logged-in user
                // Load default users from config if available, otherwise use an empty array.
                // The config.js file should be in .gitignore
                users: (window.APP_CONFIG && window.APP_CONFIG.defaultUsers) ? window.APP_CONFIG.defaultUsers : [],
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
                // schedule entries use numeric ms timestamps in `time`
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

    // low-level helpers
    function read(){
        return JSON.parse(localStorage.getItem(KEY));
    }
    function write(data){
        localStorage.setItem(KEY, JSON.stringify(data));
    }

    const api = {
        // public API
        init: seed, // call once on app start
        getLoggedInUser(){ return read().user; },
        getCases(){ return read().cases.slice(); },
        getPrograms(){ return read().programs.slice(); },
        getFinance(){ return read().finances; },
        getSchedule(){ return read().schedule.slice(); }, // returns array of schedule items
        getChat(){ return read().chat.slice(); },
        getHeroPath(){ return read().heroPath ? read().heroPath.slice() : []; },
        getAchievements() { return read().achievements ? read().achievements.slice() : []; },
        getSpecialists() { return read().users.filter(u => u.role === 'admin'); },

        registerUser(role, name, username, pass, profileData) {
            const d = read();

            // Проверяем, занят ли логин
            const existingUser = d.users.find(u => u.id === username);
            if (existingUser) {
                return null; // Возвращаем null, если логин уже существует
            }

            const newUser = { id: username, name: name, role: role, pass: pass };

            // For specialists ('admin'), attach the profile object passed from the form.
            if (role === 'admin' && profileData) {
                newUser.profile = profileData;
            }

            d.users.push(newUser);
            write(d);
            return newUser;
        },

        loginUser(username, pass) {
            const d = read();
            const user = d.users.find(u => u.id === username && u.pass === pass);
            if (user) {
                d.user = user;
                write(d);
                return user;
            }
            return null;
        },

        logoutUser() {
            const d = read();
            d.user = null;
            write(d);
        },

        deleteUser(userId) {
            if (!userId) return;
            const d = read();
            d.users = d.users.filter(u => u.id !== userId);
            // Also log out if the deleted user is the current user
            if (d.user && d.user.id === userId) {
                d.user = null;
            }
            write(d);
        },

        // addMessage: append a message to chat
        addMessage(msg){ const d = read(); 
            d.chat.push(Object.assign({ id: 'M-'+Date.now(), time: Date.now(), from: 'system' }, msg)); 
            write(d); 
        },

        // add a case to the beginning of the list
        addCase(c){ const d = read(); d.cases.unshift(c); write(d); },

        // addSchedule expects { title, time, caseId? }
        // returns the created schedule object (includes generated id)
        addSchedule(item){ const d = read();
            const sched = Object.assign({ id: 'S-'+(Date.now()), title: item.title || 'Встреча', time: item.time || Date.now() }, item);
            d.schedule.unshift(sched); write(d); return sched;
        },

        // deletes a schedule entry by id
        deleteSchedule(id){ const d = read(); d.schedule = d.schedule.filter(s=> s.id !== id); write(d); },

        // updateCase: simple patch merge by id
        updateCase(id, patch){ const d = read(); d.cases = d.cases.map(cs=> cs.id===id ? Object.assign({}, cs, patch) : cs); write(d); }
    };

    // expose global mock API for pages to use
    global.MockAPI = api;
})(window);
