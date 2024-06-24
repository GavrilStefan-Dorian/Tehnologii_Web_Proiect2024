const {sql} = require('./db'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = require('./config').jwtSecret;


async function getUserByEmail(email, callback) {
    try {
        const result = await sql`SELECT * FROM users WHERE email = ${email}`;
        if (result.length > 0) {
            console.log('User fetched:', result[0]);
            callback(null, result[0]);
        } else {
            console.log('User not found');
            callback(null, null);
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        callback(error, null);
    }
}

async function getUserById(id, callback) {
    try {
        const result = await sql`SELECT * FROM users WHERE user_id = ${id}`;
        if (result.length > 0) {
            console.log('User fetched:', result[0]);
            callback(null, result[0]);
        } else {
            console.log('User not found');
            callback(null, null);
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        callback(error, null);
    }
}

async function storeResetToken(userId, token) {
    const expiration = Date.now() + 3600000; // Token expires in 1 hour
    await sql`INSERT INTO reset_tokens (user_id, token, expiration) VALUES (${userId}, ${token}, ${expiration})`;

    console.log("Inserted token for " + userId);
    // res.writeHead(200, {'Content-Type': 'text/plain'});
    // res.end('Ok');
}

async function updatePassword(email, hashedPassword) {
    await sql`UPDATE users SET password = ${hashedPassword} WHERE email = ${email}`;
}

async function verifyTokenAndGetUserFromTable(token) {
    const result = await sql`SELECT * FROM users u JOIN reset_tokens rt ON u.user_id = rt.user_id WHERE rt.token = ${token} AND rt.expiration > ${Date.now()}`;
    return result.length ? result[0] : null;
}


async function getUsers(callback) {
    try {
        const result = await sql`SELECT * FROM users`;
        console.log('Users fetched:', result);
        callback(null, result);
    } catch (error) {
        console.error('Error fetching users:', error);
        callback(error, null);
    }
}

async function insertUser(username, email, password, role, callback) {
    console.log('Attempting to insert user:', { username, email, password });

    try {
        const result = await sql`INSERT INTO users (username, email, password, role) VALUES (${username}, ${email}, ${password}, ${role}) RETURNING *`;
        console.log('User inserted:', result);
        callback({ success: true, data: result });
    } catch (error) {
        console.error('Error inserting user:', error);
        callback({ success: false, error });
    }
}

async function getUserByName(username, callback) {
    try {
        const result = await sql`SELECT * FROM users WHERE username = ${username}`;
        if (result.length > 0) {
            console.log('User fetched:', result[0]);
            callback(null, result[0]);
        } else {
            console.log('User not found');
            callback(null, null);
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        callback(error, null);
    }
}

async function updateUser(userId, updates, callback) {
    try {
        const setClause = Object.entries(updates).map(([key, value]) => sql`${sql(key)} = ${value}`);
        const result = await sql`UPDATE users SET ${sql.join(setClause, sql`, `)} WHERE user_id = ${userId} RETURNING *`;
        if (result.length > 0) {
            console.log('User updated:', result[0]);
            callback(null, result[0]);
        } else {
            console.log('User not found');
            callback(null, null); 
        }
    } catch (error) {
        console.error('Error updating user:', error);
        callback(error, null);
    }
}

async function deleteUser(userId, callback) {
    try {
        const result = await sql`DELETE FROM users WHERE user_id = ${userId} RETURNING *`;
        if (result.length > 0) {
            console.log('User deleted:', result[0]);
            callback(null, result[0]);
        } else {
            console.log('User not found');
            callback(null, null); 
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        callback(error, null);
    }
}

module.exports = {
    getUserById,
    getUsers,
    getUserByEmail,
    getUserByName,
    insertUser,
    updateUser,
    deleteUser,
    storeResetToken,
    updatePassword,
    verifyTokenAndGetUserFromTable
};
