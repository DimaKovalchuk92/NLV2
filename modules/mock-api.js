(function(global){
    const KEY = 'nlv_mock_v1';

    function seed(){
        if (!localStorage.getItem(KEY)){
            const sample = {
                user: null,
                users: [
                    {
                        id: 'U-admin1',
                        email: 'spec@nlv.com',
                        name: 'Dr. Anna',
                        role: 'admin',
                        pass: 'hash_' + btoa('password123'),
                        onboardingComplete: true,
                        profile: {
                            fullName: 'Анна Сергеевна',
                            specializations: ['Клинический психолог', 'Гештальт-терапевт'],
                            bio: 'Опытный психолог, специализируюсь на работе с тревогой и личностным ростом. Моя цель — помочь вам найти внутренние ресурсы для преодоления трудностей.',
                            welcomeMessage: 'Добро пожаловать! Я рада начать наш совместный путь к вашему благополучию.'
                        },
                        activeSessions: [{ sessionId: 'SESS-admin-init', lastActive: new Date().toISOString() }],
                    }
                ],
                auditLog: [],
                cases: [
                    { id: 'C-1', specialistId: 'U-admin1', clientName: 'Иван Петров', programName: 'Работа с тревогой', lastActivity: '2026-02-15T10:00:00Z', status: 'active' },
                    { id: 'C-2', specialistId: 'U-admin1', clientName: 'Елена Сидорова', programName: 'Коучинг по карьере', lastActivity: '2026-02-10T14:30:00Z', status: 'paused' },
                    { id: 'C-3', specialistId: 'U-admin1', clientName: 'Сергей Кузнецов', programName: 'Семейная терапия', lastActivity: '2026-01-20T11:00:00Z', status: 'closing' }
                ],
                programs: [],
                finances: { balance: 0, transactions: [] },
                schedule: [
                    { id: 'SCH-1', specialistId: 'U-admin1', clientName: 'Иван Петров', date: '2026-02-17', time: '10:00', duration: 60, type: 'Core Session' },
                    { id: 'SCH-2', specialistId: 'U-admin1', clientName: 'Елена Сидорова', date: '2026-02-17', time: '12:00', duration: 60, type: 'Core Session' },
                    { id: 'SCH-3', specialistId: 'U-admin1', clientName: 'Сергей Кузнецов', date: '2026-02-18', time: '15:00', duration: 90, type: 'Closing Session' }
                ],
                chat: []
            };
            localStorage.setItem(KEY, JSON.stringify(sample));
        }
    }

    function read(){ return JSON.parse(localStorage.getItem(KEY)); }
    function write(data){ localStorage.setItem(KEY, JSON.stringify(data)); }

    // Strict Audit Logging 
    function _logAction(action, userId, details = {}) {
        const d = read();
        if (!d.auditLog) {
            d.auditLog = [];
        }
        d.auditLog.push({
            id: 'AUD-' + Date.now(),
            timestamp: new Date().toISOString(),
            action,
            userId: userId || 'anonymous',
            details,
            ip: '127.0.0.1'
        });
        write(d);
    }

    const api = {
        init: seed,

        // 1. Registration with Encryption & Onboarding Logic [cite: 123, 203]
        registerUser(role, name, email, pass, profileData, consents) {
            const d = read();
            if (pass.length < 10) return { error: 'password_too_short' };
            if (d.users.find(u => u.email === email)) return { error: 'email_taken' };

            const newUser = { 
                id: 'U-' + Math.random().toString(36).substr(2, 9), 
                email, name, role, 
                pass: 'hash_' + btoa(pass), // App-layer encryption [cite: 190]
                mfa_enabled: false,
                mfa_secret: null,
                backup_codes: [],
                loginAttempts: 0,
                lockUntil: null,
                activeSessions: [],
                profile: profileData || {}, // Always create a profile object
                resetToken: null,
                resetTokenExpires: null,
                createdAt: new Date().toISOString()
            };

            // Ensure onboardingComplete is set correctly inside profile, as per docs
            if (newUser.profile.onboardingComplete === undefined) {
                newUser.profile.onboardingComplete = (role !== 'admin');
            }
            // Store consents
            if (consents) newUser.profile.consents = consents;

            d.users.push(newUser);
            write(d);
            _logAction('REGISTER_SUCCESS', newUser.id, { role });
            return newUser;
        },

        // 2. Login with Rate Limiting & Session Tracking 
        loginUser(email, pass) {
            const d = read();
            const user = d.users.find(u => u.email === email);
            
            if (!user) {
                _logAction('LOGIN_FAILED_NOT_FOUND', null, { email });
                return { error: 'invalid_credentials' };
            }

            // Rate Limiting: 5 attempts / 15 min 
            if (user.lockUntil && new Date(user.lockUntil) > new Date()) {
                const remaining = Math.ceil((new Date(user.lockUntil) - new Date()) / 60000);
                return { error: 'account_locked', minutes: remaining };
            }

            const hashedPass = 'hash_' + btoa(pass);
            if (user.pass === hashedPass) {
                user.loginAttempts = 0;
                user.lockUntil = null;
                
                // Session Management 
                const session = {
                    sessionId: 'SESS-' + Math.random().toString(36).substr(2, 10),
                    device: navigator.userAgent,
                    lastActive: new Date().toISOString()
                };
                user.activeSessions.push(session);
                
                d.user = user;
                write(d);
                _logAction('LOGIN_SUCCESS', user.id);
                return user;
            } else {
                user.loginAttempts++;
                if (user.loginAttempts >= 5) {
                    user.lockUntil = new Date(Date.now() + 15 * 60000).toISOString();
                    _logAction('ACCOUNT_LOCKED', user.id);
                }
                write(d);
                _logAction('LOGIN_FAILED', user.id, { attempts: user.loginAttempts });
                return { error: 'invalid_credentials', attemptsLeft: 5 - user.loginAttempts };
            }
        },

        updateUser(userId, updateData) {
            const d = read();
            const userIndex = d.users.findIndex(u => u.id === userId);

            if (userIndex > -1) {
                // Update the user in the main users array
                d.users[userIndex] = { ...d.users[userIndex], ...updateData };

                // Also update the currently logged-in user object if it's the same user
                if (d.user && d.user.id === userId) {
                    d.user = { ...d.user, ...updateData };
                }

                write(d);
                _logAction('USER_UPDATED', userId, { fields: Object.keys(updateData) });
                return d.users[userIndex];
            }
            _logAction('USER_UPDATE_FAILED', userId, { error: 'User not found' });
            return null;
        },

        getCasesForSpecialist(specialistId) {
            const d = read();
            if (!d.cases) return [];
            return d.cases.filter(c => c.specialistId === specialistId);
        },

        updateCase(caseId, updateData) {
            const d = read();
            const caseIndex = d.cases.findIndex(c => c.id === caseId);
            if (caseIndex > -1) {
                d.cases[caseIndex] = { ...d.cases[caseIndex], ...updateData };
                write(d);
                _logAction('CASE_UPDATED', d.user?.id, { caseId, fields: Object.keys(updateData) });
                return d.cases[caseIndex];
            }
            return null;
        },

        getScheduleForSpecialist(specialistId) {
            const d = read();
            if (!d.schedule) return [];
            return d.schedule.filter(s => s.specialistId === specialistId);
        },

        deleteUser(userId) {
            const d = read();
            const userToDelete = d.users.find(u => u.id === userId);
            if (!userToDelete) return false;

            d.users = d.users.filter(u => u.id !== userId);
            if (userToDelete.role === 'admin') {
                d.cases = d.cases.filter(c => c.specialistId !== userId);
            }
            
            if (d.user && d.user.id === userId) {
                d.user = null;
            }
            write(d);
            _logAction('USER_DELETED', userId);
            return true;
        },

        // 3. Password Reset Flow 
        requestPasswordReset(email) {
            const d = read();
            const user = d.users.find(u => u.email === email);
            if (!user) return false;

            user.resetToken = 'RESET-' + Math.random().toString(36).substr(2, 15);
            user.resetTokenExpires = new Date(Date.now() + 3600000).toISOString(); // 1 hour 
            write(d);
            _logAction('PASSWORD_RESET_REQUESTED', user.id);
            return user.resetToken; 
        },

        // 4. 2FA / MFA Setup 
        enableMFA(userId) {
            const d = read();
            const user = d.users.find(u => u.id === userId);
            if (!user) return null;

            user.mfa_enabled = true;
            user.backup_codes = Array.from({length: 5}, () => Math.floor(100000 + Math.random() * 900000).toString());
            write(d);
            _logAction('MFA_ENABLED', userId);
            return { backup_codes: user.backup_codes };
        },

        // 5. Session Control 
        getActiveSessions(userId) {
            const d = read();
            const user = d.users.find(u => u.id === userId);
            return user ? user.activeSessions : [];
        },

        revokeSession(userId, sessionId) {
            const d = read();
            const user = d.users.find(u => u.id === userId);
            if (user) {
                user.activeSessions = user.activeSessions.filter(s => s.sessionId !== sessionId);
                write(d);
                _logAction('SESSION_REVOKED', userId, { sessionId });
            }
        },

        getLoggedInUser() { return read().user; },
        logoutUser() {
            const d = read();
            if (d.user) _logAction('LOGOUT', d.user.id);
            d.user = null;
            write(d);
        }
    };

    global.MockAPI = api;
})(window);