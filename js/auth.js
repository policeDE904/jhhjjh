// Authentication system with SQL Injection vulnerabilities
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const sqlQueryDisplay = document.getElementById('sqlQuery');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const messageDiv = document.getElementById('message');
            
            // Simulate MySQL query
            const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
            
            // Update SQL query display
            if (sqlQueryDisplay) {
                sqlQueryDisplay.textContent = query;
            }
            
            // Execute simulated query
            const result = mysql.executeQuery(query);
            
            if (result.length > 0) {
                const user = result[0];
                
                // Store user in localStorage
                localStorage.setItem('currentUser', JSON.stringify(user));
                localStorage.setItem('isLoggedIn', 'true');
                
                messageDiv.innerHTML = `
                    <div class="message success">
                        ✅ Login successful! Welcome ${user.username} (ID: ${user.id})<br>
                        <small>Redirecting to dashboard...</small>
                    </div>
                `;
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
            } else {
                messageDiv.innerHTML = `
                    <div class="message error">
                        ❌ Login failed! Try SQL Injection: <code>' OR '1'='1' --</code>
                    </div>
                `;
            }
        });
    }
});

// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userData = localStorage.getItem('currentUser');
    
    if (isLoggedIn === 'true' && userData) {
        return JSON.parse(userData);
    }
    return null;
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
}

// Protect pages that require authentication
function requireAuth() {
    const user = checkAuth();
    if (!user && (window.location.pathname.includes('dashboard.html') || 
                  window.location.pathname.includes('admin.html'))) {
        window.location.href = 'login.html';
        return null;
    }
    return user;
}
