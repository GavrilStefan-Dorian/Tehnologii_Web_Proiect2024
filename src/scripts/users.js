// Will have script files for each table ( here, users ) to define queries for it
const db = require('./config_supabase');

function getUsers(callback) {
    db`SELECT * FROM users`
        .then(result => {
            console.log('Users fetched:', result);
            callback(null, result);
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            callback(error, null);
        });
}

function insertUser(username, email, password, role, callback) {
    console.log('Attempting to insert user:', { username, email, password });

    db`INSERT INTO users (username, email, password, role) VALUES (${username}, ${email}, ${password}, ${role}) RETURNING *`
        .then(result => {
            console.log('User inserted:', result);
            callback({ success: true, data: result });
        })
        .catch(error => {
            console.error('Error inserting user:', error);
            callback({ success: false, error });
        });
}


function getUserByName(username, callback) {
    db`SELECT * FROM users WHERE username = ${username}`
        .then(result => {
            if (result.length > 0) {
                console.log('User fetched:', result[0]);
                callback(null, result[0]);
            } else {
                console.log('User not found');
                callback(null, null);
            }
        })
        .catch(error => {
            console.error('Error fetching user:', error);
            callback(error, null);
        });
}

function getUserByEmail(email, callback) {
    db`SELECT * FROM users WHERE email = ${email}`
        .then(result => {
            if (result.length > 0) {
                console.log('User fetched:', result[0]);
                callback(null, result[0]);
            } else {
                console.log('User not found');
                callback(null, null);
            }
        })
        .catch(error => {
            console.error('Error fetching user:', error);
            callback(error, null);
        });
}

function updateUser(userId, updates, callback) {
    db`UPDATE users SET ${updates} WHERE id = ${userId} RETURNING *`
        .then(result => {
            if (result.length > 0) {
                console.log('User updated:', result[0]);
                callback(null, result[0]);
            } else {
                console.log('User not found');
                callback(null, null); 
            }
        })
        .catch(error => {
            console.error('Error updating user:', error);
            callback(error, null);
        });
}

function deleteUser(userId, callback) {
    db`DELETE FROM users WHERE id = ${userId} RETURNING *`
        .then(result => {
            if (result.length > 0) {
                console.log('User deleted:', result[0]);
                callback(null, result[0]);
            } else {
                console.log('User not found');
                callback(null, null); 
            }
        })
        .catch(error => {
            console.error('Error deleting user:', error);
            callback(error, null);
        });
}

module.exports = {
    getUsers,
    getUserByEmail,
    getUserByName,
    insertUser,
    updateUser,
    deleteUser
};