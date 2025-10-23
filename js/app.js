// Main application functionality
document.addEventListener('DOMContentLoaded', function() {
    const user = requireAuth();
    
    if (user) {
        displayUserInfo(user);
        loadProducts();
    }
});

function displayUserInfo(user) {
    const userInfo = document.getElementById('userInfo');
    const usernameDisplay = document.getElementById('usernameDisplay');
    
    if (userInfo) {
        userInfo.innerHTML = `
            <strong>Welcome, ${user.username}!</strong>
            <br><small>Email: ${user.email} | Admin: ${user.is_admin ? 'Yes' : 'No'}</small>
            <button onclick="logout()" class="btn btn-warning" style="float: right;">Logout</button>
        `;
    }
    
    if (usernameDisplay) {
        usernameDisplay.textContent = `Welcome, ${user.username}!`;
    }
}

function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    const products = mysql.executeQuery('SELECT * FROM products');
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <h3>${product.name}</h3>
            <div class="product-price">$${product.price}</div>
            <p>${product.description}</p>
            <button onclick="buyProduct(${product.id})" class="btn btn-primary">Buy Now</button>
        </div>
    `).join('');
}

function buyProduct(productId) {
    const user = checkAuth();
    if (!user) {
        alert('Please login first');
        return;
    }
    
    alert(`Product ${productId} purchased successfully!`);
}

// IDOR Vulnerability
function viewUserProfile(userId) {
    const users = mysql.executeQuery('SELECT * FROM users');
    const user = users.find(u => u.id === userId);
    
    const resultDiv = document.getElementById('userProfileResult');
    if (user && resultDiv) {
        resultDiv.innerHTML = `
            <div class="user-profile">
                <h4>User Profile (IDOR Vulnerable):</h4>
                <p><strong>ID:</strong> ${user.id}</p>
                <p><strong>Username:</strong> ${user.username}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Password:</strong> ${user.password}</p>
                <p><strong>Admin:</strong> ${user.is_admin ? 'Yes' : 'No'}</p>
            </div>
        `;
    }
}

// Data Exposure Vulnerability
function fetchAllUsers() {
    const users = mysql.executeQuery('SELECT * FROM users');
    const dataDiv = document.getElementById('allUsersData');
    
    if (dataDiv) {
        dataDiv.innerHTML = `
            <div class="user-profile">
                <h4>All Users Data (Exposed):</h4>
                <pre>${JSON.stringify(users, null, 2)}</pre>
            </div>
        `;
    }
}

// XSS Vulnerability
function testXSS() {
    const input = document.getElementById('xssInput').value;
    const outputDiv = document.getElementById('xssOutput');
    
    if (outputDiv) {
        // VULNERABLE: Direct innerHTML usage
        outputDiv.innerHTML = `
            <div class="user-profile">
                <h4>XSS Test Output:</h4>
                <div>${input}</div>
            </div>
        `;
    }
}
