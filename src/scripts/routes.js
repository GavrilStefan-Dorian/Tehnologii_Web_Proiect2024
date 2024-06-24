const Route = require('./route');
const { sendFile, sendError, authenticateToken, requireLogin, validateEmail} = require('./utils');
const { getUserByEmail, insertUser, getUserById } = require('./users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = require('./config').jwtSecret;
const formidable = require('formidable');
const generateRSSFeed = require('./rssFeed');


// const { groupsRoute,
//     createGroupRoute,
//     getGroupRoute,
//     updateGroupRoute,
//     deleteGroupRoute,} = require('./Routes/groups')



// const { groupsRoute,
//     createGroupRoute,
//     getGroupRoute,
//     updateGroupRoute,
//     deleteGroupRoute,} = require('./Routes/groups')


const {homeRoute} = require('./Routes/home');
const path = require("path");
const {booksRoute, likedRoute, bookmarkedRoute} = require("./Routes/books");
const {bookRoute, postReviewRoute, likeRoute, bookmarkRoute, statusRoute, downloadRoute} = require("./Routes/book");
const searchRoute = require("./Routes/search");
const viewBooksRoute = require("./Routes/view_books");


const { resetGetRoute, resetPostRoute, contactPostRoute, forgotPostRoute} = require('./Routes/send_email');
const {loginRoute, registerRoute, postLoginRoute, postRegisterRoute, forgotPassRoute} = require("./Routes/login");
const {helpRoute, contactRoute, aboutRoute, adminRoute} = require("./Routes/misc");
const {viewGroupsRoute, groupPageRoute, joinGroupRoute, leaveGroupRoute,} = require("./Routes/groups");

const routes = [
    new Route('/', homeRoute.method, homeRoute.handler),

    homeRoute,

    loginRoute,

    registerRoute,

    postLoginRoute,

    postRegisterRoute,

    resetGetRoute,
    
    resetPostRoute,

    forgotPostRoute,

    contactPostRoute,

    forgotPassRoute,

    helpRoute,

    contactRoute,

    aboutRoute,

    bookRoute,

    booksRoute,

    groupPageRoute,

    searchRoute,

    viewBooksRoute,

    viewGroupsRoute,

    joinGroupRoute,
    
    leaveGroupRoute,

    adminRoute,

    new Route('/rssFeed', 'GET', async (req, res) => {
        const rssContent = await generateRSSFeed();
        res.writeHead(200, { 'Content-Type': 'application/rss+xml' });
        res.end(rssContent);
    }),

    postReviewRoute,

    likeRoute,

    bookmarkRoute,

    statusRoute,

    downloadRoute,

    likedRoute,

    bookmarkedRoute
];

// function sendUrl(url, res) {
//     res.writeHead(200, { 'Content-Type': 'application/json' });
//     res.end(JSON.stringify({ url: url }));
// }


module.exports = routes;
