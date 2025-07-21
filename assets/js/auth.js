var userToken = 'user'; 

function showUserState() {
    const guestNav = document.getElementById('guest-nav');
    const guestCta = document.getElementById('guest-cta');
    const userNav = document.getElementById('user-nav');
    const userCta = document.getElementById('user-cta');
    
    if (guestNav) guestNav.style.display = 'none';
    if (guestCta) guestCta.style.display = 'none';
    if (userNav) userNav.style.display = 'block';
    if (userCta) userCta.style.display = 'block';
    userToken = 'user';
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
    userToken = 'guest';
}

function logout() {
    showGuestState();
    alert('You have been logged out successfully!');
}

function login(userData) {
    if (userData['email'] === 'user@example.com' && userData['password'] === 'password123') {
        showUserState();
        alert('You have been logged in successfully!');
        window.location.href = '../../index.html';
        return true;
    }else{
        alert('Login failed. Please try again.');
        return false;
    }
}

function validateEmail(email) {
    return true; // Placeholder for actual validation logic
}

function validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    return true; // Placeholder for actual validation logic
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
        firstName: firstName, 
        lastName: lastName, 
        email: email,
        password: password
    };
    login(userData);
}

function toggleForm() {
    const signinForm = document.querySelector('.signin-form');
    const signupForm = document.querySelector('.signup-form');
    
    signinForm.classList.toggle('active');
    signupForm.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', function() {
    if (userToken === 'user') {
        showUserState();
    } else {
        showGuestState();
    }
});

