var userToken = null; 

function showUserState() {
    const guestNav = document.getElementById('guest-nav');
    const guestCta = document.getElementById('guest-cta');
    const userNav = document.getElementById('user-nav');
    const userCta = document.getElementById('user-cta');
    
    if (guestNav) guestNav.style.display = 'none';
    if (guestCta) guestCta.style.display = 'none';
    if (userNav) userNav.style.display = 'block';
    if (userCta) userCta.style.display = 'block';
}

function showGuestState() {
    const guestNav = document.getElementById('guest-nav');
    const guestCta = document.getElementById('guest-cta');
    const userNav = document.getElementById('user-nav');
    const userCta = document.getElementById('user-cta');
    
    if (guestNav) guestNav.style.display = 'block';
    if (guestCta) guestCta.style.display = 'block';
    if (userNav) userNav.style.display = 'none';
    if (userCta) userCta.style.display = 'none';
}

function saveUserSession(email) {
    const sessionData = {
        email: email,
        timestamp: Date.now()
    };
    localStorage.setItem('userSession', JSON.stringify(sessionData));
    userToken = email;
}

function clearUserSession() {
    localStorage.removeItem('userSession');
    userToken = null;
}

function authenticateUser(email, password) {
    try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            return true;
        }
        return false;
    } catch (error) {
        console.error('Authentication error:', error);
        return false;
    }
}

function logout() {
    clearUserSession();
    showGuestState();
    alert('You have been logged out successfully!');
    
    const currentPath = window.location.pathname;
    if (!currentPath.includes('index.html') && !currentPath.includes('auth.html')) {
        window.location.href = '/index.html';
    }
}

function login(userData) {
    if (authenticateUser(userData.email, userData.password)) {
        saveUserSession(userData.email);
        showUserState();
        alert('You have been logged in successfully!');
        const currentPath = window.location.pathname;
        if (currentPath.includes('auth.html')) {
            window.location.href = '../../index.html';
        } 
    } else {
        alert('Login failed. Please try again.');
    }
}

function signup(userData) {
    try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find(user => user.email === userData.email)) {
            alert('User with this email already exists!');
            return false;
        }
        users.push(userData);
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    } catch (error) {
        console.error('Signup error:', error);
        alert('An error occurred during signup. Please try again.');
        return false;
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
}

function handleSignIn() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('Please fill in all fields.');
        return;
    }
    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    const userData = {
        email: email,
        password: password
    };
    login(userData);
}

function handleSignUp() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill in all fields.');
        return;
    }
    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    if (!validatePassword(password)) {
        alert('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.');
        return;
    }
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }
    const userData = {
        name: name,
        email: email,
        password: password
    };
    if (signup(userData)) {
        alert('Account created successfully!');
        login(userData);
    }
}

function toggleForm() {
    const signin = document.querySelector('.signin-form');
    const signup = document.querySelector('.signup-form');

    signin.classList.toggle('active');
    signup.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', function() {
    const session = localStorage.getItem('userSession');
    if (session) {
        try {
            const sessionData = JSON.parse(session);
            userToken = sessionData.email;
        } catch (error) {
            console.error('Invalid session data:', error);
            localStorage.removeItem('userSession');
            userToken = null;
        }
    }
    if (userToken) {
        showUserState();
    } else {
        showGuestState();
    }
});
