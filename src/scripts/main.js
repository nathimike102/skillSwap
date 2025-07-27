function startLoading() {
    const loadingScreen = document.getElementById('loadingScreen');
    const progressBar = document.getElementById('loadingProgress');
    const progressText = document.getElementById('progressText');
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 4 + 2;
        progress = Math.min(progress, 100);
        progressBar.style.width = progress + '%';
        progressText.textContent = Math.floor(progress);
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 500);
        }
    }, 100);
}

function checkAuthStatus() {
    const userData = localStorage.getItem('skillswap_user');
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');

    if (userData) {
        const user = JSON.parse(userData);
        authButtons.classList.add('d-none');
        userMenu.classList.remove('d-none');
        if (userName) userName.textContent = user.name || 'Demo User';
    } else {
        authButtons.classList.remove('d-none');
        userMenu.classList.add('d-none');
    }
}

function initializeAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    document.querySelectorAll('section h2, section h1, .btn, p.lead').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

function initializeFadeInAnimations(selector) {
    setTimeout(() => {
        const cards = document.querySelectorAll(selector);
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.animation = `fade-in-up 0.6s ease-out forwards`;
            }, index * 100);
        });
    }, 200);
};

document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    const isFirstLoad = !sessionStorage.getItem('skillswap_session_started');

    if (isFirstLoad && loadingScreen) {
        sessionStorage.setItem('skillswap_session_started', 'true');
        startLoading();
    } else if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }

    checkAuthStatus();
    initializeAnimations();

    const currentPath = window.location.pathname;
    if (currentPath.endsWith('index.html')) {
        const userData = localStorage.getItem('skillswap_user');
        const getStartedButtons = document.getElementById('getStartedButtons');
        const portfolioButtons = document.getElementById('profileButtons');

        if (userData) {
            const user = JSON.parse(userData);
            getStartedButtons.classList.add('d-none');
            portfolioButtons.classList.remove('d-none');
            if (userName) userName.textContent = user.name || 'Demo User';
        } else {
            getStartedButtons.classList.remove('d-none');
            portfolioButtons.classList.add('d-none');
        }
    }
    else if (currentPath.endsWith('roadmaps.html')) {
        initializeFadeInAnimations('.roadmap-card');
    } 
    else if (currentPath.endsWith('discover.html')) {
        initializeFadeInAnimations('.course-card');
    } 
    else if (currentPath.endsWith('auth.html')) {
        initializeFadeInAnimations('.animate-fade');
    } 
    else if (currentPath.endsWith('about.html')) {  
        initializeFadeInAnimations('.team-card');
    } 
    else if (currentPath.endsWith('404.html')) {
        initializeFadeInAnimations('.animate-fade');
    }
});

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    toast.setAttribute('class', `bg-${type}`);
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 100);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(inputId + 'Icon');
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'bi bi-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'bi bi-eye';
    }
}

function demoLogin() {
    const userData = {
        name: 'Demo User',
        email: 'demo@skillswappro.com',
        avatar: null
    };
    localStorage.setItem('skillswap_user', JSON.stringify(userData));
    showToast('Demo login successful! Redirecting...');
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1000);
}

// Functions to come
function filterCourses() {
    showToast('Course filtering coming soon!', 'info');
}
function logout() {
    localStorage.removeItem('skillswap_user');
    checkAuthStatus();
    showToast('Logged out successfully');
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}
function handleSignin() {
    showToast('Login coming soon!, continuing with Demo', 'info');
    demoLogin();
}
function handleSignup() {
    showToast('Registration coming soon!, continuing with Demo', 'info');
    demoLogin();
}
function socialLogin(provider) {
    showToast(`${provider} login coming soon!`, 'info');
}
function openProfile(){
    showToast('Profile coming soon!', 'info');
}
function joinCommunity(){
    showToast('Function coming soon!', 'info');
}
