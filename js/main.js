const APP_CONFIG = {
    name: 'PMERIT - Gabriel AI',
    version: '1.0.0',
    mission: 'Empowering learning through accessible, high-quality education',
    apiEndpoints: {
        production: 'https://gabriel-ai-backend.peoplemerit.workers.dev',
        development: 'http://localhost:8000'
    }
};

let appState = {
    isAuthenticated: false,
    currentUser: null,
    darkMode: false,
    language: 'en',
    connectionStatus: 'connecting',
    virtualHumanMode: false,
    activePanel: null,
    textToSpeech: false
};

document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    
    const loginBtns = document.querySelectorAll('.btn-login');
    const registerBtns = document.querySelectorAll('.btn-register');
    
    loginBtns.forEach(btn => {
        btn.addEventListener('click', showLogin);
    });
    
    registerBtns.forEach(btn => {
        btn.addEventListener('click', showRegister);
    });
});

window.showLogin = showLogin;
window.showRegister = showRegister;
window.authState = authState;

console.log('✅ Authentication module loaded');
