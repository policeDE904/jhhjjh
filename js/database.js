// Simulated MySQL Database
class MySQLSimulator {
    constructor() {
        this.database = {
            host: 'localhost',
            user: '123',
            password: '123',
            database: 'vulnerable_shop',
            users: [
                { id: 1, username: 'admin', password: '123', email: 'admin@vulnerableshop.com', is_admin: 1 },
                { id: 2, username: '123', password: '123', email: 'user123@test.com', is_admin: 0 },
                { id: 3, username: 'user1', password: '123', email: 'user1@test.com', is_admin: 0 },
                { id: 4, username: 'user2', password: '123', email: 'user2@test.com', is_admin: 0 },
                { id: 5, username: 'john', password: 'password123', email: 'john@email.com', is_admin: 0 }
            ],
            products: [
                { id: 1, name: 'iPhone 15 Pro', price: 999.99, description: 'Latest Apple smartphone' },
                { id: 2, name: 'Samsung Galaxy', price: 799.99, description: 'Android flagship' },
                { id: 3, name: 'MacBook Pro', price: 1999.99, description: 'Professional laptop' },
                { id: 4, name: 'Gaming PC', price: 1499.99, description: 'High-end gaming' },
                { id: 5, name: 'Wireless Headphones', price: 299.99, description: 'Noise cancelling' }
            ],
            orders: []
        };
    }

    // Simulate SQL Query with Injection Vulnerability
    executeQuery(query) {
        console.log('🔍 MySQL Query:', query);
        
        // SQL Injection detection and simulation
        if (query.includes("' OR '1'='1") || query.includes("'--") || query.includes("' UNION")) {
            console.log('🚨 SQL Injection Detected - Returning first user (admin)');
            return [this.database.users[0]]; // Return admin user
        }

        // Simple username/password check simulation
        if (query.includes('SELECT * FROM users WHERE username =')) {
            const usernameMatch = query.match(/username = '([^']+)'/);
            const passwordMatch = query.match(/password = '([^']+)'/);
            
            if (usernameMatch && passwordMatch) {
                const username = usernameMatch[1];
                const password = passwordMatch[1];
                
                const user = this.database.users.find(u => 
                    u.username === username && u.password === password
                );
                
                return user ? [user] : [];
            }
        }

        // Return all users for API
        if (query.includes('SELECT * FROM users')) {
            return this.database.users;
        }

        // Return products
        if (query.includes('SELECT * FROM products')) {
            return this.database.products;
        }

        return [];
    }

    // Simulate MySQL connection
    connect(username, password) {
        console.log(`🔗 Connecting to MySQL: mysql -u ${username} -p`);
        
        if (username === '123' && password === '123') {
            return {
                success: true,
                message: `Welcome to the MySQL monitor. Connected to database: ${this.database.database}`
            };
        } else {
            // Check for SQL Injection
            if (username.includes("' OR '1'='1") || username.includes("'--")) {
                return {
                    success: true,
                    message: 'SQL Injection successful! Connected as admin',
                    user: this.database.users[0]
                };
            }
            
            return {
                success: false,
                message: 'Access denied for user. Use SQL Injection: \' OR \'1\'=\'1\' --'
            };
        }
    }
}

// Initialize MySQL Simulator
const mysql = new MySQLSimulator();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = mysql;
}
