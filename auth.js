// Admin credentials (in real app, this would be server-side)
const ADMIN_CREDENTIALS = {
    email: "admin@justacallaway.com",
    password: "SecurePassword123!" // In production, use proper hashing
};

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
            // Create admin session
            sessionStorage.setItem('adminAuthenticated', 'true');
            sessionStorage.setItem('adminEmail', email);
            
            // Redirect to dashboard
            window.location.href = 'admin.html';
        } else {
            alert('Invalid credentials. Please try again.');
        }
    });
    
    // Forgot password
    document.getElementById('forgot-password').addEventListener('click', function(e) {
        e.preventDefault();
        alert('Password reset instructions sent to admin email.');
    });
});