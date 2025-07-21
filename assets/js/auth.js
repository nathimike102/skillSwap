// function showUserState() {
//     document.getElementById('guest-nav').style.display = 'none';
//     document.getElementById('guest-cta').style.display = 'none';
//     document.getElementById('user-nav').style.display = 'block';
//     document.getElementById('user-cta').style.display = 'block';
// };

// function showGuestState() {
//     document.getElementById('guest-nav').style.display = 'block';
//     document.getElementById('guest-cta').style.display = 'block';
//     document.getElementById('user-nav').style.display = 'none';
//     document.getElementById('user-cta').style.display = 'none';
// };

function logout() {
    // showGuestState();
    alert('You have been logged out successfully!');
}

function login() {
    // showUserState();
    alert('You have been logged in successfully!');
};

function handleSignIn() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('Please fill in all fields.');
        return;
    }
    login();
    window.location.href = '../../index.html';
};

function handleSignUp() {
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        alert('Please fill in all fields.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }
    login();
    window.location.href = '../../index.html';
}