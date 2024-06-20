// const authenticateToken = require('./utils').authenticateToken;

// document.addEventListener('DOMContentLoaded', function () {
//     const token = localStorage.getItem('jwtToken');

//     console.log("HAAAAAAAAA", token);
//     if (token) {
       
//                 const originalFetch = window.fetch;
//                 window.fetch = function (url, options = {}) {
//                     options.headers = options.headers || {};
//                     options.headers['Authorization'] = `Bearer ${token}`;
//                     return originalFetch(url, options);
//                 };

//                 // Now you can access decodedToken for further client-side logic
//                 console.log('Decoded Token:', decodedToken);
//     } else {
//         // Redirect to login page if no token is found
//         window.location.href = '/login.html';
//     }
// });
