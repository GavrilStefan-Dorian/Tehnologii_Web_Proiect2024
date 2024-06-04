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

function insertUser(username, email, password, callback) {
    console.log('Attempting to insert user:', { username, email, password });

    db`INSERT INTO users (username, email, password, role) VALUES (${username}, ${email}, ${password}, 'client') RETURNING *`
        .then(result => {
            console.log('User inserted:', result);
            callback({ success: true, data: result });
        })
        .catch(error => {
            console.error('Error inserting user:', error);
            callback({ success: false, error });
        });
}

module.exports = { 
    getUsers,
    insertUser 
};
