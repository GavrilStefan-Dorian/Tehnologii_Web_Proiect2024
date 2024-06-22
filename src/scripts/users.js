const {sql} = require('./db'); 

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

async function updateUser(userId, updates, callback) {
    try {
        const setClause = Object.entries(updates).map(([key, value]) => sql`${sql(key)} = ${value}`);
        const result = await sql`UPDATE users SET ${sql.join(setClause, sql`, `)} WHERE id = ${userId} RETURNING *`;
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
        const result = await sql`DELETE FROM users WHERE id = ${userId} RETURNING *`;
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
    getUsers,
    getUserByEmail,
    getUserByName,
    insertUser,
    updateUser,
    deleteUser
};
