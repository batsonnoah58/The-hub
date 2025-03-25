const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection configuration
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

app.post('/subscribe', async (req, res) => {
    const email = req.body.email;

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).send('Invalid email format.');
    }

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('INSERT INTO subscribers (email) VALUES (?)', [email]);
        connection.release();

        res.send('Thank you for subscribing!');
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('An error occurred. Please try again.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});